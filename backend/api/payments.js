const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

let cachedDb = null;

// Connection util
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
  const { id } = query;

  try {
    if (method === 'GET') {
      if (id) {
        const payment = await Payment.findById(id)
          .populate('invoice');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        return res.status(200).json(payment);
      } else {
        const payments = await Payment.find()
          .populate('invoice', 'number clientName total')
          .sort({ createdAt: -1 });
        return res.status(200).json(payments);
      }
    }

    if (method === 'POST') {
      const payment = new Payment(req.body);
      const savedPayment = await payment.save();
      await savedPayment.populate('invoice', 'number clientName total');

      if (savedPayment.status === 'completed' && savedPayment.invoice) {
        const invoice = await Invoice.findById(savedPayment.invoiceId);
        if (invoice && savedPayment.amount >= invoice.total) {
          invoice.status = 'paid';
          invoice.paymentDate = savedPayment.date;
          await invoice.save();
          console.log(`Invoice ${invoice.number} automatically marked as paid`);
        }
      }

      return res.status(201).json(savedPayment);
    }

    if (method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Missing payment ID' });

      const payment = await Payment.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('invoice', 'number clientName total');

      if (!payment) return res.status(404).json({ message: 'Payment not found' });

      if (payment.status === 'completed' && payment.invoice) {
        const invoice = await Invoice.findById(payment.invoiceId);
        if (invoice && payment.amount >= invoice.total) {
          invoice.status = 'paid';
          invoice.paymentDate = payment.date;
          await invoice.save();
          console.log(`Invoice ${invoice.number} automatically marked as paid`);
        }
      }

      return res.status(200).json(payment);
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing payment ID' });

      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });

      return res.status(200).json({ message: 'Payment deleted successfully' });
    }

    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Error processing payment request:', error);
    res.status(500).json({ message: error.message });
  }
};
