import type { Appointment, AppointmentStatus } from '../../appointments/model/Appointment';

export const getAppointmentId = (appointment: Appointment) => appointment.id || appointment._id || '';

export const getAppointmentDateTime = (appointment: Appointment) => {
  const value =
    appointment.scheduledAt ||
    appointment.date ||
    appointment.appointmentDate ||
    appointment.start ||
    appointment.startTime;

  return value ? new Date(value) : null;
};

export const isTodayAppointment = (appointment: Appointment) => {
  const appointmentDate = getAppointmentDateTime(appointment);

  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    appointmentDate.getFullYear() === today.getFullYear() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getDate() === today.getDate()
  );
};

export const isUpcomingAppointment = (appointment: Appointment) => {
  const appointmentDate = getAppointmentDateTime(appointment);

  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return false;
  }

  return appointmentDate.getTime() > Date.now() && !isFinalStatus(appointment.status);
};

export const formatAppointmentDate = (appointment: Appointment) => {
  const appointmentDate = getAppointmentDateTime(appointment);

  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return 'Date unavailable';
  }

  return appointmentDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatAppointmentTime = (appointment: Appointment) => {
  const appointmentDate = getAppointmentDateTime(appointment);

  if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
    return appointment.startTime || 'Time unavailable';
  }

  return appointmentDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusKey = (status: AppointmentStatus | string) =>
  status.toString().trim().toUpperCase().replace(/[\s-]+/g, '_');

export const formatStatus = (status: AppointmentStatus | string) =>
  getStatusKey(status)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const isFinalStatus = (status: AppointmentStatus | string) => {
  const key = getStatusKey(status);
  return key === 'COMPLETED' || key === 'CANCELLED' || key === 'NO_SHOW';
};

export const getPatientName = (appointment: Appointment) => {
  const patient = appointment.patient;
  const fullName = [patient?.firstName, patient?.lastName].filter(Boolean).join(' ');

  return patient?.name || fullName || 'Patient';
};

export const getServiceName = (appointment: Appointment) =>
  appointment.service?.name || appointment.department?.name || 'Not provided';
