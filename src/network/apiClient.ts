import axios from "axios";
import { getToken } from "../storage/tokenStorage";

export const apiClient = axios.create({
  baseURL: "http://192.168.178.143:3005",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
