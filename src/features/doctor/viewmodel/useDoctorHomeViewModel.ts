import { useCallback, useMemo, useState } from 'react';
import { getUser } from '../../../storage/tokenStorage';
import type { Appointment } from '../../appointments/model/Appointment';
import { appointmentService } from '../../appointments/service/appointmentService';
import { doctorService } from '../service/doctorService';
import { isTodayAppointment } from '../utils/appointmentFormatters';

const getDisplayName = (user?: {
  name?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const fullName = [user?.firstName?.trim(), user?.lastName?.trim()].filter(Boolean).join(' ');

  return fullName || user?.name || 'Doctor';
};

export const useDoctorHomeViewModel = () => {
  const [doctorName, setDoctorName] = useState('Doctor');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHome = useCallback(async () => {
    setError(null);

    try {
      setIsLoading(true);

      const [profileResult, appointmentResult] = await Promise.allSettled([
        doctorService.getMyProfile(),
        appointmentService.getDoctorAppointments(''),
      ]);

      if (profileResult.status === 'fulfilled') {
        setDoctorName(getDisplayName(profileResult.value));
      } else {
        const storedUser = await getUser();
        setDoctorName(getDisplayName(storedUser || undefined));
      }

      if (appointmentResult.status === 'fulfilled') {
        setAppointments(appointmentResult.value);
      } else {
        setError('Unable to load today appointments.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const todayAppointments = useMemo(
    () => appointments.filter(isTodayAppointment),
    [appointments],
  );

  return {
    welcomeMessage: `Welcome, Dr. ${doctorName}`,
    doctorName,
    todayAppointments,
    isLoading,
    error,
    loadHome,
  };
};
