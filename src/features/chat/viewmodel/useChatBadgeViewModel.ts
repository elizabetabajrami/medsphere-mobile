import { useCallback, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { notificationSocketUrl } from '../../../network/apiClient';
import { getToken, getUser } from '../../../storage/tokenStorage';
import type { ChatMessage } from '../model/Chat';
import { chatNotificationService } from '../service/chatNotificationService';
import { chatService } from '../service/chatService';

export const useChatBadgeViewModel = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await chatService.getRooms();
      setUnreadCount(result.data.reduce((total, room) => total + room.unreadCount, 0));
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

    Promise.all([getToken(), getUser()]).then(([token, user]) => {
      if (!mounted || !token) return;

      console.log('CHAT BADGE SOCKET CONNECTING:', {
        url: notificationSocketUrl,
        tokenLength: token.length,
      });

      socket = io(notificationSocketUrl, { auth: { token } });

      socket.on('connect_error', (error) => {
        console.log('CHAT BADGE SOCKET CONNECT ERROR:', {
          url: notificationSocketUrl,
          tokenLength: token.length,
          message: error.message,
        });
      });

      socket.on('chat:message', (message: ChatMessage) => {
        if (message.senderId === user?.id) return;
        setUnreadCount((current) => current + 1);
        chatNotificationService.showIncomingMessage(message).catch((error) => {
          console.log('CHAT NOTIFICATION ERROR:', error);
        });
      });

      socket.on('chat:read', loadUnreadCount);
    });

    return () => {
      mounted = false;
      socket?.disconnect();
    };
  }, [loadUnreadCount]);

  return {
    unreadCount,
    loadUnreadCount,
  };
};
