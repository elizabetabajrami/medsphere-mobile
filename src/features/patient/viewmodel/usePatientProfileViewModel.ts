import { useState } from 'react';
import { clearSession } from '../../../storage/tokenStorage';
import type { PatientProfile } from '../model/Patient';

export const usePatientProfileViewModel = () => {
  const [profile] = useState<PatientProfile>({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 555 0198',
    location: 'New York, NY',
  });

  const logout = async () => {
    await clearSession();
    return true;
  };

  return {
    profile,
    logout,
  };
};
