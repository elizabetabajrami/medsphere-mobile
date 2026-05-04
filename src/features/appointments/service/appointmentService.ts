import { apiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { Appointment, AppointmentStatus, BookAppointmentPayload } from '../model/Appointment';

export const appointmentService = {
  async bookAppointment(payload: BookAppointmentPayload): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(endpoints.appointments.book, payload);
    return response.data;
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(endpoints.patients.appointments(patientId));
    return response.data;
  },

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(endpoints.doctors.appointments(doctorId));
    return response.data;
  },

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(
      endpoints.appointments.updateStatus(appointmentId),
      { status },
    );
    return response.data;
  },
};
