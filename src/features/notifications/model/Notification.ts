export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
};

export type NotificationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  unreadCount: number;
};

export type NotificationsResponse = {
  data: NotificationItem[];
  meta: NotificationMeta;
};
