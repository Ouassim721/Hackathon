const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const db = require('../config/db');

const router = express.Router();

// Render inscription page
router.get('/', (req, res) => {
    const error = req.flash('error')[0]; // Récupère le message d'erreur de la session
    const message = req.flash('message')[0]; // Récupère un éventuel message de succès
    res.render('inscription', { error, message });
});

// Sign-up Route
router.post('/sign-up', [
    check('email', 'L\'adresse email n\'est pas valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
], async (req, res, next) => {
    const { nom, prenom, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('inscription', { error: errors.array()[0].msg, message: null });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.render('inscription', { error: 'Cet email est déjà utilisé', message: null });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO Users (nom, prenom, email, role, password) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, 'candidat', hashedPassword] // 'candidat' est utilisé comme rôle par défaut
        );

        const newUser = {
            id: result.insertId,
            nom,
            prenom,
            email
        };

        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('message', 'Inscription réussie. Bienvenue!');
            return res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        res.render('inscription', { error: 'Une erreur est survenue lors de l\'inscription', message: null });
    }
});

// Sign-in Route
router.post('/sign-in', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/inscription',
        failureFlash: 'Adresse email ou mot de passe incorrect.'
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
