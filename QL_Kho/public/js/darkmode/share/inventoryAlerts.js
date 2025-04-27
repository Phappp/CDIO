const darkModeToggle = document.getElementById('darkModeToggle'); // Assuming you have a toggle button in your header
const body = document.body;
// const containerFluid = document.querySelector('.container-fluid');
const heading = document.querySelector('.h3.mb-0.text-gray-800');
const badgeDanger = document.querySelector('.badge-danger');
const card = document.querySelector('.card.shadow.mb-4');
const cardHeaderWarning = document.querySelector('.card-header.py-3.bg-warning');
const cardBody = document.querySelector('.card-body');
const alertSuccess = document.querySelector('.alert-success');
const table = document.querySelector('.table.table-bordered');
const theadLightTh = table ? table.querySelectorAll('.thead-light th') : [];
const tbodyTrWarning = table ? table.querySelectorAll('.table-warning') : [];
const tbodyTrDanger = table ? table.querySelectorAll('.table-danger') : [];
const boldElements = document.querySelectorAll('b');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // if (containerFluid) containerFluid.classList.toggle('dark-mode');
    if (heading) heading.classList.toggle('dark-mode');
    if (badgeDanger) badgeDanger.classList.toggle('dark-mode');
    if (card) card.classList.toggle('dark-mode');
    if (cardHeaderWarning) cardHeaderWarning.classList.toggle('dark-mode');
    if (cardBody) cardBody.classList.toggle('dark-mode');
    if (alertSuccess) alertSuccess.classList.toggle('dark-mode');
    if (table) table.classList.toggle('dark-mode');
    theadLightTh.forEach(th => th.classList.toggle('dark-mode'));
    tbodyTrWarning.forEach(tr => tr.classList.toggle('dark-mode'));
    tbodyTrDanger.forEach(tr => tr.classList.toggle('dark-mode'));
    boldElements.forEach(b => b.classList.toggle('dark-mode'));

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // if (containerFluid) containerFluid.classList.add('dark-mode');
    if (heading) heading.classList.add('dark-mode');
    if (badgeDanger) badgeDanger.classList.add('dark-mode');
    if (card) card.classList.add('dark-mode');
    if (cardHeaderWarning) cardHeaderWarning.classList.add('dark-mode');
    if (cardBody) cardBody.classList.add('dark-mode');
    if (alertSuccess) alertSuccess.classList.add('dark-mode');
    if (table) table.classList.add('dark-mode');
    theadLightTh.forEach(th => th.classList.add('dark-mode'));
    tbodyTrWarning.forEach(tr => tr.classList.add('dark-mode'));
    tbodyTrDanger.forEach(tr => tr.classList.add('dark-mode'));
    boldElements.forEach(b => b.classList.add('dark-mode'));
}
