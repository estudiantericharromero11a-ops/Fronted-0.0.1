// FUNCIONES CRUD PARA CAMPUS (BD Universitaria)
// Helper: Obtener valor de campo considerando variaciones
function getCampusField(item, fieldName) {
    // Variations de nombre, Direction, Description (con mayúscula y minúscula)
    const variations = [
        fieldName,                          // nombre
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1), // Nombre
        fieldName.toUpperCase(),            // NOMBRE
        'nombre_' + fieldName,              // nombre_nombre
        fieldName + '_campus'               // nombre_campus
    ];
    
    for (const variation of variations) {
        if (item[variation] !== undefined && item[variation] !== null) {
            return item[variation];
        }
    }
    
    // Si no encuentra nada, retornar undefined
    return undefined;
}

// LEER: Cargar y mostrar campus desde PostgreSQL
async function loadCampus() {
    try {

        // Verificar que config esté disponible
        if (typeof API_BASE === 'undefined') {
            console.error('[ADMIN] API_BASE no está definido');
            return;
        }
        if (typeof API_ENDPOINTS === 'undefined') {
            console.error('[ADMIN] API_ENDPOINTS no está definido');
            return;
        }
        if (typeof CAMPUS_FIELDS === 'undefined') {
            console.error('[ADMIN] CAMPUS_FIELDS no está definido');
            return;
        }


        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const campus = await response.json();

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('campusTableBody');
        if (!tbody) {
            console.error(' [ADMIN] Elemento "campusTableBody" no existe en HTML');
            return;
        }


        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada campus de PostgreSQL
        campus.forEach(campus_item => {

            // Obtener valores de campos con fallback si el nombre cambia
            const nombre = getCampusField(campus_item, CAMPUS_FIELDS.nombre) || 'Sin nombre';
            const direccion = getCampusField(campus_item, CAMPUS_FIELDS.direccion) || '-';
            const descripcion = getCampusField(campus_item, CAMPUS_FIELDS.descripcion);


            // Crear UNA fila de tabla para este campus
            const row = `
                <tr>
                    <td>${campus_item.id_campus}</td>
                    <td>${nombre}</td>
                    <td>${direccion}</td>
                    <td>${descripcion || 'Sin descripción'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editCampus(${campus_item.id_campus})">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteCampus(${campus_item.id_campus})">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });


    } catch (error) {
        console.error(' [ADMIN] Error al cargar campus:', error);
        console.error(' [ADMIN] Stack trace:', error.stack);
        alert('Error al cargar campus: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR campus
function showAddCampusModal() {
    // Cambiar título
    document.getElementById('campusModalTitle').textContent = 'Agregar Campus';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('campusId').value = '';

    // Limpiar formulario
    document.getElementById('campusForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('campusModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editCampus(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.campus}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const campus_item = await response.json();

        // Cambiar título del modal
        document.getElementById('campusModalTitle').textContent = 'Editar Campus';

        // Llenar formulario con datos de PostgreSQL usando helper para obtener campos
        document.getElementById('campusId').value = campus_item.id_campus;
        document.getElementById('campusNombre').value = getCampusField(campus_item, CAMPUS_FIELDS.nombre) || '';
        document.getElementById('campusDireccion').value = getCampusField(campus_item, CAMPUS_FIELDS.direccion) || '';
        document.getElementById('campusDescripcion').value = getCampusField(campus_item, CAMPUS_FIELDS.descripcion) || '';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('campusModal')).show();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar campus: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveCampus() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('campusId').value;
        const nombre = document.getElementById('campusNombre').value;
        const direccion = document.getElementById('campusDireccion').value;
        const descripcion = document.getElementById('campusDescripcion').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre) {
            alert('Nombre es obligatorio');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const campus_item = {
            [CAMPUS_FIELDS.nombre]: nombre,
            [CAMPUS_FIELDS.direccion]: direccion,
            [CAMPUS_FIELDS.descripcion]: descripcion
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.campus}/` :
            `${API_BASE}/${API_ENDPOINTS.campus}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campus_item)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('campusModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadCampus();

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteCampus(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar este campus de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.campus}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadCampus();

    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





