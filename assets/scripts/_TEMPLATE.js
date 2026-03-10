// TEMPLATE - Copia esto para CADA nueva tabla
// INSTRUCCIONES:
// Guarda este archivo como: assets/scripts/[nombre_tabla].js
// Reemplaza "miTabla" con el nombre de tu tabla
// Agrega/quita campos según sea necesario
// Incluye en admin.html
// Llama loadMiTabla() en main.js
// LEER: Cargar y mostrar registros
async function loadMiTabla() {
    try {
        const response = await fetch(`${API_BASE}/mi_tabla/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const datos = await response.json();
        
        const tbody = document.getElementById('miTablaTableBody');
        if (!tbody) {
            console.error(' Elemento "miTablaTableBody" no existe');
            return;
        }
        
        tbody.innerHTML = '';
        
        datos.forEach(item => {
            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.campo1}</td>
                    <td>${item.campo2}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" 
                                onclick="editMiTabla(${item.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="deleteMiTabla(${item.id})"></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
    } catch (error) {
        console.error(' Error:', error);
        alert('Error al cargar: ' + error.message);
    }
}

// Mostrar modal para agregar
function showAddMiTablaModal() {
    document.getElementById('miTablaModalTitle').textContent = 'Agregar';
    document.getElementById('miTablaId').value = '';
    document.getElementById('miTablaForm').reset();
    new bootstrap.Modal(document.getElementById('miTablaModal')).show();
}

// EDITAR: Cargar datos en formulario
async function editMiTabla(id) {
    try {
        const response = await fetch(`${API_BASE}/mi_tabla/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const item = await response.json();
        
        document.getElementById('miTablaModalTitle').textContent = 'Editar';
        document.getElementById('miTablaId').value = item.id;
        document.getElementById('miTablaCampo1').value = item.campo1;
        document.getElementById('miTablaCampo2').value = item.campo2;
        
        new bootstrap.Modal(document.getElementById('miTablaModal')).show();
    } catch (error) {
        console.error(' Error:', error);
        alert('Error: ' + error.message);
    }
}

// CREAR o ACTUALIZAR: Guardar datos
async function saveMiTabla() {
    try {
        const id = document.getElementById('miTablaId').value;
        const campo1 = document.getElementById('miTablaCampo1').value;
        const campo2 = document.getElementById('miTablaCampo2').value;
        
        if (!campo1 || !campo2) {
            alert('Rellena todos los campos');
            return;
        }
        
        const datos = {
            campo1: campo1,
            campo2: campo2
        };
        
        const isCreating = !id;
        const method = isCreating ? 'POST' : 'PUT';
        const url = isCreating ? 
            `${API_BASE}/mi_tabla/` : 
            `${API_BASE}/mi_tabla/${id}`;
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        bootstrap.Modal.getInstance(document.getElementById('miTablaModal')).hide();
        await loadMiTabla();
        
    } catch (error) {
        console.error(' Error:', error);
        alert('Error: ' + error.message);
    }
}

// BORRAR: Eliminar registro
async function deleteMiTabla(id) {
    if (!confirm('¿Borrar este registro?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/mi_tabla/${id}`, { 
            method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        await loadMiTabla();
    } catch (error) {
        console.error(' Error:', error);
        alert('Error: ' + error.message);
    }
}





