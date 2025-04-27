const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const container = document.querySelector('.user-management-container');
const mUheading = document.querySelector('.manageUser-heading');
const addUserButton = document.querySelector('.btnAdd');
const userTable = document.querySelector('.user-table');
const tableHeadTh = userTable ? userTable.querySelectorAll('thead th') : [];
const tableBodyTd = userTable ? userTable.querySelectorAll('tbody td') : [];
const editUserButtons = document.querySelectorAll('.edit-user-button');
const deleteUserButtons = document.querySelectorAll('.delete-user-button');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // container.classList.toggle('dark-mode');
    // mUheading.classList.toggle('dark-mode');
    // addUserButton.classList.toggle('dark-mode'); 
    // if (userTable) {
        // userTable.classList.toggle('dark-mode');
        // tableHeadTh.forEach(th => th.classList.toggle('dark-mode'));
        // tableBodyTd.forEach(td => td.classList.toggle('dark-mode'));
        // const tableRowsEven = userTable.querySelectorAll('tbody tr:nth-child(even)');
        // tableRowsEven.forEach(row => row.classList.toggle('dark-mode'));
    // }
    // editUserButtons.forEach(btn => btn.classList.toggle('dark-mode'));
    // deleteUserButtons.forEach(btn => btn.classList.toggle('dark-mode'));

    // Lưu trạng thái dark mode vào localStorage (tùy chọn)
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Kiểm tra trạng thái dark mode đã lưu khi tải trang (tùy chọn)
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    // container.classList.add('dark-mode');
    // mUheading.classList.add('dark-mode');
    // addUserButton.classList.add('dark-mode'); 
    // if (userTable) {
        // userTable.classList.add('dark-mode');
        // tableHeadTh.forEach(th => th.classList.add('dark-mode'));
        // tableBodyTd.forEach(td => td.classList.add('dark-mode'));
        // const tableRowsEven = userTable.querySelectorAll('tbody tr:nth-child(even)');
        // tableRowsEven.forEach(row => row.classList.add('dark-mode'));
    // }
    // editUserButtons.forEach(btn => btn.classList.add('dark-mode'));
    // deleteUserButtons.forEach(btn => btn.classList.add('dark-mode'));
}