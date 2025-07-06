const mongoose = require('mongoose');
const Client = require('../models/Client');

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
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        return res.status(200).json(client);
      } else {
        const clients = await Client.find().sort({ createdAt: -1 });
        return res.status(200).json(clients);
      }
    }

    if (method === 'POST') {
      const client = new Client(req.body);
      const savedClient = await client.save();
      return res.status(201).json(savedClient);
    }

    if (method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Missing client ID' });
      const client = await Client.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
      if (!client) return res.status(404).json({ message: 'Client not found' });
      return res.status(200).json(client);
    }

    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Missing client ID' });
      const client = await Client.findByIdAndDelete(id);
      if (!client) return res.status(404).json({ message: 'Client not found' });
      return res.status(200).json({ message: 'Client deleted successfully' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
