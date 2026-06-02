import { useState } from 'react';
import type { PatientAppointment } from '../model/Appointment';
import { appointmentService } from '../service/appointmentService';

export const useAppointmentDetailsViewModel = (appointment: PatientAppointment) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const details = {
    location: appointment.location || 'Location pending',
    type: appointment.type || 'Healthcare visit',
    notes: appointment.notes || 'No notes added.',
  };
  const normalizedStatus = appointment.status.toLowerCase();
  const canChangeAppointment = !['cancelled', 'completed'].includes(normalizedStatus);

  const cancelAppointment = async () => {
    if (!canChangeAppointment || isCancelling) {
      return false;
    }

    try {
      setIsCancelling(true);
      setError(null);
      await appointmentService.updateAppointmentStatus(appointment.id, 'CANCELLED');
      return true;
    } catch {
      setError('Unable to cancel appointment.');
      return false;
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    appointment,
    canChangeAppointment,
    cancelAppointment,
    details,
    error,
    isCancelling,
  };
};
