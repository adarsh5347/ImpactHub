// client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "./config";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

const MAX_RETRY_COUNT = 1;
const RETRY_DELAY_MS = 350;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableMethod(method?: string): boolean {
  const normalized = (method || "").toUpperCase();
  return normalized === "GET" || normalized === "HEAD" || normalized === "OPTIONS";
}

function shouldRetry(error: AxiosError): boolean {
  if (!error.config) return false;
  if (!isRetryableMethod(error.config.method)) return false;
  if (error.code === "ECONNABORTED" || !error.response) return true;
  return (error.response.status ?? 0) >= 500;
}

function clearAuthState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentNGO");
  localStorage.removeItem("currentVolunteer");
  localStorage.removeItem("currentAdmin");
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (token) {
        config.headers.set?.("Authorization", `Bearer ${token}`);
        if (!config.headers.set) {
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const requestConfig = error.config as RetryableRequestConfig | undefined;
    if (requestConfig && shouldRetry(error)) {
      requestConfig._retryCount = (requestConfig._retryCount ?? 0) + 1;
      if (requestConfig._retryCount <= MAX_RETRY_COUNT) {
        await sleep(RETRY_DELAY_MS);
        return apiClient(requestConfig);
      }
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        clearAuthState();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper for UI-friendly errors
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data: any = err.response?.data;
    return (
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      err.message ||
      "Request failed"
    );
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export default apiClient;