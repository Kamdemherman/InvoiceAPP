const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/clients', require('./routes/clients'));
app.use('/products', require('./routes/products'));
app.use('/invoices', require('./routes/invoices'));
app.use('/payments', require('./routes/payments'));
app.use('/settings', require('./routes/settings'));
app.use('/reminders', require('./routes/reminders'));
app.use('', require('./routes/email'));

// MongoDB connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/factureDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ Connected to MongoDB');
  return cachedDb;
}

// Vercel serverless handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
