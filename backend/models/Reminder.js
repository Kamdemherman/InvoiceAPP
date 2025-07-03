const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['overdue', 'weekly'],
    default: 'weekly'
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  nextReminderDate: {
    type: Date,
    required: true
  },
  reminderCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'cancelled'],
    default: 'sent'
  },
  emailSubject: {
    type: String,
    required: true
  },
  emailBody: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
reminderSchema.index({ invoice: 1 });
reminderSchema.index({ nextReminderDate: 1 });
reminderSchema.index({ status: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);