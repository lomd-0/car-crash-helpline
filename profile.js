document.addEventListener('DOMContentLoaded', () => {
    const profileContent = document.getElementById('profileContent');
    const userData = JSON.parse(localStorage.getItem('loggedInUser') || 'null');

    if (!userData && profileContent) {
        profileContent.innerHTML = '<p>You are not logged in. Please <a href="login.html">sign in</a>.</p>';
        return;
    }

    if (profileContent) {
        profileContent.innerHTML = `
            <p><strong>Full Name:</strong> ${userData.fullName}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Phone:</strong> ${userData.phone}</p>
            <p><strong>Car Plate:</strong> ${userData.carPlate}</p>
        `;
    }
});
