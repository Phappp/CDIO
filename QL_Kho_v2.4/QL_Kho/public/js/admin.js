document.addEventListener('DOMContentLoaded', function () {
    // Các script cho admin sẽ được thêm vào đây
    console.log('Admin scripts loaded');
});
// Xác nhận trước khi xóa
document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.btn-delete');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                e.preventDefault();
            }
        });
    });
});
// Xác nhận trước khi xóa sản phẩm
document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.btn-delete');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                e.preventDefault();
            }
        });
    });
});
// Có thể thêm hiệu ứng hoặc tự động làm mới dữ liệu
document.addEventListener('DOMContentLoaded', function () {
    // Tự động làm mới dữ liệu mỗi 5 phút
    setTimeout(() => {
        window.location.reload();
    }, 300000); // 5 phút = 300000ms

    // Thêm class warning cho sản phẩm sắp hết nếu có
    const lowStockCount = document.querySelector('.stat-card:nth-child(4) p').textContent;
    if (parseInt(lowStockCount) > 0) {
        document.querySelector('.stat-card:nth-child(4)').classList.add('warning');
    }
});
