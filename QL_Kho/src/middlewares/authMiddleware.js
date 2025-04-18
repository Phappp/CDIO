const { roles } = require('../config/auth');

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        res.redirect('/');
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === roles.admin) {
            return next();
        }
        res.status(403).render('error', { error: 'Bạn không có quyền truy cập' });
    },

    isManager: (req, res, next) => {
        if (req.session.user && req.session.user.role === roles.manager) {
            return next();
        }
        res.status(403).render('error', { error: 'Bạn không có quyền truy cập' });
    },

    isStaff: (req, res, next) => {
        if (req.session.user && req.session.user.role === roles.staff) {
            return next();
        }
        res.status(403).render('error', { error: 'Bạn không có quyền truy cập' });
    }
};