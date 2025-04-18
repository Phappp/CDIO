const pool = require('../../config/db');

const productController = {
    // Danh sách sản phẩm
    listProducts: async (req, res) => {
        try {
            const [products] = await pool.query(`
        SELECT p.*, u.username as created_by_name 
        FROM products p
        JOIN users u ON p.created_by = u.id
        ORDER BY p.id DESC
      `);
            res.render('manager/manageProducts', { products });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách sản phẩm' });
        }
    },

    // Hiển thị form thêm sản phẩm
    showCreateProduct: (req, res) => {
        res.render('manager/createProduct', { error: null, formData: null });
    },

    // Thêm sản phẩm mới
    createProduct: async (req, res) => {
        const { product_code, name, description, quantity, unit, price } = req.body;

        try {
            await pool.query(
                `INSERT INTO products 
        (product_code, name, description, quantity, unit, price, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [product_code, name, description, quantity, unit, price, req.session.user.id]
            );

            res.redirect('/manager/products');
        } catch (error) {
            console.error(error);
            res.render('manager/createProduct', {
                error: 'Thêm sản phẩm thất bại. Mã sản phẩm có thể đã tồn tại.',
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
                return res.render('error', { error: 'Sản phẩm không tồn tại' });
            }

            res.render('manager/editProduct', {
                product: products[0],
                error: null
            });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải thông tin sản phẩm' });
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { product_code, name, description, quantity, unit, price } = req.body;

        try {
            await pool.query(
                `UPDATE products SET 
        product_code = ?, name = ?, description = ?, 
        quantity = ?, unit = ?, price = ? 
        WHERE id = ?`,
                [product_code, name, description, quantity, unit, price, id]
            );

            res.redirect('/manager/products');
        } catch (error) {
            console.error(error);
            res.render('manager/editProduct', {
                product: { id, ...req.body },
                error: 'Cập nhật sản phẩm thất bại'
            });
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            await pool.query('DELETE FROM products WHERE id = ?', [id]);
            res.redirect('/manager/products');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Xóa sản phẩm thất bại' });
        }
    }
};

module.exports = productController;