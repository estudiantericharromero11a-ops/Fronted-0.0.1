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

        // DEBUG: Ver qué estructura tiene el primer elemento
        if (asignaciones.length > 0) {
            console.log('🔍 PERSONA_ROL - Primer elemento:', asignaciones[0]);
            console.log('🔍 PERSONA_ROL - Keys del objeto:', Object.keys(asignaciones[0]));
            console.log('🔍 PERSONA_ROL - Helper:', {
                estado: getEstado(asignaciones[0]),
                created_at: getCreatedAt(asignaciones[0]),
                updated_at: getUpdatedAt(asignaciones[0])
            });
        }

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
                    <td>${asignacion.id_persona}</td>
                    <td>${asignacion.id_rol}</td>
                    <td>${getCreatedAt(asignacion)}</td>
                    <td>${getUpdatedAt(asignacion)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editPersonaRol(${asignacion.id_persona}, ${asignacion.id_rol})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deletePersonaRol(${asignacion.id_persona}, ${asignacion.id_rol})">
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
async function editPersonaRol(personaId, rolId) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/${personaId}/${rolId}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const asignacion = await response.json();

        // Cambiar título del modal
        document.getElementById('personaRolModalTitle').textContent = 'Editar Asignación Rol';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('personaRolId').value = `${asignacion[PERSONA_ROL_FIELDS.id_persona]}-${asignacion[PERSONA_ROL_FIELDS.id_rol]}`;
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

        // Decidir si es CREAR (POST) o ACTUALIZAR (DELETE + POST)
        const originalId = id;
        const isCreating = !originalId;  // Si no tiene ID, es nuevo
        const parsedPersonaId = parseInt(id_persona, 10);
        const parsedRolId = parseInt(id_rol, 10);

        if (!isCreating) {
            const [oldPersonaId, oldRolId] = originalId.split('-').map(Number);
            if (oldPersonaId !== parsedPersonaId || oldRolId !== parsedRolId) {
                const deleteResponse = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/${oldPersonaId}/${oldRolId}/`, {
                    method: 'DELETE'
                });
                if (!deleteResponse.ok) {
                    const errText = await deleteResponse.text();
                    throw new Error(`Error al eliminar asignación anterior: ${errText}`);
                }
            } else {
                // Si no cambió la clave compuesta, recargar sin modificar la DB
                bootstrap.Modal.getInstance(document.getElementById('personaRolModal')).hide();
                await loadPersonaRol();
                return;
            }
        }

        // Crear nueva asignación
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/`, {
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
async function deletePersonaRol(personaId, rolId) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres eliminar esta asignación de rol de la base de datos?')) {
            return;
        }

        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/${personaId}/${rolId}/`, {
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





