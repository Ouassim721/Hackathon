const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'brief4'
    });

    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await connection.execute(
            'INSERT INTO users (nom, prenom, tele, Adresse, profession, organisation, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['Derja', 'Ouassim', '0688800303', 'YouCode SAFI', 'other', 'other', 'ouassim@gmail.com', hashedPassword, 'admin']
        );

        console.log('Admin added successfully');
    } catch (error) {
        console.error('Error adding admin:', error);
    } finally {
        await connection.end();
    }
})();
