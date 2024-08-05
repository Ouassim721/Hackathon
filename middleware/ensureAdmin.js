// middleware/ensureAdmin.js
function ensureAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/login');
}

module.exports = ensureAdmin;
