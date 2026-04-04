import apiClient from './apiClient';

export const getAllIndustries = async () => {
  const response = await apiClient.get('/industries');
  return response.data.data;
};

export const getIndustryBySlug = async (slug: string) => {
  const response = await apiClient.get(`/industries/${slug}`);
  return response.data.data;
};

export const createIndustry = async (industryData: any) => {
  const response = await apiClient.post('/industries', industryData);
  return response.data.data;
};

export const updateIndustry = async (id: number | string, industryData: any) => {
  const response = await apiClient.put(`/industries/${id}`, industryData);
  return response.data.data;
};

export const deleteIndustry = async (id: number | string) => {
  const response = await apiClient.delete(`/industries/${id}`);
  return response.data.data;
};
