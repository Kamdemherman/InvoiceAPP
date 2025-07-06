const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');

let cachedDb = null;

// Connect to MongoDB Atlas
async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;
  const conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  cachedDb = conn;
  return conn;
}

module.exports = async (req, res) => {
  await connectToDatabase(process.env.MONGO_URI);

  const { method, query } = req;
  const { id, action } = query;

  try {
    if (method === 'GET') {
      if (id) {
        const invoice = await Invoice.findById(id)
          .populate('client')
          .populate('items.product');
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        return res.status(200).json(invoice);
      } else {
        const invoices = await Invoice.find()
          .populate('client', 'name email')
          .populate('items.product', 'name')
          .sort({ createdAt: -1 });
        return res.status(200).json(invoices);
      }
    }

    if (method === 'POST') {
      if (id && action === 'convert-to-final') {
        // Convert proforma to final invoice
        const proforma = await Invoice.findById(id);
        if (!proforma) return res.status(404).json({ message: 'Pro-forma not found' });
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

        return res.status(201).json(savedFinalInvoice);
      }

      // Create new invoice
      const invoiceData = { ...req.body };
      delete invoiceData.number;

      const invoice = new Invoice(invoiceData);
      const savedInvoice = await invoice.save();

      await savedInvoice.populate('client', 'name email');
      await savedInvoice.populate('items.product', 'name');

      return res.status(201).json(savedInvoice);
    }

    if (method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Missing invoice ID' });

      const invoice = await Invoice.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate('client', 'name email')
        .populate('items.product', 'name');

      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
      return res.status(200).json(invoice);
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing invoice ID' });

      const invoice = await Invoice.findByIdAndDelete(id);
      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

      return res.status(200).json({ message: 'Invoice deleted successfully' });
    }

    if (method === 'PATCH') {
      if (!id || !req.body.status) {
        return res.status(400).json({ message: 'Missing invoice ID or status' });
      }

      const invoice = await Invoice.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
      return res.status(200).json(invoice);
    }

    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: error.message });
  }
};
