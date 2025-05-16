const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const reportController = require('../controllers/staff/reportController');
const dashboardController = require('../controllers/staff/dashboardController');
const passwordController = require('../controllers/staff/passwordController');
const inventoryAlertController = require('../controllers/staff/inventoryAlertController');
const personalController = require('../controllers/staff/personalController');

// Middleware kiểm tra quyền staff
router.use(authMiddleware.isStaff);

// Personal information
router.get('/personal', personalController.getPersonal);

// Thêm các route sau vào staffRoutes.js
router.get('/change-password', passwordController.showChangePasswordForm);
router.post('/change-password', passwordController.changePassword);

// Báo cáo nhập/xuất
router.get('/dashboard', dashboardController.getDashboardStats);

router.get('/reports', reportController.listReports);
// Route riêng cho nhập hàng
router.get('/reports/import', reportController.showCreateImport);
router.post('/reports/import', reportController.createImport);

// Route riêng cho xuất hàng
router.get('/reports/export', reportController.showCreateExport);
router.post('/reports/export', reportController.createExport);


// Danh sách tồn kho cảnh báo
router.get('/inventory/alerts', inventoryAlertController.getInventoryAlerts);

// Danh sách sản phẩm gần hết hàng
router.get('/inventory/exhausted', inventoryAlertController.getExhaustedProducts);

module.exports = router;