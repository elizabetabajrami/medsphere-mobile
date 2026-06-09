import { apiClient } from "../../../network/apiClient";
import { endpoints } from "../../../network/endpoints";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  RegisterResponse,
  ResendVerificationPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "../model/AuthTypes";
import type { User } from "../model/User";

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
    console.log("REGISTER REQUEST:", {
      ...payload,
      personalNumber: payload.personalNumber ? "***" : undefined,
    });

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

  async resendVerification(payload: ResendVerificationPayload): Promise<void> {
    const response = await apiClient.post(
      endpoints.auth.resendVerification,
      payload,
      { skipAuth: true },
    );

    console.log("RESEND VERIFICATION RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post(
      `${endpoints.auth.forgotPassword}?platform=mobile`,
      { email, platform: "mobile" },
      {
        skipAuth: true,
        headers: {
          "X-Client-Platform": "mobile",
        },
      },
    );

    console.log("FORGOT PASSWORD RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    const response = await apiClient.post(
      endpoints.auth.resetPassword,
      payload,
      { skipAuth: true },
    );

    console.log("RESET PASSWORD RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  },

  async debugGetMe(): Promise<User> {
    const response = await apiClient.get<User>(endpoints.patients.me);

    console.log("DEBUG /api/users/me RESPONSE:", response.data);
    console.log("STATUS:", response.status);

    return response.data;
  },
};
