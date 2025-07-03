import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

// Types pour les relances
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

// API functions
const remindersAPI = {
  getAll: async (): Promise<Reminder[]> => {
    const response = await fetch(`${API_BASE_URL}/reminders`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des relances');
    }
    return response.json();
  },

  getByInvoice: async (invoiceId: string): Promise<Reminder[]> => {
    const response = await fetch(`${API_BASE_URL}/reminders/invoice/${invoiceId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des relances pour cette facture');
    }
    return response.json();
  },

  sendOverdueReminders: async () => {
    const response = await fetch(`${API_BASE_URL}/reminders/send-overdue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi des relances pour factures en retard');
    }
    return response.json();
  },

  sendWeeklyReminders: async () => {
    const response = await fetch(`${API_BASE_URL}/reminders/send-weekly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi des relances hebdomadaires');
    }
    return response.json();
  },

  sendAllReminders: async () => {
    const response = await fetch(`${API_BASE_URL}/send-reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi de toutes les relances');
    }
    return response.json();
  },

  cancelReminder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'annulation de la relance');
    }
    return response.json();
  }
};

// Hooks
export const useReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: remindersAPI.getAll,
  });
};

export const useInvoiceReminders = (invoiceId: string) => {
  return useQuery({
    queryKey: ['reminders', 'invoice', invoiceId],
    queryFn: () => remindersAPI.getByInvoice(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useSendOverdueReminders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: remindersAPI.sendOverdueReminders,
    onSuccess: (data) => {
      console.log('Relances pour factures en retard envoyées:', data);
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`${data.reminders} relances envoyées pour les factures en retard`);
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'envoi des relances:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi des relances');
    },
  });
};

export const useSendWeeklyReminders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: remindersAPI.sendWeeklyReminders,
    onSuccess: (data) => {
      console.log('Relances hebdomadaires envoyées:', data);
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success(`${data.newReminders} relances hebdomadaires programmées`);
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'envoi des relances hebdomadaires:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi des relances hebdomadaires');
    },
  });
};

export const useSendAllReminders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: remindersAPI.sendAllReminders,
    onSuccess: (data) => {
      console.log('Toutes les relances envoyées:', data);
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Toutes les relances ont été traitées avec succès');
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'envoi de toutes les relances:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi des relances automatiques');
    },
  });
};

export const useCancelReminder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: remindersAPI.cancelReminder,
    onSuccess: () => {
      console.log('Relance annulée avec succès');
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Relance annulée avec succès');
    },
    onError: (error: Error) => {
      console.error('Erreur lors de l\'annulation de la relance:', error);
      toast.error(error.message || 'Erreur lors de l\'annulation de la relance');
    },
  });
};