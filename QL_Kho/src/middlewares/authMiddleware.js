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
        res.status(403).render('error', { error: 'You do not have access' });
    },

    isManager: (req, res, next) => {
        if (req.session.user && req.session.user.role === roles.manager) {
            return next();
        }
        res.status(403).render('error', { error: 'You do not have access' });
    },

    isStaff: (req, res, next) => {
        if (req.session.user && req.session.user.role === roles.staff) {
            return next();
        }
        res.status(403).render('error', { error: 'You do not have access' });
    }
};