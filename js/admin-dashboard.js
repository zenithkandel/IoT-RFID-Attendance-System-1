// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check session
    if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'admin') {
        window.location.href = 'login.html';
    }

    // Initialize UI Components
    initNavigation();
    initTheme();
    updateDate();
    
    // Fetch Data
    fetchAdminData();

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
        const interactiveElements = document.querySelectorAll('a, button, .stat-box, .nav-links li, .sidebar-menu li');
        
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

function updateDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

function initNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('pageTitle');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get target section
            const targetId = item.getAttribute('data-target');
            
            // Update Page Title
            const titleText = item.querySelector('span').textContent;
            pageTitle.textContent = titleText;
            
            // Show target section, hide others
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
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

// Placeholder for data fetching
async function fetchAdminData() {
    const databaseUrl = 'https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=database&tqx=out:json';
    const attendanceUrl = 'https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=attendance&tqx=out:json';

    try {
        // Fetch Database (Students)
        const dbResponse = await fetch(databaseUrl);
        const dbText = await dbResponse.text();
        const dbJson = JSON.parse(dbText.substring(47).slice(0, -2));
        const students = dbJson.table.rows;
        
        // Fetch Attendance
        const attResponse = await fetch(attendanceUrl);
        const attText = await attResponse.text();
        const attJson = JSON.parse(attText.substring(47).slice(0, -2));
        const logs = attJson.table.rows;

        // Process Data
        processAdminData(students, logs);

    } catch (error) {
        console.error('Error fetching admin data:', error);
    }
}

function processAdminData(students, logs) {
    // 1. Total Students
    const totalStudents = students.length;
    document.getElementById('totalStudents').textContent = totalStudents;

    // 2. Process Logs & Today's Stats
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const presentSet = new Set();
    const recentLogs = [];
    const allLogs = [];

    // Helper for Title Case
    const toTitleCase = (str) => {
        if (typeof str !== 'string') return String(str);
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Map student Roll to Name/Class for easy lookup
    const studentMap = {};
    students.forEach(row => {
        const roll = row.c[2] ? String(row.c[2].v) : '';
        if (roll) {
            studentMap[roll] = {
                name: row.c[1] ? toTitleCase(row.c[1].v) : 'Unknown',
                class: row.c[3] ? toTitleCase(row.c[3].v) : 'N/A',
                uid: row.c[0] ? (row.c[0].v || 'N/A') : 'N/A',
                address: row.c[4] ? toTitleCase(row.c[4].v) : 'N/A'
            };
        }
    });

    // Populate Student Table
    const studentsTableBody = document.getElementById('studentsTable');
    studentsTableBody.innerHTML = '';
    students.forEach(row => {
        const roll = row.c[2] ? String(row.c[2].v) : '';
        if (roll && studentMap[roll]) {
            const s = studentMap[roll];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.uid}</td>
                <td>${s.name}</td>
                <td>${roll}</td>
                <td>${s.class}</td>
                <td>${s.address}</td>
            `;
            studentsTableBody.appendChild(tr);
        }
    });

    // Process Logs (Reverse order for latest first)
    // Logs columns: 0: Date, 1: Time, 4: Roll No
    for (let i = logs.length - 1; i >= 0; i--) {
        const row = logs[i];
        const date = row.c[0] ? row.c[0].f || row.c[0].v : '';
        const time = row.c[1] ? row.c[1].f || row.c[1].v : '';
        const roll = row.c[4] ? String(row.c[4].v) : '';
        
        if (roll && studentMap[roll]) {
            const student = studentMap[roll];
            
            // Add to All Logs
            allLogs.push({
                date: date,
                time: time,
                name: student.name,
                roll: roll,
                class: student.class,
                status: 'Present'
            });

            // Check if today
            if (date === todayStr) {
                presentSet.add(roll);
            }
        }
    }

    // Update Stats
    const presentCount = presentSet.size;
    const absentCount = totalStudents - presentCount;
    const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    document.getElementById('presentToday').textContent = presentCount;
    document.getElementById('absentToday').textContent = absentCount;
    document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
    document.getElementById('attendanceRateBar').style.width = `${attendanceRate}%`;

    // Populate Recent Activity (Top 5)
    const recentTableBody = document.getElementById('recentActivityTable');
    recentTableBody.innerHTML = '';
    allLogs.slice(0, 5).forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.time}</td>
            <td>${log.name}</td>
            <td>${log.roll}</td>
            <td><span style="color: var(--success); font-weight: 600;">Present</span></td>
        `;
        recentTableBody.appendChild(tr);
    });

    // Populate Full Logs Table
    const fullLogsTableBody = document.getElementById('fullLogsTable');
    fullLogsTableBody.innerHTML = '';
    allLogs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.date}</td>
            <td>${log.time}</td>
            <td>${log.name}</td>
            <td>${log.roll}</td>
            <td>${log.class}</td>
            <td><span style="color: var(--success); font-weight: 600;">Present</span></td>
        `;
        fullLogsTableBody.appendChild(tr);
    });
}

function refreshData() {
    const btn = document.querySelector('.btn-sm i');
    btn.classList.add('fa-spin');
    fetchAdminData().then(() => {
        setTimeout(() => btn.classList.remove('fa-spin'), 500);
    });
}