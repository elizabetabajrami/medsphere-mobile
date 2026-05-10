import type { UserRole } from './AuthTypes';

export type User = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
};
