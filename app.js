const express = require('express');
const path = require('path');

const app = express();

// Définir le moteur de template sur EJS
app.set('view engine', 'ejs');

// Définir le dossier des vues
app.set('views', path.join(__dirname, 'views'));

// Définir le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, '')));

// Route pour la page d'accueil
// app.get('/', (req, res) => {
//     res.render('index');
// });

app.get('/', (req, res) => {
    res.render('Apropos');
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});