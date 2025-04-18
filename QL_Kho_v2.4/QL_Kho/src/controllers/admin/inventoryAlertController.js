const pool = require('../../config/db');

const inventoryAlertController = {
    /**
     * Lấy danh sách tồn kho cảnh báo
     */
    getInventoryAlerts: async (req, res) => {
        try {
            const [products] = await pool.query(`
        SELECT 
          p.id,
          p.product_code,
          p.name,
          p.quantity,
          p.unit,
          p.price,
          (p.quantity * p.price) as total_value,
          u.username as created_by
        FROM products p
        JOIN users u ON p.created_by = u.id
        WHERE (p.quantity * p.price) > 3000000000
        ORDER BY total_value DESC
      `);

            res.render('admin/inventoryAlerts', {
                products,
                threshold: 3000000000,
                helpers: {
                    formatCurrency: (value) => new Intl.NumberFormat('vi-VN').format(value)
                }
            });
        } catch (error) {
            console.error('Lỗi lấy danh sách tồn kho:', error);
            res.render('admin/inventoryAlerts', { products: [], threshold: 3000000000 });
        }
    }
};

module.exports = inventoryAlertController;