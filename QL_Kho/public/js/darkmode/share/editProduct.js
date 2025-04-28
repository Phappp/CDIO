const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
// const container = document.querySelector('.container');
const alertElements = document.querySelectorAll('.alert');
const inputElements = document.querySelectorAll('input.form-control, textarea.form-control');
const labelElements = document.querySelectorAll('label');
const btnElements = document.querySelectorAll('.btn');
const btnPrimaryElements = document.querySelectorAll('.btn-primary');
const btnSecondaryElements = document.querySelectorAll('.btn-secondary');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // container.classList.toggle('dark-mode');
    alertElements.forEach(el => el.classList.toggle('dark-mode'));
    inputElements.forEach(el => el.classList.toggle('dark-mode'));
    labelElements.forEach(el => el.classList.toggle('dark-mode'));
    btnElements.forEach(el => el.classList.toggle('dark-mode'));
    btnPrimaryElements.forEach(el => el.classList.toggle('dark-mode'));
    btnSecondaryElements.forEach(el => el.classList.toggle('dark-mode'));

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // container.classList.add('dark-mode');
    alertElements.forEach(el => el.classList.add('dark-mode'));
    inputElements.forEach(el => el.classList.add('dark-mode'));
    labelElements.forEach(el => el.classList.add('dark-mode'));
    btnElements.forEach(el => el.classList.add('dark-mode'));
    btnPrimaryElements.forEach(el => el.classList.add('dark-mode'));
    btnSecondaryElements.forEach(el => el.classList.add('dark-mode'));
}