function warning() {
    const firstStats = document.querySelectorAll('.stats1 .stat-card');
    firstStats.forEach((stat) => {
        if (stat.querySelector('p').textContent.trim() === "0") {
            stat.style.borderLeft = '12px solid green';
        } else {
            stat.style.borderLeft = '12px solid red';
        }
    });
}
warning();

function callURL() {
    const totalProducts = document.getElementById('total-products');
    const pendingReports = document.getElementById('pending-reports');
    const totalUsers = document.getElementById('total-users');
    const inventoryAlerts = document.getElementById('inventory-alerts');

    pendingReports.onclick = function () {
        window.location.href = '/admin/reports/pending';
    };

    totalProducts.onclick = function () {
        window.location.href = '/admin/products';
    };

    totalUsers.onclick = function () {
        window.location.href = '/admin/users';
    };
    inventoryAlerts.onclick = function () {
        window.location.href = '/admin/inventory/alerts';
    };

}
callURL();
