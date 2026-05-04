import type { PatientAppointment } from '../model/Appointment';

export const useAppointmentDetailsViewModel = (appointment: PatientAppointment) => {
  const details = {
    location: 'MedSphere Clinic',
    type: 'In-person visit',
    notes: 'Please arrive 10 minutes early.',
  };

  return {
    appointment,
    details,
  };
};
