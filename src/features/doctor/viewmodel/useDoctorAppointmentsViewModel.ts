import { useState } from 'react';
import type { Appointment } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';

export const useDoctorAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async (doctorId: string) => {
    setError(null);

    try {
      setIsLoading(true);
      const result = await appointmentService.getDoctorAppointments(doctorId);
      setAppointments(result);
    } catch {
      setError('Unable to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
  };
};
