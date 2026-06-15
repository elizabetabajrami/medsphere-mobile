import { useCallback, useEffect, useState } from 'react';
import { notificationService } from '../service/notificationService';
import { getVisibleUnreadCount } from '../utils/notificationFilters';

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

  return {
    unreadCount,
    setUnreadCount,
    loadUnreadCount,
  };
};
