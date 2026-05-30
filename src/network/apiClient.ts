import axios from "axios";
import { getToken } from "../storage/tokenStorage";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: "http://192.168.178.143:3005",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API BASE URL:", apiClient.defaults.baseURL);

apiClient.interceptors.request.use(async (config) => {
  if (config.skipAuth) {
    delete config.headers.Authorization;
    return config;
  }

  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE URL:", response.config.url);
    console.log("API RESPONSE STATUS:", response.status);
    console.log("STATUS:", response.status);
    return response;
  },
  (error) => {
    console.log("API RESPONSE URL:", error.response?.config?.url);
    console.log("API RESPONSE STATUS:", error.response?.status);
    console.log("STATUS:", error.response?.status);
    return Promise.reject(error);
  },
);

apiClient
  .get("/health", { skipAuth: true })
  .then((response) => {
    console.log("HEALTH RESPONSE:", response.data);
    console.log("STATUS:", response.status);
  })
  .catch((error) => {
    console.log("HEALTH ERROR STATUS:", error.response?.status);
    console.log("HEALTH ERROR DATA:", error.response?.data);
    console.log("HEALTH ERROR:", error.message);
  });
