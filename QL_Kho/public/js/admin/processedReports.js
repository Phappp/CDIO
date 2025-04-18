
// Hiệu ứng
document.addEventListener('DOMContentLoaded', function () {
    const itemRows = document.querySelectorAll('.itemRow');
    const urlParams = new URLSearchParams(window.location.search);
    const currentFilter = urlParams.get('status') || 'all';

    itemRows.forEach(row => {
        if (row.querySelector('a').href.includes(currentFilter)) {
            row.classList.add('active');
        } else {
            row.classList.remove('active');
        }

        row.addEventListener('click', function () {
            itemRows.forEach(item => item.classList.remove('active'));
            row.classList.add('active');
        });
    });
});
// Tự động gửi biểu mẫu
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // Lấy biểu mẫu

    // Thêm sự kiện change cho tất cả các trường select
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function () {
            form.submit(); // Gửi biểu mẫu khi có thay đổi
        });
    });
});

