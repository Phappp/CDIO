const pool = require('../../config/db');

const approvalController = {
    // Danh sách báo cáo chờ duyệt
    listPendingReports: async (req, res) => {
        try {
            const [reports] = await pool.query(`
        SELECT r.*, p.name as product_name, p.price, u.username as created_by_name
        FROM reports r
        JOIN products p ON r.product_id = p.id
        JOIN users u ON r.created_by = u.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC
      `);

            res.render('manager/pendingReports', { reports });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách báo cáo' });
        }
    },

    // Xử lý duyệt/từ chối báo cáo
    processReport: async (req, res) => {
        const { id } = req.params;
        const { action } = req.body;
        const approved_by = req.session.user.id;

        try {
            // Lấy thông tin báo cáo
            const [reports] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
            if (reports.length === 0) {
                return res.render('error', { error: 'Báo cáo không tồn tại' });
            }

            const report = reports[0];

            if (action === 'approve') {
                // Cập nhật kho nếu được approve
                await updateInventory(
                    report.product_id,
                    report.type === 'import' ? report.quantity : -report.quantity,
                    approved_by,
                    report.id
                );

                await pool.query(
                    'UPDATE reports SET status = "approved", approved_by = ? WHERE id = ?',
                    [approved_by, id]
                );
            } else {
                await pool.query(
                    'UPDATE reports SET status = "rejected", approved_by = ? WHERE id = ?',
                    [approved_by, id]
                );
            }

            res.redirect('/manager/reports/pending');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Xử lý báo cáo thất bại' });
        }
    }
};

// Helper function để cập nhật kho hàng
async function updateInventory(product_id, quantityChange, created_by, reference_id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      // Lấy số lượng hiện tại
      const [product] = await conn.query('SELECT quantity FROM products WHERE id = ? FOR UPDATE', [product_id]);
      const previousQuantity = product[0].quantity;
      const newQuantity = previousQuantity + quantityChange;
  
      if (newQuantity < 0) {
        throw new Error('Số lượng trong kho không đủ');
      }
  
      // Cập nhật sản phẩm
      await conn.query('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, product_id]);
  
      // Ghi log
      await conn.query(
        `INSERT INTO inventory_logs 
        (product_id, change_type, quantity_change, previous_quantity, new_quantity, reference_id, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product_id,
          quantityChange > 0 ? 'import' : 'export',
          Math.abs(quantityChange),
          previousQuantity,
          newQuantity,
          reference_id,
          created_by
        ]
      );
  
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

module.exports = approvalController;