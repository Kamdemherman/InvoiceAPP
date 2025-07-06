import { Client, Product, Invoice, DashboardStats, Payment } from "@/types";

export const mockClients: Client[] = [
  {
    _id: '1',
    name: 'Entreprise ABC',
    email: 'contact@abc.com',
    phone: '01 23 45 67 89',
    address: {
      street: '123 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    totalInvoices: 12,
    totalAmount: 25680.50,
    pendingAmount: 2580.00
  },
  {
    _id: '2',
    name: 'Société XYZ',
    email: 'admin@xyz.fr',
    phone: '01 98 76 54 32',
    address: {
      street: '456 Avenue des Champs',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France'
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    totalInvoices: 8,
    totalAmount: 18750.00,
    pendingAmount: 0
  }
];

export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Consultation Web',
    description: 'Consultation pour développement web',
    price: 120.00,
    category: 'Service',
    isService: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '2',
    name: 'Hébergement Web',
    description: 'Hébergement mensuel',
    price: 29.99,
    category: 'Service',
    isService: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '3',
    name: 'Ordinateur portable',
    description: 'Laptop professionnel',
    price: 899.00,
    category: 'Matériel',
    stock: 15,
    isService: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockInvoices: Invoice[] = [
  {
    _id: '1',
    number: 'FAC-2024-001',
    type: 'final',
    client: '1',
    clientName: 'Entreprise ABC',
    date: new Date('2024-06-15'),
    dueDate: new Date('2024-07-15'),
    items: [
      {
        product: '1',
        productName: 'Consultation Web',
        quantity: 10,
        unitPrice: 120.00,
        total: 1200.00
      }
    ],
    subtotal: 1200.00,
    tax: 240.00,
    total: 1440.00,
    status: 'paid',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15')
  },
  {
    _id: '2',
    number: 'FAC-2024-002',
    type: 'final',
    client: '2',
    clientName: 'Société XYZ',
    date: new Date('2024-06-16'),
    dueDate: new Date('2024-07-16'),
    items: [
      {
        product: '2',
        productName: 'Hébergement Web',
        quantity: 12,
        unitPrice: 29.99,
        total: 359.88
      }
    ],
    subtotal: 359.88,
    tax: 71.98,
    total: 431.86,
    status: 'sent',
    createdAt: new Date('2024-06-16'),
    updatedAt: new Date('2024-06-16')
  },
  {
    _id: '3',
    number: 'PRO-2024-001',
    type: 'proforma',
    client: '1',
    clientName: 'Entreprise ABC',
    date: new Date('2024-06-17'),
    dueDate: new Date('2024-06-20'),
    items: [
      {
        product: '3',
        productName: 'Ordinateur portable',
        quantity: 2,
        unitPrice: 899.00,
        total: 1798.00
      }
    ],
    subtotal: 1798.00,
    tax: 359.60,
    total: 2157.60,
    status: 'draft',
    createdAt: new Date('2024-06-17'),
    updatedAt: new Date('2024-06-17')
  }
];

export const mockPayments: Payment[] = [
  {
    _id: '1',
    invoice: '1',
    invoiceId: '1',
    amount: 1440.00,
    date: new Date('2024-06-18'),
    method: 'card',
    reference: 'TXN-20240618-001',
    status: 'completed',
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-18')
  },
  {
    _id: '2',
    invoice: '2',
    invoiceId: '2',
    amount: 431.86,
    date: new Date('2024-06-17'),
    method: 'transfer',
    reference: 'VIR-20240617-002',
    status: 'completed',
    createdAt: new Date('2024-06-17'),
    updatedAt: new Date('2024-06-17')
  },
  {
    _id: '3',
    invoice: '1',
    invoiceId: '1',
    amount: 500.00,
    date: new Date('2024-05-15'),
    method: 'cash',
    status: 'completed',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15')
  },
  {
    _id: '4',
    invoice: '2',
    invoiceId: '2',
    amount: 300.00,
    date: new Date('2024-05-10'),
    method: 'check',
    reference: 'CHQ-123456',
    status: 'completed',
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-05-10')
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 44430.50,
  monthlyRevenue: 8850.20,
  pendingInvoices: 3,
  totalClients: 28,
  overdueAmount: 2157.60,
  recentInvoices: mockInvoices.slice(0, 3)
};