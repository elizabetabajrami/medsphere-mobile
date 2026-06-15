import { useCallback, useEffect, useState } from 'react';
import type { NotificationItem } from '../model/Notification';
import { notificationService } from '../service/notificationService';
import { getVisibleNotifications, getVisibleUnreadCount } from '../utils/notificationFilters';

export const useNotificationsViewModel = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (isRefresh = false) => {
    setError(null);

    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const result = await notificationService.getNotifications({ limit: 50 });
      const visibleNotifications = getVisibleNotifications(result.data);
      setNotifications(visibleNotifications);
      setUnreadCount(getVisibleUnreadCount(visibleNotifications));
    } catch {
      setError('Unable to load notifications.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markRead = useCallback(async (notificationId: string) => {
    try {
      setIsUpdating(true);
      const updated = await notificationService.markRead(notificationId);

      setNotifications((current) =>
        current.map((item) => (item.id === notificationId ? updated : item)),
      );
      setUnreadCount((current) => Math.max(current - 1, 0));
    } catch {
      setError('Unable to mark notification as read.');
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      setIsUpdating(true);
      await notificationService.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch {
      setError('Unable to mark notifications as read.');
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    isUpdating,
    error,
    loadNotifications,
    markRead,
    markAllRead,
  };
};
