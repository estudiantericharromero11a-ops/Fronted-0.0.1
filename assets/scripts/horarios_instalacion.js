// FUNCIONES CRUD PARA HORARIOS_INSTALACION (BD Universitaria)
// LEER: Cargar y mostrar horarios de instalación desde PostgreSQL
async function loadHorariosInstalacion() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const horarios = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('horariosInstalacionTableBody');
        if (!tbody) {
            console.error('Elemento "horariosInstalacionTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada horario de PostgreSQL
        horarios.forEach(horario => {
            // Buscar el campo ID correcto (puede ser id_horario, id_horarios_instalacion, etc)
            const idField = horario.id_horarios_instalacion || horario.id_horario || horario.id || 'N/A';
            // Crear UNA fila de tabla para este horario
            // disponible ya no existe en la base de datos
            const row = `
                <tr>
                    <td>${idField}</td>
                    <td>${horario[HORARIOS_INSTALACION_FIELDS.id_instalacion] || 'N/A'}</td>
                    <td>${horario[HORARIOS_INSTALACION_FIELDS.dia_semana] || 'N/A'}</td>
                    <td>${horario[HORARIOS_INSTALACION_FIELDS.hora_apertura] || 'N/A'}</td>
                    <td>${horario[HORARIOS_INSTALACION_FIELDS.hora_cierre] || 'N/A'}</td>
                    <td>${getEstado(horario)}</td>
                    <td>${getCreatedAt(horario)}</td>
                    <td>${getUpdatedAt(horario)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editHorarioInstalacion(${idField})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteHorarioInstalacion(${idField})">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar horarios de instalación:', error);
        alert('Error al cargar horarios de instalación: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR horario de instalación
function showAddHorarioInstalacionModal() {
    // Cambiar título
    document.getElementById('horarioInstalacionModalTitle').textContent = 'Agregar Horario de Instalación';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('horarioInstalacionId').value = '';

    // Limpiar formulario
    document.getElementById('horarioInstalacionForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('horarioInstalacionModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editHorarioInstalacion(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const horario = await response.json();

        // Cambiar título del modal
        document.getElementById('horarioInstalacionModalTitle').textContent = 'Editar Horario de Instalación';

        // Buscar el campo ID correcto
        const idField = horario.id_horarios_instalacion || horario.id_horario || horario.id;
        
        // Llenar formulario con datos de PostgreSQL
        document.getElementById('horarioInstalacionId').value = idField;
        document.getElementById('horarioInstalacionIdInstalacion').value = horario[HORARIOS_INSTALACION_FIELDS.id_instalacion];
        document.getElementById('horarioInstalacionDiaSemana').value = horario[HORARIOS_INSTALACION_FIELDS.dia_semana];
        // los campos de hora se renombraron para coincidir con la BD
        document.getElementById('horarioInstalacionHoraApertura').value = horario[HORARIOS_INSTALACION_FIELDS.hora_apertura];
        document.getElementById('horarioInstalacionHoraCierre').value = horario[HORARIOS_INSTALACION_FIELDS.hora_cierre];
        document.getElementById('horarioInstalacionEstado').value = horario[HORARIOS_INSTALACION_FIELDS.estado] ? 'true' : 'false';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('horarioInstalacionModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar horario de instalación: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveHorarioInstalacion() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('horarioInstalacionId').value;
        const id_instalacion = document.getElementById('horarioInstalacionIdInstalacion').value;
        const dia_semana = document.getElementById('horarioInstalacionDiaSemana').value;
        const hora_apertura = document.getElementById('horarioInstalacionHoraApertura').value;
        const hora_cierre = document.getElementById('horarioInstalacionHoraCierre').value;
        const estado = document.getElementById('horarioInstalacionEstado').value;

        // Validar que campos requeridos no estén vacíos
        if (!id_instalacion || !dia_semana || !hora_apertura || !hora_cierre) {
            alert('ID Instalación, Día de la semana, Hora apertura y Hora cierre son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const horario = {
            [HORARIOS_INSTALACION_FIELDS.id_instalacion]: parseInt(id_instalacion),
            [HORARIOS_INSTALACION_FIELDS.dia_semana]: dia_semana,
            [HORARIOS_INSTALACION_FIELDS.hora_apertura]: hora_apertura,
            [HORARIOS_INSTALACION_FIELDS.hora_cierre]: hora_cierre,
            [HORARIOS_INSTALACION_FIELDS.estado]: estado === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/` :
            `${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(horario)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('horarioInstalacionModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadHorariosInstalacion();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteHorarioInstalacion(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar este horario de instalación de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadHorariosInstalacion();

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





