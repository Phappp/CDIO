const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/manager/productController');
const dashboardController = require('../controllers/manager/dashboardController');
const approvalController = require('../controllers/manager/approvalController');
const inventoryAlertController = require('../controllers/manager/inventoryAlertController');

// Middleware to check if user is admin
router.use(authMiddleware.isManager);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardStats);

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

// Danh sách tồn kho cảnh báo
router.get('/inventory/alerts', inventoryAlertController.getInventoryAlerts);

module.exports = router;