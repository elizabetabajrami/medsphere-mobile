import { useCallback, useState } from 'react';
import type { Appointment } from '../../appointments/model/Appointment';
import {
  appointmentService,
  AppointmentStatusAction,
} from '../../../services/appointmentService';
import { doctorService } from '../../../services/doctorService';

export const useDoctorAppointmentDetailsViewModel = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointment = useCallback(async (appointmentId: string) => {
    setError(null);

    try {
      setIsLoading(true);
      const result = await doctorService.getAppointmentDetails(appointmentId);
      setAppointment(result);
    } catch {
      setError('Unable to load appointment details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (
    appointmentId: string,
    action: AppointmentStatusAction,
    reason?: string,
  ) => {
    setError(null);

    try {
      setIsUpdating(true);
      const result = await appointmentService.updateAppointmentStatusAction(
        appointmentId,
        action,
        reason,
      );
      setAppointment(result);
      return true;
    } catch {
      setError('Unable to update appointment status.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    appointment,
    isLoading,
    isUpdating,
    error,
    loadAppointment,
    updateStatus,
  };
};
