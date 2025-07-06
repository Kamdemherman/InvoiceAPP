const mongoose = require('mongoose');
const CompanySettings = require('../models/CompanySettings');
const UserSettings = require('../models/UserSettings');

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

  const { method, query, body, url } = req;

  try {
    if (method === 'GET') {
      if (url.includes('/company')) {
        let companySettings = await CompanySettings.findOne();
        if (!companySettings) {
          companySettings = new CompanySettings({
            companyName: 'Mon Entreprise',
            address: 'Adresse de l\'entreprise',
            invoicePrefix: 'FAC',
            paymentDelay: 30,
            defaultVatRate: 20,
            currency: 'FCFA'
          });
          await companySettings.save();
        }
        return res.status(200).json(companySettings);
      }

      if (url.includes('/user')) {
        let userSettings = await UserSettings.findOne();
        if (!userSettings) {
          userSettings = new UserSettings({
            name: 'Utilisateur',
            email: 'user@example.com',
            phone: '',
            position: ''
          });
          await userSettings.save();
        }
        return res.status(200).json(userSettings);
      }

      return res.status(404).json({ message: 'Route not found' });
    }

    if (method === 'PUT') {
      if (url.includes('/company')) {
        let companySettings = await CompanySettings.findOne();
        if (!companySettings) {
          companySettings = new CompanySettings(body);
        } else {
          Object.assign(companySettings, body);
        }
        const saved = await companySettings.save();
        return res.status(200).json(saved);
      }

      if (url.includes('/user')) {
        let userSettings = await UserSettings.findOne();
        if (!userSettings) {
          userSettings = new UserSettings(body);
        } else {
          Object.assign(userSettings, body);
        }
        const saved = await userSettings.save();
        return res.status(200).json(saved);
      }

      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Erreur settings:', error);
    res.status(500).json({ message: error.message });
  }
};
