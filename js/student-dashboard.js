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
    
    // Fetch Student Details
    fetchStudentDetails(studentRoll);

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
}

async function fetchAttendanceData(studentRoll) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=attendance&tqx=out:json';
    
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);
        
        const rows = json.table.rows;
        
        // Column indices based on fetch.txt analysis
        // 0: Date, 4: Roll No
        
        rows.forEach(row => {
            const rollCell = row.c[4];
            const dateCell = row.c[0];
            
            if (rollCell && String(rollCell.v) === String(studentRoll)) {
                if (dateCell && dateCell.f) {
                    // dateCell.f is "2025-10-08"
                    attendanceData.add(dateCell.f);
                }
            }
        });
        
        // Update "You are marked PRESENT today" status
        const todayStr = new Date().toISOString().split('T')[0];
        const statusHeader = document.querySelector('.attendance-card h3');
        const statusCard = document.querySelector('.attendance-card');
        
        if (attendanceData.has(todayStr)) {
            statusHeader.innerHTML = '<i class="fas fa-check-circle"></i> You are marked PRESENT today';
            statusCard.style.borderColor = 'var(--success)';
            statusCard.style.color = 'var(--success)';
            statusCard.style.background = 'rgba(52, 211, 153, 0.1)';
        } else {
            statusHeader.innerHTML = '<i class="fas fa-times-circle"></i> You are NOT marked present yet';
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
        
        calendarGrid.appendChild(dateDiv);
    }
}