const pool = require('../../config/db');
const { roles, hashPassword } = require('../../config/auth');

const userController = {
    listUsers: async (req, res) => {
        try {
            const [users] = await pool.query(`
        SELECT u.id, u.username, u.role, u.is_active, u.last_login, p.full_name, p.email, p.phone
        FROM users u
        LEFT JOIN personal p ON u.id = p.user_id
        ORDER BY u.id
      `);
            res.render('admin/manageUsers', { users });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải danh sách người dùng' });
        }
    },

    showCreateUser: (req, res) => {
        res.render('admin/createUser', {
            roles: Object.values(roles),
            error: null,
            formData: null
        });
    },

    createUser: async (req, res) => {
        const { username, password, role, full_name, email, phone, address } = req.body;

        try {
            const hashedPassword = await hashPassword(password);

            // Start transaction
            const conn = await pool.getConnection();
            await conn.beginTransaction();

            try {
                // Insert user
                const [userResult] = await conn.query(
                    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                    [username, hashedPassword, role]
                );

                // Insert personal info
                await conn.query(
                    'INSERT INTO personal (user_id, full_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
                    [userResult.insertId, full_name, email, phone, address]
                );

                await conn.commit();
                res.redirect('/admin/users');
            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error(error);
            res.render('admin/createUser', {
                roles: Object.values(roles),
                error: 'Tạo người dùng thất bại',
                formData: req.body
            });
        }
    },

    showEditUser: async (req, res) => {
        const { id } = req.params;

        try {
            const [users] = await pool.query(`
        SELECT u.id, u.username, u.role, u.is_active, p.full_name, p.email, p.phone, p.address
        FROM users u
        LEFT JOIN personal p ON u.id = p.user_id
        WHERE u.id = ?
      `, [id]);

            if (users.length === 0) {
                return res.render('error', { error: 'Người dùng không tồn tại' });
            }

            res.render('admin/editUser', {
                user: users[0],
                roles: Object.values(roles),
                error: null
            });
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Lỗi khi tải thông tin người dùng' });
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { username, role, is_active, full_name, email, phone, address } = req.body;

        try {
            // Start transaction
            const conn = await pool.getConnection();
            await conn.beginTransaction();

            try {
                // Update user
                await conn.query(
                    'UPDATE users SET username = ?, role = ?, is_active = ? WHERE id = ?',
                    [username, role, is_active === 'on', id]
                );

                // Update personal info
                await conn.query(
                    `INSERT INTO personal (user_id, full_name, email, phone, address) 
           VALUES (?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE 
           full_name = VALUES(full_name), 
           email = VALUES(email), 
           phone = VALUES(phone), 
           address = VALUES(address)`,
                    [id, full_name, email, phone, address]
                );

                await conn.commit();
                res.redirect('/admin/users');
            } catch (error) {
                await conn.rollback();
                throw error;
            } finally {
                conn.release();
            }
        } catch (error) {
            console.error(error);
            res.render('admin/editUser', {
                user: { id, ...req.body },
                roles: Object.values(roles),
                error: 'Cập nhật thông tin thất bại'
            });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;

        try {
            await pool.query('DELETE FROM users WHERE id = ?', [id]);
            res.redirect('/admin/users');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Xóa người dùng thất bại' });
        }
    }
};

module.exports = userController;