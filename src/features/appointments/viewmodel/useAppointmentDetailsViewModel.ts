import type { PatientAppointment } from '../model/Appointment';

export const useAppointmentDetailsViewModel = (appointment: PatientAppointment) => {
  const details = {
    location: appointment.location || 'Location pending',
    type: appointment.type || 'Healthcare visit',
    notes: appointment.notes || 'No notes added.',
  };

  return {
    appointment,
    details,
  };
};
