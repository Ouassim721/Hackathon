// adminRoutes.js
const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin');
const eventController = require('../controllers/eventController');
const db = require('../config/db');


// Route pour afficher le tableau de bord
router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Evenements');
        res.render('admin/dashboard', { events });
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour afficher le formulaire d'ajout d'événements
router.get('/add-event', ensureAdmin, eventController.getAddEventForm);

// Route pour ajouter un événement
router.post('/add-event', ensureAdmin, eventController.upload.fields([
    { name: 'image', maxCount: 1 }
]), eventController.addEvent);

// Route pour supprimer un événement
router.post('/delete-event/:id', ensureAdmin, eventController.deleteEvent);

module.exports = router;
