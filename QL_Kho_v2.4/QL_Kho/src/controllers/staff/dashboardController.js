const pool = require('../../config/db');

const dashboardController = {
    getDashboardStats: async (req, res) => {
        try {
            // Lấy tất cả thống kê cùng lúc bằng Promise.all
            const [
                allProducts,
                totalProducts,
                pendingReports,
                totalUsers,
                lowStockProducts,
                todayReports
            ] = await Promise.all([
                // Sản phẩm
                pool.query('SELECT * FROM products'),
                // Tổng sản phẩm
                pool.query('SELECT COUNT(*) as count FROM products'),

                // Báo cáo chờ duyệt
                pool.query('SELECT COUNT(*) as count FROM reports WHERE status = "pending"'),

                // Tổng người dùng
                pool.query('SELECT COUNT(*) as count FROM users'),

                // Sản phẩm sắp hết (quantity < 10)
                pool.query('SELECT COUNT(*) as count FROM products WHERE quantity < 10'),

                // Báo cáo hôm nay
                pool.query('SELECT COUNT(*) as count FROM reports WHERE DATE(created_at) = CURDATE()')
            ]);

            res.render('staff/dashboard', {
                user: req.session.user,
                stats: {
                    totalProducts: totalProducts[0][0].count,
                    pendingReports: pendingReports[0][0].count,
                    totalUsers: totalUsers[0][0].count,
                    lowStockProducts: lowStockProducts[0][0].count,
                    todayReports: todayReports[0][0].count
                },
                products: allProducts[0]
            });
        } catch (error) {
            console.error('Lỗi khi lấy thống kê dashboard:', error);
            res.render('staff/dashboard', {
                user: req.session.user,
                stats: {}
            });
        }
    }
};

module.exports = dashboardController;