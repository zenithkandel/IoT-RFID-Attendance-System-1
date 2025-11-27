document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const btn = loginForm.querySelector('.btn-login-submit');
            const originalBtnContent = btn.innerHTML;

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const errorDiv = document.getElementById('login-error');

            // Clear previous errors
            errorDiv.textContent = '';
            errorDiv.classList.remove('visible');

            // Loading state
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing In...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            try {
                // 1. Check for Admin Login
                if (username === 'admin' && password === 'admin@123') {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userRole', 'admin');
                    
                    // Simulate delay for UX
                    setTimeout(() => {
                        window.location.href = 'admin-dashboard.html';
                    }, 1000);
                    return;
                }

                // 2. Check for Student Login (Google Sheet)
                // Default password check
                if (password !== 'password') {
                    throw new Error('Invalid credentials');
                }

                const sheetUrl = 'https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=database&tqx=out:json';
                
                const response = await fetch(sheetUrl);
                if (!response.ok) {
                    throw new Error('Failed to connect to database');
                }

                const text = await response.text();
                // Parse Google Visualization API response
                // The response is wrapped in google.visualization.Query.setResponse(...);
                const jsonString = text.substring(47).slice(0, -2);
                const json = JSON.parse(jsonString);

                const table = json.table;
                const rows = table.rows;
                const cols = table.cols;

                // Find column index for 'Roll No'
                // Assuming the structure, but let's find it dynamically if possible or assume standard
                // The user said "compare the username with the roll number field"
                
                // Let's look for a column label that contains "Roll"
                let rollColIndex = -1;
                for (let i = 0; i < cols.length; i++) {
                    if (cols[i].label && cols[i].label.toLowerCase().includes('roll')) {
                        rollColIndex = i;
                        break;
                    }
                }

                // If not found by label, fallback to a likely index (e.g., 1 or 2) or search in data?
                // Let's assume it's one of the columns. If we can't find "Roll", we might fail.
                // However, usually these sheets have headers.
                
                let studentFound = false;
                let studentData = null;

                if (rollColIndex !== -1) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        // Cell value might be null if empty
                        const rollCell = row.c[rollColIndex];
                        if (rollCell && String(rollCell.v) === username) {
                            studentFound = true;
                            studentData = row; // Store row if needed later
                            break;
                        }
                    }
                } else {
                    // Fallback: Try to match against any column if header not found? 
                    // Or just assume column 2 (index 2) which is often ID/Roll
                    // Let's try to be safer: iterate all columns of first row to find match? No, that's risky.
                    // Let's assume the user provided sheet has "Roll No" or similar.
                    // If not found, we can't login.
                    console.warn("Roll No column not found in headers:", cols);
                    // Try searching all columns for the username value
                     for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        for(let j=0; j<row.c.length; j++) {
                             if (row.c[j] && String(row.c[j].v) === username) {
                                studentFound = true;
                                break;
                            }
                        }
                        if(studentFound) break;
                    }
                }

                if (studentFound) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userRole', 'student');
                    sessionStorage.setItem('studentId', username);
                    
                    window.location.href = 'student-dashboard.html';
                } else {
                    throw new Error('Student not found');
                }

            } catch (error) {
                console.error('Login Error:', error);
                
                // Reset button
                btn.innerHTML = originalBtnContent;
                btn.style.opacity = '1';
                btn.disabled = false;

                // Show error (you might want to add an error element to HTML)
                alert(error.message || 'Login failed. Please check your credentials.');
            }
        });
    }
});
