// FUNCIONES CRUD PARA PROGRAMA_MATERIA (BD Universitaria)
// LEER: Cargar y mostrar asignaciones programa-materia desde PostgreSQL
async function loadProgramaMateria() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const asignaciones = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('programaMateriaTableBody');
        if (!tbody) {
            console.error('Elemento "programaMateriaTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada asignación de PostgreSQL
        asignaciones.forEach(asignacion => {
            // Crear identificador compuesto para operaciones
            const compositeId = `${asignacion[PROGRAMA_MATERIA_FIELDS.id_programa]}-${asignacion[PROGRAMA_MATERIA_FIELDS.id_materia]}`;
            
            // Crear UNA fila de tabla para esta asignación
            const row = `
                <tr>
                    <td>${asignacion[PROGRAMA_MATERIA_FIELDS.id_programa]}</td>
                    <td>${asignacion[PROGRAMA_MATERIA_FIELDS.id_materia]}</td>
                    
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editProgramaMateria('${compositeId}')">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteProgramaMateria('${compositeId}')">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar asignaciones programa-materia:', error);
        alert('Error al cargar asignaciones programa-materia: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR asignación programa-materia
function showAddProgramaMateriaModal() {
    // Cambiar título
    document.getElementById('programaMateriaModalTitle').textContent = 'Asignar Materia a Programa';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('programaMateriaId').value = '';

    // Limpiar formulario
    document.getElementById('programaMateriaForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('programaMateriaModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editProgramaMateria(compositeId) {
    try {

        // Separar el compositeId en id_programa e id_materia
        const [id_programa, id_materia] = compositeId.split('-').map(Number);

        // Crear objeto para buscar la asignación específica
        const asignacionData = {
            [PROGRAMA_MATERIA_FIELDS.id_programa]: id_programa,
            [PROGRAMA_MATERIA_FIELDS.id_materia]: id_materia
        };

        // Traer los datos de PostgreSQL (necesitamos un endpoint que busque por clave compuesta)
        // Por ahora, vamos a buscar en la lista completa y filtrar
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const asignaciones = await response.json();
        const asignacion = asignaciones.find(a => 
            a[PROGRAMA_MATERIA_FIELDS.id_programa] === id_programa && 
            a[PROGRAMA_MATERIA_FIELDS.id_materia] === id_materia
        );

        if (!asignacion) {
            throw new Error('Asignación no encontrada');
        }

        // Cambiar título del modal
        document.getElementById('programaMateriaModalTitle').textContent = 'Editar Asignación Materia';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('programaMateriaId').value = compositeId;
        document.getElementById('programaMateriaIdPrograma').value = asignacion[PROGRAMA_MATERIA_FIELDS.id_programa];
        document.getElementById('programaMateriaIdMateria').value = asignacion[PROGRAMA_MATERIA_FIELDS.id_materia];


        // Mostrar modal
        new bootstrap.Modal(document.getElementById('programaMateriaModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar asignación: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveProgramaMateria() {
    try {
        // LEER datos del formulario
        const compositeId = document.getElementById('programaMateriaId').value;
        const id_programa = document.getElementById('programaMateriaIdPrograma').value;
        const id_materia = document.getElementById('programaMateriaIdMateria').value;
        
        // Validar que campos requeridos no estén vacíos
        if (!id_programa || !id_materia) {
            alert('ID Programa e ID Materia son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const asignacion = {
            [PROGRAMA_MATERIA_FIELDS.id_programa]: parseInt(id_programa),
            [PROGRAMA_MATERIA_FIELDS.id_materia]: parseInt(id_materia)
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !compositeId;  // Si no tiene compositeId, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        
        // Para actualizar, necesitamos usar un endpoint que soporte clave compuesta
        // Por ahora, usaremos POST para crear y DELETE + POST para actualizar
        let url, finalMethod;
        if (isCreating) {
            url = `${API_BASE}/${API_ENDPOINTS.programa_materia}/`;
            finalMethod = 'POST';
        } else {
            // Para actualizar, primero eliminamos la asignación anterior y luego creamos la nueva
            const [old_id_programa, old_id_materia] = compositeId.split('-').map(Number);
            
            // Si los IDs son los mismos, no hay cambios
            if (old_id_programa === parseInt(id_programa) && old_id_materia === parseInt(id_materia)) {
                bootstrap.Modal.getInstance(document.getElementById('programaMateriaModal')).hide();
                await loadProgramaMateria();
                return;
            }
            
            // Eliminar la asignación anterior
            const deleteResponse = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [PROGRAMA_MATERIA_FIELDS.id_programa]: old_id_programa,
                    [PROGRAMA_MATERIA_FIELDS.id_materia]: old_id_materia
                })
            });
            
            if (!deleteResponse.ok) {
                throw new Error(`Error al eliminar asignación anterior: ${deleteResponse.status}`);
            }
            
            // Crear la nueva asignación
            url = `${API_BASE}/${API_ENDPOINTS.programa_materia}/`;
            finalMethod = 'POST';
        }


        // Enviar a API REST
        const response = await fetch(url, {
            method: finalMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignacion)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('programaMateriaModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadProgramaMateria();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteProgramaMateria(compositeId) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres eliminar esta asignación de materia del programa?')) {
            return;
        }

        // Separar el compositeId
        const [id_programa, id_materia] = compositeId.split('-').map(Number);


        // Crear objeto para la eliminación
        const asignacionData = {
            [PROGRAMA_MATERIA_FIELDS.id_programa]: id_programa,
            [PROGRAMA_MATERIA_FIELDS.id_materia]: id_materia
        };

        // Enviar solicitud DELETE con datos en el body
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/delete`, {
            method: 'POST',  // Usando POST para enviar datos en el body
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignacionData)
        });

        // Verificar respuesta
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Recargar tabla
        await loadProgramaMateria();

    } catch (error) {
        console.error('� Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





