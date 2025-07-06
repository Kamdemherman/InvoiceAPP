const mongoose = require('mongoose');
const Product = require('../models/Product');

let cachedDb = null;

// Connect MongoDB
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
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json(product);
      } else {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json(products);
      }
    }

    if (method === 'POST') {
      const product = new Product(req.body);
      const savedProduct = await product.save();
      return res.status(201).json(savedProduct);
    }

    if (method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Missing product ID' });
      const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing product ID' });
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing product request:', error);
    res.status(500).json({ message: error.message });
  }
};
