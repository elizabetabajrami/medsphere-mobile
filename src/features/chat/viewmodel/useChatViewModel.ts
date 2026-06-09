import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { notificationSocketUrl } from '../../../network/apiClient';
import { getToken, getUser } from '../../../storage/tokenStorage';
import type { UserRole } from '../../auth/model/AuthTypes';
import type { ChatContact, ChatImageUpload, ChatMessage, ChatRoom } from '../model/Chat';
import { chatService } from '../service/chatService';

type UseChatViewModelParams = {
  role: UserRole;
};

const participantId = (participant: ChatRoom['participants'][number]) =>
  typeof participant === 'string' ? participant : participant.userId || participant.id || '';

const participantName = (participant: ChatRoom['participants'][number]) => {
  if (typeof participant === 'string') return 'Conversation';

  return (
    participant.name ||
    [participant.firstName, participant.lastName].filter(Boolean).join(' ').trim() ||
    participant.email ||
    'Conversation'
  );
};

const sortRooms = (rooms: ChatRoom[]) =>
  [...rooms].sort((left, right) => {
    const rightDate = new Date(right.lastMessageAt || right.createdAt).getTime();
    const leftDate = new Date(left.lastMessageAt || left.createdAt).getTime();
    return rightDate - leftDate;
  });

export const useChatViewModel = ({ role }: UseChatViewModelParams) => {
  const socketRef = useRef<Socket | null>(null);
  const activeRoomIdRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await chatService.getRooms();
      const nextRooms = sortRooms(result.data);
      setRooms(nextRooms);
      setActiveRoomId((current) => current ?? nextRooms[0]?.id ?? null);
    } catch {
      setError('Unable to load conversations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      const result = role === 'doctor'
        ? await chatService.getDoctorContacts()
        : await chatService.getPatientContacts();
      setContacts(result);
    } catch {
      setContacts([]);
    }
  }, [role]);

  const loadMessages = useCallback(async (roomId: string) => {
    setError(null);
    setIsMessagesLoading(true);

    try {
      const result = await chatService.getMessages(roomId);
      setMessages(result.data);
      await chatService.markRead(roomId);
      setRooms((current) =>
        current.map((room) => (room.id === roomId ? { ...room, unreadCount: 0 } : room)),
      );
    } catch {
      setError('Unable to load messages.');
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser().then((user) => setCurrentUserId(user?.id ?? null));
    loadRooms();
    loadContacts();
  }, [loadContacts, loadRooms]);

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    loadMessages(activeRoomId);
  }, [activeRoomId, loadMessages]);

  useEffect(() => {
    let mounted = true;

    getToken().then((token) => {
      if (!mounted || !token) return;

      const socket = io(notificationSocketUrl, { auth: { token } });
      socketRef.current = socket;

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      socket.on('chat:message', (message: ChatMessage) => {
        const selectedRoomId = activeRoomIdRef.current;
        const selectedUserId = currentUserIdRef.current;

        setMessages((current) => {
          if (message.roomId !== selectedRoomId || current.some((item) => item.id === message.id)) {
            return current;
          }

          return [...current, message];
        });

        setRooms((current) => sortRooms(current.map((room) => {
          if (room.id !== message.roomId) return room;

          const isCurrentRoom = room.id === selectedRoomId;
          const isOwnMessage = message.senderId === selectedUserId;

          return {
            ...room,
            lastMessage: {
              id: message.id,
              senderId: message.senderId,
              content: message.content,
              type: message.type,
              fileUrl: message.fileUrl,
              createdAt: message.createdAt,
            },
            lastMessageAt: message.createdAt,
            unreadCount: isCurrentRoom || isOwnMessage ? room.unreadCount : room.unreadCount + 1,
          };
        })));

        if (message.roomId === selectedRoomId && message.senderId !== selectedUserId) {
          chatService.markRead(message.roomId).catch(() => undefined);
        }
      });
    });

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? null,
    [activeRoomId, rooms],
  );

  const activeParticipantId = useMemo(() => {
    const other = activeRoom?.participants.find((participant) => participantId(participant) !== currentUserId);
    return other ? participantId(other) : null;
  }, [activeRoom, currentUserId]);

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeParticipantId) ?? null,
    [activeParticipantId, contacts],
  );

  const roomTitle = useCallback((room: ChatRoom) => {
    const other = room.participants.find((participant) => participantId(participant) !== currentUserId);
    return other ? participantName(other) : 'Conversation';
  }, [currentUserId]);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !activeRoomId) return;

    try {
      setIsSending(true);
      const message = await chatService.sendMessage(activeRoomId, trimmed);
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
    } catch {
      setError('Unable to send message.');
    } finally {
      setIsSending(false);
    }
  }, [activeRoomId]);

  const sendImage = useCallback(async (upload: ChatImageUpload) => {
    if (!activeRoomId) return;

    try {
      setIsUploadingImage(true);
      const message = await chatService.sendImage(activeRoomId, upload);
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
    } catch {
      setError('Unable to upload photo.');
    } finally {
      setIsUploadingImage(false);
    }
  }, [activeRoomId]);

  const startConversation = useCallback(async (contact: ChatContact) => {
    setError(null);

    try {
      const existing = rooms.find((room) =>
        room.participants.some((participant) => participantId(participant) === contact.id),
      );
      const room = existing ?? await chatService.createRoom(contact);

      setRooms((current) => {
        if (current.some((item) => item.id === room.id)) return current;
        return sortRooms([room, ...current]);
      });
      setActiveRoomId(room.id);
    } catch {
      setError('Unable to start conversation.');
    }
  }, [rooms]);

  return {
    activeContact,
    activeParticipantId,
    activeRoom,
    activeRoomId,
    contacts,
    currentUserId,
    error,
    isConnected,
    isLoading,
    isMessagesLoading,
    isSending,
    isUploadingImage,
    messages,
    rooms,
    loadRooms,
    roomTitle,
    sendMessage,
    sendImage,
    setActiveRoomId,
    startConversation,
  };
};
