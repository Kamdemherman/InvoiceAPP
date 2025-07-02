
import { useQuery } from '@tanstack/react-query';
import { invoicesAPI, paymentsAPI, clientsAPI } from '@/services/api';
import { Invoice, Payment, Client } from '@/types';

export const useStatistics = () => {
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesAPI.getAll,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsAPI.getAll,
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.getAll,
  });

  const isLoading = invoicesLoading || paymentsLoading || clientsLoading;

  // Calcul des statistiques en temps réel
  const stats = {
    totalRevenue: payments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
    
    monthlyRevenue: (() => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      return payments
        .filter((payment: Payment) => {
          const paymentDate = new Date(payment.date);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    })(),

    totalInvoices: invoices.length,
    pendingInvoices: invoices.filter((invoice: Invoice) => invoice.status === 'sent').length,
    paidInvoices: invoices.filter((invoice: Invoice) => invoice.status === 'paid').length,
    overdueInvoices: invoices.filter((invoice: Invoice) => invoice.status === 'overdue').length,
    draftInvoices: invoices.filter((invoice: Invoice) => invoice.status === 'draft').length,
    
    totalClients: clients.length,
    
    overdueAmount: invoices
      .filter((invoice: Invoice) => invoice.status === 'overdue')
      .reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0),

    // Top clients by revenue
    topClients: (() => {
      const clientRevenue = new Map();
      
      payments.forEach((payment: Payment) => {
        const invoice = invoices.find((inv: Invoice) => inv._id === payment.invoiceId);
        if (invoice) {
          const current = clientRevenue.get(invoice.clientName) || 0;
          clientRevenue.set(invoice.clientName, current + payment.amount);
        }
      });

      return Array.from(clientRevenue.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    })(),

    // Monthly evolution
    monthlyEvolution: (() => {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        const monthPayments = payments.filter((payment: Payment) => {
          const paymentDate = new Date(payment.date);
          return paymentDate.getMonth() === date.getMonth() && 
                 paymentDate.getFullYear() === date.getFullYear();
        });
        
        months.push({
          month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          revenue: monthPayments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0)
        });
      }
      return months;
    })(),

    averagePaymentDelay: (() => {
      const paidInvoicesWithPayments = invoices
        .filter((invoice: Invoice) => invoice.status === 'paid')
        .map((invoice: Invoice) => {
          const payment = payments.find((p: Payment) => p.invoiceId === invoice._id);
          if (payment) {
            const invoiceDate = new Date(invoice.date);
            const paymentDate = new Date(payment.date);
            const diffTime = Math.abs(paymentDate.getTime() - invoiceDate.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          return 0;
        })
        .filter(days => days > 0);

      return paidInvoicesWithPayments.length > 0 
        ? Math.round(paidInvoicesWithPayments.reduce((sum, days) => sum + days, 0) / paidInvoicesWithPayments.length)
        : 0;
    })(),

    paymentRate: invoices.length > 0 
      ? Math.round((invoices.filter((invoice: Invoice) => invoice.status === 'paid').length / invoices.length) * 100)
      : 0,

    averageBasket: invoices.length > 0 
      ? invoices.reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0) / invoices.length
      : 0
  };

  return {
    data: stats,
    isLoading,
    error: null
  };
};