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
    initFilters();
    initAutoRefresh();
    initManageUsers();
    
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

    // Restore saved tab or default to dashboard
    const savedTab = localStorage.getItem('adminActiveTab') || 'dashboard';
    activateTab(savedTab);

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target section
            const targetId = item.getAttribute('data-target');
            
            // Save to localStorage
            localStorage.setItem('adminActiveTab', targetId);
            
            // Activate the tab
            activateTab(targetId);
        });
    });

    function activateTab(targetId) {
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to target item
        const targetItem = document.querySelector(`.sidebar-menu li[data-target="${targetId}"]`);
        if (targetItem) {
            targetItem.classList.add('active');
            
            // Update Page Title
            const titleText = targetItem.querySelector('span').textContent;
            pageTitle.textContent = titleText;
        }
        
        // Show target section, hide others
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Populate manage users table when that section is opened
        if (targetId === 'manage-users') {
            populateManageUsersTable();
        }
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

let globalStudents = [];
let globalLogs = [];
let globalStudentMap = {};
let isAutoRefreshing = false;

// Placeholder for data fetching
async function fetchAdminData() {
    try {
        // Fetch Students from database
        const studentsResponse = await fetch('API/fetch-student.php');
        const studentsResult = await studentsResponse.json();
        
        // Fetch Attendance from database
        const attendanceResponse = await fetch('API/fetch-attendance.php');
        const attendanceResult = await attendanceResponse.json();

        if (studentsResult.success && attendanceResult.success) {
            const students = studentsResult.data || [];
            const logs = attendanceResult.data || [];
            
            // Process Data
            processAdminData(students, logs);
        } else {
            console.error('API Error:', studentsResult.message || attendanceResult.message);
            alert('Error loading data from database');
        }

    } catch (error) {
        console.error('Error fetching admin data:', error);
        alert('Error connecting to database');
    }
}

function processAdminData(students, logs) {
    // Store globally
    globalStudents = students;
    
    // 1. Total Students
    const totalStudents = students.length;
    
    // Skip animation if auto-refreshing
    if (isAutoRefreshing) {
        document.getElementById('totalStudents').innerHTML = totalStudents;
    } else {
        animateValue(document.getElementById('totalStudents'), 0, totalStudents, 1000);
    }

    // 2. Process Logs & Today's Stats
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local time
    
    const presentSet = new Set();
    const allLogs = [];

    // Helper for Title Case
    const toTitleCase = (str) => {
        if (typeof str !== 'string') return String(str);
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Map student Roll to Name/Class for easy lookup from API data
    const studentMap = {};
    students.forEach(student => {
        const roll = String(student.roll || '');
        if (roll) {
            studentMap[roll] = {
                name: toTitleCase(student.name || 'Unknown'),
                class: toTitleCase(student.class || 'N/A'),
                uid: student.uid || 'N/A',
                address: student.address || 'N/A'
            };
        }
    });
    
    globalStudentMap = studentMap;

    // Process Logs from API data (now includes checkIn/checkOut times)
    logs.forEach(log => {
        allLogs.push({
            date: log.date,
            checkIn: log.checkIn || '-',
            checkOut: log.checkOut || '-',
            name: log.name,
            roll: String(log.roll),
            class: log.class,
            status: log.status || 'Present'
        });

        // Check if today and has checked in
        if (log.date === todayStr && log.checkIn) {
            presentSet.add(String(log.roll));
        }
    });
    
    globalLogs = allLogs;

    // Update Stats
    const presentCount = presentSet.size;
    const absentCount = totalStudents - presentCount;
    const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    // Skip animation if auto-refreshing
    if (isAutoRefreshing) {
        document.getElementById('presentToday').innerHTML = presentCount;
        document.getElementById('absentToday').innerHTML = absentCount;
    } else {
        animateValue(document.getElementById('presentToday'), 0, presentCount, 1000);
        animateValue(document.getElementById('absentToday'), 0, absentCount, 1000);
    }

    // Populate Absent Students List
    const absentStudentsList = document.getElementById('absentStudentsList');
    absentStudentsList.innerHTML = '';
    
    const absentStudents = [];
    students.forEach(student => {
        const roll = String(student.roll || '');
        if (roll && studentMap[roll] && !presentSet.has(roll)) {
            absentStudents.push({
                roll: roll,
                ...studentMap[roll]
            });
        }
    });

    if (absentStudents.length === 0) {
        absentStudentsList.innerHTML = `
            <div class="no-absences">
                <i class="fas fa-check-circle"></i>
                <p><strong>Perfect Attendance!</strong><br>All students are present today.</p>
            </div>
        `;
    } else {
        absentStudents.forEach(student => {
            const div = document.createElement('div');
            div.className = 'absent-student-item';
            div.innerHTML = `
                <div class="absent-student-avatar">
                    <i class="fas fa-user-slash"></i>
                </div>
                <div class="absent-student-info">
                    <div class="absent-student-name">${student.name}</div>
                    <div class="absent-student-details">
                        <span><i class="fas fa-id-card"></i> ${student.roll}</span>
                        <span><i class="fas fa-layer-group"></i> ${student.class}</span>
                    </div>
                </div>
                <button class="btn-mark-present" data-uid="${student.uid}" data-roll="${student.roll}" data-name="${student.name}">
                    <i class="fas fa-check"></i> Mark Present
                </button>
            `;
            
            // Add click handler for mark present button
            const markBtn = div.querySelector('.btn-mark-present');
            markBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await markStudentPresent(student.uid, student.roll, student.name);
            });
            
            absentStudentsList.appendChild(div);
        });
    }

    // Populate Recent Activity (Top 5)
    const recentTableBody = document.getElementById('recentActivityTable');
    recentTableBody.innerHTML = '';
    
    // Sort logs by date (descending) and then by check-in time (descending)
    const sortedLogs = [...allLogs].sort((a, b) => {
        // Compare dates first
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        
        // If same date, compare by check-in time (most recent first)
        const timeA = a.checkIn !== '-' ? a.checkIn : '00:00:00';
        const timeB = b.checkIn !== '-' ? b.checkIn : '00:00:00';
        return timeB.localeCompare(timeA);
    });
    
    sortedLogs.slice(0, 5).forEach(log => {
        const tr = document.createElement('tr');
        const timeDisplay = log.checkOut && log.checkOut !== '-' 
            ? `${log.checkIn} - ${log.checkOut}` 
            : log.checkIn;
        tr.innerHTML = `
            <td>${timeDisplay}</td>
            <td>${log.name}</td>
            <td>${log.roll}</td>
            <td><span style="color: var(--success); font-weight: 600;">${log.status}</span></td>
        `;
        recentTableBody.appendChild(tr);
    });

    // Populate Full Logs Table
    populateLogsTable(allLogs);

    // Generate Charts
    updateCharts(allLogs, students);
}

async function markStudentPresent(uid, roll, name) {
    if (!confirm(`Mark ${name} (${roll}) as present for today?`)) {
        return;
    }
    
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    try {
        const response = await fetch('API/mark-attendance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: uid,
                date: todayStr,
                action: 'mark'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Refresh the dashboard data
            await fetchAdminData();
        } else {
            alert(result.message || 'Failed to mark attendance');
        }
    } catch (error) {
        console.error('Error marking attendance:', error);
        alert('Error marking attendance');
    }
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
        
        // Initialize with total students from API data
        students.forEach(student => {
            const cls = student.class || 'Unknown';
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
    
    // Mark as manual refresh
    isAutoRefreshing = false;
    
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

            const headers = ['Date', 'Check In', 'Check Out', 'Name', 'Roll No', 'Class', 'Status'];
            const data = dailyLogs.map(log => [
                log.date,
                log.checkIn || '-',
                log.checkOut || '-',
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

            const headers = ['Date', 'Check In', 'Check Out', 'Name', 'Roll No', 'Class', 'Status'];
            const data = monthlyLogs.map(log => [
                log.date,
                log.checkIn || '-',
                log.checkOut || '-',
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

// Filter System
let activeFilters = {
    dateFrom: null,
    dateTo: null,
    class: null
};

function initFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filterModal = document.getElementById('filterModal');
    const modalClose = document.querySelector('.modal-close');
    const btnClearFilters = document.getElementById('clearFilters');
    const btnApplyFilters = document.getElementById('applyFilters');
    
    // Open modal
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            populateClassDropdown();
            filterModal.classList.add('active');
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            filterModal.classList.remove('active');
        });
    }
    
    // Close on backdrop click
    if (filterModal) {
        filterModal.addEventListener('click', (e) => {
            if (e.target === filterModal) {
                filterModal.classList.remove('active');
            }
        });
    }
    
    // Clear all filters
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            activeFilters = { dateFrom: null, dateTo: null, class: null };
            document.getElementById('filterDateFrom').value = '';
            document.getElementById('filterDateTo').value = '';
            document.getElementById('filterClass').value = '';
            renderFilterChips();
            applyFilters();
            filterModal.classList.remove('active');
        });
    }
    
    // Apply filters
    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', () => {
            const dateFrom = document.getElementById('filterDateFrom').value;
            const dateTo = document.getElementById('filterDateTo').value;
            const classValue = document.getElementById('filterClass').value;
            
            // Validate date range
            if (dateFrom && dateTo && dateFrom > dateTo) {
                alert('Start date cannot be after end date.');
                return;
            }
            
            activeFilters.dateFrom = dateFrom || null;
            activeFilters.dateTo = dateTo || null;
            activeFilters.class = classValue || null;
            
            renderFilterChips();
            applyFilters();
            filterModal.classList.remove('active');
        });
    }
}

function populateClassDropdown() {
    const classDropdown = document.getElementById('filterClass');
    if (!classDropdown) return;
    
    // Get unique classes from students
    const classes = new Set();
    for (const roll in globalStudentMap) {
        const studentClass = globalStudentMap[roll].class;
        if (studentClass) {
            classes.add(studentClass);
        }
    }
    
    // Clear existing options except the first one
    classDropdown.innerHTML = '<option value="">All Classes</option>';
    
    // Add class options sorted
    Array.from(classes).sort().forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classDropdown.appendChild(option);
    });
    
    // Set current value if filter is active
    if (activeFilters.class) {
        classDropdown.value = activeFilters.class;
    }
}

function renderFilterChips() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    // Date range chip
    if (activeFilters.dateFrom || activeFilters.dateTo) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        
        let dateText = '<i class="fas fa-calendar"></i> ';
        if (activeFilters.dateFrom && activeFilters.dateTo) {
            dateText += `${activeFilters.dateFrom} to ${activeFilters.dateTo}`;
        } else if (activeFilters.dateFrom) {
            dateText += `From ${activeFilters.dateFrom}`;
        } else {
            dateText += `Until ${activeFilters.dateTo}`;
        }
        
        chip.innerHTML = `${dateText} <button class="filter-chip-remove" onclick="removeFilter('date')"><i class="fas fa-times"></i></button>`;
        activeFiltersContainer.appendChild(chip);
    }
    
    // Class chip
    if (activeFilters.class) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `<i class="fas fa-graduation-cap"></i> Class: ${activeFilters.class} <button class="filter-chip-remove" onclick="removeFilter('class')"><i class="fas fa-times"></i></button>`;
        activeFiltersContainer.appendChild(chip);
    }
}

function removeFilter(filterType) {
    if (filterType === 'date') {
        activeFilters.dateFrom = null;
        activeFilters.dateTo = null;
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
    } else if (filterType === 'class') {
        activeFilters.class = null;
        document.getElementById('filterClass').value = '';
    }
    
    renderFilterChips();
    applyFilters();
}

function applyFilters() {
    let filteredLogs = [...globalLogs];
    
    // Filter by date range
    if (activeFilters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => log.date >= activeFilters.dateFrom);
    }
    if (activeFilters.dateTo) {
        filteredLogs = filteredLogs.filter(log => log.date <= activeFilters.dateTo);
    }
    
    // Filter by class
    if (activeFilters.class) {
        filteredLogs = filteredLogs.filter(log => log.class === activeFilters.class);
    }
    
    // Update the logs table with filtered data
    populateLogsTable(filteredLogs);
}

function populateLogsTable(logs) {
    const tbody = document.getElementById('fullLogsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-light);">No records found</td></tr>';
        return;
    }
    
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.date}</td>
            <td>${log.checkIn || '-'}</td>
            <td>${log.checkOut || '-'}</td>
            <td>${log.name}</td>
            <td>${log.roll}</td>
            <td>${log.class}</td>
            <td><span style="color: var(--success); font-weight: 600;">${log.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Auto Refresh Functionality
let autoRefreshInterval = null;

function initAutoRefresh() {
    const toggle = document.getElementById('autoRefreshToggle');
    if (!toggle) return;
    
    // Load saved state
    const savedState = localStorage.getItem('autoRefresh');
    if (savedState === 'true') {
        toggle.checked = true;
        startAutoRefresh();
    }
    
    // Handle toggle change
    toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            startAutoRefresh();
            localStorage.setItem('autoRefresh', 'true');
        } else {
            stopAutoRefresh();
            localStorage.setItem('autoRefresh', 'false');
        }
    });
}

function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Set new interval (3 seconds)
    autoRefreshInterval = setInterval(() => {
        isAutoRefreshing = true;
        fetchAdminData();
    }, 3000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Edit Student Modal ------------------------------------------------------
function openEditStudentModal(student) {
    // student: { id, uid, name, roll, class, address }
    const modal = document.getElementById('editStudentModal');
    if (!modal) return;

    // Populate fields
    document.getElementById('editStudentId').value = student.id || '';
    document.getElementById('editUID').value = student.uid || '';
    document.getElementById('editName').value = student.name || '';
    document.getElementById('editRoll').value = student.roll || '';
    document.getElementById('editClass').value = student.class || '';
    document.getElementById('editAddress').value = student.address || '';
    document.getElementById('editPassword').value = '';

    // Show modal
    modal.classList.add('active');

    // Wire close button (×)
    const modalCloseBtn = modal.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.onclick = () => {
            modal.classList.remove('active');
        };
    }

    // Wire backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };

    // Wire cancel/save buttons (idempotent)
    const btnCancel = document.getElementById('cancelEditStudent');
    const btnSave = document.getElementById('saveEditStudent');

    if (btnCancel) {
        btnCancel.onclick = (e) => {
            e.preventDefault();
            modal.classList.remove('active');
        };
    }

    if (btnSave) {
        btnSave.onclick = async (e) => {
            e.preventDefault();
            await submitEditStudentForm();
        };
    }
}

async function submitEditStudentForm() {
    const modal = document.getElementById('editStudentModal');
    if (!modal) return;

    const id = document.getElementById('editStudentId').value;
    const uid = document.getElementById('editUID').value.trim();
    const name = document.getElementById('editName').value.trim();
    const roll = document.getElementById('editRoll').value.trim();
    const classVal = document.getElementById('editClass').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const password = document.getElementById('editPassword').value;

    if (!id) {
        alert('Missing student identifier');
        return;
    }

    // Basic validation
    if (!uid || !name || !roll) {
        alert('Please provide UID, Name and Roll number');
        return;
    }

    const payload = { id: id, uid: uid, name: name, roll: roll, class: classVal, address: address };
    if (password && password.length > 0) payload.password = password;

    try {
        const resp = await fetch('API/update-student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await resp.json();
        if (result.success) {
            // Close modal and refresh data
            modal.classList.remove('active');
            await fetchAdminData();
            populateManageUsersTable();
            alert('Student updated successfully');
        } else {
            alert(result.message || 'Failed to update student');
        }
    } catch (err) {
        console.error('Error updating student:', err);
        alert('Error updating student');
    }
}

// User Management Functions ------------------------------------------------------
function initManageUsers() {
    const btnAddStudent = document.getElementById('btnAddStudent');
    if (btnAddStudent) {
        btnAddStudent.addEventListener('click', openAddStudentModal);
    }
    
    // Initialize search functionality
    const searchInput = document.getElementById('manageUsersSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterManageUsers(e.target.value);
        });
    }
    
    populateManageUsersTable();
}

function filterManageUsers(searchTerm) {
    const grid = document.getElementById('manageUsersGrid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.student-card');
    const normalizedSearch = searchTerm.toLowerCase().trim();

    cards.forEach(card => {
        if (!normalizedSearch) {
            card.style.display = 'flex';
            return;
        }

        const name = card.querySelector('.student-name').textContent.toLowerCase();
        const uid = card.querySelector('.student-uid .student-detail-value').textContent.toLowerCase();
        const roll = card.querySelectorAll('.student-detail-value')[1].textContent.toLowerCase();
        const className = card.querySelectorAll('.student-detail-value')[2].textContent.toLowerCase();
        const address = card.querySelectorAll('.student-detail-value')[3].textContent.toLowerCase();

        const matches = name.includes(normalizedSearch) ||
                        uid.includes(normalizedSearch) ||
                        roll.includes(normalizedSearch) ||
                        className.includes(normalizedSearch) ||
                        address.includes(normalizedSearch);

        card.style.display = matches ? 'flex' : 'none';
    });
}

function openAddStudentModal() {
    const modal = document.getElementById('addStudentModal');
    if (!modal) return;

    // Clear form
    document.getElementById('addUID').value = '';
    document.getElementById('addName').value = '';
    document.getElementById('addRoll').value = '';
    document.getElementById('addClass').value = '';
    document.getElementById('addAddress').value = '';
    document.getElementById('addPassword').value = '';

    // Show modal
    modal.classList.add('active');

    // Wire close button
    const modalCloseBtn = modal.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.onclick = () => {
            modal.classList.remove('active');
        };
    }

    // Wire backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };

    // Wire cancel/save buttons
    const btnCancel = document.getElementById('cancelAddStudent');
    const btnSave = document.getElementById('saveAddStudent');

    if (btnCancel) {
        btnCancel.onclick = (e) => {
            e.preventDefault();
            modal.classList.remove('active');
        };
    }

    if (btnSave) {
        btnSave.onclick = async (e) => {
            e.preventDefault();
            await submitAddStudentForm();
        };
    }
}

async function submitAddStudentForm() {
    const modal = document.getElementById('addStudentModal');
    if (!modal) return;

    const uid = document.getElementById('addUID').value.trim();
    const name = document.getElementById('addName').value.trim();
    const roll = document.getElementById('addRoll').value.trim();
    const classVal = document.getElementById('addClass').value.trim();
    const address = document.getElementById('addAddress').value.trim();
    const password = document.getElementById('addPassword').value;

    // Validation
    if (!uid || !name || !roll || !classVal || !password) {
        alert('Please fill in all required fields (marked with *)');
        return;
    }

    const payload = {
        uid: uid,
        name: name,
        roll: parseInt(roll),
        class: classVal,
        address: address,
        password: password
    };

    try {
        const resp = await fetch('API/add-student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await resp.json();
        if (result.success) {
            modal.classList.remove('active');
            await fetchAdminData();
            populateManageUsersTable();
            alert('Student added successfully!');
        } else {
            alert(result.message || 'Failed to add student');
        }
    } catch (err) {
        console.error('Error adding student:', err);
        alert('Error adding student');
    }
}

function populateManageUsersTable() {
    const grid = document.getElementById('manageUsersGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (globalStudents.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-light); grid-column: 1 / -1;">No students found</div>';
        return;
    }

    globalStudents.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-details">
                    <div class="student-detail-item student-uid">
                        <span class="student-detail-label">
                            <i class="fas fa-fingerprint"></i> UID
                        </span>
                        <span class="student-detail-value">${student.uid}</span>
                    </div>
                    <div class="student-detail-item">
                        <span class="student-detail-label">
                            <i class="fas fa-id-card"></i> Roll
                        </span>
                        <span class="student-detail-value">${student.roll}</span>
                    </div>
                    <div class="student-detail-item">
                        <span class="student-detail-label">
                            <i class="fas fa-layer-group"></i> Class
                        </span>
                        <span class="student-detail-value">${student.class}</span>
                    </div>
                    <div class="student-detail-item">
                        <span class="student-detail-label">
                            <i class="fas fa-map-marker-alt"></i> Address
                        </span>
                        <span class="student-detail-value">${student.address || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn-view-student" data-roll="${student.roll}">
                    <i class="fas fa-cog"></i> Dashboard
                </button>
                <button class="btn-edit-student" data-id="${student.id}" data-uid="${student.uid}" data-roll="${student.roll}" data-name="${student.name}" data-class="${student.class}" data-address="${student.address}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete-student" data-id="${student.id}" data-name="${student.name}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        // Wire view button
        const viewBtn = card.querySelector('.btn-view-student');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const roll = viewBtn.getAttribute('data-roll');
            sessionStorage.setItem('viewingStudentId', roll);
            sessionStorage.setItem('viewingAsAdmin', 'true');
            window.location.href = 'student-dashboard.html';
        });
        
        // Wire edit button
        const editBtn = card.querySelector('.btn-edit-student');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = editBtn.getAttribute('data-id');
            const uid = editBtn.getAttribute('data-uid');
            const name = editBtn.getAttribute('data-name');
            const rollVal = editBtn.getAttribute('data-roll');
            const classVal = editBtn.getAttribute('data-class');
            const addressVal = editBtn.getAttribute('data-address');
            openEditStudentModal({ id, uid, name, roll: rollVal, class: classVal, address: addressVal });
        });
        
        // Wire delete button
        const deleteBtn = card.querySelector('.btn-delete-student');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = deleteBtn.getAttribute('data-id');
            const name = deleteBtn.getAttribute('data-name');
            deleteUser(id, name);
        });
        
        grid.appendChild(card);
    });
}

function editUserFromManage(id, uid, name, roll, classVal, address) {
    openEditStudentModal({
        id: id,
        uid: uid,
        name: name,
        roll: roll,
        class: classVal,
        address: address
    });
}

async function deleteUser(id, name) {
    if (!confirm(`Are you sure you want to delete ${name}?\n\nThis will also delete all their attendance records.\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        const resp = await fetch('API/delete-student.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id) })
        });

        const result = await resp.json();
        if (result.success) {
            await fetchAdminData();
            populateManageUsersTable();
            alert(result.message);
        } else {
            alert(result.message || 'Failed to delete student');
        }
    } catch (err) {
        console.error('Error deleting student:', err);
        alert('Error deleting student');
    }
}

// Change Password functionality
function resetPasswordForm() {
    document.getElementById('changePasswordForm').reset();
}

document.addEventListener('DOMContentLoaded', function() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            // Validate password length
            if (newPassword.length < 6) {
                alert('New password must be at least 6 characters long!');
                return;
            }
            
            // Validate new password is different from current
            if (currentPassword === newPassword) {
                alert('New password must be different from current password!');
                return;
            }
            
            try {
                const response = await fetch('API/change-password.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: 'admin', // Default admin username
                        currentPassword: currentPassword,
                        newPassword: newPassword
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Password changed successfully!');
                    resetPasswordForm();
                    // Optionally redirect to login
                    // sessionStorage.clear();
                    // window.location.href = 'login.html';
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error changing password:', error);
                alert('Failed to change password. Please try again.');
            }
        });
    }
});