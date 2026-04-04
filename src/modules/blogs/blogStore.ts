import { create } from 'zustand';
import { Blog } from '@/services/blogService';
import { blogService } from './blogService';

interface BlogState {
  blogs: Blog[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD Actions
  fetchBlogs: () => Promise<void>;
  addBlog: (blog: Partial<Blog>) => Promise<void>;
  updateBlog: (id: string, updates: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  getBlogById: (id: string) => Blog | undefined;
  getBlogBySlug: (slug: string) => Blog | undefined;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  isLoading: false,
  error: null,

  fetchBlogs: async () => {
    set({ isLoading: true });
    try {
      const blogs = await blogService.getAll();
      set({ blogs, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch blogs', isLoading: false });
    }
  },

  addBlog: async (blogData) => {
    set({ isLoading: true });
    try {
      const newBlog = await blogService.create(blogData);
      set((state) => ({ blogs: [newBlog, ...state.blogs], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to add blog', isLoading: false });
    }
  },

  updateBlog: async (id, updates) => {
    set({ isLoading: true });
    try {
      const updatedBlog = await blogService.update(id, updates);
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          String(blog.id) === String(id) ? { ...blog, ...updatedBlog } : blog
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update blog', isLoading: false });
    }
  },

  deleteBlog: async (id) => {
    set({ isLoading: true });
    try {
      await blogService.delete(id);
      set((state) => ({
        blogs: state.blogs.filter((blog) => String(blog.id) !== String(id)),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete blog', isLoading: false });
    }
  },

  getBlogById: (id) => {
    return get().blogs.find((blog) => String(blog.id) === String(id));
  },

  getBlogBySlug: (slug) => {
    return get().blogs.find((blog) => 
      blog.slug === slug
    );
  },
}));
