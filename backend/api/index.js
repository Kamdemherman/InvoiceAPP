import express from 'express';
import serverless from 'serverless-http';

// Import des routes
import clientRouter from '../routes/clients.js';
import invoiceRouter from '../routes/invoices.js';
import paymentRouter from '../routes/payments.js';
import productRouter from '../routes/products.js';
import remindersRouter from '../routes/reminders.js';
import settingsRouter from '../routes/settings.js';
import emailRouter from '../routes/email.js';
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/clients', clientRouter);
app.use('/invoices', invoiceRouter);
app.use('/payments', paymentRouter);
app.use('/products', productRouter);
app.use('/reminders', remindersRouter);
app.use('/settings', settingsRouter);
app.use('/email', emailRouter);

// Export serverless handler
export const handler = serverless(app);
