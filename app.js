const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const ensureAdmin = require('./middleware/ensureAdmin');
const passportConfig = require('./passport-config'); // Ensure this path is correct

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define the public directory for static files
app.use(express.static(path.join(__dirname, '')));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and restore session
app.use(passport.initialize());
app.use(passport.session());

// Middleware to ensure admin
app.use('/admin', ensureAdmin);

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Route handlers
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

// Route usage
app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);
app.use('/inscription', authRoutes);

// Other routes
app.get('/', (req, res) => res.render('index', { user: req.user }));
app.get('/index', (req, res) => res.render('index', { user: req.user }));
app.get('/contact', (req, res) => res.render('contact', { user: req.user }));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
