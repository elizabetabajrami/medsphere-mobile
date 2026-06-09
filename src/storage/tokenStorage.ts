import * as SecureStore from 'expo-secure-store';
import type { UserRole } from '../features/auth/model/AuthTypes';
import type { User } from '../features/auth/model/User';

const TOKEN_KEY = 'medsphere_token';
const ROLE_KEY = 'medsphere_role';
const USER_KEY = 'medsphere_user';
const PENDING_PERSONAL_NUMBER_PREFIX = 'medsphere_pending_personal_number';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getPendingPersonalNumberKey = (email: string) =>
  `${PENDING_PERSONAL_NUMBER_PREFIX}_${normalizeEmail(email).replace(/[^A-Za-z0-9._-]/g, "_")}`;

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

export const savePendingPersonalNumber = async (email: string, personalNumber: string) => {
  await SecureStore.setItemAsync(getPendingPersonalNumberKey(email), personalNumber);
};

export const getPendingPersonalNumber = async (email: string) =>
  SecureStore.getItemAsync(getPendingPersonalNumberKey(email));

export const clearPendingPersonalNumber = async (email: string) => {
  await SecureStore.deleteItemAsync(getPendingPersonalNumberKey(email));
};

export const clearSession = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(ROLE_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
};
