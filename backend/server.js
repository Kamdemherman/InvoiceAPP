
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration CORS pour autoriser votre frontend Vercel
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://facturez.vercel.app',
    // 'https://772b5000-5af6-43e9-9d0a-5eb942a26170.lovableproject.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (logos) - Note: sur Railway/Vercel, utilisez Cloudinary
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/products', require('./routes/products'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api', require('./routes/email'));

// MongoDB Connection avec gestion des environnements - OPTIONS SUPPRIMÉES
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Connexion sans les options dépréciées
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Check your MONGODB_URI environment variable');
    console.error('🔍 Verify your MongoDB Atlas credentials and network access');
    
    // Ne pas quitter le processus immédiatement, laisser Railway redémarrer
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
};

connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Invoice Management API', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
    endpoints: {
      clients: '/api/clients',
      products: '/api/products', 
      invoices: '/api/invoices',
      payments: '/api/payments',
      settings: '/api/settings',
      reminders: '/api/reminders'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});