
import { Invoice, Client } from "@/types";
import { settingsAPI, CompanySettings, UserSettings } from "@/services/settingsAPI";

export const sendInvoiceByEmail = async (invoice: Invoice, client: Client): Promise<void> => {
  try {
    console.log('Préparation de l\'envoi d\'email pour:', invoice.number, 'vers:', client.email);
    
    // Récupérer les paramètres de l'entreprise et de l'utilisateur
    const [companySettings, userSettings]: [CompanySettings, UserSettings] = await Promise.all([
      settingsAPI.getCompanySettings(),
      settingsAPI.getUserSettings()
    ]);
    
    // Gérer l'URL du logo avec fallback
    const getLogoUrl = (logoUrl?: string) => {
      if (!logoUrl) return '';
      
      // Si c'est déjà une URL complète Cloudinary, l'utiliser directement
      if (logoUrl.startsWith('https://res.cloudinary.com') || logoUrl.startsWith('http')) {
        return logoUrl;
      }
      
      // Sinon, construire l'URL complète
      return `${window.location.origin}${logoUrl}`;
    };

    const logoUrl = getLogoUrl(companySettings.logo);
    
    // Préparer les données pour l'email
    const emailData = {
      to: client.email,
      subject: `Facture ${invoice.number} - ${companySettings.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${logoUrl ? `
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logoUrl}" alt="Logo ${companySettings.companyName}" 
                   style="max-width: 150px; height: auto; display: block; margin: 0 auto;"
                   onerror="this.style.display='none'" />
            </div>
          ` : `
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">${companySettings.companyName}</h2>
            </div>
          `}
          
          <h2 style="color: #333;">Nouvelle facture</h2>
          
          <p>Bonjour ${client.name},</p>
          
          <p>Veuillez trouver ci-joint votre facture <strong>${invoice.number}</strong> d'un montant de <strong>${invoice.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</strong>.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Détails de la facture:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Numéro:</strong> ${invoice.number}</li>
              <li><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString('fr-FR')}</li>
              <li><strong>Date d'échéance:</strong> ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</li>
              <li><strong>Montant total:</strong> ${invoice.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency} TTC</li>
            </ul>
          </div>
          
          <h4>Articles facturés:</h4>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produit/Service</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantité</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Prix unitaire</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.unitPrice.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="text-align: right; margin: 20px 0;">
            <div>Sous-total: ${invoice.subtotal.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</div>
            <div>TVA (${companySettings.defaultVatRate}%): ${invoice.tax.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</div>
            <div style="font-size: 1.2em; font-weight: bold; margin-top: 10px;">
              Total: ${invoice.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}
            </div>
          </div>
          
          ${invoice.notes ? `
            <div style="margin-top: 30px;">
              <h4>Notes:</h4>
              <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${invoice.notes}</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 30px;">
            Merci pour votre confiance !<br>
            Cordialement,<br>
            <strong>${userSettings.name}</strong><br>
            ${userSettings.position ? `${userSettings.position}<br>` : ''}
            <strong>${companySettings.companyName}</strong><br>
            ${userSettings.email ? `Email: ${userSettings.email}<br>` : ''}
            ${userSettings.phone ? `Tél: ${userSettings.phone}` : ''}
          </p>
        </div>
      `,
      invoiceData: {
        number: invoice.number,
        total: invoice.total,
        dueDate: invoice.dueDate,
        clientEmail: client.email
      }
    };

    // Envoyer l'email via le backend
    const response = await fetch('https://facturez-backend.up.railway.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email envoyé avec succès:', result);
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Service d\'email non disponible. Vérifiez que le serveur backend est démarré.');
    }
    
    throw error;
  }
};

// Fonction pour simuler l'envoi d'email (à utiliser temporairement)
export const simulateEmailSend = async (invoice: Invoice, client: Client): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`📧 Email simulé envoyé à ${client.email} pour la facture ${invoice.number}`);
      
      // Note: Pour un vrai envoi d'email, vous devrez configurer un service comme:
      // - SendGrid, Mailgun, AWS SES, etc.
      // - Ou utiliser un serveur SMTP
      console.log('ℹ️ Ceci est une simulation. Pour un vrai envoi, configurez un service d\'email dans le backend.');
      
      resolve();
    }, 1000);
  });
};