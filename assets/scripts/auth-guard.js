/**
 * Auth Guard - Protege las rutas verificando que exista un token válido
 * Debe incluirse al inicio de admin.html, user.html y aiagent.html
 */

class AuthGuard {
    constructor() {
        this.init();
    }

    async init() {
        // Verificar si hay token
        if (!authService.isAuthenticated()) {
            console.warn('No hay sesión activa. Redirigiendo a login...');
            window.location.href = './index.html';
            return;
        }

        // Verificar que el token sea válido en el backend
        const isValid = await authService.verifyToken();
        
        if (!isValid) {
            console.warn('Token inválido o expirado. Redirigiendo a login...');
            window.location.href = './index.html';
        }

        // Token válido, proceder normalmente
        this.setupLogout();
    }

    /**
     * Configura el botón de logout si existe
     */
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn') || document.getElementById('headerLogoutBtn');
        
        if (logoutBtn) {
            logoutBtn.type = 'button';
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                await authService.logout();
                window.location.href = './index.html';
            });
        }

        // Mostrar información del usuario
        this.displayUserInfo();
    }

    /**
     * Muestra información del usuario en la página
     */
    displayUserInfo() {
        const userData = authService.getUserData();
        const userInfoEl = document.getElementById('userInfo');

        if (userData && userInfoEl) {
            userInfoEl.textContent = `Bienvenido, ${userData.username}`;
        }
    }
}

// Inicializar auth guard cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AuthGuard();
});
