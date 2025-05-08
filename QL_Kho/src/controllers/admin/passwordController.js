const pool = require('../../config/db');
const { comparePassword, hashPassword } = require('../../config/auth');

const passwordController = {
    // Hiển thị form thay đổi mật khẩu
    showChangePasswordForm: (req, res) => {
        res.render('admin/changePassword', {
            error: null,
            success: null
        });
    },

    // Xử lý thay đổi mật khẩu
    changePassword: async (req, res) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.session.user.id;

        try {
            // Validate
            if (newPassword !== confirmPassword) {
                return res.render('admin/changePassword', {
                    error: 'New password does not match the confirmation',
                    success: null
                });
            }

            // Lấy mật khẩu hiện tại từ DB
            const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.render('error', { error: 'User does not exist' });
            }

            // Kiểm tra mật khẩu hiện tại
            const isMatch = await comparePassword(currentPassword, users[0].password);
            if (!isMatch) {
                return res.render('admin/changePassword', {
                    error: 'Current password is incorrect',
                    success: null
                });
            }

            // Hash mật khẩu mới
            const hashedPassword = await hashPassword(newPassword);

            // Cập nhật mật khẩu
            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

            res.render('admin/changePassword', {
                error: null,
                success: 'Password changed successfully'
            });
        } catch (error) {
            console.error(error);
            res.render('admin/changePassword', {
                error: 'Failed to change password',
                success: null
            });
        }
    }
};

module.exports = passwordController;
