import type { UserRole } from './AuthTypes';

export type User = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  personalNumber?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
  role: UserRole;
};
