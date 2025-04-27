const sessionUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};
module.exports = sessionUser;
