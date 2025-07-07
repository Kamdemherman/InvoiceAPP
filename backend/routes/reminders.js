const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

// GET /api/reminders - Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('invoice', 'number total dueDate status')
      .sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reminders/send-overdue - Send reminders for overdue invoices
router.post('/send-overdue', async (req, res) => {
  try {
    console.log('🔍 Recherche des factures en retard...');
    
    // Trouver toutes les factures en retard (status 'sent' et date d'échéance dépassée)
    const overdueInvoices = await Invoice.find({
      status: { $in: ['sent', 'overdue'] },
      dueDate: { $lt: new Date() }
    }).populate('client');

    console.log(`📋 ${overdueInvoices.length} factures en retard trouvées`);

    const reminders = [];
    
    for (const invoice of overdueInvoices) {
      // Vérifier si une relance a déjà été envoyée cette semaine
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentReminder = await Reminder.findOne({
        invoice: invoice._id,
        sentAt: { $gte: oneWeekAgo }
      });

      if (!recentReminder) {
        // Calculer la prochaine date de relance (dans 7 jours)
        const nextReminderDate = new Date();
        nextReminderDate.setDate(nextReminderDate.getDate() + 7);

        // Compter les relances précédentes
        const reminderCount = await Reminder.countDocuments({ invoice: invoice._id }) + 1;

        const reminderData = {
          invoice: invoice._id,
          invoiceNumber: invoice.number,
          clientEmail: invoice.client.email,
          clientName: invoice.client.name,
          type: 'overdue',
          nextReminderDate,
          reminderCount,
          emailSubject: `Rappel ${reminderCount} - Facture en retard ${invoice.number}`,
          emailBody: `Votre facture ${invoice.number} d'un montant de ${invoice.total}€ est en retard de paiement.`
        };

        const reminder = new Reminder(reminderData);
        await reminder.save();
        reminders.push(reminder);

        // Marquer la facture comme en retard si ce n'est pas déjà fait
        if (invoice.status !== 'overdue') {
          invoice.status = 'overdue';
          await invoice.save();
        }

        console.log(`📧 Relance programmée pour ${invoice.client.name} - Facture ${invoice.number}`);
      }
    }

    console.log(`✅ ${reminders.length} nouvelles relances créées`);
    res.json({ 
      message: `${reminders.length} relances créées pour les factures en retard`,
      reminders: reminders.length,
      overdueInvoices: overdueInvoices.length
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des relances:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reminders/send-weekly - Send weekly reminders
router.post('/send-weekly', async (req, res) => {
  try {
    console.log('🔍 Recherche des relances hebdomadaires à envoyer...');
    
    // Trouver toutes les relances qui doivent être envoyées aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const remindersToSend = await Reminder.find({
      nextReminderDate: { $gte: today, $lt: tomorrow },
      status: 'sent'
    }).populate('invoice');

    console.log(`📋 ${remindersToSend.length} relances à envoyer aujourd'hui`);

    const newReminders = [];

    for (const reminder of remindersToSend) {
      // Vérifier si la facture est toujours impayée
      const invoice = await Invoice.findById(reminder.invoice._id);
      
      if (invoice && invoice.status !== 'paid') {
        // Créer une nouvelle relance pour la semaine prochaine
        const nextReminderDate = new Date();
        nextReminderDate.setDate(nextReminderDate.getDate() + 7);

        const newReminderData = {
          invoice: reminder.invoice._id,
          invoiceNumber: reminder.invoiceNumber,
          clientEmail: reminder.clientEmail,
          clientName: reminder.clientName,
          type: 'weekly',
          nextReminderDate,
          reminderCount: reminder.reminderCount + 1,
          emailSubject: `Rappel ${reminder.reminderCount + 1} - Facture ${reminder.invoiceNumber}`,
          emailBody: `Rappel: Votre facture ${reminder.invoiceNumber} d'un montant de ${invoice.total}€ est toujours impayée.`
        };

        const newReminder = new Reminder(newReminderData);
        await newReminder.save();
        newReminders.push(newReminder);

        console.log(`📧 Nouvelle relance programmée pour ${reminder.clientName} - Facture ${reminder.invoiceNumber}`);
      } else {
        console.log(`✅ Facture ${reminder.invoiceNumber} payée - Arrêt des relances`);
      }
    }

    console.log(`✅ ${newReminders.length} nouvelles relances hebdomadaires créées`);
    res.json({ 
      message: `${newReminders.length} relances hebdomadaires programmées`,
      newReminders: newReminders.length,
      processed: remindersToSend.length
    });
  } catch (error) {
    console.error('Erreur lors des relances hebdomadaires:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reminders/invoice/:invoiceId - Get reminders for a specific invoice
router.get('/invoice/:invoiceId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ invoice: req.params.invoiceId })
      .sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reminders/:id - Cancel a reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ message: 'Relance non trouvée' });
    }
    
    res.json({ message: 'Relance annulée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;