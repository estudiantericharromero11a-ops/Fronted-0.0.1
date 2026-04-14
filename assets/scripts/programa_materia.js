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

        // DEBUG: Ver qué estructura tiene el primer elemento
        if (asignaciones.length > 0) {
            console.log('🔍 PROGRAMA_MATERIA - Primer elemento:', asignaciones[0]);
            console.log('🔍 PROGRAMA_MATERIA - Keys del objeto:', Object.keys(asignaciones[0]));
            console.log('🔍 PROGRAMA_MATERIA - Helper:', {
                estado: getEstado(asignaciones[0]),
                created_at: getCreatedAt(asignaciones[0]),
                updated_at: getUpdatedAt(asignaciones[0])
            });
        }

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
            const compositeId = `${asignacion.id_programa}-${asignacion.id_materia}`;
            
            // Crear UNA fila de tabla para esta asignación
            const row = `
                <tr>
                    <td>${asignacion.id_programa}</td>
                    <td>${asignacion.id_materia}</td>
                    <td>${getEstado(asignacion)}</td>
                    <td>${getCreatedAt(asignacion)}</td>
                    <td>${getUpdatedAt(asignacion)}</td>
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
        document.getElementById('programaMateriaEstado').value = asignacion[PROGRAMA_MATERIA_FIELDS.estado] ? 'true' : 'false';

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
        const estado = document.getElementById('programaMateriaEstado').value;
        
        // Validar que campos requeridos no estén vacíos
        if (!id_programa || !id_materia) {
            alert('ID Programa e ID Materia son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const asignacion = {
            [PROGRAMA_MATERIA_FIELDS.id_programa]: parseInt(id_programa),
            [PROGRAMA_MATERIA_FIELDS.id_materia]: parseInt(id_materia),
            [PROGRAMA_MATERIA_FIELDS.estado]: estado === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (DELETE + POST)
        const isCreating = !compositeId;  // Si no tiene compositeId, es nuevo
        const parsedProgramaId = parseInt(id_programa, 10);
        const parsedMateriaId = parseInt(id_materia, 10);

        if (!isCreating) {
            const [oldProgramaId, oldMateriaId] = compositeId.split('-').map(Number);

            if (oldProgramaId !== parsedProgramaId || oldMateriaId !== parsedMateriaId) {
                const deleteResponse = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/${oldProgramaId}/${oldMateriaId}/`, {
                    method: 'DELETE'
                });
                if (!deleteResponse.ok) {
                    const errText = await deleteResponse.text();
                    throw new Error(`Error al eliminar asignación anterior: ${errText}`);
                }
            } else {
                bootstrap.Modal.getInstance(document.getElementById('programaMateriaModal')).hide();
                await loadProgramaMateria();
                return;
            }
        }

        // Crear o recrear la nueva asignación
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/`, {
            method: 'POST',
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


        // Enviar solicitud DELETE usando clave compuesta en la URL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/${id_programa}/${id_materia}/`, {
            method: 'DELETE'
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





