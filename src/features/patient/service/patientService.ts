import { apiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { Patient } from '../model/Patient';

export const patientService = {
  async getPatient(patientId: string): Promise<Patient> {
    const response = await apiClient.get<Patient>(endpoints.patients.byId(patientId));
    return response.data;
  },
};
