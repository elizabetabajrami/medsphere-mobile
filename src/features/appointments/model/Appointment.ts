export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
};

export type BookAppointmentPayload = {
  patientId: string;
  doctorId: string;
  date: string;
  reason: string;
};

export type PatientAppointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Confirmed';
};
