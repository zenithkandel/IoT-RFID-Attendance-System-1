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

    // Initialize Calendar
    initCalendar(studentRoll);

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .student-profile, .attendance-card, .nav-links li');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });

        // Click effect
        window.addEventListener('mousedown', () => {
            document.body.classList.add('clicking');
        });

        window.addEventListener('mouseup', () => {
            document.body.classList.remove('clicking');
        });
    }
});

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}