const darkModeToggle = document.getElementById('darkModeToggle'); // Giả sử bạn có nút toggle với ID này
const body = document.body;
const container = document.querySelector('.container-processedReports');
const reportListHeader = document.querySelector('.reportList_header');
const itemRows = document.querySelectorAll('.itemRow');
const itemRowContentsTop = document.querySelectorAll('.itemRow_content_top');
const hrs = document.querySelectorAll('hr');
const forms = document.querySelectorAll('form');
const labels = document.querySelectorAll('label');
const selects = document.querySelectorAll('select');
const buttons = document.querySelectorAll('button');
const reportListBody = document.querySelector('.reportList_body');
const dropdown = document.querySelector('.dropdown');
const dropdownLinks = document.querySelectorAll('.dropdown a');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');
const tables = document.querySelectorAll('table');
const ths = document.querySelectorAll('th');
const tds = document.querySelectorAll('td');
const badges = document.querySelectorAll('.badge');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // container.classList.toggle('dark-mode');
    reportListHeader.classList.toggle('dark-mode');
    itemRows.forEach(row => row.classList.toggle('dark-mode'));
    itemRowContentsTop.forEach(top => top.classList.toggle('dark-mode'));
    hrs.forEach(hr => hr.classList.toggle('dark-mode'));
    forms.forEach(form => form.classList.toggle('dark-mode'));
    labels.forEach(label => label.classList.toggle('dark-mode'));
    selects.forEach(select => select.classList.toggle('dark-mode'));
    buttons.forEach(button => button.classList.toggle('dark-mode'));
    reportListBody.classList.toggle('dark-mode');
    dropdown.classList.toggle('dark-mode');
    dropdownLinks.forEach(link => link.classList.toggle('dark-mode'));
    dropdownMenus.forEach(menu => menu.classList.toggle('dark-mode'));
    tables.forEach(table => table.classList.toggle('dark-mode'));
    ths.forEach(th => th.classList.toggle('dark-mode'));
    tds.forEach(td => td.classList.toggle('dark-mode'));
    badges.forEach(badge => badge.classList.toggle('dark-mode'));

    // Lưu trạng thái vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // container.classList.add('dark-mode');
    reportListHeader.classList.add('dark-mode');
    itemRows.forEach(row => row.classList.add('dark-mode'));
    itemRowContentsTop.forEach(top => top.classList.add('dark-mode'));
    hrs.forEach(hr => hr.classList.add('dark-mode'));
    forms.forEach(form => form.classList.add('dark-mode'));
    labels.forEach(label => label.classList.add('dark-mode'));
    selects.forEach(select => select.classList.add('dark-mode'));
    buttons.forEach(button => button.classList.add('dark-mode'));
    reportListBody.classList.add('dark-mode');
    dropdown.classList.toggle('dark-mode');
    dropdownLinks.forEach(link => link.classList.add('dark-mode'));
    dropdownMenus.forEach(menu => menu.classList.add('dark-mode'));
    tables.forEach(table => table.classList.add('dark-mode'));
    ths.forEach(th => th.classList.add('dark-mode'));
    tds.forEach(td => td.classList.add('dark-mode'));
    badges.forEach(badge => badge.classList.add('dark-mode'));
}