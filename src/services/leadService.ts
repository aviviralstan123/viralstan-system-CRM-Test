import apiClient from './apiClient';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  service_interested?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  value: number;
  message?: string;
  created_at: string;
  updated_at?: string;
}

export const getAllLeads = async () => {
  const response = await apiClient.get('/leads');
  return response.data;
};

export const createLead = async (leadData: Partial<Lead>) => {
  const response = await apiClient.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (id: string, leadData: Partial<Lead>) => {
  const response = await apiClient.put(`/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await apiClient.delete(`/leads/${id}`);
  return response.data;
};
