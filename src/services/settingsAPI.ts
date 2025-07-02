const API_BASE_URL = 'http://localhost:5000/api';

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

  // Logo upload
  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${API_BASE_URL}/settings/upload-logo`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }
    return response.json();
  },
};