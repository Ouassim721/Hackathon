// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// // Route pour envoyer une candidature
// router.post('/apply', (req, res) => {
//     const newApplication = {
//         candidateId: req.body.candidateId,
//         eventId: req.body.eventId,
//         status: 'pending'
//     };

//     const query = 'INSERT INTO applications SET ?';
//     db.query(query, newApplication, (err, result) => {
//         if (err) throw err;
//         req.flash('success', 'Candidature envoyée avec succès.');
//         res.redirect('/events');
//     });
// });

// // Route pour afficher les candidatures pour un événement spécifique
// router.get('/event/:eventId', (req, res) => {
//     const query = 'SELECT * FROM applications WHERE eventId = ?';
//     db.query(query, [req.params.eventId], (err, results) => {
//         if (err) throw err;
//         res.render('applications', { applications: results });
//     });
// });

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path as needed

// Route to render the application form
router.get('/apply', (req, res) => {
    // Fetch events or other necessary data for the form
    db.query('SELECT * FROM events', (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Fetched events:', results); // Log results for debugging
        res.render('apply', { events: results });
    });
});

// Route to handle form submission
router.post('/apply', (req, res) => {
    const { name, email, event, message } = req.body;
    
    // Insert application into the database
    const query = 'INSERT INTO applications (name, email, event_id, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, event, message], (err, results) => {
        if (err) {
            console.error('Error submitting application:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/success'); // Redirect to a success page or similar
    });
});

module.exports = router;
