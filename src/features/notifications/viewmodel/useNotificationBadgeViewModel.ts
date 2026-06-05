import { useCallback, useEffect, useState } from 'react';
import { notificationService } from '../service/notificationService';

export const useNotificationBadgeViewModel = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await notificationService.getNotifications({ limit: 1 });
      setUnreadCount(result.meta.unreadCount);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  return {
    unreadCount,
    setUnreadCount,
    loadUnreadCount,
  };
};
