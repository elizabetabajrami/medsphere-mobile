import type { User } from "./User";

export type UserRole = "patient" | "doctor";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalNumber: string;
};

export type RegisterResponse = {
  token?: string;
  accessToken?: string;
  message?: string;
  user?: User;
};

export type VerifyEmailPayload = {
  token: string;
};

export type AuthResponse = {
  token?: string;
  accessToken?: string;
  role?: UserRole;
  user: User;
};
