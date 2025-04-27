const body = document.body;
const pRheading = document.querySelector('.pendingReports-heading');
const alertInfo = document.querySelector('.alert-info');
const table = document.querySelector('.pendingReports-table');
const theadTh = table ? table.querySelectorAll('thead th') : [];
const tbodyTd = table ? table.querySelectorAll('tbody td') : [];
const buttons = document.querySelectorAll('.btn');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    pRheading.classList.toggle('dark-mode');
    if (alertInfo) {
        alertInfo.classList.toggle('dark-mode');
    }
    if (table) {
        table.classList.toggle('dark-mode');
        theadTh.forEach(th => th.classList.toggle('dark-mode'));
        tbodyTd.forEach(td => td.classList.toggle('dark-mode'));

    }
    buttons.forEach(btn => btn.classList.toggle('dark-mode'));

    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    pRheading.classList.add('dark-mode');
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