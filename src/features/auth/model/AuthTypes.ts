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
};

export type AuthResponse = {
  token?: string;
  accessToken?: string;
  role?: UserRole;
  user: User;
};
