// FUNCIONES DE UTILIDAD GENERALES
// Funciones de utilidad generales
// Esta función verifica que la API responda
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Muestra alerta si hay problemas de conexión
async function showAPIStatus() {
    const isConnected = await checkAPIConnection();
    if (!isConnected) {
        alert(`No se puede conectar con la API. Asegúrate de que el servidor esté ejecutándose en ${API_BASE}`);
        console.error('API no disponible');
    }
}






