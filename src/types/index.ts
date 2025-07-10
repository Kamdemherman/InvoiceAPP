export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
  totalInvoices?: number;
  totalAmount?: number;
  pendingAmount?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  isService: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  product: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  number: string;
  type: 'proforma' | 'final';
  client: string;
  clientName: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue';
  paymentDate?: Date;
  notes?: string;
  convertedToFinal?: boolean;
  finalInvoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  invoice: string;
  invoiceId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'card' | 'transfer' | 'check';
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  _id: string;
  invoice: string;
  invoiceNumber: string;
  clientEmail: string;
  clientName: string;
  type: 'overdue' | 'weekly';
  sentAt: Date;
  nextReminderDate: Date;
  reminderCount: number;
  status: 'sent' | 'failed' | 'cancelled';
  emailSubject: string;
  emailBody: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  totalClients: number;
  overdueAmount: number;
  recentInvoices: Invoice[];
}