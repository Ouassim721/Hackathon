const bcrypt = require('bcryptjs'); // Importation de bcryptjs
const db = require('./config/db'); // Assurez-vous que le chemin vers db.js est correct

async function addAdmin(nom, prenom, email, password) {
    try {
        // Vérifiez si l'email est déjà utilisé
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            console.log('Cet email est déjà utilisé');
            return;
        }

        // Hachez le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérez l'utilisateur dans la table Users
        const [result] = await db.query(
            'INSERT INTO Users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPassword, 'admin']
        );

        console.log('Administrateur ajouté avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
    }
}

// Exemple d'utilisation : ajouter un administrateur
addAdmin('Derja', 'Ouassim', 'ouassim@gmail.com', 'admin123');
