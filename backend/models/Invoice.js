
const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const invoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['proforma', 'final'],
    default: 'final'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft'
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  convertedToFinal: {
    type: Boolean,
    default: false
  },
  finalInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }
}, {
  timestamps: true
});

// Middleware pour générer automatiquement le numéro de facture
invoiceSchema.pre('save', async function(next) {
  // Ne générer un numéro que pour les nouveaux documents sans numéro
  if (this.isNew && !this.number) {
    try {
      const year = new Date().getFullYear();
      const prefix = this.type === 'proforma' ? 'PRO' : 'FAC';
      
      const count = await this.constructor.countDocuments({
        type: this.type,
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      });
      this.number = `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
      console.log('Generated invoice number:', this.number);
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);