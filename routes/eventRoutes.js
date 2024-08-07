const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // Assurez-vous que ce chemin est correct

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route pour afficher le formulaire d'ajout d'événement
router.get('/add-event', (req, res) => {
    db.query('SELECT * FROM Evenements', (err, events) => {
        if (err) throw err;
        res.render('admin/add-event', { events });
    });
});

// Route pour ajouter un événement
router.post('/add-event', upload.single('image'), (req, res) => {
    const { titre, description, date_debut, date_fin, lieu } = req.body;
    const image = req.file ? req.file.filename : null;

    // Insertion de l'événement dans la base de données
    db.query(
        'INSERT INTO Evenements (titre, description, date_debut, date_fin, lieu) VALUES (?, ?, ?, ?, ?)',
        [titre, description, date_debut, date_fin, lieu],
        (err, results) => {
            if (err) throw err;
            res.redirect('/admin/add-event');
        }
    );
});

// Route pour ajouter un sponsor
router.post('/add-sponsor', (req, res) => {
    const { nom, description } = req.body;

    // Insertion du sponsor dans la base de données
    db.query(
        'INSERT INTO Sponsors (nom, description) VALUES (?, ?)',
        [nom, description],
        (err, results) => {
            if (err) throw err;
            res.redirect('/admin/add-event');
        }
    );
});

// Route pour ajouter un speaker
router.post('/add-speaker', upload.single('image_url'), (req, res) => {
    const { nom, prenom, description } = req.body;
    const image_url = req.file ? req.file.filename : null;

    // Insertion du speaker dans la base de données
    db.query(
        'INSERT INTO Speakers (nom, prenom, image_url, description) VALUES (?, ?, ?, ?)',
        [nom, prenom, image_url, description],
        (err, results) => {
            if (err) throw err;
            res.redirect('/admin/add-event');
        }
    );
});

// Route pour ajouter un programme
router.post('/add-program', (req, res) => {
    const { evenement_id, titre, description } = req.body;

    // Insertion du programme dans la base de données
    db.query(
        'INSERT INTO Programmes (evenement_id, titre, description) VALUES (?, ?, ?)',
        [evenement_id, titre, description],
        (err, results) => {
            if (err) throw err;
            res.redirect('/admin/add-event');
        }
    );
});

// Route pour supprimer un événement
router.post('/delete-event/:id', (req, res) => {
    const eventId = req.params.id;

    // Suppression de l'événement de la base de données
    db.query('DELETE FROM Evenements WHERE id = ?', [eventId], (err, results) => {
        if (err) throw err;
        res.redirect('/admin/add-event');
    });
});

module.exports = router;
