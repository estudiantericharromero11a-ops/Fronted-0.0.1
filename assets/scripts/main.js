// Arranque mínimo sin comentarios raros

document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que se detecte el API port primero
    const detectedPort = await detectApiPort();
    
    if (!detectedPort) {
        console.error('No se pudo conectar a la API. Verifica que el servidor esté corriendo.');
        return;
    }

    await showAPIStatus();

    await loadPersonas();
    await loadMaterias();
    await loadProgramas();
    await loadInstalaciones();
    await loadCampus();
    await loadRoles();

    await loadPersonaRol();
    await loadProgramaMateria();
    await loadAsignacionInstalaciones();

    await loadBloques();
    await loadAreasFuncionales();
    await loadHorariosInstalacion();
    await loadEstadoInstalacion();

    await updateStats();
});

async function updateStats() {
    try {
        const [personasRes, materiasRes, programasRes, instalacionesRes, campusRes, rolesRes, personaRolRes, programaMateriaRes, asignacionInstalacionesRes, bloquesRes, areasFuncionalesRes, horariosInstalacionRes, estadoInstalacionRes] = await Promise.all([
            fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.materias}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.programas}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.instalaciones}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.campus}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.roles}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.persona_rol}/`).catch(e => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.programa_materia}/`).catch(e => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.asignacion_instalaciones}/`).catch(e => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.bloques}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.areas_funcionales}/`),
            fetch(`${API_BASE}/${API_ENDPOINTS.horarios_instalacion}/`).catch(e => ({ ok: false })),
            fetch(`${API_BASE}/${API_ENDPOINTS.estado_instalacion}/`)
        ]);

        if (!personasRes.ok || !materiasRes.ok || !programasRes.ok ||
            !instalacionesRes.ok || !campusRes.ok || !rolesRes.ok ||
            !bloquesRes.ok || !areasFuncionalesRes.ok || !estadoInstalacionRes.ok) {
            return;
        }

        const jsonPromises = [
            personasRes.json(),
            materiasRes.json(),
            programasRes.json(),
            instalacionesRes.json(),
            campusRes.json(),
            rolesRes.json(),
            personaRolRes.ok ? personaRolRes.json() : Promise.resolve([]),
            programaMateriaRes.ok ? programaMateriaRes.json() : Promise.resolve([]),
            asignacionInstalacionesRes.ok ? asignacionInstalacionesRes.json() : Promise.resolve([]),
            bloquesRes.json(),
            areasFuncionalesRes.json(),
            horariosInstalacionRes.ok ? horariosInstalacionRes.json() : Promise.resolve([]),
            estadoInstalacionRes.json()
        ];

        const [personas, materias, programas, instalaciones, campus, roles, personaRol, programaMateria, asignacionInstalaciones, bloques, areasFuncionales, horariosInstalacion, estadoInstalacion] = await Promise.all(jsonPromises);

        document.getElementById('totalPersonas').textContent = personas.length;
        document.getElementById('totalMaterias').textContent = materias.length;
        document.getElementById('totalProgramas').textContent = programas.length;
        document.getElementById('totalInstalaciones').textContent = instalaciones.length;
        document.getElementById('totalCampus').textContent = campus.length;
        document.getElementById('totalRoles').textContent = roles.length;
        document.getElementById('totalBloques').textContent = bloques.length;
        document.getElementById('totalAreasFuncionales').textContent = areasFuncionales.length;
        document.getElementById('totalHorariosInstalacion').textContent = horariosInstalacion.length;
        document.getElementById('totalEstadoInstalacion').textContent = estadoInstalacion.length;
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}

async function showAPIStatus() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        if (!response.ok) {
            alert('API respondio con error ' + response.status);
        }
    } catch (error) {
        alert('Error de conexion con la API');
        console.error(error);
    }
}




