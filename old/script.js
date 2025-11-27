//
// EduTrack Pro Web Portal - JavaScript
// Author: Sakshyam Bastakoti
// Description: Handles dynamic functionality and interactivity.
//

// Function to show footer information
    function showFooterInfo(type) {
        const modal = document.getElementById('footer-modal');
        const modalBody = document.getElementById('footer-modal-body');
        
        let content = '';
        
        switch(type) {
            case 'home':
                content = `
                    <h2>About EduTrack Pro</h2>
                    <p>EduTrack Pro is a comprehensive student attendance management system designed specifically for educational institutions. Our system simplifies the process of tracking student attendance, generating reports, and managing class schedules.</p>
                    
                    <h3>Key Benefits:</h3>
                    <ul>
                        <li>Streamlined attendance tracking with real-time updates</li>
                        <li>Automated report generation for administrators and teachers</li>
                        <li>Easy-to-use interface with minimal training required</li>
                        <li>Secure data storage with regular backups</li>
                        <li>Customizable to fit your institution's specific needs</li>
                    </ul>
                    
                    <h3>Our Mission</h3>
                    <p>To provide educational institutions with reliable, efficient, and user-friendly tools that enhance the learning experience and simplify administrative tasks.</p>
                `;
                break;
                
            case 'features':
                content = `
                    <h2>EduTrack Pro Features</h2>
                    
                    <h3>Attendance Management</h3>
                    <ul>
                        <li>Quick and easy student check-in/check-out system</li>
                        <li>Real-time attendance tracking with visual indicators</li>
                        <li>Support for multiple attendance statuses (Present, Absent, Late, Excused)</li>
                        <li>Bulk attendance entry for entire classes</li>
                    </ul>
                    
                    <h3>Reporting & Analytics</h3>
                    <ul>
                        <li>Comprehensive attendance reports by student, class, or date range</li>
                        <li>Export functionality to CSV, PDF, and Excel formats</li>
                        <li>Visual analytics with charts and graphs</li>
                        <li>Custom report builder for specific needs</li>
                    </ul>
                    
                    <h3>Administrative Tools</h3>
                    <ul>
                        <li>Student and staff management dashboard</li>
                        <li>Class and schedule organization</li>
                        <li>User role management with different permission levels</li>
                        <li>Automated notifications for absent students</li>
                    </ul>
                    
                    <h3>Security & Privacy</h3>
                    <ul>
                        <li>Secure login with role-based access control</li>
                        <li>Data encryption for all sensitive information</li>
                        <li>Regular automatic backups</li>
                        <li>Compliance with educational data privacy regulations</li>
                    </ul>
                `;
                break;
                
            case 'contact':
                content = `
                    <h2>Contact Information</h2>
                    
                    <h3>Developer Contact</h3>
                    <p><strong>Sakshyam Bastakoti</strong></p>
                    <p>Full Stack Developer & System Designer</p>
                    
                    <h3>Get in Touch</h3>
                    <ul>
                        <li><i class="fas fa-envelope"></i> Email: sakshyamxeetri@gmail.com</li>
                        <li><i class="fas fa-phone"></i> Phone: +977 9764320750</li>
                        <li><i class="fas fa-map-marker-alt"></i> Address: Putalisadak, Kathmandu, Nepal</li>
                    </ul>
                    
                    <h3>Professional Profiles</h3>
                    <ul>
                        <li><i class="fab fa-linkedin"></i> LinkedIn: <a href="https://www.linkedin.com/in/sakshyambastakoti/" target="_blank">sakshyambastakoti</a></li>
                        <li><i class="fas fa-globe"></i> Website: <a href="https://sakshyambastakoti.com.np/" target="_blank">sakshyambastakoti.com.np</a></li>
                    </ul>
                    
                    <h3>Social Media</h3>
                    <ul>
                        <li><i class="fab fa-facebook"></i> Facebook: <a href="https://www.facebook.com/sakshyam.xeetri" target="_blank">sakshyam.xeetri</a></li>
                        <li><i class="fab fa-instagram"></i> Instagram: <a href="https://www.instagram.com/sakxam_console.log/" target="_blank">sakxam_console.log</a></li>
                    </ul>
                `;
                break;
                
            case 'privacy':
                content = `
                    <h2>Privacy Policy</h2>
                    
                    <h3>Data Collection</h3>
                    <p>EduTrack Pro collects only necessary information for attendance tracking and educational purposes. This includes student names, ID numbers, class information, and attendance records.</p>
                    
                    <h3>Data Usage</h3>
                    <p>All collected data is used exclusively for educational administration purposes, including:</p>
                    <ul>
                        <li>Tracking and reporting student attendance</li>
                        <li>Generating academic reports</li>
                        <li>Communicating with parents/guardians about attendance matters</li>
                        <li>Analyzing attendance patterns for institutional improvement</li>
                    </ul>
                    
                    <h3>Data Protection</h3>
                    <p>We implement industry-standard security measures to protect your data:</p>
                    <ul>
                        <li>Encryption of sensitive information</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls based on user roles</li>
                        <li>Secure backup procedures</li>
                    </ul>
                    
                    <h3>Data Retention</h3>
                    <p>Attendance records are maintained for the duration required by educational regulations. Data is securely archived or anonymized when no longer needed for active educational purposes.</p>
                    
                    <h3>Your Rights</h3>
                    <p>Educational institutions using EduTrack Pro retain ownership of their data and can:</p>
                    <ul>
                        <li>Request access to all stored data</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of data when no longer needed</li>
                        <li>Export their data at any time</li>
                    </ul>
                    
                    <p><em>Last updated: January 2025</em></p>
                `;
                break;
        }
        
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        
        // Prevent default link behavior
        return false;
    }
    
    
    // Function to close the modal
    function closeFooterModal() {
        document.getElementById('footer-modal').style.display = 'none';
    }
    
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('footer-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
<<<<<<< HEAD:old/script.js
        const SPREADSHEET_ID = "1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE";// Replace with your actual Spreadsheet ID
=======


        const SPREADSHEET_ID = "1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE";
>>>>>>> origin/web-patch:script.js
        let allAttendanceData = [];
        let allStudents = [];
        let attendanceChart = null;
        
        document.addEventListener('DOMContentLoaded', () => {
            // Load Google Charts library
            google.charts.load('current', {'packages':['corechart']});

            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
            updateCurrentDate();
            document.getElementById('filterDate').value = formatDate(new Date());
        });

        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'Bhu Pu Sainik' && password === 'sainik 4050') {
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('dashboard').style.display = 'flex';
                // Set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(loadData);
                showToast('Login successful!', 'success');
            } else {
                const errorMessage = document.getElementById('errorMessage');
                errorMessage.style.display = 'block';
                setTimeout(() => { errorMessage.style.display = 'none'; }, 3000);
            }
        }

        function logout() {
            document.getElementById('login-page').style.display = 'flex';
            document.getElementById('dashboard').style.display = 'none';
        }

        function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        }

        async function loadData() {
            setLoadingState(true);
            const SHEET_NAME = "Attendance"; // As defined in the Apps Script
            // const queryUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;
            const queryUrl = `https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=attendance&tqx=out:json`;

            try {
                const response = await fetch(queryUrl);
                if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
                
                const responseText = await response.text();
                // Clean the response text to get a valid JSON string
                const jsonString = responseText.substring(47).slice(0, -2);
                const json = JSON.parse(jsonString);

                if (json.status === 'error') {
                     throw new Error(json.errors.map(e => e.detailed_message).join(', '));
                }

                if (!json.table || !json.table.rows || json.table.rows.length === 0) {
                    showToast('No attendance data found in the spreadsheet.', 'warning');
                    setLoadingState(false);
                    return;
                }

                processGoogleSheetData(json);
                updateAllUI();
                showToast('Data loaded successfully!', 'success');

            } catch (error) {
                console.error('Fetch Error:', error);
                showToast(`Error loading data: ${error.message}`, 'error');
            } finally {
                setLoadingState(false);
            }
        }

        function processGoogleSheetData(json) {
            const dataTable = json.table;
            const cols = dataTable.cols.map(col => col.label);
            const rows = dataTable.rows;

            const colIndices = {
                date: cols.indexOf('Date'),
                time: cols.indexOf('Time'),
                uid: cols.indexOf('UID'),
                name: cols.indexOf('Name'),
                rollNo: cols.indexOf('Roll No'),
                class: cols.indexOf('Class'),
                address: cols.indexOf('Address'),
            };

            const uniqueStudents = new Map();

            allAttendanceData = rows.map(row => {
                const rowData = row.c;
                const name = rowData[colIndices.name]?.v || 'Unknown';
                const rollNo = rowData[colIndices.rollNo]?.v || '';
                const studentClass = rowData[colIndices.class]?.v || '';
                const uid = rowData[colIndices.uid]?.v || `${name}-${studentClass}-${rollNo}`.toLowerCase();
                const address = rowData[colIndices.address]?.v || 'N/A';

                if (name !== 'Unknown' && !uniqueStudents.has(uid)) {
                    uniqueStudents.set(uid, {
                        id: uid, name: name, rollNo: rollNo,
                        class: studentClass, address: address
                    });
                }
                
                // Use formatted value 'f' if available, otherwise use raw value 'v'
                const dateStr = rowData[colIndices.date]?.f || formatDate(new Date(rowData[colIndices.date]?.v));
                const timeStr = rowData[colIndices.time]?.f || rowData[colIndices.time]?.v || '-';
                
                return {
                    studentId: uid, name: name, rollNo: rollNo, class: studentClass,
                    date: dateStr, inTime: timeStr,
                    status: timeStr !== '-' ? 'Present' : 'Absent',
                    address: address
                };
            }).filter(record => record.date && record.name);

            allStudents = Array.from(uniqueStudents.values()).sort((a, b) => a.rollNo - b.rollNo);
        }

        function updateAllUI() {
            updateDashboard();
            updateAttendanceRecords(allAttendanceData);
            updateStudentsSection();
            updateCurrentDate();
        }

        function updateDashboard() {
            const todayFormatted = formatDate(new Date());
            const todaysCheckIns = allAttendanceData.filter(r => r.date === todayFormatted);
            const presentStudentIds = new Set(todaysCheckIns.map(r => r.studentId));
            
            const totalStudents = allStudents.length;
            const presentCount = presentStudentIds.size;
            const absentCount = totalStudents - presentCount;
            const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
            
            document.getElementById('totalStudents').textContent = totalStudents;
            document.getElementById('presentCount').textContent = presentCount;
            document.getElementById('absentCount').textContent = absentCount;
            document.getElementById('attendancePercent').textContent = `${attendancePercent}%`;
            
            const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            document.getElementById('presentTimeDesc').textContent = `As of ${timeString}`;
            document.getElementById('absentTimeDesc').textContent = `As of ${timeString}`;
            
            const presentStudents = [];
            const absentStudents = [];

            allStudents.forEach(student => {
                if (presentStudentIds.has(student.id)) {
                    const checkIn = todaysCheckIns.find(r => r.studentId === student.id);
                    presentStudents.push({
                        name: student.name,
                        rollNo: student.rollNo,
                        class: student.class,
                        inTime: checkIn.inTime,
                        address: student.address || 'N/A'
                    });
                } else {
                    absentStudents.push({
                        name: student.name,
                        rollNo: student.rollNo,
                        class: student.class,
                        address: student.address || 'N/A'
                    });
                }
            });

            populateTable('presentStudentsTable', presentStudents, ['name', 'rollNo', 'class', 'inTime', 'address']);
            populateTable('absentStudentsTable', absentStudents, ['name', 'rollNo', 'class', 'address']);
        }

        function updateAttendanceRecords(data) {
            populateTable('recordsTable', data.slice().reverse(), ['date', 'inTime', 'studentId', 'name', 'rollNo', 'class', 'address'], true);
        }

        function updateStudentsSection(filteredStudents = allStudents) {
            const container = document.getElementById('studentCards');
            container.innerHTML = '';
            if (filteredStudents.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No students found.</p>';
                return;
            }
            const todayFormatted = formatDate(new Date());
            const presentStudentIds = new Set(allAttendanceData.filter(r => r.date === todayFormatted).map(r => r.studentId));
            let cardsHtml = '';
            filteredStudents.forEach(student => {
                const isPresent = presentStudentIds.has(student.id);
                const status = isPresent ? 'Present' : 'Absent';
                const statusColor = isPresent ? 'var(--success)' : 'var(--danger)';
                cardsHtml += `<div class="student-card">
                                <div class="student-avatar">${student.name.charAt(0)}</div>
                                <div class="student-info">
                                    <h3>${student.name}</h3>
                                    <p>Roll No: ${student.rollNo} | Class: ${student.class}</p>
                                    <p><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${student.address || 'Not Available'}</p>
                                    <p>Status Today: <strong style="color: ${statusColor};">${status}</strong></p>
                                </div>
                            </div>`;
            });
            container.innerHTML = cardsHtml;
        }

        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(s => {
                s.style.opacity = '0';
                s.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    s.classList.remove('active');
                    s.style.opacity = '';
                    s.style.transform = '';
                }, 200);
            });
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            
            setTimeout(() => {
                document.getElementById(sectionId).classList.add('active');
                document.getElementById(sectionId).style.opacity = '0';
                document.getElementById(sectionId).style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    document.getElementById(sectionId).style.opacity = '1';
                    document.getElementById(sectionId).style.transform = 'translateY(0)';
                }, 50);
            }, 200);
            
            event.currentTarget.classList.add('active');
            
            if (sectionId === 'reports-section') {
                setTimeout(() => {
                    renderAttendanceChart();
                }, 300);
            }
        }

        function filterByDate() {
            const dateValue = document.getElementById('filterDate').value;
            const filteredData = allAttendanceData.filter(r => r.date === dateValue);
            updateAttendanceRecords(filteredData);
            showToast(`Showing ${filteredData.length} records for ${formatDisplayDate(dateValue)}`, 'success');
        }

        function searchStudents() {
            const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
            const filtered = allStudents.filter(s => s.name.toLowerCase().includes(searchTerm) || String(s.rollNo).includes(searchTerm));
            updateStudentsSection(filtered);
        }

        function refreshData() {
            showToast('Refreshing data...', 'info');
            loadData();
        }
        
        function populateTable(tableId, data, columns, formatDateCol = false) {
            const tableBody = document.querySelector(`#${tableId} tbody`);
            tableBody.innerHTML = '';
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 20px;">No data available.</td></tr>`;
                return;
            }
            let rowsHtml = '';
            data.forEach(item => {
                rowsHtml += '<tr>';
                columns.forEach(col => {
                    let cellValue = item[col] || 'N/A';
                    if (col === 'status') {
                        const statusClass = item.status === 'Present' ? 'status-present' : 'status-absent';
                        cellValue = `<span class="status-badge ${statusClass}">${item.status}</span>`;
                    } else if (formatDateCol && col === 'date') {
                        cellValue = formatDisplayDate(cellValue);
                    }
                    rowsHtml += `<td>${cellValue}</td>`;
                });
                rowsHtml += '</tr>';
            });
            tableBody.innerHTML = rowsHtml;
        }

        function renderAttendanceChart() {
            if (!google || !google.visualization) {
                console.error("Google Charts library not loaded.");
                showToast("Could not load reporting library.", "error");
                return;
            }

            const dataArray = [['Date', 'Present Students']];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateString = formatDate(date);
                const displayDate = formatDisplayDate(dateString).split(',')[0]; // Just Month and Day
                
                const presentCount = new Set(allAttendanceData.filter(r => r.date === dateString).map(r => r.studentId)).size;
                dataArray.push([displayDate, presentCount]);
            }

            const data = google.visualization.arrayToDataTable(dataArray);

            const options = {
                title: 'Daily Attendance Trend (Last 7 Days)',
                titleTextStyle: { fontSize: 18, fontName: 'Poppins', color: '#333', bold: false },
                legend: { position: 'none' },
                hAxis: { 
                    textStyle: { color: '#555', fontName: 'Poppins', fontSize: 12 },
                    gridlines: { color: 'transparent' }
                },
                vAxis: { 
                    gridlines: { color: '#eef2f7', count: 5 },
                    minValue: 0,
                    textStyle: { color: '#555', fontName: 'Poppins', fontSize: 12 },
                    viewWindow: { min: 0 }
                },
                chartArea: { 
                    width: '90%', 
                    height: '75%',
                    backgroundColor: {
                        stroke: '#ddd',
                        strokeWidth: 1
                    }
                },
                animation: {
                    startup: true,
                    duration: 1200,
                    easing: 'out',
                },
                backgroundColor: 'transparent',
                colors: ['#4361ee'],
                areaOpacity: 0.1,
                pointSize: 7,
                pointShape: 'circle',
                tooltip: { 
                    textStyle: { fontName: 'Poppins', fontSize: 13 },
                    isHtml: true 
                },
                series: {
                    0: {
                        areaOpacity: 0.2,
                        lineWidth: 3,
                    }
                },
                crosshair: {
                    trigger: 'both',
                    orientation: 'vertical',
                    color: '#999',
                    opacity: 0.5
                }
            };
            
            const chartDiv = document.getElementById('attendanceChart');
            chartDiv.innerHTML = ''; 
            attendanceChart = new google.visualization.AreaChart(chartDiv);
            attendanceChart.draw(data, options);
        }

        function downloadCSV(data, filename = 'report.csv') {
            if (data.length === 0) {
                showToast('No data available to download.', 'warning');
                return;
            }
            const headers = ['date', 'name', 'rollNo', 'class', 'inTime', 'status'];
            const csvRows = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => JSON.stringify(row[header] || '')).join(',')
                )
            ];
            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Download started!', 'success');
        }

        function downloadFilteredAttendance() {
            const dateValue = document.getElementById('filterDate').value;
            const filteredData = allAttendanceData.filter(r => r.date === dateValue);
            downloadCSV(filteredData, `attendance_${dateValue}.csv`);
        }

        function downloadAllAttendance() {
            if (confirm('This will export all attendance records. Continue?')) {
                downloadCSV(allAttendanceData, 'full_attendance_report.csv');
            }
        }

        function updateCurrentDate() {
            document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        function parseDMYDate(dateString) {
            const parts = String(dateString).split('/');
            // Handles both D/M/YYYY and YYYY-MM-DD
            if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
            return new Date(dateString);
        }
        
        function formatDate(date) {
            if (!(date instanceof Date) || isNaN(date)) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function formatDisplayDate(dateString) {
            if (!dateString || !dateString.includes('-')) return 'N/A';
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function setLoadingState(isLoading) {
            document.querySelectorAll('.loading').forEach(el => { el.style.display = isLoading ? 'flex' : 'none'; });
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toast-message');
            toastMessage.textContent = message;
            toast.className = 'toast show ' + type;
            setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
        }
        
        // Add session timeout functionality
        let inactivityTime = function() {
            let time;
            window.onload = resetTimer;
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;
            
            function logoutAfterTimeout() {
                if (document.getElementById('dashboard').style.display !== 'none') {
                    showToast('Session expired due to inactivity. Logging out.', 'error');
                    setTimeout(() => logout(), 2000);
                }
            }
            
            function resetTimer() {
                clearTimeout(time);
                time = setTimeout(logoutAfterTimeout, 1800000); // 30 minutes
            }
        };
        inactivityTime();