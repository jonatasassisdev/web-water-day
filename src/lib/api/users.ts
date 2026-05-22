import apiClient from './client';
import { User } from './types';

export const usersApi = {
  uploadAvatar: async (file: File): Promise<User> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<User>('/users/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
