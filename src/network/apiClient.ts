import axios from "axios";
import type { AxiosInstance } from "axios";
import { getToken } from "../storage/tokenStorage";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const AUTH_BASE_URL = "http://192.168.178.143:3005";
const CORE_BASE_URL = "http://192.168.178.143:3007";

export const apiClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const coreApiClient = axios.create({
  baseURL: CORE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const configureClient = (client: AxiosInstance, label: string) => {
  console.log(`${label} BASE URL:`, client.defaults.baseURL);

  client.interceptors.request.use(async (config) => {
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

  client.interceptors.response.use(
    (response) => {
      console.log(`${label} RESPONSE URL:`, response.config.url);
      console.log(`${label} RESPONSE STATUS:`, response.status);
      console.log("STATUS:", response.status);
      return response;
    },
    (error) => {
      console.log(`${label} ERROR MESSAGE:`, error.message);
      console.log(`${label} ERROR CODE:`, error.code);
      console.log(`${label} REQUEST BASE URL:`, error.config?.baseURL);
      console.log(`${label} REQUEST URL:`, error.config?.url);
      console.log(`${label} RESPONSE URL:`, error.response?.config?.url);
      console.log(`${label} RESPONSE STATUS:`, error.response?.status);
      console.log(`${label} RESPONSE DATA:`, error.response?.data);
      console.log(`${label} REQUEST METHOD:`, error.config?.method);
      console.log(`${label} REQUEST DATA:`, error.config?.data);
      console.log("STATUS:", error.response?.status);
      return Promise.reject(error);
    },
  );
};

configureClient(apiClient, "AUTH API");
configureClient(coreApiClient, "CORE API");

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
