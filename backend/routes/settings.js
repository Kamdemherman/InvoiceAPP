const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CompanySettings = require('../models/CompanySettings');
const UserSettings = require('../models/UserSettings');

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/logos/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Routes pour les paramètres d'entreprise
router.get('/company', async (req, res) => {
  try {
    let companySettings = await CompanySettings.findOne();
    
    // Si aucun paramètre n'existe, créer des paramètres par défaut
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
    
    res.json(companySettings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres d\'entreprise:', error);
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
    console.error('Erreur lors de la mise à jour des paramètres d\'entreprise:', error);
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
    console.error('Erreur lors de la récupération des paramètres utilisateur:', error);
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
    console.error('Erreur lors de la mise à jour des paramètres utilisateur:', error);
    res.status(400).json({ message: error.message });
  }
});

// Route pour l'upload de logo
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    // Mettre à jour les paramètres d'entreprise avec le nouveau logo
    let companySettings = await CompanySettings.findOne();
    if (companySettings) {
      // Supprimer l'ancien logo s'il existe
      if (companySettings.logo) {
        const oldLogoPath = path.join(__dirname, '..', companySettings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      companySettings.logo = logoUrl;
      await companySettings.save();
    }

    res.json({ logoUrl });
  } catch (error) {
    console.error('Erreur lors de l\'upload du logo:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;