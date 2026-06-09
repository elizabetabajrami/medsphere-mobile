import { apiClient, coreApiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { Patient, PatientDoctor } from '../model/Patient';

type UserProfileResponse = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  personalNumber?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
  role?: string;
};

type UpdateUserProfilePayload = {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
};

type DoctorResponse = {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  displayName?: string;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
  specialization?: string;
  employmentStatus?: string;
  status?: string;
  isPublicProfile?: boolean;
  staffPositionType?: {
    name?: string;
    defaultRoleKey?: string;
  };
  positionType?: {
    name?: string;
    defaultRoleKey?: string;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
  departments?: {
    id?: string;
    name?: string;
    isActive?: boolean;
    isPrimary?: boolean;
    unassignedAt?: string | null;
    department?: {
      id?: string;
      name?: string;
      isActive?: boolean;
    };
  }[];
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
  personalNumber: string;
};

const getDoctorName = (doctor: DoctorResponse) => {
  if (doctor.name) {
    return doctor.name;
  }

  if (doctor.fullName) {
    return doctor.fullName;
  }

  if (doctor.displayName) {
    return doctor.displayName;
  }

  if (doctor.employeeCode) {
    return doctor.employeeCode;
  }

  if (doctor.user?.name) {
    return doctor.user.name;
  }

  if (doctor.user?.fullName) {
    return doctor.user.fullName;
  }

  const userFullName = [doctor.user?.firstName, doctor.user?.lastName].filter(Boolean).join(' ');
  if (userFullName) {
    return userFullName;
  }

  const fullName = [doctor.firstName, doctor.lastName].filter(Boolean).join(' ');
  return fullName || 'Doctor';
};

const getDoctorReviews = (reviews?: string | number) => {
  if (typeof reviews === 'number') {
    return String(reviews);
  }

  return reviews?.replace(/\s*reviews?$/i, '') || '120';
};

const normalizeRoleKey = (value?: string) =>
  value?.trim().toLowerCase().replace(/[\s_-]+/g, '') || '';

const isDoctorStaffProfile = (doctor: DoctorResponse) => {
  const positionType = doctor.staffPositionType || doctor.positionType;
  const roleKey = normalizeRoleKey(positionType?.defaultRoleKey);
  const positionName = normalizeRoleKey(positionType?.name);

  return !positionType || roleKey === 'doctor' || positionName === 'doctor';
};

const isActivePublicProfile = (doctor: DoctorResponse) => {
  const status = (doctor.employmentStatus || doctor.status || 'ACTIVE').toUpperCase();

  return status === 'ACTIVE' && doctor.isPublicProfile !== false;
};

const getActiveDepartments = (doctor: DoctorResponse) =>
  (doctor.departments || []).filter((assignment) => {
    const department = assignment.department;
    const isAssigned = assignment.unassignedAt === undefined || assignment.unassignedAt === null;
    const isActive = assignment.isActive !== false && department?.isActive !== false;

    return isAssigned && isActive;
  });

const getPrimaryDepartmentName = (doctor: DoctorResponse) => {
  const departments = getActiveDepartments(doctor);
  const primary = departments.find((assignment) => assignment.isPrimary) || departments[0];

  return primary?.name || primary?.department?.name;
};

const getDoctorSpecialty = (doctor: DoctorResponse) =>
  doctor.specialty || doctor.specialization || getPrimaryDepartmentName(doctor) || 'Doctor';

const isVisibleDoctor = (doctor: DoctorResponse) =>
  isDoctorStaffProfile(doctor) && isActivePublicProfile(doctor) && getActiveDepartments(doctor).length > 0;

const getDoctorId = (doctor: DoctorResponse) =>
  doctor.id || doctor._id || doctor.userId || getDoctorName(doctor);

const getStaffProfileId = (doctor: DoctorResponse) => doctor.id || doctor._id;

const sortDoctorsByName = (doctors: PatientDoctor[]) =>
  [...doctors].sort((first, second) => first.name.localeCompare(second.name));

export const patientService = {
  async getMyProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>(endpoints.patients.me);
    return response.data;
  },

  async updateMyProfile(payload: UpdateUserProfilePayload): Promise<UserProfileResponse> {
    const response = await apiClient.patch<UserProfileResponse>(endpoints.patients.me, payload);
    return response.data;
  },

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

    return sortDoctorsByName(doctors.filter(isVisibleDoctor).map((doctor) => ({
      id: getDoctorId(doctor),
      staffProfileId: getStaffProfileId(doctor),
      userId: doctor.userId,
      name: getDoctorName(doctor),
      specialty: getDoctorSpecialty(doctor),
      department: getPrimaryDepartmentName(doctor),
      rating: String(doctor.rating || '4.8'),
      reviews: getDoctorReviews(doctor.reviews),
    })));
  },
};
