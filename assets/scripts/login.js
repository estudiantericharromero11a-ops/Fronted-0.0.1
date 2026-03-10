// SCRIPT DE AUTENTICACIÓN - LOGIN

// Esperar a que el DOM cargue para asignar eventos

document.addEventListener('DOMContentLoaded', function() {
    // botones
    const adminBtn = document.getElementById('adminBtn');
    const userBtn = document.getElementById('userBtn');

    if (adminBtn) {
        adminBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin.html';
        });
    }

    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'user.html';
        });
    }
});





