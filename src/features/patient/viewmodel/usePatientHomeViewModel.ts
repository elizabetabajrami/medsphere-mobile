import { useCallback, useState } from 'react';
import type { Appointment } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';
import { getUser } from '../../../storage/tokenStorage';

type NextAppointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
};

type AppointmentResponse = Appointment & {
  _id?: string;
  doctorName?: string;
  specialty?: string;
  time?: string;
  doctor?: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
  };
};

const formatStatus = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
};

const isUpcomingAppointment = (appointment: AppointmentResponse) => {
  const status = appointment.status.toLowerCase();
  return status !== 'cancelled' && status !== 'completed';
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

const formatAppointmentDate = (dateValue: string) => {
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

const formatAppointmentTime = (dateValue: string, time?: string) => {
  if (time) {
    return time;
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

const mapAppointment = (appointment: AppointmentResponse): NextAppointment => ({
  id: appointment.id || appointment._id || appointment.date,
  doctorName: getDoctorName(appointment),
  specialty: appointment.specialty || appointment.doctor?.specialty || 'Healthcare visit',
  date: formatAppointmentDate(appointment.date),
  time: formatAppointmentTime(appointment.date, appointment.time),
  status: formatStatus(appointment.status),
});

export const usePatientHomeViewModel = () => {
  const [patientName, setPatientName] = useState('Patient');
  const [nextAppointment, setNextAppointment] = useState<NextAppointment | null>(null);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);

  const loadHome = useCallback(async () => {
    const user = await getUser();
    const firstName = user?.firstName?.trim();
    const lastName = user?.lastName?.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    if (fullName) {
      setPatientName(fullName);
    } else if (user?.name?.trim()) {
      setPatientName(user.name.trim());
    }

    if (!user?.id) {
      setIsLoadingAppointment(false);
      return;
    }

    try {
      setIsLoadingAppointment(true);
      const appointments = await appointmentService.getPatientAppointments(user.id);
      const upcomingAppointment = appointments
        .filter(isUpcomingAppointment)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

      setNextAppointment(upcomingAppointment ? mapAppointment(upcomingAppointment) : null);
    } catch {
      setNextAppointment(null);
    } finally {
      setIsLoadingAppointment(false);
    }
  }, []);

  const [quickActions] = useState([
    'Book Appointment',
    'Find Doctors',
    'My Appointments',
    'Profile',
  ]);

  return {
    patientName,
    nextAppointment,
    isLoadingAppointment,
    quickActions,
    loadHome,
  };
};
