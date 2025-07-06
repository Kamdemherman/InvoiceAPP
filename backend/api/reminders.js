const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;
  const conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  cachedDb = conn;
  return conn;
}

module.exports = async (req, res) => {
  await connectToDatabase(process.env.MONGO_URI);

  const { method, query, url } = req;
  const { id, invoiceId, action } = query;

  try {
    if (method === 'GET') {
      if (url.includes('/invoice/')) {
        // GET reminders for a specific invoice
        const reminders = await Reminder.find({ invoice: invoiceId })
          .sort({ createdAt: -1 });
        return res.status(200).json(reminders);
      } else {
        // GET all reminders
        const reminders = await Reminder.find()
          .populate('invoice', 'number total dueDate status')
          .sort({ createdAt: -1 });
        return res.status(200).json(reminders);
      }
    }

    if (method === 'POST') {
      if (url.includes('send-overdue')) {
        // Send overdue reminders
        const overdueInvoices = await Invoice.find({
          status: { $in: ['sent', 'overdue'] },
          dueDate: { $lt: new Date() }
        }).populate('client');

        const reminders = [];
        for (const invoice of overdueInvoices) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          const recentReminder = await Reminder.findOne({
            invoice: invoice._id,
            sentAt: { $gte: oneWeekAgo }
          });

          if (!recentReminder) {
            const nextReminderDate = new Date();
            nextReminderDate.setDate(nextReminderDate.getDate() + 7);
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

            if (invoice.status !== 'overdue') {
              invoice.status = 'overdue';
              await invoice.save();
            }
          }
        }
        return res.status(200).json({
          message: `${reminders.length} relances créées`,
          reminders: reminders.length,
          overdueInvoices: overdueInvoices.length
        });
      }

      if (url.includes('send-weekly')) {
        // Send weekly reminders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const remindersToSend = await Reminder.find({
          nextReminderDate: { $gte: today, $lt: tomorrow },
          status: 'sent'
        }).populate('invoice');

        const newReminders = [];
        for (const reminder of remindersToSend) {
          const invoice = await Invoice.findById(reminder.invoice._id);
          if (invoice && invoice.status !== 'paid') {
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
          }
        }

        return res.status(200).json({
          message: `${newReminders.length} relances hebdomadaires créées`,
          newReminders: newReminders.length,
          processed: remindersToSend.length
        });
      }

      return res.status(405).json({ message: 'Invalid POST action' });
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing reminder ID' });
      const reminder = await Reminder.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { new: true }
      );
      if (!reminder) return res.status(404).json({ message: 'Relance non trouvée' });
      return res.status(200).json({ message: 'Relance annulée avec succès' });
    }

    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
};
