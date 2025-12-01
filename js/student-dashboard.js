// Student Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is viewing student profile
    const isAdminViewing = sessionStorage.getItem('viewingAsAdmin') === 'true';
    const viewingStudentId = sessionStorage.getItem('viewingStudentId');
    
    // Check session - allow admin or student access
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const userRole = sessionStorage.getItem('userRole');
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    if (!isAdminViewing && userRole !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Determine which student to display
    const studentRoll = isAdminViewing ? viewingStudentId : sessionStorage.getItem('studentId');
    const studentRollElement = document.getElementById('studentRoll');
    const currentDateElement = document.getElementById('currentDate');

    if (studentRollElement) {
        studentRollElement.textContent = studentRoll;
    }

    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Update navbar for admin viewing
    if (isAdminViewing) {
        updateNavbarForAdmin();
    }

    // Initialize Calendar
    initCalendar(studentRoll);
    
    // Initialize Theme
    initTheme();
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Fetch Student Details
    fetchStudentDetails(studentRoll);

});

function updateNavbarForAdmin() {
    const navbar = document.querySelector('.navbar .container');
    const logoBadge = document.querySelector('.logo .badge');
    
    if (logoBadge) {
        logoBadge.textContent = 'Admin View';
        logoBadge.style.background = '#5B7BE9';
        logoBadge.style.webkitBackgroundClip = 'unset';
        logoBadge.style.backgroundClip = 'unset';
        logoBadge.style.webkitTextFillColor = '#ffffff';
        logoBadge.style.color = '#ffffff';
        logoBadge.style.border = '1px solid rgba(91, 123, 233, 0.3)';
        logoBadge.style.fontWeight = '600';
    }
    
    // Add back button
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('backToAdmin')) {
        const backButton = document.createElement('li');
        backButton.innerHTML = `<a href="#" id="backToAdmin"><i class="fas fa-arrow-left"></i> Back to Admin</a>`;
        navLinks.insertBefore(backButton, navLinks.firstChild);
        
        document.getElementById('backToAdmin').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('viewingStudentId');
            sessionStorage.removeItem('viewingAsAdmin');
            window.location.href = 'admin-dashboard.html';
        });
    }
}

function logout() {
    const isAdminViewing = sessionStorage.getItem('viewingAsAdmin') === 'true';
    
    if (isAdminViewing) {
        // If admin is viewing, go back to admin dashboard
        sessionStorage.removeItem('viewingStudentId');
        sessionStorage.removeItem('viewingAsAdmin');
        window.location.href = 'admin-dashboard.html';
    } else {
        // Regular student logout
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        htmlElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            // Switch to Dark
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            // Switch to Light
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
}

// Calendar Logic
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let attendanceData = new Set(); // Stores dates like "2025-10-08"

async function initCalendar(studentRoll) {
    await fetchAttendanceData(studentRoll);
    renderCalendar(currentMonth, currentYear);

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Check Specific Date Logic
    const checkDateBtn = document.getElementById('checkDateBtn');
    const checkDateInput = document.getElementById('checkDateInput');
    const dateResult = document.getElementById('dateResult');

    if (checkDateBtn && checkDateInput) {
        checkDateBtn.addEventListener('click', () => {
            const selectedDate = checkDateInput.value;
            
            if (!selectedDate) {
                dateResult.innerHTML = '<p class="placeholder-text">Please select a date first</p>';
                dateResult.className = 'date-result';
                return;
            }

            const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            if (attendanceData.has(selectedDate)) {
                dateResult.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Present</strong> on ${formattedDate}`;
                dateResult.className = 'date-result present';
            } else {
                // Check if date is in future
                const checkDate = new Date(selectedDate);
                const today = new Date();
                today.setHours(0,0,0,0);
                
                if (checkDate > today) {
                    dateResult.innerHTML = `<i class="fas fa-clock"></i> No record yet (Future Date)`;
                    dateResult.className = 'date-result';
                } else {
                    dateResult.innerHTML = `<i class="fas fa-times-circle"></i> <strong>Absent</strong> on ${formattedDate}`;
                    dateResult.className = 'date-result absent';
                }
            }
        });
    }
}

async function fetchAttendanceData(studentRoll) {
    try {
        const response = await fetch(`API/fetch-student.php?roll=${studentRoll}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const attendance = result.data.attendance || [];
            
            // Add all attendance dates to the Set
            attendance.forEach(record => {
                if (record.date) {
                    attendanceData.add(record.date);
                }
            });
        }
        
        // Update "You are marked PRESENT today" status
        const todayStr = new Date().toISOString().split('T')[0];
        const statusHeader = document.querySelector('.attendance-card h3');
        const statusText = document.getElementById('todayStatusText');
        const statusCard = document.querySelector('.attendance-card');
        
        if (attendanceData.has(todayStr)) {
            statusHeader.innerHTML = '<i class="fas fa-check-circle"></i> Today\'s Status';
            statusText.textContent = 'Marked PRESENT';
            statusCard.style.borderColor = 'var(--success)';
            statusCard.style.color = 'var(--success)';
            statusCard.style.background = 'rgba(52, 211, 153, 0.1)';
            triggerConfetti();
        } else {
            statusHeader.innerHTML = '<i class="fas fa-times-circle"></i> Today\'s Status';
            statusText.textContent = 'Not Marked Yet';
            statusCard.style.borderColor = 'var(--danger)';
            statusCard.style.color = 'var(--danger)';
            statusCard.style.background = 'rgba(239, 68, 68, 0.1)';
        }

    } catch (error) {
        console.error('Error fetching attendance:', error);
    }
}

function renderCalendar(month, year) {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearHeader = document.getElementById('calendarMonthYear');
    
    // Clear existing days (keep headers)
    const headers = calendarGrid.querySelectorAll('.calendar-day-header');
    calendarGrid.innerHTML = '';
    headers.forEach(header => calendarGrid.appendChild(header));
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    monthYearHeader.textContent = `${monthNames[month]} ${year}`;
    
    // Empty slots for days before the 1st
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'calendar-day';
        dateDiv.textContent = day;
        
        // Format date string to match Google Sheet format (YYYY-MM-DD)
        // Note: Month is 0-indexed in JS, so +1. Pad with 0.
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const checkDate = new Date(year, month, day);
        
        // Check if today
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dateDiv.classList.add('today');
        }
        
        // Check status
        if (attendanceData.has(dateString)) {
            dateDiv.classList.add('present');
            dateDiv.title = "Present";
        } else {
            // Mark absent only if date is in the past (and not a weekend, optionally)
            // For simplicity, just check if it's in the past
            if (checkDate < today && checkDate.setHours(0,0,0,0) !== today.setHours(0,0,0,0)) {
                dateDiv.classList.add('absent');
                dateDiv.title = "Absent";
            }
        }
        
        dateDiv.style.animationDelay = `${day * 0.03}s`; // Staggered animation
        calendarGrid.appendChild(dateDiv);
    }
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = Math.random() * 3 + 2 + 's';
        const animDelay = Math.random() * 2 + 's';
        
        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.animationDuration = animDuration;
        confetti.style.animationDelay = animDelay;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

async function fetchStudentDetails(studentRoll) {
    try {
        const response = await fetch(`API/fetch-student.php?roll=${studentRoll}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const student = result.data;
            
            // Helper to fix capitalization (Title Case)
            const toTitleCase = (str) => {
                if (typeof str !== 'string') return String(str);
                return str.toLowerCase().split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
            };

            const name = toTitleCase(student.name || 'Student');
            const className = toTitleCase(student.class || 'N/A');
            const address = student.address || 'N/A';
            const uid = student.uid || 'N/A';
            
            // Update DOM
            document.getElementById('studentName').textContent = `Welcome, ${name}`;
            document.getElementById('studentClass').textContent = className;
            document.getElementById('studentUID').textContent = uid;
            document.getElementById('studentAddress').textContent = address;
        } else {
            console.warn('Student details not found for roll:', studentRoll);
            document.getElementById('studentName').textContent = 'Welcome, Student';
        }

    } catch (error) {
        console.error('Error fetching student details:', error);
        document.getElementById('studentName').textContent = 'Welcome, Student';
    }
}