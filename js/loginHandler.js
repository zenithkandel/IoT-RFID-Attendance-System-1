document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing session to prevent glitches
    sessionStorage.clear();

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Check for saved username
    if (usernameInput) {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            usernameInput.value = savedUsername;
            if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // const usernameInput = document.getElementById('username'); // Already defined above
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
                // Call the login API
                const response = await fetch('API/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();

                if (result.success) {
                    // Remember username if checkbox is checked
                    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberedUsername', username);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                    }

                    // Store session data
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userRole', result.data.role);
                    
                    if (result.data.role === 'admin') {
                        sessionStorage.setItem('username', result.data.username);
                        setTimeout(() => window.location.href = 'admin-dashboard.html', 800);
                    } else if (result.data.role === 'student') {
                        sessionStorage.setItem('studentId', result.data.roll);
                        sessionStorage.setItem('studentName', result.data.name);
                        sessionStorage.setItem('studentClass', result.data.class);
                        setTimeout(() => window.location.href = 'student-dashboard.html', 600);
                    }
                } else {
                    throw new Error(result.message || 'Login failed');
                }

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
