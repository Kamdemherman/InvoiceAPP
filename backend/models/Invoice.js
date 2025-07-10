const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

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
    
    // Si c'est une facture finale, décrémenter le stock des produits
    if (savedInvoice.type === 'final') {
      await updateProductStock(savedInvoice.items, 'decrement');
    }
    
    console.log('Invoice created with number:', savedInvoice.number);
    
    await savedInvoice.populate('client', 'name email');
    await savedInvoice.populate('items.product', 'name');
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST /api/invoices/:id/convert-to-final - Convert pro-forma to final invoice
router.post('/:id/convert-to-final', async (req, res) => {
  try {
    const proforma = await Invoice.findById(req.params.id);
    
    if (!proforma) {
      return res.status(404).json({ message: 'Pro-forma not found' });
    }
    
    if (proforma.type !== 'proforma') {
      return res.status(400).json({ message: 'Invoice is not a pro-forma' });
    }
    
    if (proforma.convertedToFinal) {
      return res.status(400).json({ message: 'Pro-forma already converted' });
    }
    
    // Créer une nouvelle facture finale basée sur la pro-forma
    const finalInvoiceData = {
      ...proforma.toObject(),
      _id: undefined,
      number: undefined, // Laisser le middleware générer un nouveau numéro
      type: 'final',
      createdAt: undefined,
      updatedAt: undefined
    };
    
    const finalInvoice = new Invoice(finalInvoiceData);
    const savedFinalInvoice = await finalInvoice.save();
    
    // Décrémenter le stock pour la facture finale
    await updateProductStock(savedFinalInvoice.items, 'decrement');
    
    // Marquer la pro-forma comme convertie
    proforma.convertedToFinal = true;
    proforma.finalInvoiceId = savedFinalInvoice._id;
    await proforma.save();
    
    await savedFinalInvoice.populate('client', 'name email');
    await savedFinalInvoice.populate('items.product', 'name');
    
    res.status(201).json(savedFinalInvoice);
  } catch (error) {
    console.error('Error converting pro-forma:', error);
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

// Fonction utilitaire pour mettre à jour le stock
async function updateProductStock(items, operation) {
  for (const item of items) {
    try {
      const product = await Product.findById(item.product);
      
      if (product && !product.isService) {
        // Seuls les produits physiques (non-services) ont leur stock géré
        if (operation === 'decrement') {
          if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
            console.log(`Stock decremented for product ${product.name}: ${item.quantity} units`);
          } else {
            console.warn(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            // On peut choisir de continuer ou de lever une erreur
            // throw new Error(`Stock insuffisant pour le produit ${product.name}`);
          }
        } else if (operation === 'increment') {
          product.stock += item.quantity;
          await product.save();
          console.log(`Stock incremented for product ${product.name}: ${item.quantity} units`);
        }
      }
    } catch (error) {
      console.error(`Error updating stock for product ${item.product}:`, error);
    }
  }
}

module.exports = router;