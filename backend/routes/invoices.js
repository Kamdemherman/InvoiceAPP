const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /api/invoices - Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('items.product');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
  try {
    console.log('Creating invoice with data:', req.body);
    
    // S'assurer que le champ number n'est pas inclus pour les nouvelles factures
    const invoiceData = { ...req.body };
    delete invoiceData.number; // Supprimer le champ number pour laisser le middleware le générer
    
    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();
    
    console.log('Invoice created with number:', savedInvoice.number);
    
    await savedInvoice.populate('client', 'name email');
    await savedInvoice.populate('items.product', 'name');
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/invoices/:id - Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('client', 'name email')
    .populate('items.product', 'name');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/invoices/:id/status - Update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;