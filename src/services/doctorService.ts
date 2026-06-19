import { apiClient, coreApiClient } from '../network/apiClient';
import { endpoints } from '../network/endpoints';
import type { Appointment } from '../features/appointments/model/Appointment';
import type { Doctor } from '../features/doctor/model/Doctor';

type DoctorProfileResponse = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
};

export type StaffProfileResponse = {
  id: string;
  userId: string;
  specialization?: string;
  departments?: {
    isPrimary?: boolean;
    department?: {
      id: string;
      name: string;
      isActive?: boolean;
    };
  }[];
};

export const doctorService = {
  async getDoctor(doctorId: string): Promise<Doctor> {
    const response = await apiClient.get<Doctor>(endpoints.doctors.byId(doctorId));
    return response.data;
  },

  async getMyProfile(): Promise<DoctorProfileResponse> {
    const response = await apiClient.get<DoctorProfileResponse>(endpoints.patients.me);
    return response.data;
  },

  async getMyStaffProfile(): Promise<StaffProfileResponse> {
    const response = await coreApiClient.get<StaffProfileResponse>(endpoints.doctors.me, {
      headers: {
        'Cache-Control': 'no-cache',
      },
      params: {
        refresh: Date.now(),
      },
    });
    return response.data;
  },

  async getAppointmentDetails(appointmentId: string): Promise<Appointment> {
    const response = await coreApiClient.get<Appointment>(endpoints.appointments.byId(appointmentId));
    return response.data;
  },
};
