const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/admin/userController');
const productController = require('../controllers/admin/productController');
const dashboardController = require('../controllers/admin/dashboardController');
const approvalController = require('../controllers/admin/approvalController');
const reportController = require('../controllers/admin/reportController');
const inventoryAlertController = require('../controllers/admin/inventoryAlertController');
const passwordController = require('../controllers/admin/passwordController');


// Middleware to check if user is admin
router.use(authMiddleware.isAdmin);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardStats);
// User management
router.get('/users', userController.listUsers);
router.get('/users/create', userController.showCreateUser);
router.post('/users', userController.createUser);
router.get('/users/:id/edit', userController.showEditUser);
router.post('/users/:id', userController.updateUser);
router.get('/users/:id/delete', userController.deleteUser);

// Thêm các route quản lý sản phẩm
router.get('/products', productController.listProducts);
router.get('/products/create', productController.showCreateProduct);
router.post('/products', productController.createProduct);
router.get('/products/:id/edit', productController.showEditProduct);
router.post('/products/:id', productController.updateProduct);
router.get('/products/:id/delete', productController.deleteProduct);

// Thêm route duyệt báo cáo
router.get('/reports/pending', approvalController.listPendingReports);
router.post('/reports/:id/process', approvalController.processReport);

// Danh sách báo cáo
router.get('/reports/processed', reportController.listProcessedReports);
router.post('/reports/:id/process', reportController.processReport);

// Xuât báo cáo Excel,PDF
router.get('/reports/export/excel', reportController.exportExcel);
router.get('/reports/export/pdf', reportController.exportPDF);

// Thêm route biêu đồ thống kê
router.get('/reports/charts', dashboardController.showCharts);

// Danh sách tồn kho cảnh báo
router.get('/inventory/alerts', inventoryAlertController.getInventoryAlerts);

// Thêm các route sau vào staffRoutes.js
router.get('/change-password', passwordController.showChangePasswordForm);
router.post('/change-password', passwordController.changePassword);

module.exports = router;