const pool = require('../../config/db');

const personalController = {
    getPersonal: async (req, res) => {
        try {
            const userId = req.session.user.id; // hoặc req.user.id tùy bạn

            const [personal] = await pool.query(`
                SELECT 
                    p.id,
                    p.user_id,
                    p.full_name,
                    p.email,
                    p.phone,
                    p.address,
                    p.avatar
                FROM personal p
                WHERE p.user_id = ?
            `, [userId]);

            res.render('admin/personal', {
                personal: personal[0] || null  // chỉ lấy 1 user thôi
            });
        } catch (error) {
            console.error('Lỗi lấy thông tin cá nhân:', error);
            res.render('admin/personal', { personal: null });
        }
    }
};

module.exports = personalController;
