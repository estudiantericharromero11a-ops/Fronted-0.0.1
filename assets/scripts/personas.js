// FUNCIONES PARA PERSONAS (Estudiantes, Docentes, Administrativos)
// LEER: Cargar y mostrar personas
async function loadPersonas() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const personas = await response.json();

        const tbody = document.getElementById('personasTableBody');
        if (!tbody) {
            console.error(' Elemento "personasTableBody" no existe');
            return;
        }

        tbody.innerHTML = '';

        personas.forEach(persona => {
            const row = `
                <tr>
                    <td>${getFieldValue(persona, 'id_persona')}</td>
                    <td>${getFieldValue(persona, 'nombre')}</td>
                    <td>${getFieldValue(persona, 'documento')}</td>
                    <td>${getFieldValue(persona, 'correo') || '-'}</td>
                    <td>${getFieldValue(persona, 'telefono') || '-'}</td>
                    <td>${getEstado(persona)}</td>
                    <td>${getCreatedAt(persona)}</td>
                    <td>${getUpdatedAt(persona)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                                onclick="editPersona(${persona.id_persona})">Editar</button>
                        <button class="btn btn-sm btn-danger"
                                onclick="deletePersona(${persona.id_persona})">Borrar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(' Error al cargar personas:', error);
        alert('Error al cargar personas: ' + error.message);
    }
}

// Mostrar modal para agregar persona
function showAddPersonaModal() {
    document.getElementById('personaModalTitle').textContent = 'Agregar Persona';
    document.getElementById('personaId').value = '';
    document.getElementById('personaForm').reset();
    new bootstrap.Modal(document.getElementById('personaModal')).show();
}

// EDITAR: Cargar datos en formulario
async function editPersona(id) {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/${id}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const persona = await response.json();

        document.getElementById('personaModalTitle').textContent = 'Editar Persona';
        document.getElementById('personaId').value = persona.id_persona;
        document.getElementById('personaNombre').value = persona[PERSONAS_FIELDS.nombre];
        document.getElementById('personaDocumento').value = persona[PERSONAS_FIELDS.documento];
        document.getElementById('personaCorreo').value = persona[PERSONAS_FIELDS.correo];
        document.getElementById('personaTelefono').value = persona[PERSONAS_FIELDS.telefono];
        document.getElementById('personaEstado').value = persona[PERSONAS_FIELDS.estado] ? 'true' : 'false';

        new bootstrap.Modal(document.getElementById('personaModal')).show();

    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar persona: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar datos
async function savePersona() {
    try {
        const id = document.getElementById('personaId').value;
        const nombre = document.getElementById('personaNombre').value;
        const documento = document.getElementById('personaDocumento').value;
        const correo = document.getElementById('personaCorreo').value;
        const telefono = document.getElementById('personaTelefono').value;

        // Validar campos requeridos
        if (!nombre || !documento) {
            alert('Nombre y documento son obligatorios');
            return;
        }

        // Crear objeto con los datos
        const persona = {
            [PERSONAS_FIELDS.nombre]: nombre,
            [PERSONAS_FIELDS.documento]: documento,
            [PERSONAS_FIELDS.correo]: correo,
            [PERSONAS_FIELDS.telefono]: telefono,
            [PERSONAS_FIELDS.estado]: document.getElementById('personaEstado').value === 'true'
        };

        const isCreating = !id;
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ?
            `${API_BASE}/${API_ENDPOINTS.personas}/` :
            `${API_BASE}/${API_ENDPOINTS.personas}/${id}/`;


        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(persona)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }


        bootstrap.Modal.getInstance(document.getElementById('personaModal')).hide();
        await loadPersonas();

    } catch (error) {
        console.error(' Error al guardar:', error);
        alert('Error: ' + error.message);
    }
}

// BORRAR: Eliminar persona
async function deletePersona(id) {
    if (!confirm('¿Realmente quieres borrar esta persona?')) return;

    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/${id}/`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        await loadPersonas();

    } catch (error) {
        console.error(' Error al eliminar:', error);
        alert('Error: ' + error.message);
    }
}

// ACTUALIZAR ESTADÍSTICAS (opcional)
async function updatePersonasStats() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        const personas = await response.json();

        const totalPersonas = personas.length;

        document.getElementById('totalPersonas').textContent = totalPersonas;

    } catch (error) {
        console.error('Error actualizando stats personas:', error);
    }
}





