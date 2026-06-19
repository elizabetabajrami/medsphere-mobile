import { useCallback, useEffect, useState } from 'react';
import {
  clearSession,
  getCurrentPatientAvatarUrl,
  getPatientAvatarUrl,
  getUser,
  saveCurrentPatientAvatarUrl,
  savePatientAvatarUrl,
  saveUser,
} from '../../../storage/tokenStorage';
import type { PatientProfile } from '../model/Patient';
import { patientService } from '../../../services/patientService';
import { pushNotificationService } from '../../../services/pushNotificationService';
import { apiClient } from '../../../network/apiClient';

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

const localAvatarSchemes = ['file:', 'content:', 'data:', 'asset-library:', 'ph:'];

const isLocalAvatarUrl = (avatarUrl?: string) =>
  !!avatarUrl && localAvatarSchemes.some((scheme) => avatarUrl.startsWith(scheme));

const normalizeAvatarUrl = (avatarUrl?: string) => {
  const trimmedAvatarUrl = avatarUrl?.trim();

  if (!trimmedAvatarUrl) {
    return undefined;
  }

  if (
    trimmedAvatarUrl.startsWith('http://') ||
    trimmedAvatarUrl.startsWith('https://') ||
    localAvatarSchemes.some((scheme) => trimmedAvatarUrl.startsWith(scheme))
  ) {
    return trimmedAvatarUrl;
  }

  const baseUrl = apiClient.defaults.baseURL;

  if (!baseUrl) {
    return trimmedAvatarUrl;
  }

  return `${baseUrl.replace(/\/$/, '')}/${trimmedAvatarUrl.replace(/^\//, '')}`;
};

const getAvatarUrl = (remoteAvatarUrl?: string, fallbackAvatarUrl?: string) =>
  normalizeAvatarUrl(remoteAvatarUrl) || normalizeAvatarUrl(fallbackAvatarUrl);

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
      const storedUser = await getUser();
      const storedAvatarUrl = await getPatientAvatarUrl(user.id);
      const currentAvatarUrl = await getCurrentPatientAvatarUrl();
      const avatarUrl = getAvatarUrl(
        storedAvatarUrl || currentAvatarUrl || storedUser?.avatarUrl,
        user.avatarUrl,
      );

      if (avatarUrl) {
        await savePatientAvatarUrl(user.id, avatarUrl);
        await saveCurrentPatientAvatarUrl(avatarUrl);
      }

      setProfile({
        name: fullName || user.name || 'Patient',
        email: user.email,
        phone: user.phone || 'Not provided',
        avatarUrl,
      });

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
          avatarUrl,
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
      const storedAvatarUrl = await getPatientAvatarUrl(user.id);
      const currentAvatarUrl = await getCurrentPatientAvatarUrl();
      const avatarUrl = getAvatarUrl(storedAvatarUrl || currentAvatarUrl || user.avatarUrl);

      setProfile({
        name: fullName || user.name || 'Patient',
        email: user.email,
        phone: user.phone || 'Not provided',
        avatarUrl,
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
      const nextAvatarUrl = getAvatarUrl(updates.avatarUrl, user.avatarUrl);
      const apiAvatarUrl = isLocalAvatarUrl(nextAvatarUrl) ? undefined : nextAvatarUrl;

      const updatedProfile = await patientService.updateMyProfile({
        firstName,
        lastName,
        phone: phone || undefined,
        avatarUrl: apiAvatarUrl,
      });
      const updatedName = [updatedProfile.firstName?.trim(), updatedProfile.lastName?.trim()]
        .filter(Boolean)
        .join(' ') || updatedProfile.name || name;
      const avatarUrl = getAvatarUrl(nextAvatarUrl, updatedProfile.avatarUrl || user.avatarUrl);

      if (avatarUrl) {
        await savePatientAvatarUrl(user.id, avatarUrl);
        await saveCurrentPatientAvatarUrl(avatarUrl);
      }

      await saveUser({
        ...user,
        name: updatedName,
        firstName: updatedProfile.firstName || firstName,
        lastName: updatedProfile.lastName || lastName,
        email: updatedProfile.email || user.email,
        phone: updatedProfile.phone,
        dateOfBirth: updatedProfile.dateOfBirth,
        gender: updatedProfile.gender,
        avatarUrl,
      });

      setProfile({
        name: updatedName,
        email: updatedProfile.email || user.email,
        phone: updatedProfile.phone || 'Not provided',
        avatarUrl,
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
    await pushNotificationService.unregisterCurrentDevice().catch((error) => {
      console.log('PUSH UNREGISTER ERROR:', error);
    });
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
