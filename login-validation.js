document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const statusMessage = document.getElementById('loginStatus');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value
        };

        try {
            const apiBaseUrl = window.API_BASE_URL || 'https://your-render-app.onrender.com';
            const response = await fetch(`${apiBaseUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.user) {
                localStorage.setItem('loggedInUser', JSON.stringify(data.user));
                window.location.href = 'profile.html';
            } else {
                if (statusMessage) {
                    statusMessage.textContent = data.message || 'Login failed.';
                    statusMessage.className = 'status-message error';
                }
            }
        } catch (error) {
            if (statusMessage) {
                statusMessage.textContent = 'Unable to connect to the server.';
                statusMessage.className = 'status-message error';
            }
        }
    });
});
