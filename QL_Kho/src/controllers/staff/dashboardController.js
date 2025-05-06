const pool = require('../../config/db');

const dashboardController = {
    getDashboardStats: async (req, res) => {
        try {
            // Lấy tất cả thống kê cùng lúc bằng Promise.all
            const [
                allProducts,
                productA,
                productB,
                productC,
                totalProductA,
                totalProductB,
                totalProductC,
                totalProducts,
                pendingReports,
                totalUsers,
                lowStockProducts,
                todayReports,
                alerts
            ] = await Promise.all([
                // Sản phẩm
                pool.query('SELECT * FROM products WHERE is_deleted = 0'),

                // Kho A
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "A"'),

                // Kho B
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "B"'),

                // Kho C
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "C"'),

                //Tổng kho A
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND warehouse = "A"'),

                // Tổng kho B
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND warehouse = "B"'),

                //Tổng kho C
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND warehouse = "C"'),

                // Tổng sản phẩm
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0'),

                // Báo cáo chờ duyệt
                pool.query('SELECT COUNT(*) as count FROM reports WHERE status = "pending"'),

                // Tổng người dùng
                pool.query('SELECT COUNT(*) as count FROM users'),

                // Sản phẩm sắp hết (quantity < 10)
                pool.query('SELECT COUNT(*) as count FROM products WHERE quantity < 10'),

                // Báo cáo hôm nay
                pool.query('SELECT COUNT(*) as count FROM reports WHERE DATE(created_at) = CURDATE()'),

                // Sản phẩm có giá trị lớn hơn 3 tỷ (cảnh báo tồn kho)
                pool.query(`
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE (quantity * price) > 3000000000
                  `)
            ]);

            res.render('staff/dashboard', {
                user: req.session.user,
                stats: {
                    totalProductA: totalProductA[0][0].count,
                    totalProductB: totalProductB[0][0].count,
                    totalProductC: totalProductC[0][0].count,
                    totalProducts: totalProducts[0][0].count,
                    pendingReports: pendingReports[0][0].count,
                    totalUsers: totalUsers[0][0].count,
                    lowStockProducts: lowStockProducts[0][0].count,
                    todayReports: todayReports[0][0].count,
                    inventoryAlerts: alerts[0][0].count
                },
                products: allProducts[0],
                productA: productA[0],
                productB: productB[0],
                productC: productC[0]
            });
        } catch (error) {
            console.error('Lỗi khi lấy thống kê dashboard:', error);
            res.render('staff/dashboard', {
                user: req.session.user,
                stats: {},
                products: [],
                productA: [],
                productB: [],
                productC: []
            });
        }
    }
};

module.exports = dashboardController;