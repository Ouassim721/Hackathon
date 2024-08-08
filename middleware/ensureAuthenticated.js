function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Vous devez être connecté pour effectuer cette action.');
        res.redirect('/inscription');
    }
}

module.exports = ensureAuthenticated;
