/**
 * Sistema de Autenticación JWT - Frontend
 * Maneja login, logout, tokens y validación de sesiones
 */

const AUTH_CONFIG = {
    API_URL: 'http://localhost:8000',
    TOKEN_KEY: 'jwtToken',
    USER_DATA_KEY: 'userData',
    STORAGE_TYPE: 'localStorage' // localStorage o sessionStorage
};

class AuthService {
    constructor() {
        this.storage = window[AUTH_CONFIG.STORAGE_TYPE];
    }

    /**
     * Realiza login contra el backend
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} - Token y datos del usuario
     */
    async login(username, password) {
        try {
            const response = await fetch(`${AUTH_CONFIG.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error en autenticación');
            }

            const data = await response.json();
            
            // Guardar token y datos del usuario
            this.storage.setItem(AUTH_CONFIG.TOKEN_KEY, data.access_token);
            this.storage.setItem(AUTH_CONFIG.USER_DATA_KEY, JSON.stringify({
                id_persona: data.id_persona,
                username: data.username,
                rol: data.rol,
                expires_at: data.expires_at
            }));

            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Realiza logout (invalida el token)
     */
    async logout() {
        try {
            const token = this.getToken();
            
            if (token) {
                // Notificar al backend que se cierra sesión
                await fetch(`${AUTH_CONFIG.API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token })
                });
            }

            // Limpiar localStorage/sessionStorage
            this.storage.removeItem(AUTH_CONFIG.TOKEN_KEY);
            this.storage.removeItem(AUTH_CONFIG.USER_DATA_KEY);
        } catch (error) {
            console.error('Error en logout:', error);
            // Aún así limpiar el storage local
            this.storage.removeItem(AUTH_CONFIG.TOKEN_KEY);
            this.storage.removeItem(AUTH_CONFIG.USER_DATA_KEY);
        }
    }

    /**
     * Obtiene el token JWT actual
     * @returns {string|null} - Token JWT o null
     */
    getToken() {
        return this.storage.getItem(AUTH_CONFIG.TOKEN_KEY);
    }

    /**
     * Obtiene los datos del usuario actual
     * @returns {Object|null} - Datos del usuario o null
     */
    getUserData() {
        const userData = this.storage.getItem(AUTH_CONFIG.USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - true si hay token válido
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Verifica si el token es válido en el backend
     * @returns {Promise<boolean>} - true si el token es válido
     */
    async verifyToken() {
        try {
            const token = this.getToken();
            
            if (!token) return false;

            const response = await fetch(
                `${AUTH_CONFIG.API_URL}/auth/verify-header`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                await this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error verificando token:', error);
            return false;
        }
    }

    /**
     * Realiza una petición HTTP autenticada (incluye el token)
     * @param {string} url - URL del endpoint
     * @param {Object} options - Opciones de fetch
     * @returns {Promise<Response>} - Respuesta del servidor
     */
    async fetchWithAuth(url, options = {}) {
        const token = this.getToken();

        if (!token) {
            throw new Error('No hay token disponible');
        }

        const headers = {
            ...options.headers || {},
            'Authorization': `Bearer ${token}`
        };

        return fetch(url, { ...options, headers });
    }

    /**
     * Obtiene el rol del usuario actual
     * @returns {string|null} - Rol del usuario (admin, user, aiagent)
     */
    getUserRole() {
        const userData = this.getUserData();
        return userData ? userData.rol : null;
    }

    /**
     * Redirige basado en el rol del usuario
     */
    redirectByRole() {
        const role = this.getUserRole();
        
        if (!role) {
            window.location.href = './index.html';
            return;
        }

        switch (role.toLowerCase()) {
            case 'admin':
                window.location.href = './admin.html';
                break;
            case 'aiagent':
                window.location.href = './aiagent.html';
                break;
            case 'user':
                window.location.href = './user.html';
                break;
            default:
                window.location.href = './index.html';
        }
    }
}

// Crear instancia global
const authService = new AuthService();
