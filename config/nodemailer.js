const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password' // Your email password or app-specific password
    }
});

module.exports = transporter;
