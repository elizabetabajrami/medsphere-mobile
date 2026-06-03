export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type Appointment = {
  id: string;
  _id?: string;
  patientId: string;
  doctorId: string;
  date: string;
  appointmentDate?: string;
  scheduledAt?: string;
  start?: string;
  startTime?: string;
  reason: string;
  status: AppointmentStatus;
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
