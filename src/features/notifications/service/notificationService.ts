import { isAxiosError } from 'axios';
import { notificationApiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { NotificationItem, NotificationsResponse } from '../model/Notification';

type ListNotificationsParams = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};

export const notificationService = {
  async getNotifications(params: ListNotificationsParams = {}): Promise<NotificationsResponse> {
    try {
      const response = await notificationApiClient.get<NotificationsResponse>(
        endpoints.notifications.list,
        { params },
      );

      console.log('NOTIFICATIONS LIST RESPONSE:', {
        url: `${response.config.baseURL}${response.config.url}`,
        status: response.status,
        body: response.data,
      });

      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log('NOTIFICATIONS LIST AXIOS ERROR:', {
          message: error.message,
          code: error.code,
          url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
          status: error.response?.status,
          body: error.response?.data,
        });
      } else {
        console.log('NOTIFICATIONS LIST ERROR:', error);
      }

      throw error;
    }
  },

  async markRead(notificationId: string): Promise<NotificationItem> {
    const response = await notificationApiClient.put<{ data: NotificationItem }>(
      endpoints.notifications.markRead(notificationId),
    );
    return response.data.data;
  },

  async markAllRead(): Promise<{ count: number }> {
    const response = await notificationApiClient.put<{ data: { count: number } }>(
      endpoints.notifications.markAllRead,
    );
    return response.data.data;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await notificationApiClient.delete(endpoints.notifications.delete(notificationId));
  },

  async registerPushToken(payload: {
    token: string;
    platform: 'android' | 'ios';
    deviceName?: string;
  }): Promise<void> {
    await notificationApiClient.post(endpoints.notifications.pushTokens, payload);
  },

  async unregisterPushToken(token: string): Promise<void> {
    await notificationApiClient.delete(endpoints.notifications.pushTokens, {
      data: { token },
    });
  },

  async scheduleTestPush(delaySeconds = 10): Promise<void> {
    await notificationApiClient.post(endpoints.notifications.pushTest, {
      delaySeconds,
    });
  },
};
