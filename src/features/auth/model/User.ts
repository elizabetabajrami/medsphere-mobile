import type { UserRole } from './AuthTypes';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
