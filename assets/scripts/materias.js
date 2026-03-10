// FUNCIONES PARA MATERIAS (Asignaturas)
// LEER: Cargar y mostrar materias
async function loadMaterias() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const materias = await response.json();

        const tbody = document.getElementById('materiasTableBody');
        if (!tbody) {
            console.error(' Elemento "materiasTableBody" no existe');
            return;
        }

        tbody.innerHTML = '';

        materias.forEach(materia => {
            const row = `
                <tr>
                    <td>${materia.id_materia}</td>
                    <td>${materia[MATERIAS_FIELDS.nombre]}</td>
                    <td>${materia[MATERIAS_FIELDS.creditos] || 0}</td>
                    <td>${materia[MATERIAS_FIELDS.descripcion] || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editMateria(${materia.id_materia})">Editar</button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deleteMateria(${materia.id_materia})">Borrar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar materias:', error);
        alert('Error al cargar materias: ' + error.message);
    }
}

// Mostrar modal para agregar materia
function showAddMateriaModal() {
    document.getElementById('materiaModalTitle').textContent = 'Agregar Materia';
    document.getElementById('materiaId').value = '';
    document.getElementById('materiaForm').reset();
    new bootstrap.Modal(document.getElementById('materiaModal')).show();
}

// EDITAR: Cargar datos en formulario
async function editMateria(id) {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.materias}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const materia = await response.json();

        document.getElementById('materiaModalTitle').textContent = 'Editar Materia';
        document.getElementById('materiaId').value = materia.id_materia;
        document.getElementById('materiaNombre').value = materia[MATERIAS_FIELDS.nombre];
        document.getElementById('materiaCreditos').value = materia[MATERIAS_FIELDS.creditos];
        document.getElementById('materiaDescripcion').value = materia[MATERIAS_FIELDS.descripcion];

        new bootstrap.Modal(document.getElementById('materiaModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar materia: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar datos
async function saveMateria() {
    try {
        const id = document.getElementById('materiaId').value;
        const nombre = document.getElementById('materiaNombre').value;
        const creditos = document.getElementById('materiaCreditos').value;
        const descripcion = document.getElementById('materiaDescripcion').value;

        // Validar campos requeridos
        if (!nombre) {
            alert('El nombre de la materia es obligatorio');
            return;
        }

        // Crear objeto con los datos
        const materia = {
            [MATERIAS_FIELDS.nombre]: nombre,
            [MATERIAS_FIELDS.creditos]: parseInt(creditos) || 0,
            [MATERIAS_FIELDS.descripcion]: descripcion
        };

        const isCreating = !id;
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.materias}/` :
            `${API_BASE}/${API_ENDPOINTS.materias}/${id}/`;


        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(materia)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }


        bootstrap.Modal.getInstance(document.getElementById('materiaModal')).hide();
        await loadMaterias();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error: ' + error.message);
    }
}

// BORRAR: Eliminar materia
async function deleteMateria(id) {
    if (!confirm('¿Realmente quieres borrar esta materia?')) return;

    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.materias}/${id}/`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        await loadMaterias();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error: ' + error.message);
    }
}

// ACTUALIZAR ESTADÍSTICAS (opcional)
async function updateMateriasStats() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`);
        const materias = await response.json();

        const totalMaterias = materias.length;
        const totalCreditos = materias.reduce((sum, m) => sum + (m.creditos || 0), 0);

        document.getElementById('totalMaterias').textContent = totalMaterias;
        document.getElementById('totalCreditos').textContent = totalCreditos;

    } catch (error) {
        console.error('Error actualizando stats materias:', error);
    }
}





