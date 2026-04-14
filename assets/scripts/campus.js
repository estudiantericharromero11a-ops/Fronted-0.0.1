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

        // DEBUG: Ver qué estructura tiene el primer elemento
        if (campus.length > 0) {
            console.log('🔍 CAMPUS - Primer elemento:', campus[0]);
            console.log('🔍 CAMPUS - Keys del objeto:', Object.keys(campus[0]));
            console.log('🔍 CAMPUS - Helper:', {
                estado: getEstado(campus[0]),
                created_at: getCreatedAt(campus[0]),
                updated_at: getUpdatedAt(campus[0])
            });
        }

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
            const estadoValue = getEstado(campus_item) !== '-' ? getEstado(campus_item) :
                formatEstado(campus_item.id_estado);
            const createdValue = getCreatedAt(campus_item) !== '-' ? getCreatedAt(campus_item) :
                displayValue(campus_item.created_at || campus_item.created || campus_item.fecha_creacion || campus_item.fechaCreacion);
            const updatedValue = getUpdatedAt(campus_item) !== '-' ? getUpdatedAt(campus_item) :
                displayValue(campus_item.updated_at || campus_item.updated || campus_item.fecha_actualizacion || campus_item.fechaActualizacion);

            const auditMissing = !hasCampusAuditFields(campus_item) && estadoValue === '-' && createdValue === '-' && updatedValue === '-';
            if (auditMissing) {
                console.warn('[Campus] El backend no devuelve campos de auditoría para campus:', campus_item);
            }

            const displayedEstado = auditMissing ? 'No disponible' : estadoValue;
            const displayedCreated = auditMissing ? 'No disponible' : createdValue;
            const displayedUpdated = auditMissing ? 'No disponible' : updatedValue;

            const row = `
                <tr>
                    <td>${campus_item.id_campus}</td>
                    <td>${campus_item.nombre}</td>
                    <td>${campus_item.direccion || '-'}</td>
                    <td>${campus_item.descripcion || '-'}</td>
                    <td>${displayedEstado}</td>
                    <td>${displayedCreated}</td>
                    <td>${displayedUpdated}</td>
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
        document.getElementById('campusEstado').value = campus_item[CAMPUS_FIELDS.estado] ? 'true' : 'false';

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
            [CAMPUS_FIELDS.descripcion]: descripcion,
            [CAMPUS_FIELDS.estado]: document.getElementById('campusEstado').value === 'true'
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





