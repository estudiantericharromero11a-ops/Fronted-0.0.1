// FUNCIONES CRUD PARA INSTALACIONES (BD Universitaria)
// LEER: Cargar y mostrar instalaciones desde PostgreSQL
async function loadInstalaciones() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const instalaciones = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('instalacionesTableBody');
        if (!tbody) {
            console.error('Elemento "instalacionesTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada instalacion de PostgreSQL
        instalaciones.forEach(instalacion => {
            // Crear UNA fila de tabla para esta instalacion
            const row = `
                <tr>
                    <td>${instalacion.id_instalacion}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.nombre]}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.tipo_instalacion] || '-'}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.piso] || '-'}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.capacidad] || '-'}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.id_bloque] || '-'}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.id_area] || '-'}</td>
                    <td>${instalacion[INSTALACIONES_FIELDS.id_estado] || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editInstalacion(${instalacion.id_instalacion})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteInstalacion(${instalacion.id_instalacion})">
                            Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error al cargar instalaciones:', error);
        alert('Error al cargar instalaciones: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR instalacion
function showAddInstalacionModal() {
    // Cambiar título
    document.getElementById('instalacionModalTitle').textContent = 'Agregar Instalación';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('instalacionId').value = '';

    // Limpiar formulario
    document.getElementById('instalacionForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('instalacionModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editInstalacion(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const instalacion = await response.json();

        // Cambiar título del modal
        document.getElementById('instalacionModalTitle').textContent = 'Editar Instalación';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('instalacionId').value = instalacion.id_instalacion;
        document.getElementById('instalacionNombre').value = instalacion[INSTALACIONES_FIELDS.nombre];
        document.getElementById('instalacionTipo').value = instalacion[INSTALACIONES_FIELDS.tipo_instalacion];
        document.getElementById('instalacionCapacidad').value = instalacion[INSTALACIONES_FIELDS.capacidad];
        document.getElementById('instalacionPiso').value = instalacion[INSTALACIONES_FIELDS.piso];
        document.getElementById('instalacionIdBloque').value = instalacion[INSTALACIONES_FIELDS.id_bloque];
        document.getElementById('instalacionArea').value = instalacion[INSTALACIONES_FIELDS.id_area];
        document.getElementById('instalacionIdEstado').value = instalacion[INSTALACIONES_FIELDS.id_estado];

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('instalacionModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar instalacion: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveInstalacion() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('instalacionId').value;
        const nombre = document.getElementById('instalacionNombre').value;
        const tipo = document.getElementById('instalacionTipo').value;
        const capacidad = document.getElementById('instalacionCapacidad').value;
        const piso = document.getElementById('instalacionPiso').value;
        const idBloque = document.getElementById('instalacionIdBloque').value;
        const area = document.getElementById('instalacionArea').value;
        const idEstado = document.getElementById('instalacionIdEstado').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre) {
            alert('Nombre es obligatorio');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const instalacion = {
            [INSTALACIONES_FIELDS.nombre]: nombre,
            [INSTALACIONES_FIELDS.tipo_instalacion]: tipo,
            [INSTALACIONES_FIELDS.capacidad]: capacidad,
            [INSTALACIONES_FIELDS.piso]: piso,
            [INSTALACIONES_FIELDS.id_bloque]: idBloque,
            [INSTALACIONES_FIELDS.id_area]: area,
            [INSTALACIONES_FIELDS.id_estado]: idEstado
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.instalaciones}/` :
            `${API_BASE}/${API_ENDPOINTS.instalaciones}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(instalacion)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('instalacionModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadInstalaciones();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteInstalacion(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar esta instalación de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadInstalaciones();

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





