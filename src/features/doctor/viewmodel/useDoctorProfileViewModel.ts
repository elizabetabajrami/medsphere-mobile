import { useCallback, useEffect, useState } from 'react';
import { clearSession, getUser, saveUser } from '../../../storage/tokenStorage';
import { appointmentService } from '../../appointments/service/appointmentService';
import { doctorService } from '../service/doctorService';

type DoctorProfile = {
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
};

const defaultProfile: DoctorProfile = {
  name: 'Doctor',
  email: '',
  phone: 'Not provided',
  department: 'Not provided',
  specialization: 'Not provided',
};

const getDisplayName = (profile?: {
  name?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const fullName = [profile?.firstName?.trim(), profile?.lastName?.trim()]
    .filter(Boolean)
    .join(' ');

  return fullName || profile?.name || 'Doctor';
};

export const useDoctorProfileViewModel = () => {
  const [profile, setProfile] = useState<DoctorProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setError(null);

    try {
      setIsLoading(true);

      const [userResult, appointmentResult] = await Promise.allSettled([
        doctorService.getMyProfile(),
        appointmentService.getDoctorAppointments(''),
      ]);

      const storedUser = await getUser();
      const user = userResult.status === 'fulfilled' ? userResult.value : storedUser;
      const firstAppointment =
        appointmentResult.status === 'fulfilled' ? appointmentResult.value[0] : undefined;

      if (!user) {
        setError('Unable to load profile.');
        return;
      }

      const updatedProfile = {
        name: getDisplayName(user),
        email: user.email,
        phone: user.phone || 'Not provided',
        department: firstAppointment?.department?.name || 'Not provided',
        specialization:
          firstAppointment?.staff?.specialization ||
          firstAppointment?.doctor?.specialization ||
          firstAppointment?.doctor?.specialty ||
          'Not provided',
      };

      setProfile(updatedProfile);

      if (storedUser) {
        await saveUser({
          ...storedUser,
          name: updatedProfile.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        });
      }
    } catch {
      setError('Unable to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await clearSession();
    return true;
  }, []);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    logout,
  };
};
