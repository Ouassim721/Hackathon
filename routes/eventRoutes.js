const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin');
const eventController = require('../controllers/eventController');

// Route pour afficher la page des événements
router.get('/', eventController.getEvents);

// Route pour afficher les détails d'un événement
router.get('/event-details/:id', eventController.getEventDetails);

// Route pour afficher le formulaire d'ajout d'événement (Admin uniquement)
router.get('/admin/add-event', ensureAdmin, eventController.getAddEventForm);

// Route pour ajouter un événement et ses associés
router.post('/add-event', ensureAdmin, eventController.upload.fields([
    { name: 'image', maxCount: 1 } // Nom du champ pour l'image de l'événement
]), eventController.addEvent);


module.exports = router;
