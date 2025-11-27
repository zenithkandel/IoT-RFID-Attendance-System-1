// Student Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check session
    if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'student') {
        window.location.href = 'login.html';
    }

    const studentRoll = sessionStorage.getItem('studentId');
    const studentRollElement = document.getElementById('studentRoll');
    const currentDateElement = document.getElementById('currentDate');

    if (studentRollElement) {
        studentRollElement.textContent = studentRoll;
    }

    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
});

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}