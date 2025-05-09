const pool = require('../../config/db');

const dashboardController = {
    getDashboardStats: async (req, res) => {
        try {
            // Lấy tất cả thống kê cùng lúc bằng Promise.all
            const [
                totalProducts,
                pendingReports,
                totalUsers,
                lowStockProducts,
                todayReports,
                alerts
            ] = await Promise.all([
                // Tổng sản phẩm
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0'),

                // Báo cáo chờ duyệt
                pool.query('SELECT COUNT(*) as count FROM reports WHERE status = "pending"'),

                // Tổng người dùng
                pool.query('SELECT COUNT(*) as count FROM users'),

                // Sản phẩm sắp hết (quantity < 10)
                pool.query('SELECT COUNT(*) as count FROM products WHERE quantity < 10 AND is_deleted = 0'),

                // Báo cáo hôm nay
                pool.query('SELECT COUNT(*) as count FROM reports WHERE DATE(created_at) = CURDATE()'),

                // Sản phẩm có giá trị lớn hơn 3 tỷ (cảnh báo tồn kho)
                pool.query(`
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE (quantity * price) > 300000000
                `)
            ]);

            res.render('admin/dashboard', {
                user: req.session.user,
                stats: {
                    totalProducts: totalProducts[0][0].count,
                    pendingReports: pendingReports[0][0].count,
                    totalUsers: totalUsers[0][0].count,
                    lowStockProducts: lowStockProducts[0][0].count,
                    todayReports: todayReports[0][0].count,
                    inventoryAlerts: alerts[0][0].count
                }
            });
        } catch (error) {
            console.error('Error while fetching dashboard statistics:', error);
            res.render('admin/dashboard', {
                user: req.session.user,
                stats: {}
            });
        }
    },
    showCharts: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const year = req.query.year || currentYear;

            const [monthlySummary, monthlyComparison] = await Promise.all([
                pool.query(`
              SELECT 
                type,
                SUM(quantity) as total_quantity,
                SUM(quantity * (SELECT price FROM products WHERE id = reports.product_id)) as total_value
              FROM reports
              WHERE status = 'approved'
                AND YEAR(created_at) = ?
              GROUP BY type
            `, [year]),

                pool.query(`
              SELECT 
                MONTH(created_at) as month,
                SUM(CASE WHEN type = 'import' THEN quantity ELSE 0 END) as import_qty,
                SUM(CASE WHEN type = 'export' THEN quantity ELSE 0 END) as export_qty,
                SUM(CASE WHEN type = 'import' THEN quantity * (SELECT price FROM products WHERE id = reports.product_id) ELSE 0 END) as import_value,
                SUM(CASE WHEN type = 'export' THEN quantity * (SELECT price FROM products WHERE id = reports.product_id) ELSE 0 END) as export_value
              FROM reports
              WHERE status = 'approved'
                AND YEAR(created_at) = ?
              GROUP BY MONTH(created_at)
              ORDER BY month
            `, [year])
            ]);

            const allMonthsData = Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const found = monthlyComparison[0].find(item => item.month === month);
                return found || {
                    month,
                    import_qty: 0,
                    export_qty: 0,
                    import_value: 0,
                    export_value: 0
                };
            });

            res.render('admin/charts', {
                user: req.session.user,
                stats: {
                    monthlySummary: monthlySummary[0],
                    monthlyData: allMonthsData,
                    currentYear: year,
                    availableYears: [currentYear, currentYear - 1, currentYear - 2]
                }
            });
        } catch (error) {
            console.error('Error while fetching chart data:', error);
            res.render('admin/charts', {
                user: req.session.user,
                stats: {
                    monthlySummary: [],
                    monthlyData: Array.from({ length: 12 }, (_, i) => ({
                        month: i + 1,
                        import_qty: 0,
                        export_qty: 0,
                        import_value: 0,
                        export_value: 0
                    })),
                    currentYear: new Date().getFullYear(),
                    availableYears: []
                }
            });
        }
    }
};

module.exports = dashboardController;
