import { apiClient } from '../../../network/apiClient';
import { endpoints } from '../../../network/endpoints';
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../model/AuthTypes';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(endpoints.auth.login, credentials);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(endpoints.auth.register, payload);
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(endpoints.auth.forgotPassword, { email });
  },
};
