const express = require('express');
const path = require('path');

const app = express();

// Définir le moteur de template sur EJS
app.set('view engine', 'ejs');

// Définir le dossier des vues
app.set('views', path.join(__dirname, 'views'));

// Définir le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, '')));

// Render the index.ejs file
app.get('/', (req, res) => {
    res.render('index');  
});

// Route for the events page
app.get('/events', (req, res) => {
    res.render('event/events');  // Render the events.ejs file
});
//Route pour afficher la liste des événements
app.get('/events', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('events', { events: results });
    });
});

//Route pour afficher les détails d'un événements
app.get('/event/:id', (req, res) => {
    const query = 'SELECT * FROM events WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('event', { event: result[0] });
    });
});

//Route pour soumettre une condidature a un événement
app.get('/apply/:eventId', (req, res) => {
    res.render('apply', { eventId: req.params.eventId });
});

app.post('/apply/:eventId', (req, res) => {
    const application = {
        candidatId: req.body.candidatId, // ID du candidat connecté
        evenementId: req.params.eventId,
        statut: 'en attente'
    };

    const query = 'INSERT INTO applications SET ?';
    db.query(query, application, (err, result) => {
        if (err) throw err;
        req.flash('success', 'Votre candidature a été soumise.');
        res.redirect('/events');
    });
});


// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});