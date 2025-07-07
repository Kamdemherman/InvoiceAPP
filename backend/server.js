const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (exemple, adapte selon tes fichiers)
app.use('/api/clients', require('./routes/clients'));
app.use('/api/products', require('./routes/products'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api', require('./routes/email'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test basique
app.get('/', (req, res) => {
  res.json({
    message: 'Invoice Management API',
    version: '1.0.0',
  });
});

// MongoDB URI codé en dur
const MONGODB_URI = 'mongodb+srv://kamdemherman9:Hermansteve99%40@cluster0.egvl4l5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connexion MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware de gestion d’erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
