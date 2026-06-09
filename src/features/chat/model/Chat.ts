export type ChatParticipantRole = 'patient' | 'doctor' | 'receptionist' | 'staff';

export type ChatParticipant =
  | string
  | {
      id?: string;
      userId?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
      roles?: string[];
    };

export type ChatMessageType = 'text' | 'file' | 'image';

export type ChatMessagePreview = {
  id: string;
  senderId: string;
  content: string;
  type: ChatMessageType;
  fileUrl: string | null;
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  participants: ChatParticipant[];
  type: 'direct';
  lastMessageAt: string | null;
  lastMessage: ChatMessagePreview | null;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: ChatMessageType;
  fileUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type ChatMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ChatRoomsResponse = {
  data: ChatRoom[];
  meta: ChatMeta;
};

export type ChatMessagesResponse = {
  data: ChatMessage[];
  meta: ChatMeta;
};

export type ChatContact = {
  id: string;
  name: string;
  role: ChatParticipantRole;
  subtitle?: string;
};

export type ChatImageUpload = {
  fileName: string;
  mimeType?: string;
  contentBase64: string;
};
