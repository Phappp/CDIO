const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
// const editUserContainer = document.querySelector('.edit-user-container');
const eUheading = document.querySelector('.editUser-heading');
const errorAlert = document.querySelector('.error-alert');
const formLabels = document.querySelectorAll('.form-label');
const formInputs = document.querySelectorAll('.form-input');
const formSelects = document.querySelectorAll('.form-select');
const formTextareas = document.querySelectorAll('.form-textarea');
const checkboxLabel = document.querySelector('.checkbox-label');
const primaryButton = document.querySelector('.primary-button');
const secondaryButton = document.querySelector('.secondary-button');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // editUserContainer.classList.toggle('dark-mode');
    eUheading.classList.toggle('dark-mode');
    if (errorAlert) errorAlert.classList.toggle('dark-mode');
    formLabels.forEach(label => label.classList.toggle('dark-mode'));
    formInputs.forEach(input => input.classList.toggle('dark-mode'));
    formSelects.forEach(select => select.classList.toggle('dark-mode'));
    formTextareas.forEach(textarea => textarea.classList.toggle('dark-mode'));
    if (checkboxLabel) checkboxLabel.classList.toggle('dark-mode');
    if (primaryButton) primaryButton.classList.toggle('dark-mode');
    if (secondaryButton) secondaryButton.classList.toggle('dark-mode');

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // editUserContainer.classList.add('dark-mode');
    eUheading.classList.add('dark-mode');
    if (errorAlert) errorAlert.classList.add('dark-mode');
    formLabels.forEach(label => label.classList.add('dark-mode'));
    formInputs.forEach(input => input.classList.add('dark-mode'));
    formSelects.forEach(select => select.classList.add('dark-mode'));
    formTextareas.forEach(textarea => textarea.classList.add('dark-mode'));
    if (checkboxLabel) checkboxLabel.classList.add('dark-mode');
    if (primaryButton) primaryButton.classList.add('dark-mode');
    if (secondaryButton) secondaryButton.classList.add('dark-mode');
}