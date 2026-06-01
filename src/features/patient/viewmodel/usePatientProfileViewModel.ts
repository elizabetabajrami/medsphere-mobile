import { useEffect, useState } from 'react';
import { clearSession, getUser } from '../../../storage/tokenStorage';
import type { PatientProfile } from '../model/Patient';

const defaultProfile: PatientProfile = {
  name: 'Patient',
  email: '',
  phone: 'Not provided',
  location: 'Not provided',
};

export const usePatientProfileViewModel = () => {
  const [profile, setProfile] = useState<PatientProfile>(defaultProfile);

  useEffect(() => {
    const loadProfile = async () => {
      const user = await getUser();

      if (!user) {
        return;
      }

      const fullName = [user.firstName?.trim(), user.lastName?.trim()]
        .filter(Boolean)
        .join(' ');

      setProfile({
        name: fullName || user.name || 'Patient',
        email: user.email,
        phone: 'Not provided',
        location: 'Not provided',
      });
    };

    loadProfile();
  }, []);

  const logout = async () => {
    await clearSession();
    return true;
  };

  return {
    profile,
    logout,
  };
};
