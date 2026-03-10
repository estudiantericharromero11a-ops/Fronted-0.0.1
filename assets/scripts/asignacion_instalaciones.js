// FUNCIONES CRUD PARA ASIGNACION_INSTALACIONES (BD Universitaria)
// LEER: Cargar y mostrar asignaciones instalacion-campus desde PostgreSQL
async function loadAsignacionInstalaciones() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const asignaciones = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('asignacionInstalacionesTableBody');
        if (!tbody) {
            console.error(' Elemento "asignacionInstalacionesTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada asignación de PostgreSQL
        asignaciones.forEach(asignacion => {
            // Crear UNA fila de tabla para esta asignación
            const row = `
                <tr>
                    <td>${asignacion.id_asignacion}</td>
                    <td>${asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_instalacion]}</td>
                    <td>${asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_materia]}</td>
                    <td>${asignacion[ASIGNACION_INSTALACIONES_FIELDS.dia_semana] || '-'}</td>

                    <td>${asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_persona] || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editAsignacionInstalaciones(${asignacion.id_asignacion})">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteAsignacionInstalaciones(${asignacion.id_asignacion})">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar asignaciones instalación-campus:', error);
        alert('Error al cargar asignaciones instalación-campus: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR asignación instalación-campus
function showAddAsignacionInstalacionesModal() {
    // Cambiar título
    document.getElementById('asignacionInstalacionesModalTitle').textContent = 'Asignar Instalación a Campus';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('asignacionInstalacionesId').value = '';

    // Limpiar formulario
    document.getElementById('asignacionInstalacionesForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('asignacionInstalacionesModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editAsignacionInstalaciones(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const asignacion = await response.json();

        // Cambiar título del modal
        document.getElementById('asignacionInstalacionesModalTitle').textContent = 'Editar Asignación Instalación';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('asignacionInstalacionesId').value = asignacion.id_asignacion;
        document.getElementById('asignacionInstalacionesIdInstalacion').value = asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_instalacion];
        document.getElementById('asignacionInstalacionesIdMateria').value = asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_materia];
        document.getElementById('asignacionInstalacionesDiaSemana').value = asignacion[ASIGNACION_INSTALACIONES_FIELDS.dia_semana];

        document.getElementById('asignacionInstalacionesIdPersona').value = asignacion[ASIGNACION_INSTALACIONES_FIELDS.id_persona];

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('asignacionInstalacionesModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar asignación: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveAsignacionInstalaciones() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('asignacionInstalacionesId').value;
        const id_instalacion = document.getElementById('asignacionInstalacionesIdInstalacion').value;
        const id_materia = document.getElementById('asignacionInstalacionesIdMateria').value;
        const dia_semana = document.getElementById('asignacionInstalacionesDiaSemana').value;
        // const hora_inicio = document.getElementById('asignacionInstalacionesHoraInicio').value;
        // const hora_fin = document.getElementById('asignacionInstalacionesHoraFin').value;
        const id_persona = document.getElementById('asignacionInstalacionesIdPersona').value;

        // Validar que campos requeridos no estén vacíos
        if (!id_instalacion || !id_materia || !dia_semana || !id_persona) {
            alert('Todos los campos son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const asignacion = {
            [ASIGNACION_INSTALACIONES_FIELDS.id_instalacion]: parseInt(id_instalacion),
            [ASIGNACION_INSTALACIONES_FIELDS.id_materia]: parseInt(id_materia),
            [ASIGNACION_INSTALACIONES_FIELDS.dia_semana]: dia_semana,

            [ASIGNACION_INSTALACIONES_FIELDS.id_persona]: parseInt(id_persona)
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/` :
            `${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/${id}/`;


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
            document.getElementById('asignacionInstalacionesModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadAsignacionInstalaciones();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteAsignacionInstalaciones(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres eliminar esta asignación de instalación?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Recargar tabla
        await loadAsignacionInstalaciones();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





