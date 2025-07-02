import { Invoice, Client } from "@/types";
import { settingsAPI, CompanySettings } from "@/services/settingsAPI";

export const generateInvoicePDF = async (invoice: Invoice, client: Client): Promise<void> => {
  try {
    // Récupérer les paramètres de l'entreprise
    const companySettings: CompanySettings = await settingsAPI.getCompanySettings();
    
    // Créer le contenu HTML de la facture
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${invoice.number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .company-info { flex: 1; }
          .invoice-info { flex: 1; text-align: right; }
          .company-logo { width: 100px; height: auto; margin-bottom: 15px; }
          .client-info { margin-bottom: 30px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .totals { text-align: right; margin-top: 20px; }
          .total-line { margin: 5px 0; }
          .total-final { font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            ${companySettings.logo ? `<img src="${window.location.origin}${companySettings.logo}" alt="Logo" class="company-logo" />` : ''}
            <h1>${companySettings.companyName}</h1>
            <p>${companySettings.address}</p>
            ${companySettings.siret ? `<p>Email: ${companySettings.siret}</p>` : ''}
            ${companySettings.vatNumber ? `<p>Telephone: ${companySettings.vatNumber}</p>` : ''}
          </div>
          <div class="invoice-info">
            <h2>FACTURE</h2>
            <p><strong>N°: ${invoice.number}</strong></p>
            <p>Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
            <p>Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div class="client-info">
          <h3>Facturé à:</h3>
          <p><strong>${client.name}</strong></p>
          <p>${client.address.street}</p>
          <p>${client.address.postalCode} ${client.address.city}</p>
          <p>${client.address.country}</p>
          <p>Email: ${client.email}</p>
          <p>Téléphone: ${client.phone}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Produit/Service</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</td>
                <td>${item.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-line">Sous-total: ${invoice.subtotal.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</div>
          <div class="total-line">TVA (${companySettings.defaultVatRate}%): ${invoice.tax.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</div>
          <div class="total-line total-final">Total: ${invoice.total.toFixed(2)} ${companySettings.currency === 'EUR' ? '€' : companySettings.currency}</div>
        </div>

        ${invoice.notes ? `
          <div style="margin-top: 30px;">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        ${companySettings.legalMentions ? `
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>${companySettings.legalMentions}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    // Créer et télécharger le PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Attendre que le contenu soit chargé puis imprimer
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
};