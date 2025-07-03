
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsAPI } from '@/services/api';
import { useInvoices } from '@/hooks/useInvoices';
import { toast } from 'sonner';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.getAll,
  });
};

export const useClientsWithStats = () => {
  const { data: clients = [] } = useClients();
  const { data: invoices = [] } = useInvoices();

  const clientsWithStats = clients.map(client => {
    const clientInvoices = invoices.filter(invoice => 
      invoice.client === client._id || invoice.clientName === client.name
    );
    
    const totalInvoices = clientInvoices.length;
    const totalAmount = clientInvoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    const pendingAmount = clientInvoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.total, 0);

    return {
      ...client,
      totalInvoices,
      totalAmount,
      pendingAmount
    };
  });

  return { 
    data: clientsWithStats, 
    isLoading: false, 
    error: null 
  };
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du client');
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => clientsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la modification du client');
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du client');
    },
  });
};