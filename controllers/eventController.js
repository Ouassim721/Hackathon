const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images')); // Répertoire où les fichiers seront sauvegardés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom de fichier unique
    }
});
const upload = multer({ storage: storage });

// Middleware pour gérer les fichiers téléchargés
exports.upload = upload;

// Fonction pour récupérer tous les événements
exports.getEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM evenements');
        res.render('event/events', { events });
    } catch (err) {
        console.error('Erreur lors de la récupération des événements:', err);
        res.status(500).send('Erreur du serveur');
    }
};

// Fonction pour afficher le formulaire d'ajout d'événement
exports.getAddEventForm = async (req, res) => {
    try {
        // Récupère tous les événements existants
        const [events] = await db.query('SELECT * FROM evenements');
        
        // Rendu de la vue avec la liste des événements
        res.render('admin/add-event', { events });
    } catch (err) {
        console.error('Erreur lors de l\'affichage du formulaire d\'ajout d\'événement:', err);
        res.status(500).send('Erreur du serveur');
    }
};

// Fonction pour ajouter un événement
exports.addEvent = async (req, res) => {
    const { titre, description, date_debut, date_fin, lieu } = req.body;
    const eventImage = req.file ? '/images/' + req.file.filename : null; // Assurez-vous d'utiliser req.file pour un seul fichier
    const sponsorsData = JSON.parse(req.body.sponsorsData || '[]');
    const speakersData = JSON.parse(req.body.speakersData || '[]');
    const programmeDaysData = JSON.parse(req.body.programDaysData || '[]');

    try {
        // Insertion de l'événement
        const sqlEvent = 'INSERT INTO evenements (titre, description, date_debut, date_fin, lieu, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
        const [eventResult] = await db.query(sqlEvent, [titre, description, date_debut, date_fin, lieu, eventImage]);
        const eventId = eventResult.insertId;

        // Insertion des sponsors
        for (const sponsor of sponsorsData) {
            await db.query('INSERT INTO sponsors (evenement_id, nom, description) VALUES (?, ?, ?)', [eventId, sponsor.name, sponsor.description]);
        }

        // Insertion des speakers
        for (const speaker of speakersData) {
            await db.query('INSERT INTO speakers (evenement_id, nom, prenom, image_url, description) VALUES (?, ?, ?, ?, ?)', [eventId, speaker.name, speaker.surname, speaker.image, speaker.description]);
        }

        // Insertion des programmes
        for (const day of programmeDaysData) {
            await db.query('INSERT INTO programmes (evenement_id, titre, description) VALUES (?, ?, ?)', [eventId, day.date, day.description]);
        }

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
};

// Fonction pour obtenir les détails d'un événement spécifique
// Exemple de fonction pour obtenir les détails d'un événement
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

        // Rendu de la page avec les détails de l'événement
        res.render('event/eventDetails/index', { event: event[0], sponsors, speakers, programmes, user });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'événement:', error);
        res.status(500).send('Erreur du serveur');
    }
};
