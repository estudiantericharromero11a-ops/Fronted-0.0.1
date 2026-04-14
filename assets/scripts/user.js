// USER.JS - PANEL DE USUARIO (SOLO LECTURA)
// Este archivo solo contiene operaciones GET (lectura)
// No hay CREATE, UPDATE, DELETE

document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que se detecte el API port primero
    const detectedPort = await detectApiPort();
    
    if (!detectedPort) {
        console.error('No se pudo conectar a la API. Verifica que el servidor esté corriendo.');
        return;
    }

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
            fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.roles}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/`).catch(() => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/`).catch(() => ({ ok: false }))
        ]);
        
        const data = await Promise.all(stats.map(async r => {
            return r.ok ? await r.json() : [];
        }));
        
        const totals = [
            'userTotalPersonas',
            'userTotalMaterias',
            'userTotalProgramas',
            'userTotalInstalaciones',
            'userTotalCampus',
            'userTotalRoles',
            'userTotalBloques',
            'userTotalAreasFuncionales',
            'userTotalHorariosInstalacion',
            'userTotalEstadoInstalacion'
        ];

        totals.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = Array.isArray(data[index]) ? data[index].length : 0;
            }
        });
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
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = personas.map(p => `
            <tr>
                <td>${p.id_persona}</td>
                <td>${p.nombre}</td>
                <td>${p.documento}</td>
                <td>${p.correo}</td>
                <td>${p.telefono || '-'}</td>
                <td>${getEstado(p)}</td>
                <td>${getCreatedAt(p)}</td>
                <td>${getUpdatedAt(p)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error personas:', error.message);
        const tbody = document.getElementById('userPersonasTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error</td></tr>';
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
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = materias.map(m => `
            <tr>
                <td>${m.id_materia || '-'}</td>
                <td>${m.nombre || '-'}</td>
                <td>${m.creditos || '-'}</td>
                <td>${m.descripcion || '-'}</td>
                <td>${getEstado(m)}</td>
                <td>${getCreatedAt(m)}</td>
                <td>${getUpdatedAt(m)}</td>
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
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = programas.map(p => `
            <tr>
                <td>${p.id_programa || '-'}</td>
                <td>${p.nombre || '-'}</td>
                <td>${p.tipo_programa || '-'}</td>
                <td>${p.duracion_semestres || '-'}</td>
                <td>${getEstado(p)}</td>
                <td>${getCreatedAt(p)}</td>
                <td>${getUpdatedAt(p)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error programas:', error.message);
        const tbody = document.getElementById('userProgramasTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error</td></tr>';
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
            tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">No hay datos</td></tr>';
            return;
        }
        
        tbody.innerHTML = instalaciones.map(i => `
            <tr>
                <td>${i.id_instalacion || '-'}</td>
                <td>${i.nombre || '-'}</td>
                <td>${i.tipo_instalacion || '-'}</td>
                <td>${i.piso || '-'}</td>
                <td>${i.capacidad || '-'}</td>
                <td>${i.id_bloque || '-'}</td>
                <td>${i.id_area || '-'}</td>
                <td>${i.id_estado || '-'}</td>
                <td>${getEstado(i)}</td>
                <td>${getCreatedAt(i)}</td>
                <td>${getUpdatedAt(i)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error instalaciones:', error.message);
        const tbody = document.getElementById('userInstalacionesTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="text-center text-danger">Error</td></tr>';
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
        
        tbody.innerHTML = campus.map(c => {
            const estadoValue = getEstado(c) !== '-' ? getEstado(c) : formatEstado(c.id_estado);
            const createdValue = getCreatedAt(c) !== '-' ? getCreatedAt(c) :
                displayValue(c.created_at || c.created || c.fecha_creacion || c.fechaCreacion);
            const updatedValue = getUpdatedAt(c) !== '-' ? getUpdatedAt(c) :
                displayValue(c.updated_at || c.updated || c.fecha_actualizacion || c.fechaActualizacion);
            const auditMissing = !hasCampusAuditFields(c) && estadoValue === '-' && createdValue === '-' && updatedValue === '-';
            if (auditMissing) {
                console.warn('[User Campus] El backend no devuelve campos de auditoría para campus:', c);
            }
            const displayedEstado = auditMissing ? 'No disponible' : estadoValue;
            const displayedCreated = auditMissing ? 'No disponible' : createdValue;
            const displayedUpdated = auditMissing ? 'No disponible' : updatedValue;

            return `
                <tr>
                    <td>${c.id_campus || '-'}</td>
                    <td>${c.nombre || '-'}</td>
                    <td>${c.direccion || '-'}</td>
                    <td>${c.descripcion || '-'}</td>
                    <td>${displayedEstado}</td>
                    <td>${displayedCreated}</td>
                    <td>${displayedUpdated}</td>
                </tr>
            `;
        }).join('');
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
                <td>${r.id_rol || '-'}</td>
                <td>${r.nombre_rol || r.nombre || '-'}</td>
                <td>${r.descripcion || '-'}</td>
                <td>${getEstado(r)}</td>
                <td>${getCreatedAt(r)}</td>
                <td>${getUpdatedAt(r)}</td>
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
                <td>${pr.id_persona}</td>
                <td>${pr.id_rol}</td>
                <td>${getCreatedAt(pr)}</td>
                <td>${getUpdatedAt(pr)}</td>
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
                <td>${pm.id_programa}</td>
                <td>${pm.id_materia}</td>
                <td>${getEstado(pm)}</td>
                <td>${getCreatedAt(pm)}</td>
                <td>${getUpdatedAt(pm)}</td>
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
                <td>${a.id_instalacion || '-'}</td>
                <td>${a.id_materia || '-'}</td>
                <td>${a.dia_semana || '-'}</td>
                <td>${a.hora_inicio || '-'}</td>
                <td>${a.hora_fin || '-'}</td>
                <td>${a.id_persona || '-'}</td>
                <td>${getEstado(a)}</td>
                <td>${getCreatedAt(a)}</td>
                <td>${getUpdatedAt(a)}</td>
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
                <td>${b.nombre || '-'}</td>
                <td>${b.descripcion || '-'}</td>
                <td>${b.id_campus}</td>
                <td>${getEstado(b)}</td>
                <td>${getCreatedAt(b)}</td>
                <td>${getUpdatedAt(b)}</td>
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
                <td>${a.nombre_area || a.nombre || '-'}</td>
                <td>${a.descripcion || '-'}</td>
                <td>${getEstado(a)}</td>
                <td>${getCreatedAt(a)}</td>
                <td>${getUpdatedAt(a)}</td>
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
                <td>${h.id_instalacion || '-'}</td>
                <td>${h.dia_semana || '-'}</td>
                <td>${h.hora_apertura || '-'}</td>
                <td>${h.hora_cierre || '-'}</td>
                <td>${getEstado(h)}</td>
                <td>${getCreatedAt(h)}</td>
                <td>${getUpdatedAt(h)}</td>
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
                <td>${e.nombre_estado || '-'}</td>
                <td>${e.descripcion || '-'}</td>
                <td>${getEstado(e)}</td>
                <td>${getCreatedAt(e)}</td>
                <td>${getUpdatedAt(e)}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('� Error cargando estados:', error.message);
        const tbody = document.getElementById('userEstadoInstalacionTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error</td></tr>';
    }
}