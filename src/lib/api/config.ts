function normalizeApiBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:8080/api";

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  const normalizedPath = parsed.pathname.replace(/\/+$/, "");
  if (!normalizedPath || normalizedPath === "/") {
    parsed.pathname = "/api";
    return parsed.toString().replace(/\/+$/, "");
  }

  if (!normalizedPath.endsWith("/api")) {
    parsed.pathname = `${normalizedPath}/api`;
  }

  return parsed.toString().replace(/\/+$/, "");
}

const ENV_BASE_URL = normalizeApiBaseUrl(
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_BASE_URL) ||
    "http://localhost:8080/api"
);

export const API_CONFIG = {
  baseURL: ENV_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    TEST: "/auth/test",
    REGISTER_VOLUNTEER: "/auth/register/volunteer",
    REGISTER_NGO: "/auth/register/ngo",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  VOLUNTEERS: {
    DETAIL: (id: string | number) => `/volunteers/${id}`,
    UPDATE: (id: string | number) => `/volunteers/${id}`,
    DELETE: (id: string | number) => `/volunteers/${id}`,
    ACTIVITIES: (id: string | number) => `/volunteers/${id}/activities`,
    ME: "/volunteers/me",
  },

  NGOS: {
    LIST: "/ngos",
    DETAIL: (id: string | number) => `/ngos/${id}`,
    UPDATE: (id: string | number) => `/ngos/${id}`,
    DELETE: (id: string | number) => `/ngos/${id}`,
    PROJECTS: (id: string | number) => `/ngos/${id}/projects`,
    PROJECT_DETAIL: (ngoId: string | number, projectId: string | number) => `/ngos/${ngoId}/projects/${projectId}`,
    UPDATE_PROJECT: (ngoId: string | number, projectId: string | number) => `/ngos/${ngoId}/projects/${projectId}`,
    COMPLETE_PROJECT: (ngoId: string | number, projectId: string | number) =>
      `/ngos/${ngoId}/projects/${projectId}/complete`,
    ENROLLMENTS: (id: string | number) => `/ngos/${id}/enrollments`,
    PROJECT_ENROLLMENTS: (ngoId: string | number, projectId: string | number) =>
      `/ngos/${ngoId}/projects/${projectId}/enrollments`,
    LOGO_UPLOAD: "/ngos/logo/upload",
    COVER_UPLOAD: "/ngos/cover/upload",
  },

  PROJECTS: {
    CREATE: "/projects",
    LIST: "/projects",
    DETAIL: (id: string | number) => `/projects/${id}`,
    UPDATE: (id: string | number) => `/projects/${id}`,
    DELETE: (id: string | number) => `/projects/${id}`,
    ENROLL: (id: string | number) => `/projects/${id}/enroll`,
    ENROLLMENT_STATUS: (id: string | number) => `/projects/${id}/enrollment-status`,
  },

  ADMIN: {
    STATS: "/admin/stats",
    NGOS: "/admin/ngos",
    VOLUNTEERS: "/admin/volunteers",
    NGO_DETAIL: (id: string | number) => `/admin/ngos/${id}`,
    APPROVE_NGO: (id: string | number) => `/admin/ngos/${id}/approve`,
    REJECT_NGO: (id: string | number) => `/admin/ngos/${id}/reject`,
    SUSPEND_NGO: (id: string | number) => `/admin/ngos/${id}/suspend`,
  },
} as const;

export const FEATURES = {
  USE_MOCK_DATA:
    ((typeof import.meta !== "undefined" &&
      (import.meta as any).env?.VITE_ENABLE_MOCK_DATA) ||
      (typeof process !== "undefined" &&
        (process as any).env?.REACT_APP_ENABLE_MOCK_DATA)) === "true",

  ENABLE_LOGGING:
    (typeof import.meta !== "undefined" &&
      (import.meta as any).env?.MODE !== "production") ||
    (typeof process !== "undefined" &&
      (process as any).env?.NODE_ENV !== "production"),
} as const;