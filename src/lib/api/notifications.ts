import apiClient from './client';

export interface NotificationSettings {
  id: string;
  userId: string;
  fcmToken: string | null;
  pushEnabled: boolean;
  emailEnabled: boolean;
  reminderIntervalHours: number;
  lastPushSentAt: string | null;
  lastEmailSentAt: string | null;
}

export const notificationsApi = {
  getSettings: async (): Promise<NotificationSettings> => {
    const res = await apiClient.get<NotificationSettings>('/notifications/settings');
    return res.data;
  },

  updateSettings: async (data: Partial<Pick<NotificationSettings, 'fcmToken' | 'pushEnabled' | 'emailEnabled' | 'reminderIntervalHours'>>): Promise<NotificationSettings> => {
    const res = await apiClient.patch<NotificationSettings>('/notifications/settings', data);
    return res.data;
  },
};
