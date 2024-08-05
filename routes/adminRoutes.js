const express = require('express');
const router = express.Router();
const multer = require('multer');

// Define Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// Admin dashboard route
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// Route to handle adding events
router.post('/add-event', upload.single('image'), (req, res) => {
    const { titre, description, date, lieu } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    const query = 'INSERT INTO events (titre, description, date, lieu, imageUrl) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [titre, description, date, lieu, imageUrl], (err, result) => {
        if (err) {
            console.error('Error adding event:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;
