const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const labels = document.querySelectorAll('label');
const textInputs = document.querySelectorAll('input[type="text"]');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const passwordToggleIcon = document.querySelector('.password-toggle');
const alertDanger = document.querySelector('.alert-danger');
const loginButton = document.querySelector('.btn-primary');
const circleEffect = document.querySelector('.circle-effect');
const circleEffectLink = circleEffect ? circleEffect.querySelector('a') : null;
const moonIcon = document.querySelector('.moon');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    labels.forEach(label => label.classList.toggle('dark-mode'));
    textInputs.forEach(input => input.classList.toggle('dark-mode'));
    passwordInputs.forEach(input => input.classList.toggle('dark-mode'));
    if (passwordToggleIcon) {
        passwordToggleIcon.classList.toggle('dark-mode');
    }
    if (alertDanger) {
        alertDanger.classList.toggle('dark-mode');
    }
    loginButton.classList.toggle('dark-mode');
    if (circleEffect) {
        circleEffect.classList.toggle('dark-mode');
    }
    if (circleEffectLink) {
        circleEffectLink.classList.toggle('dark-mode');
    }
    if (moonIcon) {
        moonIcon.classList.toggle('dark-mode');
    }

    // Lưu trạng thái vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    labels.forEach(label => label.classList.add('dark-mode'));
    textInputs.forEach(input => input.classList.add('dark-mode'));
    passwordInputs.forEach(input => input.classList.add('dark-mode'));
    if (passwordToggleIcon) {
        passwordToggleIcon.classList.add('dark-mode');
    }
    if (alertDanger) {
        alertDanger.classList.add('dark-mode');
    }
    loginButton.classList.add('dark-mode');
    if (circleEffect) {
        circleEffect.classList.add('dark-mode');
    }
    if (circleEffectLink) {
        circleEffectLink.classList.add('dark-mode');
    }
    if (moonIcon) {
        moonIcon.classList.add('dark-mode');
    }
}