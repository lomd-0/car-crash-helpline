document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const phoneInput = document.getElementById('phoneNumber');
    const carPlateInput = document.getElementById('carPlate');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const statusMessage = document.getElementById('formStatus');

    if (!form) return;

    const setError = (input, message) => {
        const errorBox = document.getElementById(`${input.id}Error`);
        if (errorBox) {
            errorBox.textContent = message;
        }
        input.classList.add('input-error');
    };

    const clearError = (input) => {
        const errorBox = document.getElementById(`${input.id}Error`);
        if (errorBox) {
            errorBox.textContent = '';
        }
        input.classList.remove('input-error');
    };

    const clearAllErrors = () => {
        [fullNameInput, emailInput, phoneInput, carPlateInput, passwordInput, confirmPasswordInput].forEach(clearError);
    };

    const validateName = (value) => {
        return value.trim().length >= 2;
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
    };

    const validatePhone = (value) => {
        const phoneRegex = /^(?:\+?60|0)1\d{8,9}$/;
        return phoneRegex.test(value.trim());
    };

    const validateCarPlate = (value) => {
        const carPlateRegex = /^[A-Za-z]{1,3}\s?\d{1,4}$/;
        return carPlateRegex.test(value.trim().toUpperCase());
    };

    const validatePassword = (value) => {
        return value.length >= 6;
    };

    const validateForm = () => {
        clearAllErrors();
        let isValid = true;

        if (!validateName(fullNameInput.value)) {
            setError(fullNameInput, 'Please enter your full name.');
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            setError(emailInput, 'Please enter a valid email address.');
            isValid = false;
        }

        if (!validatePhone(phoneInput.value)) {
            setError(phoneInput, 'Please use a Malaysia phone number such as 0123456789 or +60123456789.');
            isValid = false;
        }

        if (!validateCarPlate(carPlateInput.value)) {
            setError(carPlateInput, 'Please use a Malaysia car plate format such as ABC 1234.');
            isValid = false;
        }

        if (!validatePassword(passwordInput.value)) {
            setError(passwordInput, 'Password must be at least 6 characters.');
            isValid = false;
        }

        if (confirmPasswordInput.value !== passwordInput.value) {
            setError(confirmPasswordInput, 'Passwords do not match.');
            isValid = false;
        }

        return isValid;
    };

    [fullNameInput, emailInput, phoneInput, carPlateInput, passwordInput, confirmPasswordInput].forEach((input) => {
        input.addEventListener('input', () => {
            clearError(input);
            if (statusMessage) {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            if (statusMessage) {
                statusMessage.textContent = 'Please fix the highlighted fields before submitting.';
                statusMessage.className = 'status-message error';
            }
            return;
        }

        const payload = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            phone: phoneInput.value.trim(),
            carPlate: carPlateInput.value.trim().toUpperCase(),
            password: passwordInput.value
        };

        try {
            const apiBaseUrl = window.API_BASE_URL || 'https://your-render-app.onrender.com';
            const response = await fetch(`${apiBaseUrl}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                statusMessage.textContent = data.message || 'Registration successful.';
                statusMessage.className = 'status-message success';
                form.reset();
            } else {
                statusMessage.textContent = data.message || 'Registration failed.';
                statusMessage.className = 'status-message error';
            }
        } catch (error) {
            statusMessage.textContent = 'Unable to connect to the registration server. Start the Python server first.';
            statusMessage.className = 'status-message error';
        }
    });
});
