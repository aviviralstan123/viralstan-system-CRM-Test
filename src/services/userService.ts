import apiClient from './apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const createUser = async (userData: any) => {
  // Backend registration endpoint standard uses /auth/register for new users
  // but if there's a specific /users POST, we use that.
  // Standardizing on /auth/register for now as it handles password hashing.
  const response = await apiClient.post('/auth/register', {
    ...userData,
    password: 'password123' // Default password for new users
  });
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
