import { useCallback, useState } from 'react';
import type { Appointment, PatientAppointment } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';
import { chatService } from '../../chat/service/chatService';
import { notificationService } from '../../notifications/service/notificationService';
import { getUser } from '../../../storage/tokenStorage';

type AppointmentResponse = Appointment & {
  _id?: string;
  doctorId?: string;
  doctorName?: string;
  specialty?: string;
  time?: string;
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

const getNextVisitLabel = (appointment?: AppointmentResponse) => {
  if (!appointment?.date) {
    return 'None';
  }

  const visitDate = new Date(appointment.date);

  if (Number.isNaN(visitDate.getTime())) {
    return 'Scheduled';
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfVisit = new Date(
    visitDate.getFullYear(),
    visitDate.getMonth(),
    visitDate.getDate(),
  );
  const dayDifference = Math.round(
    (startOfVisit.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Tomorrow';
  }

  return visitDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const mapAppointment = (appointment: AppointmentResponse): PatientAppointment => ({
  id: appointment.id || appointment._id || appointment.date,
  doctorId: appointment.doctorId || appointment.doctor?.id || appointment.doctor?._id || '',
  staffProfileId: appointment.staffProfileId,
  doctorName: getDoctorName(appointment),
  specialty: appointment.specialty || appointment.doctor?.specialty || 'Healthcare visit',
  date: formatAppointmentDate(appointment.date),
  time: formatAppointmentTime(appointment.date, appointment.time),
  status: formatStatus(appointment.status),
});

export const usePatientHomeViewModel = () => {
  const [patientName, setPatientName] = useState('Patient');
  const [nextAppointment, setNextAppointment] = useState<PatientAppointment | null>(null);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [nextVisitLabel, setNextVisitLabel] = useState('None');

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
      setNextAppointment(null);
      setUnreadMessages(0);
      setUnreadNotifications(0);
      setNextVisitLabel('None');
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
      setNextVisitLabel(getNextVisitLabel(upcomingAppointment));
    } catch {
      setNextAppointment(null);
      setNextVisitLabel('None');
    } finally {
      setIsLoadingAppointment(false);
    }

    const [roomsResult, notificationsResult] = await Promise.allSettled([
      chatService.getRooms(),
      notificationService.getNotifications({ limit: 1 }),
    ]);

    if (roomsResult.status === 'fulfilled') {
      setUnreadMessages(
        roomsResult.value.data.reduce((total, room) => total + room.unreadCount, 0),
      );
    } else {
      setUnreadMessages(0);
    }

    if (notificationsResult.status === 'fulfilled') {
      setUnreadNotifications(notificationsResult.value.meta.unreadCount);
    } else {
      setUnreadNotifications(0);
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
    unreadMessages,
    unreadNotifications,
    nextVisitLabel,
    isLoadingAppointment,
    quickActions,
    loadHome,
  };
};
