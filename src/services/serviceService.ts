import apiClient from './apiClient';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}

export const getAllServices = async () => {
  const response = await apiClient.get('/services');
  return response.data;
};

export const createService = async (serviceData: Partial<Service>) => {
  const response = await apiClient.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id: string, serviceData: Partial<Service>) => {
  const response = await apiClient.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await apiClient.delete(`/services/${id}`);
  return response.data;
};
