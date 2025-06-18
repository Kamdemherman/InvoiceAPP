
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/services/api';
import { toast } from 'sonner';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsAPI.getAll,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du produit');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la modification du produit');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du produit');
    },
  });
};
