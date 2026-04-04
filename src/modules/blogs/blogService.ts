import apiClient from '@/services/apiClient';
import { Blog } from '@/services/blogService';

export const blogService = {
  getAll: async () => {
    const response = await apiClient.get('/blogs');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data.data;
  },
  
  create: async (blog: Partial<Blog>) => {
    const response = await apiClient.post('/blogs', blog);
    return response.data.data;
  },
  
  update: async (id: string, blog: Partial<Blog>) => {
    const response = await apiClient.put(`/blogs/${id}`, blog);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  }
};
