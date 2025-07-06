import express from 'express';
import CompanySettings from '../models/CompanySettings.js';
import UserSettings from '../models/UserSettings.js';

const router = express.Router();

// Routes pour les paramètres d'entreprise
router.get('/company', async (req, res) => {
  try {
    let companySettings = await CompanySettings.findOne();

    // Si aucun paramètre n'existe, créer des paramètres par défaut
    if (!companySettings) {
      companySettings = new CompanySettings({
        companyName: 'Mon Entreprise',
        address: "Adresse de l'entreprise",
        invoicePrefix: 'FAC',
        paymentDelay: 30,
        defaultVatRate: 20,
        currency: 'FCFA'
      });
      await companySettings.save();
    }

    res.json(companySettings);
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres d'entreprise:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/company', async (req, res) => {
  try {
    let companySettings = await CompanySettings.findOne();

    if (!companySettings) {
      companySettings = new CompanySettings(req.body);
    } else {
      Object.assign(companySettings, req.body);
    }

    const savedSettings = await companySettings.save();
    res.json(savedSettings);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres d'entreprise:", error);
    res.status(400).json({ message: error.message });
  }
});

// Routes pour les paramètres utilisateur
router.get('/user', async (req, res) => {
  try {
    let userSettings = await UserSettings.findOne();

    // Si aucun paramètre n'existe, créer des paramètres par défaut
    if (!userSettings) {
      userSettings = new UserSettings({
        name: 'Utilisateur',
        email: 'user@example.com',
        phone: '',
        position: ''
      });
      await userSettings.save();
    }

    res.json(userSettings);
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres utilisateur:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/user', async (req, res) => {
  try {
    let userSettings = await UserSettings.findOne();

    if (!userSettings) {
      userSettings = new UserSettings(req.body);
    } else {
      Object.assign(userSettings, req.body);
    }

    const savedSettings = await userSettings.save();
    res.json(savedSettings);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres utilisateur:", error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
