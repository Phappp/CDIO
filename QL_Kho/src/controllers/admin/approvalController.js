const pool = require('../../config/db');

const approvalController = {
    // List of pending inventory reports
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

            res.render('admin/pendingReports', { reports });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Error while loading report list' });
        }
    },

    // Process approval/rejection of inventory report
    processReport: async (req, res) => {
        const { id } = req.params;
        const { action } = req.body;
        const approved_by = req.session.user.id;

        try {
            // Retrieve report information
            const [reports] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
            if (reports.length === 0) {
                return res.render('error', { error: 'Report does not exist' });
            }

            const report = reports[0];

            if (action === 'approve') {
                // Update inventory if approved
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

            res.redirect('/admin/reports/pending');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Failed to process report' });
        }
    }
};

// Helper function to update inventory quantity
async function updateInventory(product_id, quantityChange, created_by, reference_id) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Get current inventory quantity
        const [product] = await conn.query('SELECT quantity FROM products WHERE id = ? FOR UPDATE', [product_id]);
        const previousQuantity = product[0].quantity;
        const newQuantity = previousQuantity + quantityChange;

        if (newQuantity < 0) {
            throw new Error('Insufficient inventory quantity');
        }

        // Update product quantity
        await conn.query('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, product_id]);

        // Log inventory change
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
