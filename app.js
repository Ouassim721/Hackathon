const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const ensureAdmin = require('./middleware/ensureAdmin');
const passportConfig = require('./passport-config');
const db = require('./config/db');
const candidatureRoutes = require('./routes/candidatureRoutes');
const app = express();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
require('dotenv').config();
// Configurer EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Définir le répertoire public pour les fichiers statiques
app.use(express.static(path.join(__dirname, ''))); // Répertoire public

// Middleware pour parser les corps de requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());

// Configuration de la session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Initialiser Passport et restaurer la session
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour assurer l'accès admin
app.use('/admin', ensureAdmin);

// Routes pour les différentes parties de l'application
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);
app.use('/inscription', authRoutes);
app.use('/', userRoutes);
app.use('/candidature', candidatureRoutes);

// Routes de base
app.get('/', (req, res) => res.render('index', { user: req.user }));
app.get('/index', (req, res) => res.render('index', { user: req.user }));
app.get('/contact', (req, res) => res.render('contact', { user: req.user }));

// Route pour afficher actualites.ejs
app.get('/actualites', (req, res) => {
    // Remplacez ceci par la logique réelle pour obtenir les données de l'utilisateur
    const user = req.user || null; // Assurez-vous que `req.user` est défini, sinon définissez-le comme `null`

    res.render('actualites', { user }); // Passez `user` comme une variable à la vue
});
// Route pour afficher apropos.ejs
app.get('/apropos', (req, res) => {
    // Remplacez ceci par la logique réelle pour obtenir les données de l'utilisateur
    const user = req.user || null; // Assurez-vous que `req.user` est défini, sinon définissez-le comme `null`

    res.render('apropos', { user }); // Passez `user` comme une variable à la vue
});
// Route pour afficher apropos.ejs
app.get('/more', (req, res) => {
    // Remplacez ceci par la logique réelle pour obtenir les données de l'utilisateur
    const user = req.user || null; // Assurez-vous que `req.user` est défini, sinon définissez-le comme `null`

    res.render('more', { user }); // Passez `user` comme une variable à la vue
});
// Route pour afficher apropos.ejs
app.get('/contact', (req, res) => {
    // Remplacez ceci par la logique réelle pour obtenir les données de l'utilisateur
    const user = req.user || null; // Assurez-vous que `req.user` est défini, sinon définissez-le comme `null`

    res.render('contact', { user }); // Passez `user` comme une variable à la vue
});

// Gestion des erreurs
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
