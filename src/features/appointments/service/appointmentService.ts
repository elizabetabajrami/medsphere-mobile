import { coreApiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type {
  Appointment,
  AppointmentStatus,
  AvailableSlot,
  BookAppointmentPayload,
  RescheduleAppointmentPayload,
} from '../model/Appointment';

type AvailableSlotsResponse =
  | AvailableSlot[]
  | {
      availableSlots?: AvailableSlot[];
      slots?: AvailableSlot[];
      timeSlots?: AvailableSlot[];
      data?: AvailableSlot[] | { availableSlots?: AvailableSlot[]; slots?: AvailableSlot[] };
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

const normalizeAvailableSlots = (payload: AvailableSlotsResponse): AvailableSlot[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.availableSlots)) {
    return payload.availableSlots;
  }

  if (Array.isArray(payload.slots)) {
    return payload.slots;
  }

  if (Array.isArray(payload.timeSlots)) {
    return payload.timeSlots;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && typeof payload.data === 'object') {
    if (Array.isArray(payload.data.availableSlots)) {
      return payload.data.availableSlots;
    }

    if (Array.isArray(payload.data.slots)) {
      return payload.data.slots;
    }
  }

  return [];
};

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
    const response = await coreApiClient.post<Appointment>(endpoints.appointments.book, payload);
    return response.data;
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<AvailableSlot[]> {
    const response = await coreApiClient.get<AvailableSlotsResponse>(
      endpoints.doctors.availableSlots(doctorId, date),
    );
    return normalizeAvailableSlots(response.data);
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const response = await coreApiClient.get<AppointmentListResponse>(
      endpoints.appointments.patientMine,
    );
    return normalizeAppointments(response.data);
  },

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const response = await coreApiClient.get<Appointment[]>(endpoints.doctors.appointments(doctorId));
    return response.data;
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

  async rescheduleAppointment(
    appointmentId: string,
    payload: RescheduleAppointmentPayload,
  ): Promise<Appointment> {
    const response = await coreApiClient.patch<Appointment>(
      endpoints.appointments.reschedule(appointmentId),
      payload,
    );
    return response.data;
  },
};
