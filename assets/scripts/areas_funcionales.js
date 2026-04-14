// FUNCIONES CRUD PARA AREAS_FUNCIONALES (BD Universitaria)
// LEER: Cargar y mostrar áreas funcionales desde PostgreSQL
async function loadAreasFuncionales() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const areas = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('areasFuncionalesTableBody');
        if (!tbody) {
            console.error(' Elemento "areasFuncionalesTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada área funcional de PostgreSQL
        areas.forEach(area => {
            // Crear UNA fila de tabla para esta área
            const row = `
                <tr>
                    <td>${area.id_area}</td>
                    <td>${area[AREAS_FUNCIONALES_FIELDS.nombre_area]}</td>
                    <td>${getFieldValue(area, 'descripcion') || '-'}</td>
                    <td>${getEstado(area)}</td>
                    <td>${getCreatedAt(area)}</td>
                    <td>${getUpdatedAt(area)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editAreaFuncional(${area.id_area})">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteAreaFuncional(${area.id_area})">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar áreas funcionales:', error);
        alert('Error al cargar áreas funcionales: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR área funcional
function showAddAreaFuncionalModal() {
    // Cambiar título
    document.getElementById('areaFuncionalModalTitle').textContent = 'Agregar Área Funcional';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('areaFuncionalId').value = '';

    // Limpiar formulario
    document.getElementById('areaFuncionalForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('areaFuncionalModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editAreaFuncional(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const area = await response.json();

        // Cambiar título del modal
        document.getElementById('areaFuncionalModalTitle').textContent = 'Editar Área Funcional';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('areaFuncionalId').value = area.id_area;
        document.getElementById('areaFuncionalNombre').value = area[AREAS_FUNCIONALES_FIELDS.nombre_area];
        document.getElementById('areaFuncionalDescripcion').value = area[AREAS_FUNCIONALES_FIELDS.descripcion];
        document.getElementById('areaFuncionalEstado').value = area[AREAS_FUNCIONALES_FIELDS.estado] ? 'true' : 'false';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('areaFuncionalModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar área funcional: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveAreaFuncional() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('areaFuncionalId').value;
        const nombre = document.getElementById('areaFuncionalNombre').value;
        const descripcion = document.getElementById('areaFuncionalDescripcion').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre) {
            alert('Nombre es obligatorio');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const area = {
            [AREAS_FUNCIONALES_FIELDS.nombre_area]: nombre,
            [AREAS_FUNCIONALES_FIELDS.descripcion]: descripcion,
            [AREAS_FUNCIONALES_FIELDS.estado]: document.getElementById('areaFuncionalEstado').value === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.areas_funcionales}/` :
            `${API_BASE}/${API_ENDPOINTS.areas_funcionales}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(area)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('areaFuncionalModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadAreasFuncionales();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteAreaFuncional(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar esta área funcional de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
const response = await fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/${id}/`, {
            method: 'DELETE'
        });
        
        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadAreasFuncionales();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





