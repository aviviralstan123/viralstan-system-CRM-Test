import apiClient from './apiClient';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: "active" | "inactive" | "prospect";
  totalSpent: number;
  joinedAt: string;
}

export const getAllClients = async () => {
  const response = await apiClient.get('/clients');
  return response.data;
};

export const getClientById = async (id: string) => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: Omit<Client, 'id' | 'totalSpent' | 'joinedAt'>) => {
  const response = await apiClient.post('/clients', clientData);
  return response.data;
};

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const response = await apiClient.put(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await apiClient.delete(`/clients/${id}`);
  return response.data;
};
