const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const db = require('../config/db');

const router = express.Router();

// Render inscription page
router.get('/', (req, res) => {
    res.render('inscription', { error: null, message: null });
});

// Sign-up Route
router.post('/sign-up', [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const { nom, prenom, tele, Adresse, profession, organisation, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('inscription', { error: errors.array()[0].msg, message: null });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (nom, prenom, tele, Adresse, profession, organisation, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, tele, Adresse, profession, organisation, email, hashedPassword]
        );

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render('inscription', { error: 'An error occurred', message: null });
    }
});

// Sign-in Route
router.post('/sign-in', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/inscription',
        failureFlash: true
    })(req, res, next);
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
