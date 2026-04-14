// FUNCIONES CRUD PARA ROLES (BD Universitaria)
// LEER: Cargar y mostrar roles desde PostgreSQL
async function loadRoles() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.roles}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const roles = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('rolesTableBody');
        if (!tbody) {
            console.error('Elemento "rolesTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada rol de PostgreSQL
        roles.forEach(rol => {
            // Crear UNA fila de tabla para este rol
            const row = `
                <tr>
                    <td>${rol.id_rol}</td>
                    <td>${rol[ROLES_FIELDS.nombre_rol]}</td>
                    <td>${getFieldValue(rol, 'descripcion') || '-'}</td>
                    <td>${getEstado(rol)}</td>
                    <td>${getCreatedAt(rol)}</td>
                    <td>${getUpdatedAt(rol)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editRol(${rol.id_rol})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteRol(${rol.id_rol})">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar roles:', error);
        alert('Error al cargar roles: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR rol
function showAddRolModal() {
    // Cambiar título
    document.getElementById('rolModalTitle').textContent = 'Agregar Rol';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('rolId').value = '';

    // Limpiar formulario
    document.getElementById('rolForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('rolModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editRol(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.roles}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const rol = await response.json();

        // Cambiar título del modal
        document.getElementById('rolModalTitle').textContent = 'Editar Rol';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('rolId').value = rol.id_rol;
        document.getElementById('rolNombre').value = rol[ROLES_FIELDS.nombre_rol];
        document.getElementById('rolDescripcion').value = rol[ROLES_FIELDS.descripcion];
        document.getElementById('rolEstado').value = rol[ROLES_FIELDS.estado] ? 'true' : 'false';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('rolModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar rol: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveRol() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('rolId').value;
        const nombre = document.getElementById('rolNombre').value;
        const descripcion = document.getElementById('rolDescripcion').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre) {
            alert('Nombre es obligatorio');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const rol = {
            [ROLES_FIELDS.nombre_rol]: nombre,
            [ROLES_FIELDS.descripcion]: descripcion,
            [ROLES_FIELDS.estado]: document.getElementById('rolEstado').value === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.roles}/` :
            `${API_BASE}/${API_ENDPOINTS.roles}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('rolModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadRoles();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteRol(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar este rol de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.roles}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadRoles();

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





