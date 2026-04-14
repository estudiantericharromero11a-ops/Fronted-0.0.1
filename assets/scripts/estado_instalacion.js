// FUNCIONES CRUD PARA ESTADO_INSTALACION (BD Universitaria)
// LEER: Cargar y mostrar estados de instalación desde PostgreSQL
async function loadEstadoInstalacion() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const estados = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('estadoInstalacionTableBody');
        if (!tbody) {
            console.error(' Elemento "estadoInstalacionTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada estado de PostgreSQL
        estados.forEach(estado => {
            // Crear UNA fila de tabla para este estado
            const row = `
                <tr>
                    <td>${estado.id_estado}</td>
                    <td>${estado[ESTADO_INSTALACION_FIELDS.nombre_estado]}</td>
                    <td>${getFieldValue(estado, 'descripcion') || '-'}</td>
                    <td>${getEstado(estado)}</td>
                    <td>${getCreatedAt(estado)}</td>
                    <td>${getUpdatedAt(estado)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editEstadoInstalacion(${estado.id_estado})">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteEstadoInstalacion(${estado.id_estado})">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar estados de instalación:', error);
        alert('Error al cargar estados de instalación: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR estado de instalación
function showAddEstadoInstalacionModal() {
    // Cambiar título
    document.getElementById('estadoInstalacionModalTitle').textContent = 'Agregar Estado de Instalación';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('estadoInstalacionId').value = '';

    // Limpiar formulario
    document.getElementById('estadoInstalacionForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('estadoInstalacionModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editEstadoInstalacion(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const estado = await response.json();

        // Cambiar título del modal
        document.getElementById('estadoInstalacionModalTitle').textContent = 'Editar Estado de Instalación';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('estadoInstalacionId').value = estado.id_estado;
        document.getElementById('estadoInstalacionNombre').value = estado[ESTADO_INSTALACION_FIELDS.nombre_estado];
        document.getElementById('estadoInstalacionDescripcion').value = estado[ESTADO_INSTALACION_FIELDS.descripcion];
        document.getElementById('estadoInstalacionEstado').value = estado[ESTADO_INSTALACION_FIELDS.estado] ? 'true' : 'false';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('estadoInstalacionModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar estado de instalación: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveEstadoInstalacion() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('estadoInstalacionId').value;
        const nombre = document.getElementById('estadoInstalacionNombre').value;
        const descripcion = document.getElementById('estadoInstalacionDescripcion').value;
        const estadoValue = document.getElementById('estadoInstalacionEstado').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre) {
            alert('Nombre es obligatorio');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const estado = {
            [ESTADO_INSTALACION_FIELDS.nombre_estado]: nombre,
            [ESTADO_INSTALACION_FIELDS.descripcion]: descripcion,
            [ESTADO_INSTALACION_FIELDS.estado]: estadoValue === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.estado_instalacion}/` :
            `${API_BASE}/${API_ENDPOINTS.estado_instalacion}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estado)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('estadoInstalacionModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadEstadoInstalacion();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteEstadoInstalacion(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar este estado de instalación de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Recargar tabla
        await loadEstadoInstalacion();

    } catch (error) {
        console.error('� Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





