
const express = require('express');
const router = express.Router();

// Route pour envoyer un email (simulation)
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, invoiceData } = req.body;
    
    console.log('📧 Envoi d\'email:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Invoice:', invoiceData);
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = { to, subject, html, from: 'herman@wouessi.com' };
    await sgMail.send(msg);
    

    // Pour l'instant, simulation avec un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log pour indiquer que c'est une simulation
    console.log('ℹ️  Pour envoyer de vrais emails, configurez un service comme SendGrid');
    
    res.json({ 
      message: 'Email traité (simulation)',
      to,
      subject,
      timestamp: new Date().toISOString(),
      note: 'Ceci est une simulation. Configurez un service d\'email pour un envoi réel.'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
});

module.exports = router;