// FUNCIONES PARA PROGRAMAS (Carreras Académicas)
// LEER: Cargar y mostrar programas
async function loadProgramas() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const programas = await response.json();

        const tbody = document.getElementById('programasTableBody');
        if (!tbody) {
            console.error(' Elemento "programasTableBody" no existe');
            return;
        }

        tbody.innerHTML = '';

        programas.forEach(programa => {
            const row = `
                <tr>
                    <td>${programa.id_programa}</td>
                    <td>${programa[PROGRAMAS_FIELDS.nombre]}</td>
                    <td>${programa[PROGRAMAS_FIELDS.tipo_programa] || '-'}</td>
                    <td>${programa[PROGRAMAS_FIELDS.duracion_semestres] || 0} semestres</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editPrograma(${programa.id_programa})">Editar</button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deletePrograma(${programa.id_programa})">Borrar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar programas:', error);
        alert('Error al cargar programas: ' + error.message);
    }
}

// Mostrar modal para agregar programa
function showAddProgramaModal() {
    document.getElementById('programaModalTitle').textContent = 'Agregar Programa';
    document.getElementById('programaId').value = '';
    document.getElementById('programaForm').reset();
    new bootstrap.Modal(document.getElementById('programaModal')).show();
}

// EDITAR: Cargar datos en formulario
async function editPrograma(id) {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programas}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const programa = await response.json();

        document.getElementById('programaModalTitle').textContent = 'Editar Programa';
        document.getElementById('programaId').value = programa.id_programa;
        document.getElementById('programaNombre').value = programa[PROGRAMAS_FIELDS.nombre];
        document.getElementById('programaTipo').value = programa[PROGRAMAS_FIELDS.tipo_programa];
        document.getElementById('programaDuracion').value = programa[PROGRAMAS_FIELDS.duracion_semestres];

        new bootstrap.Modal(document.getElementById('programaModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar programa: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar datos
async function savePrograma() {
    try {
        const id = document.getElementById('programaId').value;
        const nombre = document.getElementById('programaNombre').value;
        const tipo = document.getElementById('programaTipo').value;
        const duracion = document.getElementById('programaDuracion').value;

        // Validar campos requeridos
        if (!nombre) {
            alert('El nombre del programa es obligatorio');
            return;
        }

        // Crear objeto con los datos
        const programa = {
            [PROGRAMAS_FIELDS.nombre]: nombre,
            [PROGRAMAS_FIELDS.tipo_programa]: tipo,
            [PROGRAMAS_FIELDS.duracion_semestres]: parseInt(duracion) || 0
        };

        const isCreating = !id;
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.programas}/` :
            `${API_BASE}/${API_ENDPOINTS.programas}/${id}/`;


        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(programa)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }


        bootstrap.Modal.getInstance(document.getElementById('programaModal')).hide();
        await loadProgramas();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error: ' + error.message);
    }
}

// BORRAR: Eliminar programa
async function deletePrograma(id) {
    if (!confirm('¿Realmente quieres borrar este programa?')) return;

    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programas}/${id}/`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        await loadProgramas();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error: ' + error.message);
    }
}

// ACTUALIZAR ESTADÍSTICAS (opcional)
async function updateProgramasStats() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`);
        const programas = await response.json();

        const totalProgramas = programas.length;
        const programasPregrado = programas.filter(p => p.tipo_programa === 'pregrado').length;
        const programasPosgrado = programas.filter(p => p.tipo_programa === 'posgrado').length;

        document.getElementById('totalProgramas').textContent = totalProgramas;
        document.getElementById('programasPregrado').textContent = programasPregrado;
        document.getElementById('programasPosgrado').textContent = programasPosgrado;

    } catch (error) {
        console.error('Error actualizando stats programas:', error);
    }
}





