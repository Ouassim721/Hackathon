const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assurez-vous que ce chemin correspond à votre configuration
const { accepterCandidature } = require('../controllers/candidatureController');

// Route pour accepter une candidature
router.post('/candidature/:id/accepter', accepterCandidature);
// Route pour accepter une candidature
router.post('/:id/accepter', async (req, res) => {
    const candidatureId = req.params.id;
    try {
        await db.query('UPDATE Candidatures SET status = "acceptée" WHERE id = ?', [candidatureId]);
        req.flash('success', 'Candidature acceptée.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erreur lors de l\'acceptation de la candidature.');
    }
    res.redirect('/admin/dashboard');
});

// Route pour refuser une candidature
router.post('/:id/refuser', async (req, res) => {
    const candidatureId = req.params.id;
    try {
        await db.query('UPDATE Candidatures SET status = "refusée" WHERE id = ?', [candidatureId]);
        req.flash('success', 'Candidature refusée.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Erreur lors du refus de la candidature.');
    }
    res.redirect('/admin/dashboard');
});

module.exports = router;
