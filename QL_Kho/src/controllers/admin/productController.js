const pool = require('../../config/db');

const productController = {
    // Danh sách sản phẩm
    listProducts: async (req, res) => {
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
                todayReports
            ] = await Promise.all([
                // Sản phẩm
                pool.query('SELECT * FROM products WHERE is_deleted = 0'),

                // Kho A
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "A"'),

                // Kho B
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "B"'),

                // Kho C
                pool.query('SELECT * FROM products WHERE is_deleted = 0 AND warehouse = "C"'),

                // Tổng kho A
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND warehouse = "A"'),

                // Tổng kho B
                pool.query('SELECT COUNT(*) as count FROM products WHERE is_deleted = 0 AND warehouse = "B"'),

                // Tổng kho C
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
                pool.query('SELECT COUNT(*) as count FROM reports WHERE DATE(created_at) = CURDATE()')
            ]);

            res.render('admin/manageProducts', {
                user: req.session.user,
                stats: {
                    totalProductA: totalProductA[0][0].count,
                    totalProductB: totalProductB[0][0].count,
                    totalProductC: totalProductC[0][0].count,
                    totalProducts: totalProducts[0][0].count,
                    pendingReports: pendingReports[0][0].count,
                    totalUsers: totalUsers[0][0].count,
                    lowStockProducts: lowStockProducts[0][0].count,
                    todayReports: todayReports[0][0].count
                },
                products: allProducts[0],
                productA: productA[0],
                productB: productB[0],
                productC: productC[0]
            });
        } catch (error) {
            console.error('Error while retrieving dashboard statistics:', error);
            res.render('admin/manageProducts', {
                user: req.session.user,
                stats: {},
                products: [],
                productA: [],
                productB: [],
                productC: []
            });
        }
    },

    // Hiển thị form thêm sản phẩm
    showCreateProduct: (req, res) => {
        res.render('admin/createProduct', { error: null, formData: null });
    },

    // Thêm sản phẩm mới
    createProduct: async (req, res) => {
        const { product_code, name, description, image, quantity, unit, price, warehouse } = req.body;

        try {
            await pool.query(
                `INSERT INTO products 
        (product_code, name, description, image, quantity, unit, price, warehouse, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [product_code, name, description, image, quantity, unit, price, warehouse, req.session.user.id]
            );

            res.redirect('/admin/products');
        } catch (error) {
            console.error(error);
            res.render('admin/createProduct', {
                error: 'Failed to add product. Product code may already exist.',
                formData: req.body
            });
        }
    },

    // Hiển thị form chỉnh sửa sản phẩm
    showEditProduct: async (req, res) => {
        const { id } = req.params;

        try {
            const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

            if (products.length === 0) {
                return res.render('error', { error: 'Product not found' });
            }

            res.render('admin/editProduct', {
                product: products[0],
                error: null
            });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Error loading product information' });
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { product_code, name, description, image, quantity, unit, price } = req.body;

        try {
            await pool.query(
                `UPDATE products SET 
        product_code = ?, name = ?, description = ?, image = ?, 
        quantity = ?, unit = ?, price = ? 
        WHERE id = ?`,
                [product_code, name, description, image, quantity, unit, price, id]
            );

            res.redirect('/admin/products');
        } catch (error) {
            console.error(error);
            res.render('admin/editProduct', {
                product: { id, ...req.body },
                error: 'Failed to update product'
            });
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            await pool.query('UPDATE products SET is_deleted = 1, quantity = 0 WHERE id = ?', [id]);
            res.redirect('/admin/products');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Failed to delete product' });
        }
    }
};

module.exports = productController;
