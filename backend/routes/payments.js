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

// POST /api/payments - Create new payment with partial payment handling
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    await savedPayment.populate('invoice', 'number clientName total');
    
    // Gestion des paiements complets et partiels
    if (savedPayment.status === 'completed' && savedPayment.invoice) {
      const invoice = await Invoice.findById(savedPayment.invoiceId);
      if (invoice) {
        // Calculer le total des paiements pour cette facture
        const allPayments = await Payment.find({
          invoiceId: savedPayment.invoiceId,
          status: 'completed'
        });
        
        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
        
        console.log(`Facture ${invoice.number}: Total facturé: ${invoice.total}€, Total payé: ${totalPaid}€`);
        
        if (totalPaid >= invoice.total) {
          // Paiement complet
          invoice.status = 'paid';
          invoice.paymentDate = savedPayment.date;
          await invoice.save();
          console.log(`✅ Facture ${invoice.number} complètement payée`);
        } else {
          // Paiement partiel - créer un nouveau statut si nécessaire
          invoice.status = 'partially_paid';
          await invoice.save();
          console.log(`🔶 Facture ${invoice.number} partiellement payée (${totalPaid}€/${invoice.total}€)`);
        }
      }
    }
    
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/payments/:id - Update payment with partial payment handling
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

    // Recalculer le statut de la facture après modification du paiement
    if (payment.invoice) {
      const invoice = await Invoice.findById(payment.invoiceId);
      if (invoice) {
        const allPayments = await Payment.find({
          invoiceId: payment.invoiceId,
          status: 'completed'
        });
        
        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
        
        if (totalPaid >= invoice.total) {
          invoice.status = 'paid';
          invoice.paymentDate = payment.date;
        } else if (totalPaid > 0) {
          invoice.status = 'partially_paid';
          invoice.paymentDate = null; // Pas encore complètement payé
        } else {
          // Aucun paiement valide, revenir au statut précédent
          invoice.status = 'sent'; // ou le statut approprié
          invoice.paymentDate = null;
        }
        
        await invoice.save();
        console.log(`🔄 Statut facture ${invoice.number} mis à jour: ${invoice.status}`);
      }
    }
    
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/payments/invoice/:invoiceId - Get all payments for a specific invoice
router.get('/invoice/:invoiceId', async (req, res) => {
  try {
    const payments = await Payment.find({ invoiceId: req.params.invoiceId })
      .sort({ createdAt: -1 });
    
    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    res.json({
      payments,
      totalPaid,
      paymentCount: payments.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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