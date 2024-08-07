const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const ensureAdmin = require('../middleware/ensureAdmin'); // Assurez-vous que ce chemin est correct

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'brief4'
});

// Route pour le tableau de bord
router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const [events] = await pool.query('SELECT * FROM Evenements');
        res.render('admin/dashboard', { events });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour afficher le formulaire d'ajout d'événements et les événements existants
router.get('/add-event', ensureAdmin, async (req, res) => {
    try {
        const [events] = await pool.query('SELECT * FROM Evenements');
        res.render('admin/add-event', { events });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour ajouter un événement
router.post('/add-event', ensureAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'speakerImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { titre, description, date_debut, date_fin, lieu, sponsorName, sponsorDescription, speakerName, speakerSurname, speakerDescription, programmeDays, programmeDescription } = req.body;

        let imageUrl = null;
        if (req.files['image']) {
            imageUrl = '/images/' + req.files['image'][0].filename;
        }

        // Insertion de l'événement
        const sqlEvent = 'INSERT INTO Evenements (titre, description, date_debut, date_fin, lieu, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
        const [eventResult] = await pool.query(sqlEvent, [titre, description, date_debut, date_fin, lieu, imageUrl]);
        const eventId = eventResult.insertId;

        // Insertion du sponsor
        if (sponsorName && sponsorDescription) {
            await pool.query('INSERT INTO Sponsors (nom, description, evenement_id) VALUES (?, ?, ?)', [sponsorName, sponsorDescription, eventId]);
        }

        // Insertion du speaker
        if (speakerName && speakerSurname) {
            const speakerImageUrl = req.files['speakerImage'] ? '/images/' + req.files['speakerImage'][0].filename : null;
            await pool.query('INSERT INTO Speakers (nom, prenom, description, evenement_id, image_url) VALUES (?, ?, ?, ?, ?)', [speakerName, speakerSurname, speakerDescription, eventId, speakerImageUrl]);
        }

        // Insertion du programme
        if (programmeDays && programmeDescription) {
            for (let i = 0; i < programmeDays; i++) {
                const day = new Date(date_debut);
                day.setDate(day.getDate() + i);
                await pool.query('INSERT INTO Programmes (evenement_id, titre, description) VALUES (?, ?, ?)', [eventId, `Jour ${i + 1}`, programmeDescription]);
            }
        }

        res.redirect('/admin/add-event');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour supprimer un événement
router.post('/delete-event/:id', ensureAdmin, async (req, res) => {
    const eventId = req.params.id;
    try {
        // Récupérer l'URL de l'image pour pouvoir la supprimer du dossier
        const [event] = await pool.query('SELECT imageUrl FROM Evenements WHERE id = ?', [eventId]);
        if (event.length > 0 && event[0].imageUrl) {
            const filePath = path.join(__dirname, '../public', event[0].imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Supprimer l'événement de la base de données
        await pool.query('DELETE FROM Evenements WHERE id = ?', [eventId]);
        res.redirect('/admin/add-event');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;
