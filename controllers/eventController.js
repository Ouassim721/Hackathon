const db = require('../models/db'); // Adjust the path as needed

// Example function to get event details by ID
const getEventById = async (id) => {
    try {
        const query = 'SELECT * FROM events WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error(error);
        throw new Error('Database query failed');
    }
};

module.exports = {
    getEventById,
};
