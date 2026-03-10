// SOLUCILUCION ALTERNATIVA PARA CAMPUS EN ADMIN
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

// Función alternativa más robusta para admin.html
async function loadCampusAdmin() {

    try {
        // Verificar configuración
        if (!API_BASE || !API_ENDPOINTS || !CAMPUS_FIELDS) {
            console.error(' [ADMIN-ALT] Configuración faltante');
            return;
        }

        // Esperar a que el DOM esté completamente listo
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        }

        // Verificar elemento HTML con reintentos
        let tbody = null;
        let attempts = 0;
        const maxAttempts = 10;

        while (!tbody && attempts < maxAttempts) {
            tbody = document.getElementById('campusTableBody');
            if (!tbody) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }

        if (!tbody) {
            console.error(' [ADMIN-ALT] campusTableBody no encontrado después de 10 intentos');
            return;
        }


        // Hacer la petición API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const campus = await response.json();

        // Limpiar y llenar tabla
        tbody.innerHTML = '';

        if (campus.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-warning">�️ No hay campus registrados</td></tr>';
            return;
        }

        campus.forEach(campus_item => {
            const nombre = getCampusField(campus_item, CAMPUS_FIELDS.nombre) || 'Sin nombre';
            const direccion = getCampusField(campus_item, CAMPUS_FIELDS.direccion) || '-';
            const descripcion = getCampusField(campus_item, CAMPUS_FIELDS.descripcion) || 'Sin descripción';

            const row = `
                <tr>
                    <td>${campus_item.id_campus || 'N/A'}</td>
                    <td>${nombre}</td>
                    <td>${direccion}</td>
                    <td>${descripcion}</td>
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
        console.error(' [ADMIN-ALT] Error:', error);
        const tbody = document.getElementById('campusTableBody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger"> Error al cargar campus: ${error.message}</td></tr>`;
        }
    }
}

// Reemplazar la función original en admin
if (typeof loadCampus !== 'undefined') {
    window.originalLoadCampus = loadCampus;
    window.loadCampus = loadCampusAdmin;
}





