import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { io, type Socket } from 'socket.io-client';
import { notificationSocketUrl } from '../../../network/apiClient';
import { getToken } from '../../../storage/tokenStorage';
import type { NotificationItem } from '../model/Notification';
import { notificationService } from '../service/notificationService';
import { getVisibleNotifications, getVisibleUnreadCount } from '../utils/notificationFilters';

export const useNotificationBadgeViewModel = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getNotifications({ limit: 50 });
      setUnreadCount(getVisibleUnreadCount(result.data));
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    let mounted = true;
    let socket: Socket | null = null;

    getToken().then((token) => {
      if (!mounted || !token) return;

      socket = io(notificationSocketUrl, { auth: { token } });

      socket.on('notification:new', (notification: NotificationItem) => {
        if (getVisibleNotifications([notification]).length === 0 || notification.isRead) {
          return;
        }

        setUnreadCount((current) => current + 1);
        Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.message,
            data: {
              notificationId: notification.id,
              type: notification.type,
              link: notification.link,
            },
            sound: 'default',
          },
          trigger: null,
        }).catch((error) => {
          console.log('LOCAL NOTIFICATION ERROR:', error);
        });
      });

      socket.on('notification:read', loadUnreadCount);

      socket.on('notification:all-read', () => {
        setUnreadCount(0);
      });
    });

    return () => {
      mounted = false;
      socket?.disconnect();
    };
  }, [loadUnreadCount]);

  return {
    unreadCount,
    setUnreadCount,
    loadUnreadCount,
  };
};
