
export interface Client {
  id: string;
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
  totalInvoices: number;
  totalAmount: number;
  pendingAmount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  isService: boolean;
  createdAt: Date;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentDate?: Date;
  notes?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'card' | 'transfer' | 'check';
  reference?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  totalClients: number;
  overdueAmount: number;
  recentInvoices: Invoice[];
}
