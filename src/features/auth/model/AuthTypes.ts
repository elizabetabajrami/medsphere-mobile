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
  platform?: "mobile";
};

export type RegisterResponse = {
  token?: string;
  accessToken?: string;
  message?: string;
  user?: User;
};

export type VerifyEmailPayload =
  | {
      code: string;
    }
  | {
      token: string;
    };

export type ResendVerificationPayload = {
  email: string;
  platform?: "mobile";
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  password: string;
};

export type AuthResponse = {
  token?: string;
  accessToken?: string;
  role?: UserRole;
  user: User;
};
