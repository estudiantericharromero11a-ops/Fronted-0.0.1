// FUNCIONES CRUD PARA BLOQUES (BD Universitaria)
// LEER: Cargar y mostrar bloques desde PostgreSQL
async function loadBloques() {
    try {

        // Conectar a API REST
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/`);

        // Verificar conexión
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        // Convertir respuesta JSON a datos JavaScript
        const bloques = await response.json();

        // DEBUG: Ver qué estructura tiene el primer elemento
        if (bloques.length > 0) {
            console.log('🔍 BLOQUES - Primer elemento:', bloques[0]);
            console.log('🔍 BLOQUES - Keys del objeto:', Object.keys(bloques[0]));
            console.log('🔍 BLOQUES - Helper:', {
                estado: getEstado(bloques[0]),
                created_at: getCreatedAt(bloques[0]),
                updated_at: getUpdatedAt(bloques[0])
            });
        }

        // Encontrar tabla en HTML (por ID)
        const tbody = document.getElementById('bloquesTableBody');
        if (!tbody) {
            console.error(' Elemento "bloquesTableBody" no existe en HTML');
            return;
        }

        // Limpiar tabla (quitar datos viejos)
        tbody.innerHTML = '';

        // RECORRER cada bloque de PostgreSQL
        bloques.forEach(bloque => {
            const row = `
                <tr>
                    <td>${bloque.id_bloque}</td>
                    <td>${bloque.nombre || '-'}</td>
                    <td>${bloque.descripcion || '-'}</td>
                    <td>${bloque.id_campus}</td>
                    <td>${getEstado(bloque)}</td>
                    <td>${getCreatedAt(bloque)}</td>
                    <td>${getUpdatedAt(bloque)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editBloque(${bloque.id_bloque})">
                             Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteBloque(${bloque.id_bloque})">
                             Borrar
                        </button>
                    </td>
                </tr>
            `;

            // Agregar la fila a la tabla
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar bloques:', error);
        alert('Error al cargar bloques: ' + error.message);
    }
}

// MODALES (Ventanas emergentes)
// Mostrar modal para AGREGAR bloque
function showAddBloqueModal() {
    // Cambiar título
    document.getElementById('bloqueModalTitle').textContent = 'Agregar Bloque';

    // Limpiar ID (para saber que es NUEVO, no edición)
    document.getElementById('bloqueId').value = '';

    // Limpiar formulario
    document.getElementById('bloqueForm').reset();

    // Mostrar el modal
    new bootstrap.Modal(document.getElementById('bloqueModal')).show();
}

// CRUD COMPLETO
// EDITAR: Cargar datos de PostgreSQL en el formulario
async function editBloque(id) {
    try {

        // Traer los datos de PostgreSQL
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const bloque = await response.json();

        // Cambiar título del modal
        document.getElementById('bloqueModalTitle').textContent = 'Editar Bloque';

        // Llenar formulario con datos de PostgreSQL
        document.getElementById('bloqueId').value = bloque.id_bloque;
        document.getElementById('bloqueNombre').value = bloque[BLOQUES_FIELDS.nombre];
        document.getElementById('bloqueDescripcion').value = bloque[BLOQUES_FIELDS.descripcion];
        document.getElementById('bloqueIdCampus').value = bloque[BLOQUES_FIELDS.id_campus];
        document.getElementById('bloqueEstado').value = bloque[BLOQUES_FIELDS.estado] ? 'true' : 'false';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('bloqueModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar bloque: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar en PostgreSQL
async function saveBloque() {
    try {
        // LEER datos del formulario
        const id = document.getElementById('bloqueId').value;
        const nombre = document.getElementById('bloqueNombre').value;
        const descripcion = document.getElementById('bloqueDescripcion').value;
        const id_campus = document.getElementById('bloqueIdCampus').value;

        // Validar que campos requeridos no estén vacíos
        if (!nombre || !id_campus) {
            alert('Nombre e ID Campus son obligatorios');
            return;
        }

        // Crear objeto con formato PostgreSQL
        const bloque = {
            [BLOQUES_FIELDS.nombre]: nombre,
            [BLOQUES_FIELDS.descripcion]: descripcion,
            [BLOQUES_FIELDS.id_campus]: parseInt(id_campus),
            [BLOQUES_FIELDS.estado]: document.getElementById('bloqueEstado').value === 'true'
        };

        // Decidir si es CREAR (POST) o ACTUALIZAR (PUT)
        const isCreating = !id;  // Si no tiene ID, es nuevo
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.bloques}/` :
            `${API_BASE}/${API_ENDPOINTS.bloques}/${id}/`;


        // Enviar a API REST
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bloque)
        });

        // Verificar si salió bien
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        // Cerrar modal
        bootstrap.Modal.getInstance(
            document.getElementById('bloqueModal')
        ).hide();

        // Recargar tabla para ver cambios
        await loadBloques();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// BORRAR: Eliminar de PostgreSQL
async function deleteBloque(id) {
    try {
        // Pedir confirmación al usuario
        if (!confirm('¿Realmente quieres borrar este bloque de la base de datos?')) {
            return;
        }


        // Enviar solicitud DELETE a la API
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/${id}/`, {
            method: 'DELETE'
        });

        // Verificar respuesta
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error ${response.status}: ${errText}`);
        }


        // Recargar tabla
        await loadBloques();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error al eliminar: ' + error.message);
    }
}





