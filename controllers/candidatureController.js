// controllers/candidatureController.js
const db = require('../config/db'); // Chemin vers votre module de base de données
const sendEmail = require('../config/mailer'); // Chemin vers votre module de mailer

// Fonction pour accepter une candidature
const accepterCandidature = async (req, res) => {
    try {
        const candidatureId = req.params.id;

        // Trouver la candidature à accepter
        const [candidature] = await db.query('SELECT * FROM candidatures WHERE id = ?', [candidatureId]);

        if (!candidature.length) {
            return res.status(404).send('Candidature non trouvée');
        }

        // Mettre à jour le statut de la candidature
        await db.query('UPDATE candidatures SET status = ? WHERE id = ?', ['acceptée', candidatureId]);

        // Trouver les informations de l'utilisateur et l'événement
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [candidature[0].utilisateur_id]);
        const [event] = await db.query('SELECT * FROM evenements WHERE id = ?', [candidature[0].evenement_id]);

        // Envoyer un e-mail à l'utilisateur
        const subject = 'Votre candidature a été acceptée';
        const text = `Bonjour ${user[0].nom},\n\nFélicitations ! Votre candidature pour l'événement "${event[0].titre}" a été acceptée.\n\nCordialement,\nL'équipe`;
        await sendEmail(user[0].email, subject, text);

        res.redirect('/admin/dashboard'); // Rediriger vers le tableau de bord après l'acceptation

    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la candidature:', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { accepterCandidature };
