import * as SecureStore from 'expo-secure-store';
import type { UserRole } from '../features/auth/model/AuthTypes';
import type { User } from '../features/auth/model/User';

const TOKEN_KEY = 'medsphere_token';
const ROLE_KEY = 'medsphere_role';
const USER_KEY = 'medsphere_user';

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => SecureStore.getItemAsync(TOKEN_KEY);

export const saveRole = async (role: UserRole) => {
  await SecureStore.setItemAsync(ROLE_KEY, role);
};

export const getRole = async (): Promise<UserRole | null> => {
  const role = await SecureStore.getItemAsync(ROLE_KEY);
  return role === 'patient' || role === 'doctor' ? role : null;
};

export const saveUser = async (user: User) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const user = await SecureStore.getItemAsync(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
};

export const clearSession = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(ROLE_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
};
