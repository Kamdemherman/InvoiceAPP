
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Client API
export const clientsAPI = {
  getAll: () => apiRequest('/clients'),
  getById: (id: string) => apiRequest(`/clients/${id}`),
  create: (data: any) => apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getAll: () => apiRequest('/products'),
  getById: (id: string) => apiRequest(`/products/${id}`),
  create: (data: any) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Invoices API
export const invoicesAPI = {
  getAll: () => apiRequest('/invoices'),
  getById: (id: string) => apiRequest(`/invoices/${id}`),
  create: (data: any) => apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/invoices/${id}`, {
    method: 'DELETE',
  }),
  updateStatus: (id: string, status: string) => apiRequest(`/invoices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Payments API
export const paymentsAPI = {
  getAll: () => apiRequest('/payments'),
  getById: (id: string) => apiRequest(`/payments/${id}`),
  create: (data: any) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/payments/${id}`, {
    method: 'DELETE',
  }),
};
