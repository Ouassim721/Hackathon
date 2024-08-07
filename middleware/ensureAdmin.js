module.exports = function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/inscription'); // Redirige vers la page de connexion/inscription si non admin
    }
};
