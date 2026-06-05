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
    const response = await notificationApiClient.get<NotificationsResponse>(
      endpoints.notifications.list,
      { params },
    );
    return response.data;
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
};
