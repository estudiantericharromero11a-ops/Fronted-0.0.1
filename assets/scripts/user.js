// USER.JS - PANEL DE USUARIO (SOLO LECTURA)
// Este archivo solo contiene operaciones GET (lectura)
// No hay CREATE, UPDATE, DELETE

// HELPER: Obtener valor de campo
function getUserField(item, fieldName) {
    const variations = [
        fieldName,
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        fieldName.toUpperCase(),
        'nombre_' + fieldName,
        fieldName + '_campus'
    ];
    
    for (const variation of variations) {
        if (item[variation] !== undefined && item[variation] !== null) {
            return item[variation];
        }
    }
    return undefined;
}

document.addEventListener('DOMContentLoaded', async function() {
    await userLoadAllData();
});

// CARGAR TODOS LOS DATOS AL INICIAR
async function userLoadAllData() {
    try {
        await Promise.all([
            userLoadPersonas(),
            userLoadMaterias(),
            userLoadProgramas(),
            userLoadInstalaciones(),
            userLoadCampus(),
            userLoadRoles(),
            userLoadPersonaRol().catch(e => console.warn('Tabla persona_rol no disponible')),
            userLoadProgramaMateria().catch(e => console.warn('Tabla programa_materia no disponible')),
            userLoadAsignacionInstalaciones().catch(e => console.warn('Tabla asignacion_instalaciones no disponible')),
            userLoadBloques(),
            userLoadAreasFuncionales(),
            userLoadHorariosInstalacion().catch(e => console.warn('Tabla horarios_instalacion no disponible')),
            userLoadEstadoInstalacion(),
            userUpdateStats()
        ]);
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// ESTADÍSTICAS (SOLO GET)
async function userUpdateStats() {
    try {
        const stats = await Promise.all([
            fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.roles}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/`)
        ]);
        
        if (stats.every(r => r.ok)) {
            const data = await Promise.all(stats.map(r => r.json()));
            
            document.getElementById('userTotalPersonas').textContent = data[0].length;
            document.getElementById('userTotalMaterias').textContent = data[1].length;
            document.getElementById('userTotalProgramas').textContent = data[2].length;
            document.getElementById('userTotalInstalaciones').textContent = data[3].length;
            document.getElementById('userTotalCampus').textContent = data[4].length;
            document.getElementById('userTotalRoles').textContent = data[5].length;
            document.getElementById('userTotalBloques').textContent = data[6].length;
            document.getElementById('userTotalAreasFuncionales').textContent = data[7].length;
            document.getElementById('userTotalHorariosInstalacion').textContent = data[8].length;
            document.getElementById('userTotalEstadoInstalacion').textContent = data[9].length;
        }
    } catch (error) {
        console.error('Error estadísticas:', error);
    }
}


// FUNCIONES GET - PERSONAS
async function userLoadPersonas() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const personas = await response.json();
        const tbody = document.getElementById('userPersonasTableBody');
        if (!tbody) return;
        
        if (!personas.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = personas.map(p => `
            <tr>
                <td>${p.id_persona}</td>
                <td>${p[PERSONAS_FIELDS.nombre]}</td>
                <td>${p[PERSONAS_FIELDS.documento]}</td>
                <td>${p[PERSONAS_FIELDS.correo]}</td>
                <td>${p[PERSONAS_FIELDS.telefono] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error personas:', error.message);
        const tbody = document.getElementById('userPersonasTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - MATERIAS
async function userLoadMaterias() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const materias = await response.json();
        const tbody = document.getElementById('userMateriasTableBody');
        if (!tbody) return;
        
        if (!materias.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = materias.map(m => `
            <tr>
                <td>${m.id_materia}</td>
                <td>${m[MATERIAS_FIELDS.nombre]}</td>
                <td>${m[MATERIAS_FIELDS.creditos] || '-'}</td>
                <td>${m[MATERIAS_FIELDS.descripcion] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error materias:', error.message);
        const tbody = document.getElementById('userMateriasTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - PROGRAMAS
async function userLoadProgramas() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const programas = await response.json();
        const tbody = document.getElementById('userProgramasTableBody');
        if (!tbody) return;
        
        if (!programas.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = programas.map(p => `
            <tr>
                <td>${p.id_programa}</td>
                <td>${p[PROGRAMAS_FIELDS.nombre]}</td>
                <td>${p[PROGRAMAS_FIELDS.tipo_programa] || '-'}</td>
                <td>${p[PROGRAMAS_FIELDS.duracion_semestres] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error programas:', error.message);
        const tbody = document.getElementById('userProgramasTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - INSTALACIONES
async function userLoadInstalaciones() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const instalaciones = await response.json();
        const tbody = document.getElementById('userInstalacionesTableBody');
        if (!tbody) return;
        
        if (!instalaciones.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = instalaciones.map(i => `
            <tr>
                <td>${i.id_instalacion}</td>
                <td>${i[INSTALACIONES_FIELDS.nombre]}</td>
                <td>${i[INSTALACIONES_FIELDS.tipo_instalacion] || '-'}</td>
                <td>${i[INSTALACIONES_FIELDS.piso] || '-'}</td>
                <td>${i[INSTALACIONES_FIELDS.capacidad] || '-'}</td>
                <td>${i[INSTALACIONES_FIELDS.id_bloque] || '-'}</td>
                <td>${i[INSTALACIONES_FIELDS.id_area] || '-'}</td>
                <td>${i[INSTALACIONES_FIELDS.id_estado] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error instalaciones:', error.message);
        const tbody = document.getElementById('userInstalacionesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - CAMPUS
async function userLoadCampus() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const campus = await response.json();
        const tbody = document.getElementById('userCampusTableBody');
        if (!tbody) return;
        
        if (!campus.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = campus.map(c => `
            <tr>
                <td>${c.id_campus}</td>
                <td>${c[CAMPUS_FIELDS.nombre]}</td>
                <td>${c[CAMPUS_FIELDS.direccion] || '-'}</td>
                <td>${c[CAMPUS_FIELDS.descripcion] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error campus:', error.message);
        const tbody = document.getElementById('userCampusTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - ROLES
async function userLoadRoles() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.roles}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const roles = await response.json();
        const tbody = document.getElementById('userRolesTableBody');
        if (!tbody) return;
        
        if (!roles.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = roles.map(r => `
            <tr>
                <td>${r.id_rol}</td>
                <td>${r[ROLES_FIELDS.nombre_rol]}</td>
                <td>${r[ROLES_FIELDS.descripcion] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error roles:', error.message);
        const tbody = document.getElementById('userRolesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - PERSONA-ROL (OPCIONAL)
async function userLoadPersonaRol() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const personaRol = await response.json();
        const tbody = document.getElementById('userPersonaRolTableBody');
        if (!tbody) return;
        
        if (!personaRol.length) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = personaRol.map(pr => `
            <tr>
                <td>${pr[PERSONA_ROL_FIELDS.id_persona]}</td>
                <td>${pr[PERSONA_ROL_FIELDS.id_rol]}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error persona_rol:', error.message);
        const tbody = document.getElementById('userPersonaRolTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="2" class="text-center text-warning">No disponible</td></tr>';
    }
}


// FUNCIONES GET - PROGRAMA-MATERIA (OPCIONAL)
async function userLoadProgramaMateria() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const programaMateria = await response.json();
        const tbody = document.getElementById('userProgramaMateriaTableBody');
        if (!tbody) return;
        
        if (!programaMateria.length) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = programaMateria.map(pm => `
            <tr>
                <td>${pm[PROGRAMA_MATERIA_FIELDS.id_programa]}</td>
                <td>${pm[PROGRAMA_MATERIA_FIELDS.id_materia]}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error programa_materia:', error.message);
        const tbody = document.getElementById('userProgramaMateriaTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="2" class="text-center text-warning">No disponible</td></tr>';
    }
}


// FUNCIONES GET - ASIGNACION INSTALACIONES
async function userLoadAsignacionInstalaciones() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const asignacion = await response.json();
        const tbody = document.getElementById('userAsignacionInstalacionesTableBody');
        if (!tbody) return;
        
        if (!asignacion.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = asignacion.map(a => `
            <tr>
                <td>${a.id_asignacion || '-'}</td>
                <td>${a[ASIGNACION_INSTALACIONES_FIELDS.id_instalacion]}</td>
                <td>${a[ASIGNACION_INSTALACIONES_FIELDS.id_materia]}</td>
                <td>${a[ASIGNACION_INSTALACIONES_FIELDS.dia_semana] || '-'}</td>
                <td>${a.hora_inicio || '-'}</td>
                <td>${a.hora_fin || '-'}</td>
                <td>${a[ASIGNACION_INSTALACIONES_FIELDS.id_persona] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error asignaciones:', error.message);
        const tbody = document.getElementById('userAsignacionInstalacionesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-warning">No disponible</td></tr>';
    }
}


// FUNCIONES GET - BLOQUES
async function userLoadBloques() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const bloques = await response.json();
        const tbody = document.getElementById('userBloquesTableBody');
        if (!tbody) return;
        
        if (!bloques.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = bloques.map(b => `
            <tr>
                <td>${b.id_bloque}</td>
                <td>${b[BLOQUES_FIELDS.nombre]}</td>
                <td>${b[BLOQUES_FIELDS.descripcion] || '-'}</td>
                <td>${b[BLOQUES_FIELDS.id_campus]}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error bloques:', error.message);
        const tbody = document.getElementById('userBloquesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - AREAS FUNCIONALES
async function userLoadAreasFuncionales() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const areas = await response.json();
        const tbody = document.getElementById('userAreasFuncionalesTableBody');
        if (!tbody) return;
        
        if (!areas.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = areas.map(a => `
            <tr>
                <td>${a.id_area}</td>
                <td>${a[AREAS_FUNCIONALES_FIELDS.nombre_area]}</td>
                <td>${a[AREAS_FUNCIONALES_FIELDS.descripcion] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error areas:', error.message);
        const tbody = document.getElementById('userAreasFuncionalesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error</td></tr>';
    }
}


// FUNCIONES GET - HORARIOS INSTALACION (OPCIONAL)
async function userLoadHorariosInstalacion() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const horarios = await response.json();
        const tbody = document.getElementById('userHorariosInstalacionTableBody');
        if (!tbody) return;
        
        if (!horarios || horarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = horarios.map(h => `
            <tr>
                <td>${h.id_horario || h.id || '-'}</td>
                <td>${h[HORARIOS_INSTALACION_FIELDS.id_instalacion] || '-'}</td>
                <td>${h[HORARIOS_INSTALACION_FIELDS.dia_semana] || '-'}</td>
                <td>${h[HORARIOS_INSTALACION_FIELDS.hora_apertura] || '-'}</td>
                <td>${h[HORARIOS_INSTALACION_FIELDS.hora_cierre] || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error horarios:', error.message);
        const tbody = document.getElementById('userHorariosInstalacionTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-warning">No disponible</td></tr>';
    }
}


// FUNCIONES GET - ESTADO INSTALACION
async function userLoadEstadoInstalacion() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/`);
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
        
        const estados = await response.json();
        const tbody = document.getElementById('userEstadoInstalacionTableBody');
        
        if (!tbody) {
            console.warn('Elemento HTML userEstadoInstalacionTableBody no encontrado');
            return;
        }
        
        if (!estados.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = estados.map(e => `
            <tr>
                <td>${e.id_estado}</td>
                <td>${e[ESTADO_INSTALACION_FIELDS.nombre_estado]}</td>
                <td>${e[ESTADO_INSTALACION_FIELDS.descripcion] || '-'}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('� Error cargando estados:', error.message);
        const tbody = document.getElementById('userEstadoInstalacionTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error</td></tr>';
    }
}