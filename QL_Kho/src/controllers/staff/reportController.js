const pool = require('../../config/db');

const reportController = {
    // Danh sách báo cáo của staff
    listReports: async (req, res) => {
        try {
            const [reports] = await pool.query(`
                SELECT r.*, p.name as product_name, p.price
                FROM reports r
                JOIN products p ON r.product_id = p.id
                WHERE r.created_by = ?
                ORDER BY r.created_at DESC
            `, [req.session.user.id]);

            const successMessage = req.query.success === 'true' ? 'Tạo báo cáo thành công!' : null;

            res.render('staff/listReports', { reports, successMessage });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách báo cáo' });
        }
    },


    // Hiển thị form nhập hàng
    showCreateImport: async (req, res) => {
        try {
            const [products] = await pool.query('SELECT id, name, quantity, price FROM products WHERE is_deleted = 0');
            res.render('staff/createReport', {
                products,
                reportType: 'import',
                error: null,
                successMessage: null // thêm dòng này
            });            
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách sản phẩm' });
        }
    },

    // Xử lý nhập hàng
    createImport: async (req, res) => {
        await handleReportCreation(req, res, 'import');
    },

    // Hiển thị form xuất hàng
    showCreateExport: async (req, res) => {
        try {
            const [products] = await pool.query('SELECT id, name, quantity, price FROM products WHERE is_deleted = 0');
            res.render('staff/createReport', {
                products,
                reportType: 'export',
                error: null,
                successMessage: null // thêm dòng này
            });

        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách sản phẩm' });
        }
    },

    // Xử lý xuất hàng
    createExport: async (req, res) => {
        await handleReportCreation(req, res, 'export');
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
// Hàm xử lý chung cho cả nhập và xuất
async function handleReportCreation(req, res, reportType) {
    const { product_id, quantity, notes } = req.body;
    const created_by = req.session.user.id;

    try {
        // Kiểm tra sản phẩm
        const [products] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) {
            return res.render('error', { error: 'Sản phẩm không tồn tại' });
        }

        const totalValue = products[0].price * quantity;
        const isHighValue = totalValue > 10000000; // Trên 10 triệu

        // Kiểm tra số lượng khi xuất hàng
        if (reportType === 'export') {
            const [current] = await pool.query('SELECT quantity FROM products WHERE id = ?', [product_id]);
            if (current[0].quantity < quantity) {
                return res.render('staff/createReport', {
                    products: await getProducts(),
                    reportType,
                    error: 'Số lượng trong kho không đủ'
                });
            }
        }

        // Tạo báo cáo
        const [result] = await pool.query(
            `INSERT INTO reports 
      (type, product_id, quantity, notes, created_by, status) 
      VALUES (?, ?, ?, ?, ?, ?)`,
            [reportType, product_id, quantity, notes, created_by, isHighValue ? 'pending' : 'approved']
        );

        // Nếu giá trị thấp, cập nhật kho ngay lập tức
        if (!isHighValue) {
            await updateInventory(
                product_id,
                reportType === 'import' ? quantity : -quantity,
                created_by,
                result.insertId
            );
        }

        res.redirect(`/staff/reports?success=true`);

    } catch (error) {
        console.error(error);
        res.render('staff/createReport', {
            products: await getProducts(),
            reportType,
            error: 'Tạo báo cáo thất bại',
            successMessage: null // thêm dòng này
        });
        
    }
}
async function getProducts() {
    const [products] = await pool.query('SELECT id, name, quantity, price FROM products');
    return products;
}
module.exports = reportController;

// const pool = require('../../config/db');

// const reportController = {
//     listReports: async (req, res) => {
//         try {
//             const [reports] = await pool.query(
//               SELECT r.*, p.name as product_name, p.price
//               FROM reports r
//               JOIN products p ON r.product_id = p.id
//               WHERE r.created_by = ?
//               ORDER BY r.created_at DESC
//             , [req.session.user.id]);

//             res.render('staff/listReports', { reports });
//         } catch (error) {
//             console.error(error);
//             res.render('error', { error: 'Lỗi khi tải danh sách báo cáo' });
//         }
//     },

//     showCreateImport: async (req, res) => {
//         try {
//             const [products] = await pool.query('SELECT id, name, quantity, price FROM products WHERE is_deleted = 0');
//             res.render('staff/createReport', {
//                 products,
//                 reportType: 'import',
//                 error: null
//             });
//         } catch (error) {
//             console.error(error);
//             res.render('error', { error: 'Lỗi khi tải danh sách sản phẩm' });
//         }
//     },

//     createImport: async (req, res) => {
//         await handleReportCreation(req, res, 'import');
//     },

//     showCreateExport: async (req, res) => {
//         try {
//             const [products] = await pool.query('SELECT id, name, quantity, price FROM products WHERE is_deleted = 0');
//             res.render('staff/createReport', {
//                 products,
//                 reportType: 'export',
//                 error: null
//             });
//         } catch (error) {
//             console.error(error);
//             res.render('error', { error: 'Lỗi khi tải danh sách sản phẩm' });
//         }
//     },

//     createExport: async (req, res) => {
//         await handleReportCreation(req, res, 'export');
//     }
// };
// async function updateInventory(product_id, quantityChange, created_by, reference_id) {
//     const conn = await pool.getConnection();
//     try {
//         await conn.beginTransaction();

//         const [product] = await conn.query('SELECT quantity FROM products WHERE id = ? FOR UPDATE', [product_id]);
//         const previousQuantity = product[0].quantity;
//         const newQuantity = previousQuantity + quantityChange;

//         if (newQuantity < 0) {
//             throw new Error('Số lượng trong kho không đủ');
//         }

//         await conn.query('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, product_id]);

//         await conn.query(
//             INSERT INTO inventory_logs 
//         (product_id, change_type, quantity_change, previous_quantity, new_quantity, reference_id, created_by) 
//         VALUES (?, ?, ?, ?, ?, ?, ?),
//             [
//                 product_id,
//                 quantityChange > 0 ? 'import' : 'export',
//                 Math.abs(quantityChange),
//                 previousQuantity,
//                 newQuantity,
//                 reference_id,
//                 created_by
//             ]
//         );

//         await conn.commit();
//     } catch (error) {
//         await conn.rollback();
//         throw error;
//     } finally {
//         conn.release();
//     }
// }
// async function handleReportCreation(req, res, reportType) {
//     const { product_id, quantity, notes } = req.body;
//     const created_by = req.session.user.id;

//     try {
//         const [products] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
//         if (products.length === 0) {
//             return res.render('error', { error: 'Sản phẩm không tồn tại' });
//         }

//         const totalValue = products[0].price * quantity;
//         const isHighValue = totalValue > 10000000; 

//         if (reportType === 'export') {
//             const [current] = await pool.query('SELECT quantity FROM products WHERE id = ?', [product_id]);
//             if (current[0].quantity < quantity) {
//                 return res.render('staff/createReport', {
//                     products: await getProducts(),
//                     reportType,
//                     error: 'Số lượng trong kho không đủ'
//                 });
//             }
//         }

//         // Tạo báo cáo
//         const [result] = await pool.query(
//             INSERT INTO reports 
//       (type, product_id, quantity, notes, created_by, status) 
//       VALUES (?, ?, ?, ?, ?, ?),
//             [reportType, product_id, quantity, notes, created_by, isHighValue ? 'pending' : 'approved']
//         );

//         if (!isHighValue) {
//             await updateInventory(
//                 product_id,
//                 reportType === 'import' ? quantity : -quantity,
//                 created_by,
//                 result.insertId
//             );
//         }

//         res.redirect('/staff/reports/export');
//     } catch (error) {
//         console.error(error);
//         res.render('staff/createReport', {
//             products: await getProducts(),
//             reportType,
//             error: 'Tạo báo cáo thất bại'
//         });
//     }
// }
// async function getProducts() {
//     const [products] = await pool.query('SELECT id, name, quantity, price FROM products');
//     return products;
// }
// module.exports = reportController;