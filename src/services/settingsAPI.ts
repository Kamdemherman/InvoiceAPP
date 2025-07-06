import { cloudinaryAPI } from './cloudinaryAPI';
import { ENV } from '../config/environment';

const API_BASE_URL = ENV.API_BASE_URL;

export interface CompanySettings {
  _id?: string;
  companyName: string;
  siret: string;
  vatNumber: string;
  address: string;
  logo?: string;
  invoicePrefix: string;
  paymentDelay: number;
  defaultVatRate: number;
  currency: string;
  legalMentions: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSettings {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  createdAt?: string;
  updatedAt?: string;
}

export const settingsAPI = {
  // Company settings
  getCompanySettings: async (): Promise<CompanySettings> => {
    const response = await fetch(`${API_BASE_URL}/settings/company`);
    if (!response.ok) {
      throw new Error('Failed to fetch company settings');
    }
    return response.json();
  },

  updateCompanySettings: async (settings: Partial<CompanySettings>): Promise<CompanySettings> => {
    const response = await fetch(`${API_BASE_URL}/settings/company`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update company settings');
    }
    return response.json();
  },

  // User settings
  getUserSettings: async (): Promise<UserSettings> => {
    const response = await fetch(`${API_BASE_URL}/settings/user`);
    if (!response.ok) {
      throw new Error('Failed to fetch user settings');
    }
    return response.json();
  },

  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await fetch(`${API_BASE_URL}/settings/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update user settings');
    }
    return response.json();
  },

  // Logo upload via Cloudinary
  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    try {
      // Upload vers Cloudinary
      const result = await cloudinaryAPI.uploadImage(file);
      
      // Mettre à jour les paramètres d'entreprise avec la nouvelle URL
      await settingsAPI.updateCompanySettings({ logo: result.secure_url });
      
      return { logoUrl: result.secure_url };
    } catch (error) {
      throw new Error('Erreur lors de l\'upload du logo vers Cloudinary');
    }
  },
};