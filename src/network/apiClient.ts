import type { AxiosInstance } from "axios";
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

const AUTH_BASE_URL = "http://192.168.1.11:3005";
const CORE_BASE_URL = "http://192.168.1.11:3007";
const NOTIFICATION_BASE_URL = "http://192.168.1.11:3008";

export const notificationSocketUrl = NOTIFICATION_BASE_URL;

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

export const notificationApiClient = axios.create({
  baseURL: NOTIFICATION_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const configureClient = (client: AxiosInstance, label: string) => {
  console.log(`${label} BASE URL:`, client.defaults.baseURL);

  const redactSensitiveData = (data: unknown) => {
    if (!data) {
      return data;
    }

    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return parsed;
      }

      return {
        ...parsed,
        password: "password" in parsed ? "***" : undefined,
        personalNumber: "personalNumber" in parsed ? "***" : undefined,
      };
    } catch {
      return "[unparseable request data]";
    }
  };

  client.interceptors.request.use(async (config) => {
    if (config.skipAuth) {
      delete config.headers.Authorization;
    } else {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`${label} REQUEST BASE URL:`, config.baseURL);
    console.log(`${label} REQUEST URL:`, config.url);
    console.log(`${label} REQUEST METHOD:`, config.method);
    console.log(`${label} REQUEST DATA:`, redactSensitiveData(config.data));

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
      console.log(`${label} REQUEST DATA:`, redactSensitiveData(error.config?.data));
      console.log("STATUS:", error.response?.status);
      return Promise.reject(error);
    },
  );
};

configureClient(apiClient, "AUTH API");
configureClient(coreApiClient, "CORE API");
configureClient(notificationApiClient, "NOTIFICATION API");

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
