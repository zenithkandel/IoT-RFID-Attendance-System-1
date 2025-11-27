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
                // ADMIN flow
                if (username === 'admin') {
                    if (password === 'admin@123') {
                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('userRole', 'admin');
                        setTimeout(() => window.location.href = 'admin-dashboard.html', 800);
                        return;
                    } else {
                        // Wrong password for admin
                        throw new Error('wrong password');
                    }
                }

                // STUDENT flow
                const sheetUrl = 'https://docs.google.com/spreadsheets/d/1S7L_hKo5LJW6bOPKvxLMkXVSiP4V1CH5rfX6xYqAhBE/gviz/tq?sheet=database&tqx=out:json';
                let response;
                try {
                    response = await fetch(sheetUrl);
                } catch (fetchErr) {
                    throw new Error('something went wrong');
                }

                if (!response || !response.ok) {
                    throw new Error('something went wrong');
                }

                let text;
                try {
                    text = await response.text();
                } catch (tErr) {
                    throw new Error('something went wrong');
                }

                // Parse Google Visualization API response
                let json;
                try {
                    const jsonString = text.substring(47).slice(0, -2);
                    json = JSON.parse(jsonString);
                } catch (parseErr) {
                    throw new Error('something went wrong');
                }

                const table = json.table;
                const rows = table.rows || [];
                const cols = table.cols || [];

                // Find roll column index
                let rollColIndex = -1;
                for (let i = 0; i < cols.length; i++) {
                    if (cols[i].label && cols[i].label.toLowerCase().includes('roll')) {
                        rollColIndex = i;
                        break;
                    }
                }

                // Search for student by roll number (username)
                let studentFound = false;
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (rollColIndex !== -1) {
                        const cell = row.c[rollColIndex];
                        if (cell && String(cell.v) === username) {
                            studentFound = true;
                            break;
                        }
                    } else {
                        // fallback: search any cell in the row
                        for (let j = 0; j < (row.c || []).length; j++) {
                            const cell = row.c[j];
                            if (cell && String(cell.v) === username) {
                                studentFound = true;
                                break;
                            }
                        }
                        if (studentFound) break;
                    }
                }

                if (!studentFound) {
                    throw new Error('user not found');
                }

                // If student exists, validate password (default 'password')
                if (password !== 'password') {
                    throw new Error('wrong password');
                }

                // Success: set session and redirect
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userRole', 'student');
                sessionStorage.setItem('studentId', username);
                setTimeout(() => window.location.href = 'student-dashboard.html', 600);

            } catch (error) {
                console.error('Login Error:', error);
                // Reset button
                btn.innerHTML = originalBtnContent;
                btn.style.opacity = '1';
                btn.disabled = false;

                // Map internal error messages to user-friendly messages
                const code = (error && error.message) ? error.message.toLowerCase() : 'something went wrong';
                let message = 'Something went wrong';
                if (code.includes('user not found')) message = 'User not found';
                else if (code.includes('wrong password')) message = 'Wrong password';
                else if (code.includes('something went wrong') || code.includes('failed') || code.includes('connect')) message = 'Something went wrong';

                errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                errorDiv.classList.add('visible');
            }
        });
    }
});
