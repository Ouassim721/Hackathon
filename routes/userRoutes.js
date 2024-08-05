const express = require('express');
const router = express.Router();

// Example route: user profile
router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/inscription');
    }
});

// Example route: update user details
router.post('/update', (req, res) => {
    if (req.isAuthenticated()) {
        // Update user details logic here
    } else {
        res.redirect('/inscription');
    }
});

module.exports = router;
