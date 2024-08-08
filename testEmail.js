const sendEmail = require('./config/mailer');

const testEmail = async () => {
    try {
        await sendEmail('derjaouassim2004@gmail.com', 'Test Subject', 'This is a test email.');
        console.log('E-mail de test envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de test:', error);
    }
};

testEmail();
