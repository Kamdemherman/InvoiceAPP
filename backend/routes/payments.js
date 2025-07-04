const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// GET /api/payments - Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('invoice', 'number clientName total')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/payments/:id - Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('invoice');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/payments - Create new payment
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    await savedPayment.populate('invoice', 'number clientName total');
    
    // Marquer automatiquement la facture comme payée si le paiement est complet
    if (savedPayment.status === 'completed' && savedPayment.invoice) {
      const invoice = await Invoice.findById(savedPayment.invoiceId);
      if (invoice && savedPayment.amount >= invoice.total) {
        invoice.status = 'paid';
        invoice.paymentDate = savedPayment.date;
        await invoice.save();
        console.log(`Facture ${invoice.number} automatiquement marquée comme payée`);
      }
    }
    
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/payments/:id - Update payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('invoice', 'number clientName total');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Vérifier si la facture doit être marquée comme payée
    if (payment.status === 'completed' && payment.invoice) {
      const invoice = await Invoice.findById(payment.invoiceId);
      if (invoice && payment.amount >= invoice.total) {
        invoice.status = 'paid';
        invoice.paymentDate = payment.date;
        await invoice.save();
        console.log(`Facture ${invoice.number} automatiquement marquée comme payée`);
      }
    }
    
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;