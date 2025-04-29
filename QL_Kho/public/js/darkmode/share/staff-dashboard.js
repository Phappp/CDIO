const darkModeToggle = document.getElementById('darkModeToggle'); // Đảm bảo bạn có nút toggle dark mode với ID này trong header
const body = document.body;
const staffDashboardHeader = document.querySelector('.staff-dashboardHeader');
const h1Element = document.querySelector('h1');
const h2Elements = document.querySelectorAll('.products-list h2');
const productsList = document.querySelector('.products-list');
const productTable = document.querySelector('.products-list table');
const tableHeaders = document.querySelectorAll('.products-list th');
const tableData = document.querySelectorAll('.products-list td');

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (staffDashboardHeader) staffDashboardHeader.classList.toggle('dark-mode');
        if (h1Element) h1Element.classList.toggle('dark-mode');
        if (h2Elements) h2Elements.forEach(h2 => h2.classList.toggle('dark-mode'));
        if (productsList) productsList.classList.toggle('dark-mode');
        if (productTable) productTable.classList.toggle('dark-mode');
        tableHeaders.forEach(header => header.classList.toggle('dark-mode'));
        tableData.forEach(data => data.classList.toggle('dark-mode'));

        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
}

// Kiểm tra trạng thái dark mode đã lưu khi tải trang
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    if (staffDashboardHeader) staffDashboardHeader.classList.add('dark-mode');
    if (h1Element) h1Element.classList.add('dark-mode');
    if (h2Elements) h2Elements.forEach(h2 => h2.classList.toggle('dark-mode'));
    if (productsList) productsList.classList.add('dark-mode');
    if (productTable) productTable.classList.add('dark-mode');
    tableHeaders.forEach(header => header.classList.add('dark-mode'));
    tableData.forEach(data => data.classList.add('dark-mode'));
}