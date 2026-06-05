export type AppointmentStatus =
  | 'PENDING'
  | 'pending'
  | 'scheduled'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'no_show'
  | 'checked_in'
  | 'in_progress';

export type Appointment = {
  id: string;
  _id?: string;
  patientId: string;
  doctorId: string;
  staffProfileId?: string;
  serviceCatalogId?: string;
  departmentId?: string;
  date: string;
  appointmentDate?: string;
  scheduledAt?: string;
  start?: string;
  startTime?: string;
  endAt?: string;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  patient?: {
    id?: string;
    userId?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  doctor?: {
    id?: string;
    userId?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
    specialization?: string;
  };
  staff?: {
    id?: string;
    userId?: string;
    displayName?: string;
    employeeCode?: string;
    specialization?: string;
  };
  service?: {
    id?: string;
    name?: string;
  };
  department?: {
    id?: string;
    name?: string;
  };
};

export type BookAppointmentPayload = {
  doctorId: string;
  date: string;
  reason: string;
};

export type RescheduleAppointmentPayload = {
  doctorId: string;
  date: string;
};

export type AvailableSlot = {
  start?: string;
  end?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  durationMinutes?: number;
  isAvailable?: boolean;
};

export type PatientAppointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  location?: string;
  type?: string;
  notes?: string;
};
