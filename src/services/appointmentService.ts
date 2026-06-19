import { coreApiClient } from '../network/apiClient';
import { endpoints } from '../network/endpoints';
import type {
  Appointment,
  AppointmentStatus,
  AvailableSlot,
  BookAppointmentPayload,
  RescheduleAppointmentPayload,
  SlotAvailability,
} from '../features/appointments/model/Appointment';

type AvailableSlotsResponse =
  | AvailableSlot[]
  | {
      availableSlots?: AvailableSlot[];
      occupiedSlots?: AvailableSlot[];
      slots?: AvailableSlot[];
      timeSlots?: AvailableSlot[];
      data?:
        | AvailableSlot[]
        | {
            availableSlots?: AvailableSlot[];
            occupiedSlots?: AvailableSlot[];
            slots?: AvailableSlot[];
          };
    };

type AppointmentListResponse =
  | Appointment[]
  | {
      appointments?: Appointment[];
      items?: Appointment[];
      results?: Appointment[];
      data?:
        | Appointment[]
        | {
            appointments?: Appointment[];
            items?: Appointment[];
            results?: Appointment[];
          };
    };

export type AppointmentStatusAction = 'complete' | 'cancel' | 'no-show';

const normalizeSlotList = (
  payload: AvailableSlotsResponse,
  preferredKey: 'availableSlots' | 'occupiedSlots',
): AvailableSlot[] => {
  if (Array.isArray(payload)) {
    return preferredKey === 'availableSlots' ? payload : [];
  }

  if (Array.isArray(payload[preferredKey])) {
    return payload[preferredKey] || [];
  }

  if (preferredKey === 'availableSlots' && Array.isArray(payload.slots)) {
    return payload.slots;
  }

  if (preferredKey === 'availableSlots' && Array.isArray(payload.timeSlots)) {
    return payload.timeSlots;
  }

  const data = payload.data;

  if (preferredKey === 'availableSlots' && Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (Array.isArray(data[preferredKey])) {
      return data[preferredKey] || [];
    }

    if (preferredKey === 'availableSlots' && Array.isArray(data.slots)) {
      return data.slots;
    }
  }

  return [];
};

const normalizeSlotAvailability = (payload: AvailableSlotsResponse): SlotAvailability => ({
  availableSlots: normalizeSlotList(payload, 'availableSlots'),
  occupiedSlots: normalizeSlotList(payload, 'occupiedSlots'),
});

const normalizeAppointments = (payload: AppointmentListResponse): Appointment[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.appointments)) {
    return payload.appointments;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && typeof payload.data === 'object') {
    if (Array.isArray(payload.data.appointments)) {
      return payload.data.appointments;
    }

    if (Array.isArray(payload.data.items)) {
      return payload.data.items;
    }

    if (Array.isArray(payload.data.results)) {
      return payload.data.results;
    }
  }

  return [];
};

export const appointmentService = {
  async bookAppointment(payload: BookAppointmentPayload): Promise<Appointment> {
    const { date, ...rest } = payload;
    const response = await coreApiClient.post<Appointment>(endpoints.appointments.book, {
      ...rest,
      scheduledAt: date,
    });
    return response.data;
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<SlotAvailability> {
    const response = await coreApiClient.get<AvailableSlotsResponse>(
      endpoints.doctors.availableSlots(doctorId, date),
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: {
          refresh: Date.now(),
        },
      },
    );
    return normalizeSlotAvailability(response.data);
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const response = await coreApiClient.get<AppointmentListResponse>(
      endpoints.appointments.patientMine,
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: {
          refresh: Date.now(),
        },
      },
    );
    return normalizeAppointments(response.data);
  },

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const response = await coreApiClient.get<AppointmentListResponse>(
      doctorId ? endpoints.doctors.appointments(doctorId) : endpoints.appointments.doctorMine,
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
        params: {
          refresh: Date.now(),
        },
      },
    );
    return normalizeAppointments(response.data);
  },

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const response = await coreApiClient.patch<Appointment>(
      endpoints.appointments.updateStatus(appointmentId),
      { status },
    );
    return response.data;
  },

  async updateAppointmentStatusAction(
    appointmentId: string,
    action: AppointmentStatusAction,
    reason?: string,
  ): Promise<Appointment> {
    const response = await coreApiClient.patch<Appointment>(
      endpoints.appointments.updateStatus(appointmentId),
      {
        action,
        ...(reason ? { reason } : {}),
      },
    );
    return response.data;
  },

  async rescheduleAppointment(
    appointmentId: string,
    payload: RescheduleAppointmentPayload,
  ): Promise<Appointment> {
    const { date, ...rest } = payload;
    const response = await coreApiClient.patch<Appointment>(
      endpoints.appointments.reschedule(appointmentId),
      {
        ...rest,
        scheduledAt: date,
      },
    );
    return response.data;
  },
};
