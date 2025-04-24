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
    const inventoryAlerts = document.getElementById('inventory-alerts');

    pendingReports.onclick = function () {
        window.location.href = '/manager/reports/pending';
    };

    totalProducts.onclick = function () {
        window.location.href = '/manager/products';
    };

    inventoryAlerts.onclick = function () {
        window.location.href = '/manager/inventory/alerts';
    };

}
callURL();
