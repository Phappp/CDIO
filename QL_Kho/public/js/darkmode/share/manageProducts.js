const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const productManagementContainer = document.querySelector('.product-management-container');
const mPheading = document.querySelector('.manageProduct-heading');
const addProductButton = document.querySelector('.add-product-button');
const productTable = document.querySelector('table');
const tableHeadTh = productTable ? productTable.querySelectorAll('thead th') : [];
const tableBodyTd = productTable ? productTable.querySelectorAll('tbody td') : [];
const editProductButtons = document.querySelectorAll('.edit-product-button');
const deleteProductButtons = document.querySelectorAll('.delete-product-button');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // productManagementContainer.classList.toggle('dark-mode');
    mPheading.classList.toggle('dark-mode');
    addProductButton.classList.toggle('dark-mode');
    productTable.classList.toggle('dark-mode');
    tableHeadTh.forEach(th => th.classList.toggle('dark-mode'));
    tableBodyTd.forEach(td => td.classList.toggle('dark-mode'));
    editProductButtons.forEach(btn => btn.classList.toggle('dark-mode'));
    deleteProductButtons.forEach(btn => btn.classList.toggle('dark-mode'));

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // productManagementContainer.classList.add('dark-mode');
    mPheading.classList.add('dark-mode');
    addProductButton.classList.add('dark-mode');
    productTable.classList.add('dark-mode');
    tableHeadTh.forEach(th => th.classList.add('dark-mode'));
    tableBodyTd.forEach(td => td.classList.add('dark-mode'));
    editProductButtons.forEach(btn => btn.classList.add('dark-mode'));
    deleteProductButtons.forEach(btn => btn.classList.add('dark-mode'));
}