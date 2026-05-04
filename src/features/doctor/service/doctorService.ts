import { apiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { Appointment } from '../../appointments/model/Appointment';
import type { Doctor } from '../model/Doctor';

export const doctorService = {
  async getDoctor(doctorId: string): Promise<Doctor> {
    const response = await apiClient.get<Doctor>(endpoints.doctors.byId(doctorId));
    return response.data;
  },

  async getAppointmentDetails(appointmentId: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(endpoints.appointments.byId(appointmentId));
    return response.data;
  },
};
