const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const db = require('../config/db');

// Route to display events
router.get('/', eventController.getEvents);

// Route to display event details
router.get('/event-details/:id', eventController.getEventDetails);

// Route to apply for an event
router.post('/apply', ensureAuthenticated, async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id; // Ensure user is authenticated and user ID is available

    try {
        // Insert new application into the database
        const query = `INSERT INTO Candidatures (utilisateur_id, evenement_id, date_candidature) VALUES (?, ?, NOW())`;
        await db.query(query, [userId, eventId]);

        // Redirect to event details page with success message
        req.flash('success_msg', 'Your application has been submitted.');
        res.redirect(`/events/event-details/${eventId}`);
    } catch (error) {
        console.error('Error submitting application:', error);
        req.flash('error_msg', 'An error occurred. Please try again.');
        res.redirect(`/events/event-details/${eventId}`);
    }
});

module.exports = router;
