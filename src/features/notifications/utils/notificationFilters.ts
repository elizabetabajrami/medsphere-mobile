type NotificationLike = {
  type?: string | null;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  data?: Record<string, unknown> | null;
};

const normalize = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

export const isAppointmentBookedNotification = (notification: NotificationLike) => {
  const type = normalize(notification.type ?? notification.data?.type);
  const title = normalize(notification.title);
  const message = normalize(notification.message ?? notification.body);

  return (
    title === 'appointment booked' ||
    message.startsWith('appointment booked:') ||
    (type.includes('appointment') && type.includes('book'))
  );
};

export const isChatMessageNotification = (notification: NotificationLike) => {
  const type = normalize(notification.type ?? notification.data?.type);
  const title = normalize(notification.title);

  return type === 'chat.message.created' || type === 'chat_message' || title === 'new chat message';
};

export const getVisibleNotifications = <T extends NotificationLike>(notifications: T[]) =>
  notifications.filter(
    (notification) =>
      !isAppointmentBookedNotification(notification) &&
      !isChatMessageNotification(notification),
  );

export const getVisibleUnreadCount = (notifications: NotificationLike[]) =>
  getVisibleNotifications(notifications).filter((notification) => {
    const maybeRead = notification as { isRead?: boolean };
    return maybeRead.isRead === false;
  }).length;
