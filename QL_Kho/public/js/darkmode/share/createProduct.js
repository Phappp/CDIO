const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const container = document.querySelector('.container');
const cPheading = document.querySelector('.createProduct-heading');
const alertElement = document.querySelector('.alert');
const formGroups = document.querySelectorAll('.form-group label');
const formControls = document.querySelectorAll('.form-control');
const primaryButton = document.querySelector('.btn-primary');
const secondaryButton = document.querySelector('.btn-secondary');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    cPheading.classList.toggle('dark-mode');
    if (alertElement) alertElement.classList.toggle('dark-mode');
    formGroups.forEach(label => label.classList.toggle('dark-mode'));
    formControls.forEach(control => control.classList.toggle('dark-mode'));
    if (primaryButton) primaryButton.classList.toggle('dark-mode');
    if (secondaryButton) secondaryButton.classList.toggle('dark-mode');

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    container.classList.add('dark-mode');
    cPheading.classList.add('dark-mode');
    if (alertElement) alertElement.classList.add('dark-mode');
    formGroups.forEach(label => label.classList.add('dark-mode'));
    formControls.forEach(control => control.classList.add('dark-mode'));
    if (primaryButton) primaryButton.classList.add('dark-mode');
    if (secondaryButton) secondaryButton.classList.add('dark-mode');
}