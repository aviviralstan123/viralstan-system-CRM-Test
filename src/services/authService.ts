import apiClient from './apiClient';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const login = async (credentials: any): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  const data = response.data.data; // Backend wraps response in { success: true, message: '', data: { ... } }
  
  if (data && data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
    return data;
  }
  
  throw new Error(response.data.message || 'Login failed');
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getUserInfo = () => {
  const info = localStorage.getItem('user_info');
  return info ? JSON.parse(info) : null;
};
