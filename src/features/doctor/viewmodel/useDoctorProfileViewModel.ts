import { useCallback, useEffect, useState } from 'react';
import { clearSession, getUser, saveUser } from '../../../storage/tokenStorage';
import { doctorService } from '../../../services/doctorService';
import { pushNotificationService } from '../../../services/pushNotificationService';

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

      const [userResult, staffResult] = await Promise.allSettled([
        doctorService.getMyProfile(),
        doctorService.getMyStaffProfile(),
      ]);

      const storedUser = await getUser();
      const user = userResult.status === 'fulfilled' ? userResult.value : storedUser;
      const staff = staffResult.status === 'fulfilled' ? staffResult.value : undefined;
      const primaryDepartment = staff?.departments?.find(
        (assignment) => assignment.isPrimary,
      ) ?? staff?.departments?.[0];

      if (!user) {
        setError('Unable to load profile.');
        return;
      }

      const updatedProfile = {
        name: getDisplayName(user),
        email: user.email,
        phone: user.phone || 'Not provided',
        department: primaryDepartment?.department?.name || 'Not provided',
        specialization: staff?.specialization || 'Not provided',
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
    await pushNotificationService.unregisterCurrentDevice().catch((error) => {
      console.log('PUSH UNREGISTER ERROR:', error);
    });
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
