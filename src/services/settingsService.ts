import apiClient from './apiClient';

export interface SettingsData {
  siteName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  metaTitle?: string;
  metaDescription?: string;
  currency?: string;
  timezone?: string;
  email?: string;
}

export const getSettings = () => {
  return apiClient.get('/settings');
};

export const updateSettings = (data: SettingsData) => {
  return apiClient.put('/settings', data);
};
