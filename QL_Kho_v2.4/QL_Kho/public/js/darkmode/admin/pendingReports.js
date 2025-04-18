const darkModeToggle = document.getElementById('darkModeToggle'); // Assuming you have a toggle button in your header
const body = document.body;
const container = document.querySelector('.container');
const heading = document.querySelector('h1');
const alertInfo = document.querySelector('.alert-info');
const table = document.querySelector('.table');
const theadTh = table ? table.querySelectorAll('thead th') : [];
const tbodyTd = table ? table.querySelectorAll('tbody td') : [];
const buttons = document.querySelectorAll('.btn');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // container.classList.toggle('dark-mode');
    heading.classList.toggle('dark-mode');
    if (alertInfo) {
        alertInfo.classList.toggle('dark-mode');
    }
    if (table) {
        table.classList.toggle('dark-mode');
        theadTh.forEach(th => th.classList.toggle('dark-mode'));
        tbodyTd.forEach(td => td.classList.toggle('dark-mode'));
    }
    buttons.forEach(btn => btn.classList.toggle('dark-mode'));

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // container.classList.add('dark-mode');
    heading.classList.add('dark-mode');
    if (alertInfo) {
        alertInfo.classList.add('dark-mode');
    }
    if (table) {
        table.classList.add('dark-mode');
        theadTh.forEach(th => th.classList.add('dark-mode'));
        tbodyTd.forEach(td => td.classList.add('dark-mode'));
    }
    buttons.forEach(btn => btn.classList.add('dark-mode'));
}