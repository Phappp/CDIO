const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const productManagementContainer = document.querySelector('.product-management-container');
const mPheading = document.querySelector('.manageProduct-heading');
const addProductButton = document.querySelector('.add-product-button');
const productTables = document.querySelectorAll('table'); // Note: Changed to productTables (plural)

// Add event listener for the toggle button
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    mPheading.classList.toggle('dark-mode');
    addProductButton.classList.toggle('dark-mode');

    // Loop through each table to toggle dark mode
    productTables.forEach(table => {
        table.classList.toggle('dark-mode');

        const tableHeadTh = table.querySelectorAll('thead th');
        const tableBodyTd = table.querySelectorAll('tbody td');

        // Toggle classes for table headers and body cells
        tableHeadTh.forEach(th => th.classList.toggle('dark-mode'));
        tableBodyTd.forEach(td => td.classList.toggle('dark-mode'));
    });

    // Toggle classes for action buttons
    const editProductButtons = document.querySelectorAll('.edit-product-button');
    const deleteProductButtons = document.querySelectorAll('.delete-product-button');

    editProductButtons.forEach(btn => btn.classList.toggle('dark-mode'));
    deleteProductButtons.forEach(btn => btn.classList.toggle('dark-mode'));

    // Save dark mode state to localStorage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Check saved dark mode state on page load
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    mPheading.classList.add('dark-mode');
    addProductButton.classList.add('dark-mode');

    // Loop through each table to apply dark mode
    productTables.forEach(table => {
        table.classList.add('dark-mode');

        const tableHeadTh = table.querySelectorAll('thead th');
        const tableBodyTd = table.querySelectorAll('tbody td');

        tableHeadTh.forEach(th => th.classList.add('dark-mode'));
        tableBodyTd.forEach(td => td.classList.add('dark-mode'));
    });

    // Add dark mode to buttons
    const editProductButtons = document.querySelectorAll('.edit-product-button');
    const deleteProductButtons = document.querySelectorAll('.delete-product-button');

    editProductButtons.forEach(btn => btn.classList.add('dark-mode'));
    deleteProductButtons.forEach(btn => btn.classList.add('dark-mode'));
}