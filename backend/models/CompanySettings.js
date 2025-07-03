const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  siret: {
    type: String,
    trim: true
  },
  vatNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // URL du logo
    trim: true
  },
  invoicePrefix: {
    type: String,
    default: 'FAC',
    trim: true
  },
  paymentDelay: {
    type: Number,
    default: 30
  },
  defaultVatRate: {
    type: Number,
    default: 20
  },
  currency: {
    type: String,
    default: 'FCFA',
    trim: true
  },
  legalMentions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanySettings', companySettingsSchema);