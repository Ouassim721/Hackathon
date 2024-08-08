const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images')); // Directory to save files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
const upload = multer({ storage: storage });

// Middleware for handling file uploads
exports.upload = upload;

// Function to get all events
exports.getEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Evenements');
        res.render('event/events', { events });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Server error');
    }
};

// Function to display add event form
exports.getAddEventForm = async (req, res) => {
    try {
        // Fetch existing events
        const [events] = await db.query('SELECT * FROM Evenements');
        // Render the view with the list of events
        res.render('admin/add-event', { events });
    } catch (err) {
        console.error('Error displaying add event form:', err);
        res.status(500).send('Server error');
    }
};

// Function to add an event
exports.addEvent = async (req, res) => {
    const { titre, description, date_debut, date_fin, lieu } = req.body;
    const eventImage = req.file ? '/images/' + req.file.filename : null;
    const sponsorsData = JSON.parse(req.body.sponsorsData || '[]');
    const speakersData = JSON.parse(req.body.speakersData || '[]');
    const programmeDaysData = JSON.parse(req.body.programDaysData || '[]');

    try {
        // Insert event
        const sqlEvent = 'INSERT INTO Evenements (titre, description, date_debut, date_fin, lieu, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
        const [eventResult] = await db.query(sqlEvent, [titre, description, date_debut, date_fin, lieu, eventImage]);
        const eventId = eventResult.insertId;

        // Insert sponsors
        for (const sponsor of sponsorsData) {
            await db.query('INSERT INTO Sponsors (evenement_id, nom, description) VALUES (?, ?, ?)', [eventId, sponsor.name, sponsor.description]);
        }

        // Insert speakers
        for (const speaker of speakersData) {
            await db.query('INSERT INTO Speakers (evenement_id, nom, prenom, imageUrl, description) VALUES (?, ?, ?, ?, ?)', [eventId, speaker.name, speaker.surname, speaker.image, speaker.description]);
        }

        // Insert programmes
        for (const day of programmeDaysData) {
            await db.query('INSERT INTO Programmes (evenement_id, titre, description) VALUES (?, ?, ?)', [eventId, day.date, day.description]);
        }

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Server error');
    }
};

exports.getEventDetails = async (req, res) => {
    const eventId = req.params.id;

    try {
        // Requête pour obtenir les détails de l'événement
        const [event] = await db.query('SELECT * FROM evenements WHERE id = ?', [eventId]);
        if (event.length === 0) {
            return res.status(404).send('Événement non trouvé');
        }

        // Récupérer les informations sur l'utilisateur s'il est connecté (exemple)
        const user = req.session.user || null; // Adapté en fonction de votre gestion des sessions

        // Requêtes pour obtenir les sponsors, speakers, et programmes associés
        const [sponsors] = await db.query('SELECT * FROM sponsors WHERE evenement_id = ?', [eventId]);
        const [speakers] = await db.query('SELECT * FROM speakers WHERE evenement_id = ?', [eventId]);
        const [programmes] = await db.query('SELECT * FROM programmes WHERE evenement_id = ?', [eventId]);

        // Passer les messages de flash au rendu de la vue
        res.render('event/eventDetails/index', { 
            event: event[0], 
            sponsors, 
            speakers, 
            programmes, 
            user, 
            messages: req.flash() // Passe les messages de flash à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
};


// Function to delete an event
exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        // Fetch image URL to delete from the file system
        const [event] = await db.query('SELECT imageUrl FROM Evenements WHERE id = ?', [eventId]);
        if (event.length > 0 && event[0].imageUrl) {
            const filePath = path.join(__dirname, '../public', event[0].imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await db.query('DELETE FROM Evenements WHERE id = ?', [eventId]);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Server error');
    }
};
