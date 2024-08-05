const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

// Configure Passport.js
passport.use(new LocalStrategy((username, password, done) => {
    db.query('SELECT * FROM users WHERE email = ?', [username], (err, results) => {
        if (err) return done(err);
        if (results.length === 0 || password !== results[0].password) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, results[0]);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});
