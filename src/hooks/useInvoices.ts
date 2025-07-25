import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesAPI } from '@/services/api';
import { toast } from 'sonner';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesAPI.getAll,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoicesAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: invoicesAPI.create,
    onSuccess: (data) => {
      console.log('Invoice created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      const type = data.type === 'proforma' ? 'Pro-forma' : 'Facture';
      toast.success(`${type} créée avec succès`);
    },
    onError: (error: Error) => {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Erreur lors de la création de la facture');
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => invoicesAPI.update(id, data),
    onSuccess: (data) => {
      console.log('Invoice updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      const type = data.type === 'proforma' ? 'Pro-forma' : 'Facture';
      toast.success(`${type} modifiée avec succès`);
    },
    onError: (error: Error) => {
      console.error('Error updating invoice:', error);
      toast.error(error.message || 'Erreur lors de la modification de la facture');
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: invoicesAPI.delete,
    onSuccess: () => {
      console.log('Invoice deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Facture supprimée avec succès');
    },
    onError: (error: Error) => {
      console.error('Error deleting invoice:', error);
      toast.error(error.message || 'Erreur lors de la suppression de la facture');
    },
  });
};

export const useConvertToFinalInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/invoices/${id}/convert-to-final`, { method: 'POST' })
        .then(res => res.json()),
    onSuccess: (data) => {
      console.log('Pro-forma converted successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Pro-forma convertie en facture finale avec succès');
    },
    onError: (error: Error) => {
      console.error('Error converting pro-forma:', error);
      toast.error(error.message || 'Erreur lors de la conversion');
    },
  });
};