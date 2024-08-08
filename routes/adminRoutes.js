const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin');
const eventController = require('../controllers/eventController');
const db = require('../config/db');

router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        // Fetch both events and candidatures
        const [events] = await db.query('SELECT * FROM evenements');
        const [candidatures] = await db.query(`
            SELECT c.id, u.nom AS utilisateur_nom, e.titre AS evenement_titre, c.date_candidature 
            FROM candidatures c
            JOIN users u ON c.utilisateur_id = u.id
            JOIN evenements e ON c.evenement_id = e.id
            WHERE c.status = 'en_attente'
        `);

        res.render('admin/dashboard', { events, candidatures });
    } catch (error) {
        console.error('Error fetching data for dashboard:', error);
        res.status(500).send('Server error');
    }
});



// Route to display the add event form
router.get('/add-event', ensureAdmin, eventController.getAddEventForm);

// Route to add an event
router.post('/add-event', ensureAdmin, eventController.upload.fields([
    { name: 'image', maxCount: 1 }
]), eventController.addEvent);

// Route to delete an event
router.post('/delete-event/:id', ensureAdmin, eventController.deleteEvent);

module.exports = router;
