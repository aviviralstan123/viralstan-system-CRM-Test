import apiClient from '@/services/apiClient';
import { Blog } from '@/services/blogService';

export const blogService = {
  getAll: async () => {
    const response = await apiClient.get('/blogs/admin/all');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/blogs/admin/id/${id}`);
    return response.data.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data.data;
  },
  
  create: async (blogData: Partial<Blog> | any) => {
    let payload = blogData;
    let config = {};
    if (blogData.coverFile) {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        if (key === 'coverFile') {
          formData.append('featured_image', blogData.coverFile);
        } else if (key === 'coverImage' || key === 'featured_image') {
          if (typeof blogData[key] === 'string' && !blogData[key].startsWith('blob:')) {
            formData.append(key, blogData[key]);
          }
        } else if (blogData[key] !== undefined && blogData[key] !== null) {
          formData.append(key, blogData[key]);
        }
      });
      payload = formData;
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }
    const response = await apiClient.post('/blogs', payload, config);
    return response.data.data;
  },
  
  update: async (id: string, blogData: Partial<Blog> | any) => {
    let payload = blogData;
    let config = {};
    if (blogData.coverFile) {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        if (key === 'coverFile') {
          formData.append('featured_image', blogData.coverFile);
        } else if (key === 'coverImage' || key === 'featured_image') {
          if (typeof blogData[key] === 'string' && !blogData[key].startsWith('blob:')) {
            formData.append(key, blogData[key]);
          }
        } else if (blogData[key] !== undefined && blogData[key] !== null) {
          formData.append(key, blogData[key]);
        }
      });
      payload = formData;
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }
    const response = await apiClient.put(`/blogs/${id}`, payload, config);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  }
};
