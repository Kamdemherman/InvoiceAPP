const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);