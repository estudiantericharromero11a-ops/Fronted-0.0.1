// FUNCIONES CRUD PARA PERSONA_ROL (BD Universitaria)
// LEER: Cargar y mostrar asignaciones persona-rol desde PostgreSQL
async function loadPersonaRol() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const asignaciones = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('personaRolTableBody');
        if (!tbody) {
            console.error('Elemento "personaRolTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada asignación de PostgreSQL
        asignaciones.forEach(asignacion => {
            // Crear UNA fila de tabla para esta asignación
            const row = `
                <tr>
                    <td>${asignacion[PERSONA_ROL_FIELDS.id_persona]}</td>
                    <td>${asignacion[PERSONA_ROL_FIELDS.id_rol]}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editPersonaRol(${asignacion.id_persona_rol})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deletePersonaRol(${asignacion.id_persona_rol})">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar asignaciones persona-rol:', error);
        alert('Error al cargar asignaciones persona-rol: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR asignación persona-rol
function showAddPersonaRolModal() {
    // Cambiar título
    document.getElementById('personaRolModalTitle').textContent = 'Asignar Rol a Persona';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('personaRolId').value = '';

    // Limpiar formulario
    document.getElementById('personaRolForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('personaRolModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editPersonaRol(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const asignacion = await response.json();

        // Cambiar título del modal
        document.getElementById('personaRolModalTitle').textContent = 'Editar Asignación Rol';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('personaRolId').value = asignacion.id_persona_rol;
        document.getElementById('personaRolIdPersona').value = asignacion[PERSONA_ROL_FIELDS.id_persona];
        document.getElementById('personaRolIdRol').value = asignacion[PERSONA_ROL_FIELDS.id_rol];


        // Mostrar modal
        new bootstrap.Modal(document.getElementById('personaRolModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar asignación: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function savePersonaRol() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('personaRolId').value;
        const id_persona = document.getElementById('personaRolIdPersona').value;
        const id_rol = document.getElementById('personaRolIdRol').value;
        // Validar que campos requeridos no estén vacíos
        if (!id_persona || !id_rol) {
            alert('ID Persona e ID Rol son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const asignacion = {
            [PERSONA_ROL_FIELDS.id_persona]: parseInt(id_persona),
            [PERSONA_ROL_FIELDS.id_rol]: parseInt(id_rol)
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.persona_rol}/` :
            `${API_BASE}/${API_ENDPOINTS.persona_rol}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
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
            document.getElementById('personaRolModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadPersonaRol();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deletePersonaRol(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres eliminar esta asignación de rol de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadPersonaRol();

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





