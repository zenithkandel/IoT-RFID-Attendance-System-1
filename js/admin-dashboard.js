// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check session
    if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'admin') {
        window.location.href = 'login.html';
    }
});

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}