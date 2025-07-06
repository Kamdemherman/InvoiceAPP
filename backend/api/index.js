import express from 'express';
import serverless from 'serverless-http';

// Import des routes
import clientRouter from '../routes/client.js';
import invoiceRouter from '../routes/invoice.js';
import paymentRouter from '../routes/payment.js';
import productRouter from '../routes/product.js';
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
