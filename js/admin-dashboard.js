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
    initSearch();
    initReports();
    
    // Mobile Sidebar Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
    
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

let globalStudents = [];
let globalLogs = [];
let globalStudentMap = {};

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
    // Store globally
    globalStudents = students;
    
    // 1. Total Students
    const totalStudents = students.length;
    animateValue(document.getElementById('totalStudents'), 0, totalStudents, 1000);

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
    
    globalStudentMap = studentMap;

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
    
    globalLogs = allLogs;

    // Update Stats
    const presentCount = presentSet.size;
    const absentCount = totalStudents - presentCount;
    const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    animateValue(document.getElementById('presentToday'), 0, presentCount, 1000);
    animateValue(document.getElementById('absentToday'), 0, absentCount, 1000);
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

    // Generate Charts
    updateCharts(allLogs, students);
}

function updateCharts(logs, students) {
    // 1. Attendance Trends (Last 7 Days)
    const last7Days = [];
    const trendData = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        last7Days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Count unique students present on this date
        const presentOnDate = new Set(
            logs.filter(log => log.date === dateStr).map(log => log.roll)
        );
        trendData.push(presentOnDate.size);
    }

    const ctxTrend = document.getElementById('attendanceTrendChart');
    if (ctxTrend) {
        // Destroy existing chart if any
        if (window.trendChartInstance) window.trendChartInstance.destroy();

        window.trendChartInstance = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Students Present',
                    data: trendData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4361ee',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#8898aa' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8898aa' }
                    }
                }
            }
        });
    }

    // 2. Class Distribution (Today)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.date === todayStr);
    
    const classCounts = {};
    todayLogs.forEach(log => {
        const cls = log.class || 'Unknown';
        classCounts[cls] = (classCounts[cls] || 0) + 1;
    });

    const classLabels = Object.keys(classCounts);
    const classData = Object.values(classCounts);
    
    // Generate random colors for classes
    const backgroundColors = [
        '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#2ec4b6'
    ];

    const ctxClass = document.getElementById('classDistributionChart');
    if (ctxClass) {
        if (window.classChartInstance) window.classChartInstance.destroy();

        window.classChartInstance = new Chart(ctxClass, {
            type: 'doughnut',
            data: {
                labels: classLabels,
                datasets: [{
                    data: classData,
                    backgroundColor: backgroundColors.slice(0, classLabels.length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#8898aa', usePointStyle: true }
                    }
                }
            }
        });
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function refreshData() {
    const btn = document.querySelector('.btn-sm i');
    btn.classList.add('fa-spin');
    fetchAdminData().then(() => {
        setTimeout(() => btn.classList.remove('fa-spin'), 500);
    });
}

function initSearch() {
    // Log Search
    const logSearch = document.getElementById('logSearch');
    if (logSearch) {
        logSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tableBody = document.getElementById('fullLogsTable');
            const rows = tableBody.getElementsByTagName('tr');

            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Student Search
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tableBody = document.getElementById('studentsTable');
            const rows = tableBody.getElementsByTagName('tr');

            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

function initReports() {
    // Daily Report (CSV)
    const btnDaily = document.getElementById('btnDownloadDaily');
    if (btnDaily) {
        btnDaily.addEventListener('click', () => {
            const todayStr = new Date().toISOString().split('T')[0];
            const dailyLogs = globalLogs.filter(log => log.date === todayStr);
            
            if (dailyLogs.length === 0) {
                alert('No attendance records found for today.');
                return;
            }

            const headers = ['Date', 'Time', 'Name', 'Roll No', 'Class', 'Status'];
            const data = dailyLogs.map(log => [
                log.date,
                log.time,
                log.name,
                log.roll,
                log.class,
                log.status
            ]);

            downloadCSV([headers, ...data], `attendance_daily_${todayStr}.csv`);
        });
    }

    // Monthly Report (Excel/CSV)
    const btnMonthly = document.getElementById('btnDownloadMonthly');
    if (btnMonthly) {
        btnMonthly.addEventListener('click', () => {
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // 1-12
            const currentYear = today.getFullYear();
            
            const monthlyLogs = globalLogs.filter(log => {
                const logDate = new Date(log.date);
                return (logDate.getMonth() + 1) === currentMonth && logDate.getFullYear() === currentYear;
            });

            if (monthlyLogs.length === 0) {
                alert('No attendance records found for this month.');
                return;
            }

            const headers = ['Date', 'Time', 'Name', 'Roll No', 'Class', 'Status'];
            const data = monthlyLogs.map(log => [
                log.date,
                log.time,
                log.name,
                log.roll,
                log.class,
                log.status
            ]);

            downloadCSV([headers, ...data], `attendance_monthly_${currentYear}_${currentMonth}.csv`);
        });
    }

    // Absentees List
    const btnAbsentees = document.getElementById('btnViewAbsentees');
    if (btnAbsentees) {
        btnAbsentees.addEventListener('click', () => {
            const todayStr = new Date().toISOString().split('T')[0];
            const presentRolls = new Set(globalLogs
                .filter(log => log.date === todayStr)
                .map(log => log.roll));
            
            const absentees = [];
            
            // Iterate over all students to find who is missing
            for (const roll in globalStudentMap) {
                if (!presentRolls.has(roll)) {
                    const s = globalStudentMap[roll];
                    absentees.push([
                        todayStr,
                        s.name,
                        roll,
                        s.class,
                        'Absent'
                    ]);
                }
            }

            if (absentees.length === 0) {
                alert('Everyone is present today!');
                return;
            }

            const headers = ['Date', 'Name', 'Roll No', 'Class', 'Status'];
            downloadCSV([headers, ...absentees], `absentees_${todayStr}.csv`);
        });
    }
}

function downloadCSV(data, filename) {
    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}