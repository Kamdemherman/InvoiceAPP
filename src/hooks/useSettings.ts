
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI, CompanySettings, UserSettings } from '@/services/settingsAPI';
import { toast } from 'sonner';

export const useCompanySettings = () => {
  return useQuery({
    queryKey: ['company-settings'],
    queryFn: settingsAPI.getCompanySettings,
  });
};

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['user-settings'],
    queryFn: settingsAPI.getUserSettings,
  });
};

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsAPI.updateCompanySettings,
    onSuccess: (data) => {
      console.log('Company settings updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast.success('Paramètres d\'entreprise mis à jour avec succès');
    },
    onError: (error: Error) => {
      console.error('Error updating company settings:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour des paramètres');
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsAPI.updateUserSettings,
    onSuccess: (data) => {
      console.log('User settings updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast.success('Profil utilisateur mis à jour avec succès');
    },
    onError: (error: Error) => {
      console.error('Error updating user settings:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    },
  });
};

export const useUploadLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsAPI.uploadLogo,
    onSuccess: (data) => {
      console.log('Logo uploaded successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast.success('Logo téléchargé avec succès');
    },
    onError: (error: Error) => {
      console.error('Error uploading logo:', error);
      toast.error(error.message || 'Erreur lors du téléchargement du logo');
    },
  });
};