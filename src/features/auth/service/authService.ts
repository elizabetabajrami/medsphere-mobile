import { apiClient } from "../../../network/apiClient";
import { endpoints } from "../../../network/endpoints";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
} from "../model/AuthTypes";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("LOGIN REQUEST:", { email: credentials.email });

    const response = await apiClient.post<AuthResponse>(
      endpoints.auth.login,
      credentials,
      { skipAuth: true },
    );

    console.log("LOGIN RESPONSE:", response.data);
    console.log("STATUS:", response.status);

    return response.data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    console.log("REGISTER REQUEST:", payload);

    const response = await apiClient.post<RegisterResponse>(
      endpoints.auth.register,
      payload,
      { skipAuth: true },
    );

    console.log("REGISTER RESPONSE:", response.data);
    console.log("STATUS:", response.status);

    return response.data;
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<void> {
    const response = await apiClient.post(endpoints.auth.verifyEmail, payload, {
      skipAuth: true,
    });

    console.log("VERIFY EMAIL RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post(
      endpoints.auth.forgotPassword,
      { email },
      { skipAuth: true },
    );

    console.log("FORGOT PASSWORD RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },

  async debugGetMe(): Promise<void> {
    const response = await apiClient.get(endpoints.patients.me);

    console.log("DEBUG /api/users/me RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },
};
