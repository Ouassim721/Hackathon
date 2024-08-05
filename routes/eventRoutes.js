const express = require('express');
const db = require('../config/db'); // Adjust the path as necessary
const path = require('path');
const router = express.Router();

// Route for the events page
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM events');
        res.render('event/events', { events: results });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display event details
router.get('/:id', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        res.render('event/eventDetails/index', { event: result[0] });
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render the application form
router.get('/apply/:eventId', async (req, res) => {
    try {
        const [eventResult] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.eventId]);
        const [allEventsResult] = await db.query('SELECT * FROM events');

        res.render('event/apply', { 
            event: eventResult[0], // Specific event details
            events: allEventsResult // All events for the dropdown
        });
    } catch (err) {
        console.error('Error fetching event or all events:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle application form submission
router.post('/apply/:eventId', async (req, res) => {
    const { name, email, message } = req.body;
    const eventId = req.params.eventId;

    try {
        await db.query('INSERT INTO applications (event_id, name, email, message) VALUES (?, ?, ?, ?)', 
            [eventId, name, email, message]
        );
        res.redirect(`/events/${eventId}`);
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
