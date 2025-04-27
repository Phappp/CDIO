const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}