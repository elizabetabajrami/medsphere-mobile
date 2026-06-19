import * as Notifications from 'expo-notifications';
import type { ChatMessage } from '../features/chat/model/Chat';

const MAX_PREVIEW_LENGTH = 90;

const getMessagePreview = (message: ChatMessage) => {
  if (message.type === 'image') {
    return 'Sent you a photo';
  }

  if (message.type === 'file') {
    return 'Sent you a file';
  }

  const content = message.content.trim();

  if (!content) {
    return 'Sent you a message';
  }

  return content.length > MAX_PREVIEW_LENGTH
    ? `${content.slice(0, MAX_PREVIEW_LENGTH - 1)}...`
    : content;
};

export const chatNotificationService = {
  async showIncomingMessage(message: ChatMessage): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New chat message',
        body: getMessagePreview(message),
        data: {
          type: 'chat_message',
          roomId: message.roomId,
          messageId: message.id,
        },
        sound: 'default',
      },
      trigger: null,
    });
  },
};
