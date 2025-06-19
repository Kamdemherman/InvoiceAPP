
import { useQuery } from '@tanstack/react-query';
import { invoicesAPI, paymentsAPI, clientsAPI } from '@/services/api';
import { Invoice, Payment, Client } from '@/types';

export const useDashboardStats = () => {
  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesAPI.getAll,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsAPI.getAll,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.getAll,
  });

  // Calcul des statistiques
  const totalRevenue = payments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = payments
    .filter((payment: Payment) => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

  const pendingInvoices = invoices.filter((invoice: Invoice) => invoice.status === 'sent').length;
  const totalClients = clients.length;
  
  const overdueInvoices = invoices.filter((invoice: Invoice) => invoice.status === 'overdue');
  const overdueAmount = overdueInvoices.reduce((sum: number, invoice: Invoice) => sum + invoice.total, 0);
  
  // Factures récentes (5 dernières)
  const recentInvoices = invoices
    .sort((a: Invoice, b: Invoice) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    data: {
      totalRevenue,
      monthlyRevenue,
      pendingInvoices,
      totalClients,
      overdueAmount,
      recentInvoices
    },
    isLoading: false,
    error: null
  };
};
