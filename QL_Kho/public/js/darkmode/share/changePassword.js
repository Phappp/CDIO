const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const formControls = document.querySelectorAll('.changePassword-form-control');
const changePasswordLabels = document.querySelectorAll('.form-group label');
const title = document.querySelector('.changePassword-heading');
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    formControls.forEach(form => form.classList.toggle('dark-mode'));
    changePasswordLabels.forEach(label => label.classList.toggle('dark-mode'));
    title.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
    body.classList.toggle('dark-mode');
    changePasswordLabels.forEach(label => label.classList.toggle('dark-mode'));
    formControls.forEach(form => form.classList.toggle('dark-mode'));
    title.classList.toggle('dark-mode');

}

