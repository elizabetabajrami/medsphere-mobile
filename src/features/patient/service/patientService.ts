import { apiClient, coreApiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { Patient, PatientDoctor } from '../model/Patient';

type DoctorResponse = {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
  specialization?: string;
  rating?: string | number;
  reviews?: string | number;
};

type DoctorsResponse = {
  items?: DoctorResponse[];
};

type CreatePatientPayload = {
  firstName: string;
  lastName: string;
  email: string;
};

const getDoctorName = (doctor: DoctorResponse) => {
  if (doctor.name) {
    return doctor.name;
  }

  if (doctor.fullName) {
    return doctor.fullName;
  }

  const fullName = [doctor.firstName, doctor.lastName].filter(Boolean).join(' ');
  return fullName || 'Doctor';
};

const getDoctorReviews = (reviews?: string | number) => {
  if (typeof reviews === 'number') {
    return `${reviews} reviews`;
  }

  return reviews || '120 reviews';
};

export const patientService = {
  async createPatientProfile(payload: CreatePatientPayload): Promise<Patient> {
    const response = await coreApiClient.post<Patient>(endpoints.patients.create, payload);
    return response.data;
  },

  async getPatient(patientId: string): Promise<Patient> {
    const response = await apiClient.get<Patient>(endpoints.patients.byId(patientId));
    return response.data;
  },

  async getDoctors(): Promise<PatientDoctor[]> {
    const response = await coreApiClient.get<DoctorsResponse | DoctorResponse[]>(
      endpoints.doctors.list,
    );
    const doctors = Array.isArray(response.data) ? response.data : response.data.items || [];

    return doctors.map((doctor) => ({
      id: doctor.id || doctor._id || doctor.userId || getDoctorName(doctor),
      name: getDoctorName(doctor),
      specialty: doctor.specialty || doctor.specialization || 'Doctor',
      rating: String(doctor.rating || '4.8'),
      reviews: getDoctorReviews(doctor.reviews),
    }));
  },
};
