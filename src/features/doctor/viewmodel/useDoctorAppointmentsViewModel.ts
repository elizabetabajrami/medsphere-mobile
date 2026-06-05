import { useCallback, useMemo, useState } from 'react';
import type { Appointment, AppointmentStatus } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';
import { getStatusKey, isTodayAppointment, isUpcomingAppointment } from '../utils/appointmentFormatters';

export type DoctorAppointmentFilter = 'today' | 'upcoming' | 'completed' | 'cancelled' | 'no-show';

const filterAppointments = (
  appointments: Appointment[],
  filter: DoctorAppointmentFilter,
) => appointments.filter((appointment) => {
  const status = getStatusKey(appointment.status);

  if (filter === 'today') {
    return isTodayAppointment(appointment);
  }

  if (filter === 'upcoming') {
    return isUpcomingAppointment(appointment);
  }

  if (filter === 'completed') {
    return status === 'COMPLETED';
  }

  if (filter === 'cancelled') {
    return status === 'CANCELLED';
  }

  return status === 'NO_SHOW';
});

export const useDoctorAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<DoctorAppointmentFilter>('today');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setError(null);

    try {
      setIsLoading(true);
      const result = await appointmentService.getDoctorAppointments('');
      setAppointments(result);
    } catch {
      setError('Unable to load appointments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (
    appointmentId: string,
    status: AppointmentStatus,
  ) => {
    setError(null);

    try {
      setIsUpdating(true);
      const updated = await appointmentService.updateAppointmentStatus(appointmentId, status);
      setAppointments((current) =>
        current.map((appointment) =>
          (appointment.id || appointment._id) === appointmentId ? updated : appointment,
        ),
      );
      return true;
    } catch {
      setError('Unable to update appointment status.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const filteredAppointments = useMemo(
    () => filterAppointments(appointments, selectedFilter),
    [appointments, selectedFilter],
  );

  return {
    appointments,
    filteredAppointments,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    isUpdating,
    error,
    loadAppointments,
    updateAppointmentStatus,
  };
};
