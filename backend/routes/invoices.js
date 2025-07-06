import express from 'express';
import Invoice from '../models/Invoice.js';

const router = express.Router();

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
    
    const invoiceData = { ...req.body };
    delete invoiceData.number;

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

    const finalInvoiceData = {
      ...proforma.toObject(),
      _id: undefined,
      number: undefined,
      type: 'final',
      createdAt: undefined,
      updatedAt: undefined
    };

    const finalInvoice = new Invoice(finalInvoiceData);
    const savedFinalInvoice = await finalInvoice.save();

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

export default router;
