const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const ensureAdmin = require('../middleware/ensureAdmin');
const eventController = require('../controllers/eventController');

// Route pour le tableau de bord
router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Evenements');
        res.render('admin/dashboard', { events });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour afficher le formulaire d'ajout d'événements et les événements existants
router.get('/add-event', ensureAdmin, eventController.getAddEventForm);

// Route pour ajouter un événement
router.post('/add-event', ensureAdmin, eventController.upload.fields([
    { name: 'image', maxCount: 1 } // Nom du champ pour l'image de l'événement
]), eventController.addEvent);

// Route pour supprimer un événement
router.post('/delete-event/:id', ensureAdmin, async (req, res) => {
    const eventId = req.params.id;
    try {
        // Récupérer l'URL de l'image pour pouvoir la supprimer du dossier
        const [event] = await db.query('SELECT imageURL FROM Evenements WHERE id = ?', [eventId]);
        if (event.length > 0 && event[0].imageURL) {
            const filePath = path.join(__dirname, '../public', event[0].imageURL);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.query('DELETE FROM Evenements WHERE id = ?', [eventId]);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
});


module.exports = router;
