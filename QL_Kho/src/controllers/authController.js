const pool = require('../config/db');
const { roles, hashPassword, comparePassword } = require('../config/auth');

const authController = {
    showLogin: (req, res) => {
        res.render('index', { error: null });
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

            if (users.length === 0) {
                return res.render('index', { error: 'Account does not exist' });
            }

            const user = users[0];
            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                return res.render('index', { error: 'Password is incorrect' });
            }

            if (!user.is_active) {
                return res.render('index', { error: 'Account has been disabled' });
            }

            req.session.user = user;
            await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

            // Redirect based on role
            switch (user.role) {
                case roles.admin:
                    return res.redirect('/admin/dashboard');
                case roles.manager:
                    return res.redirect('/manager/dashboard');
                case roles.staff:
                    return res.redirect('/staff/dashboard');
                default:
                    return res.redirect('/');
            }
        } catch (error) {
            console.error(error);
            res.render('index', { error: 'Login failed' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }
};

module.exports = authController;