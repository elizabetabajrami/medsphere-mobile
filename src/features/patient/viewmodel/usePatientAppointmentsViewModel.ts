import { useCallback, useState } from 'react';
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

const formatStatus = (status?: string) => {
  if (!status) {
    return 'Pending';
  }

  const normalizedStatus = status.toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};

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

const mapAppointment = (appointment: AppointmentResponse): PatientAppointment => ({
  id: appointment.id || appointment._id || getAppointmentDate(appointment) || `${Date.now()}`,
  doctorId: appointment.doctorId || appointment.doctor?.id || appointment.doctor?._id || '',
  doctorName: getDoctorName(appointment),
  specialty: appointment.specialty || appointment.doctor?.specialty || 'Healthcare visit',
  date: formatDate(getAppointmentDate(appointment)),
  time: formatTime(getAppointmentDate(appointment), appointment.time || appointment.startTime),
  status: formatStatus(appointment.status),
  location: appointment.location,
  type: appointment.type,
  notes: appointment.notes || appointment.reason,
});

export const usePatientAppointmentsViewModel = () => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
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
      setAppointments(result.map(mapAppointment));
    } catch {
      setAppointments([]);
      setError('Unable to load appointments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
  };
};
