import apiClient from './apiClient';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string; // alias for content
  excerpt?: string;
  category: string;
  status: "draft" | "published" | "archived";
  featured_image?: string;
  coverImage?: string; // alias for featured_image
  meta_title?: string;
  metaTitle?: string; // alias
  meta_description?: string;
  metaDescription?: string; // alias
  author?: string;
  views?: number;
  word_count?: number;
  wordCount?: number; // alias
  published_at?: string;
  publishedAt?: string; // alias
  created_at: string;
  coverFile?: any;
}

export const getAllBlogs = async () => {
  const response = await apiClient.get('/blogs');
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await apiClient.get(`/blogs/${slug}`);
  return response.data;
};

export const createBlog = async (blogData: Partial<Blog>) => {
  const response = await apiClient.post('/blogs', blogData);
  return response.data;
};

export const updateBlog = async (id: string, blogData: Partial<Blog>) => {
  const response = await apiClient.put(`/blogs/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};
