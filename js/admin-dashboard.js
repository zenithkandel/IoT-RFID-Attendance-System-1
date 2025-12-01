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
    // Use local date to ensure we match the user's timezone, not UTC
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local time
    
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

    // Populate Student Cards
    const studentsGrid = document.getElementById('studentsGrid');
    studentsGrid.innerHTML = '';
    students.forEach(row => {
        const roll = row.c[2] ? String(row.c[2].v) : '';
        if (roll && studentMap[roll]) {
            const s = studentMap[roll];
            
            // Get initials for avatar
            const nameParts = s.name.split(' ');
            const initials = nameParts.length > 1 
                ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
                : nameParts[0][0];
            
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="student-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="student-info">
                    <div class="student-name">${s.name}</div>
                    <div class="student-details">
                        <div class="student-detail-item student-uid">
                            <span class="student-detail-label">
                                <i class="fas fa-fingerprint"></i> UID
                            </span>
                            <span class="student-detail-value">${s.uid}</span>
                        </div>
                        <div class="student-detail-item">
                            <span class="student-detail-label">
                                <i class="fas fa-id-card"></i> Roll
                            </span>
                            <span class="student-detail-value">${roll}</span>
                        </div>
                        <div class="student-detail-item">
                            <span class="student-detail-label">
                                <i class="fas fa-layer-group"></i> Class
                            </span>
                            <span class="student-detail-value">${s.class}</span>
                        </div>
                        <div class="student-detail-item">
                            <span class="student-detail-label">
                                <i class="fas fa-map-marker-alt"></i> Address
                            </span>
                            <span class="student-detail-value">${s.address}</span>
                        </div>
                    </div>
                </div>
            `;
            studentsGrid.appendChild(card);
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
        const dateStr = d.toLocaleDateString('en-CA');
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
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#8898aa', stepSize: 1 }
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
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayLogs = logs.filter(log => log.date === todayStr);
    
    const ctxClass = document.getElementById('classDistributionChart');
    // Get the wrapper div we added in HTML (the one with height: 300px)
    const chartContainer = ctxClass ? ctxClass.parentElement : null;
    
    // Remove existing empty message if any
    if (chartContainer) {
        const existingMsg = chartContainer.querySelector('.no-data-message');
        if (existingMsg) existingMsg.remove();
    }

    if (ctxClass && chartContainer) {
        if (window.classChartInstance) window.classChartInstance.destroy();

        if (todayLogs.length === 0) {
            // Show Empty State
            ctxClass.style.display = 'none';
            const msg = document.createElement('div');
            msg.className = 'no-data-message';
            msg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: var(--text-secondary); width: 100%;';
            msg.innerHTML = `
                <i class="fas fa-chart-pie" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No attendance data available for today.</p>
            `;
            chartContainer.appendChild(msg);
        } else {
            // Show Chart
            ctxClass.style.display = 'block';
            
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
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#8898aa', usePointStyle: true, padding: 20 }
                        }
                    }
                }
            });
        }
    }

    // 3. Class Summary Table
    const classSummaryTable = document.getElementById('classSummaryTable');
    if (classSummaryTable) {
        classSummaryTable.innerHTML = '';
        
        // Calculate stats per class
        const classStats = {};
        
        // Initialize with total students from global student list
        // We need to re-parse students because the raw 'students' array passed here 
        // has columns: 0:UID, 1:Name, 2:Roll, 3:Class, 4:Address
        students.forEach(row => {
            const cls = row.c[3] ? (typeof row.c[3].v === 'string' ? row.c[3].v : String(row.c[3].v)) : 'Unknown';
            // Normalize class name (Title Case)
            const className = cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase();
            
            if (!classStats[className]) classStats[className] = { total: 0, present: 0 };
            classStats[className].total++;
        });
        
        // Count present from today's logs
        const todayStrForTable = new Date().toLocaleDateString('en-CA');
        const todayLogsForTable = logs.filter(log => log.date === todayStrForTable);

        todayLogsForTable.forEach(log => {
            // log.class is already Title Cased in processAdminData
            const cls = log.class || 'Unknown';
            if (classStats[cls]) {
                classStats[cls].present++;
            } else {
                // Handle case where class exists in logs but not in student db (rare)
                if (!classStats[cls]) classStats[cls] = { total: 0, present: 0 };
                classStats[cls].present++;
            }
        });
        
        // Render
        Object.keys(classStats).sort().forEach(cls => {
            const stats = classStats[cls];
            const rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="font-weight: 500;">${cls}</span></td>
                <td>${stats.total}</td>
                <td>${stats.present}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${rate}%; height: 100%; background: ${rate >= 75 ? 'var(--success)' : (rate >= 50 ? 'var(--warning)' : 'var(--danger)')}; border-radius: 3px;"></div>
                        </div>
                        <span style="min-width: 35px; font-size: 0.9em;">${rate}%</span>
                    </div>
                </td>
            `;
            classSummaryTable.appendChild(tr);
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
            const todayStr = new Date().toLocaleDateString('en-CA');
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
            const todayStr = new Date().toLocaleDateString('en-CA');
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