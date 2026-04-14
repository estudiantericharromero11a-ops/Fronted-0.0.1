/**
 * SCRIPT DE AUTENTICACIÓN - LOGIN JWT
 * Valida usuario y contraseña contra el backend
 */

document.addEventListener('DOMContentLoaded', async function() {
    const loginForm = document.getElementById('loginForm');
    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    // Verificar si el usuario ya está autenticado
    if (authService.isAuthenticated()) {
        authService.redirectByRole();
    }

    /**
     * Realiza el login y redirige según el rol
     */
    async function performLogin() {
        const username = usuarioInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Por favor complete todos los campos');
            return;
        }

        try {
            // Mostrar indicador de carga
            loginBtn.disabled = true;
            loginBtn.textContent = 'Cargando...';

            // Realizar login
            const result = await authService.login(username, password);

            console.log('Login exitoso:', result);
            alert(`Bienvenido ${result.username}!`);

            // Redirigir según el rol
            authService.redirectByRole();

        } catch (error) {
            console.error('Error en login:', error);
            alert(`Error: ${error.message}`);
            
            // Re-habilitar botón
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar sesión';
            
            // Limpiar password por seguridad
            passwordInput.value = '';
        }
    }

    // Event listener para el botón de login
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogin();
        });
    }

    // Permitir login con Enter en el password input
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLogin();
            }
        });
    }
});



