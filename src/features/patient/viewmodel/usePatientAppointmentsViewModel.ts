import { useCallback, useMemo, useState } from 'react';
import type { Appointment, PatientAppointment } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';
import { getUser } from '../../../storage/tokenStorage';

type AppointmentResponse = Appointment & {
  _id?: string;
  doctorId?: string;
  appointmentDate?: string;
  scheduledAt?: string;
  start?: string;
  startTime?: string;
  doctorName?: string;
  specialty?: string;
  time?: string;
  location?: string;
  type?: string;
  notes?: string;
  doctor?: {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
  };
};

export type PatientAppointmentFilter = 'scheduled' | 'completed';

const ACTIVE_STATUSES = new Set(['PENDING', 'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS']);

const getStatusKey = (status?: string) => status?.trim().toUpperCase() || '';

const getDoctorName = (appointment: AppointmentResponse) => {
  if (appointment.doctorName) {
    return appointment.doctorName;
  }

  if (appointment.doctor?.name) {
    return appointment.doctor.name;
  }

  if (appointment.doctor?.fullName) {
    return appointment.doctor.fullName;
  }

  const fullName = [appointment.doctor?.firstName, appointment.doctor?.lastName]
    .filter(Boolean)
    .join(' ');

  return fullName || 'Doctor';
};

const formatDate = (dateValue?: string) => {
  if (!dateValue) {
    return 'Date pending';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateValue?: string, time?: string) => {
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);

    if (Number.isInteger(hours) && Number.isInteger(minutes)) {
      return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    return time;
  }

  if (!dateValue) {
    return 'Time pending';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Time pending';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getAppointmentDate = (appointment: AppointmentResponse) =>
  appointment.date || appointment.appointmentDate || appointment.scheduledAt || appointment.start;

const isFutureAppointment = (appointment: AppointmentResponse) => {
  const endDate = appointment.endAt ? new Date(appointment.endAt) : null;
  const startDate = new Date(getAppointmentDate(appointment) || '');

  if (endDate && !Number.isNaN(endDate.getTime())) {
    return endDate.getTime() > Date.now();
  }

  if (Number.isNaN(startDate.getTime())) {
    return false;
  }

  return startDate.getTime() + 30 * 60 * 1000 > Date.now();
};

const isVisiblePatientAppointment = (appointment: AppointmentResponse) => {
  const status = getStatusKey(appointment.status);
  return status === 'COMPLETED' || (ACTIVE_STATUSES.has(status) && isFutureAppointment(appointment));
};

const mapAppointment = (appointment: AppointmentResponse): PatientAppointment => ({
  id: appointment.id || appointment._id || getAppointmentDate(appointment) || `${Date.now()}`,
  doctorId: appointment.doctorId || appointment.doctor?.id || appointment.doctor?._id || '',
  staffProfileId: appointment.staffProfileId,
  doctorName: getDoctorName(appointment),
  specialty: appointment.specialty || appointment.doctor?.specialty || 'Healthcare visit',
  date: formatDate(getAppointmentDate(appointment)),
  time: formatTime(getAppointmentDate(appointment), appointment.time || appointment.startTime),
  status: getStatusKey(appointment.status) === 'COMPLETED' ? 'Completed' : 'Scheduled',
  location: appointment.location,
  type: appointment.type,
  notes: appointment.notes || appointment.reason,
});

export const usePatientAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<PatientAppointmentFilter>('scheduled');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    const user = await getUser();

    if (!user?.id) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await appointmentService.getPatientAppointments(user.id);
      setAppointments(
        result
          .filter(isVisiblePatientAppointment)
          .map(mapAppointment),
      );
    } catch {
      setAppointments([]);
      setError('Unable to load appointments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredAppointments = useMemo(
    () => appointments.filter(
      (appointment) => appointment.status.toLowerCase() === selectedFilter,
    ),
    [appointments, selectedFilter],
  );

  return {
    appointments,
    filteredAppointments,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    error,
    loadAppointments,
  };
};
