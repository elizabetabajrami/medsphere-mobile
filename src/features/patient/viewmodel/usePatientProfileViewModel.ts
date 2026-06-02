import { useCallback, useEffect, useState } from 'react';
import { clearSession, getUser, saveUser } from '../../../storage/tokenStorage';
import type { PatientProfile } from '../model/Patient';
import { patientService } from '../service/patientService';

const defaultProfile: PatientProfile = {
  name: 'Patient',
  email: '',
  phone: 'Not provided',
};

type ProfileUpdates = {
  name: string;
  phone: string;
  avatarUrl?: string;
};

export const usePatientProfileViewModel = () => {
  const [profile, setProfile] = useState<PatientProfile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setError(null);

    try {
      const user = await patientService.getMyProfile();
      const fullName = [user.firstName?.trim(), user.lastName?.trim()]
        .filter(Boolean)
        .join(' ');

      setProfile({
        name: fullName || user.name || 'Patient',
        email: user.email,
        phone: user.phone || 'Not provided',
        avatarUrl: user.avatarUrl,
      });

      const storedUser = await getUser();

      if (storedUser) {
        await saveUser({
          ...storedUser,
          name: fullName || user.name || storedUser.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          avatarUrl: user.avatarUrl,
        });
      }
    } catch {
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
        phone: user.phone || 'Not provided',
        avatarUrl: user.avatarUrl,
      });
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(async (updates: ProfileUpdates) => {
    const user = await getUser();

    if (!user) {
      return false;
    }

    const name = updates.name.trim() || profile.name;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const phone = updates.phone.trim();

    try {
      setError(null);
      setIsSaving(true);

      const updatedProfile = await patientService.updateMyProfile({
        firstName,
        lastName,
        phone: phone || undefined,
        avatarUrl: updates.avatarUrl,
      });
      const updatedName = [updatedProfile.firstName?.trim(), updatedProfile.lastName?.trim()]
        .filter(Boolean)
        .join(' ') || updatedProfile.name || name;

      await saveUser({
        ...user,
        name: updatedName,
        firstName: updatedProfile.firstName || firstName,
        lastName: updatedProfile.lastName || lastName,
        email: updatedProfile.email || user.email,
        phone: updatedProfile.phone,
        dateOfBirth: updatedProfile.dateOfBirth,
        gender: updatedProfile.gender,
        avatarUrl: updatedProfile.avatarUrl,
      });

      setProfile({
        name: updatedName,
        email: updatedProfile.email || user.email,
        phone: updatedProfile.phone || 'Not provided',
        avatarUrl: updatedProfile.avatarUrl,
      });

      return true;
    } catch {
      setError('Unable to save profile changes.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [profile.name]);

  const logout = useCallback(async () => {
    await clearSession();
    return true;
  }, []);

  return {
    profile,
    isSaving,
    error,
    loadProfile,
    saveProfile,
    logout,
  };
};
