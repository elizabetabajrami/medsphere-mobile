import { coreApiClient, notificationApiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import { patientService } from '../../patient/service/patientService';
import type {
  ChatContact,
  ChatImageUpload,
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomsResponse,
  ChatRoom,
} from '../model/Chat';

type Envelope<T> = {
  data?: T;
  items?: T;
  meta?: Partial<ChatRoomsResponse['meta']>;
  total?: number;
  totalItems?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

type PatientRecord = {
  id: string;
  userId?: string | null;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string | null;
};

const getMeta = (value: Envelope<unknown>, fallbackLength: number) => {
  const meta = value.meta ?? {};
  const page = meta.page ?? value.page ?? 1;
  const limit = meta.limit ?? value.limit ?? fallbackLength;
  const totalItems = meta.totalItems ?? value.totalItems ?? value.total ?? fallbackLength;
  const totalPages = meta.totalPages ?? value.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(limit, 1)));

  return { page, limit, totalItems, totalPages };
};

const paginated = <T>(value: unknown) => {
  const envelope = value as Envelope<T[] | { data?: T[]; items?: T[]; meta?: Partial<ChatRoomsResponse['meta']> }>;
  const nested = envelope.data && !Array.isArray(envelope.data) ? envelope.data : null;
  const data =
    (Array.isArray(envelope.data) && envelope.data) ||
    (Array.isArray(envelope.items) && envelope.items) ||
    (nested && Array.isArray(nested.data) && nested.data) ||
    (nested && Array.isArray(nested.items) && nested.items) ||
    [];
  const metaSource = nested?.meta ? { ...envelope, meta: nested.meta } : envelope;

  return {
    data,
    meta: getMeta(metaSource, data.length),
  };
};

const item = <T>(value: unknown): T => {
  const envelope = value as Envelope<T>;
  return (envelope.data ?? value) as T;
};

const displayName = (parts: (string | null | undefined)[], fallback: string) =>
  parts.filter(Boolean).join(' ').trim() || fallback;

export const chatService = {
  async getRooms(): Promise<ChatRoomsResponse> {
    const response = await notificationApiClient.get<unknown>(endpoints.chat.rooms, {
      params: { page: 1, limit: 50 },
    });
    return paginated<ChatRoom>(response.data);
  },

  async getMessages(roomId: string): Promise<ChatMessagesResponse> {
    const response = await notificationApiClient.get<unknown>(endpoints.chat.messages(roomId), {
      params: { page: 1, limit: 50 },
    });
    return paginated<ChatMessage>(response.data);
  },

  async createRoom(contact: ChatContact): Promise<ChatRoom> {
    const response = await notificationApiClient.post<unknown>(endpoints.chat.rooms, {
      participantId: contact.id,
      participantRole: contact.role,
    });
    return item<ChatRoom>(response.data);
  },

  async sendMessage(roomId: string, content: string): Promise<ChatMessage> {
    const response = await notificationApiClient.post<unknown>(endpoints.chat.messages(roomId), {
      content,
      type: 'text',
      fileUrl: null,
    });
    return item<ChatMessage>(response.data);
  },

  async sendImage(roomId: string, upload: ChatImageUpload): Promise<ChatMessage> {
    const uploadResponse = await notificationApiClient.post<unknown>(
      endpoints.chat.upload(roomId),
      upload,
    );
    const attachment = item<{ fileName: string; fileUrl: string }>(uploadResponse.data);

    const messageResponse = await notificationApiClient.post<unknown>(endpoints.chat.messages(roomId), {
      content: attachment.fileName || 'Photo',
      type: 'image',
      fileUrl: attachment.fileUrl,
    });

    return item<ChatMessage>(messageResponse.data);
  },

  async markRead(roomId: string): Promise<void> {
    await notificationApiClient.patch(endpoints.chat.markRead(roomId));
  },

  async getPatientContacts(): Promise<ChatContact[]> {
    const doctors = await patientService.getDoctors();

    return doctors
      .filter((doctor) => doctor.userId)
      .map((doctor) => ({
        id: doctor.userId!,
        name: doctor.name,
        role: 'doctor',
        subtitle: doctor.department || doctor.specialty,
      }));
  },

  async getDoctorContacts(): Promise<ChatContact[]> {
    const response = await coreApiClient.get<{ items?: PatientRecord[] } | PatientRecord[]>(
      endpoints.patients.list,
      { params: { page: 1, limit: 50 } },
    );
    const patients = Array.isArray(response.data) ? response.data : response.data.items || [];

    return patients
      .filter((patient) => patient.userId)
      .map((patient) => ({
        id: patient.userId!,
        name: patient.name || displayName([patient.firstName, patient.lastName], patient.email || 'Patient'),
        role: 'patient',
        subtitle: patient.email || undefined,
      }));
  },
};
