/**
 * Authentication Service
 * Matches Spring AuthResponse exactly:
 * {
 *   token: string,
 *   userType: string,
 *   email: string,
 *   message: string
 * }
 */

import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import type { AuthMeResponse, LoginRequest, RegisterNGORequest, RegisterVolunteerRequest } from "./types";

export interface AuthResponse {
  token: string | null;
  userType: string | null;
  role?: string | null;
  userId?: number | null;
  fullName?: string | null;
  email: string | null;
  message: string | null;
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLength);
    return atob(padded);
  } catch {
    return null;
  }
}

function readRoleClaim(payload: Record<string, unknown>): string[] {
  const roleKeys = ["roles", "authorities", "role", "scope"];

  for (const key of roleKeys) {
    const claim = payload[key];
    if (Array.isArray(claim)) {
      return claim.map(String);
    }
    if (typeof claim === "string") {
      return claim.split(/[\s,]+/).filter(Boolean);
    }
  }

  return [];
}

export const authService = {
  getToken: (): string | null => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  },

  decodeTokenPayload: (token?: string | null): Record<string, unknown> | null => {
    const rawToken = token || authService.getToken();
    if (!rawToken) return null;

    const parts = rawToken.split(".");
    if (parts.length < 2) return null;

    const decoded = decodeBase64Url(parts[1]);
    if (!decoded) return null;

    try {
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  },

  hasRole: (role: string, token?: string | null): boolean => {
    const payload = authService.decodeTokenPayload(token);
    if (!payload) return false;
    const roles = readRoleClaim(payload).map((entry) => entry.toUpperCase());
    const normalized = role.toUpperCase();
    return roles.includes(normalized);
  },

  isAdminToken: (token?: string | null): boolean => {
    return authService.hasRole("ROLE_ADMIN", token) || authService.hasRole("ADMIN", token);
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const payload: LoginRequest = { email, password };
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        payload
      );

      const data = response.data;

      // If backend returned error message
      if (!data.token) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("authToken", data.token);

      const normalizedRole = data.userType ?? data.role ?? null;
      data.role = normalizedRole;

      // Store user type based on backend response
      if (normalizedRole === "VOLUNTEER") {
        localStorage.setItem(
          "currentVolunteer",
          JSON.stringify({
            id: data.userId ?? null,
            email: data.email,
            fullName: data.fullName ?? null,
            userType: normalizedRole,
          })
        );
        localStorage.removeItem("currentNGO");
      } else if (normalizedRole === "NGO") {
        localStorage.setItem(
          "currentNGO",
          JSON.stringify({ email: data.email, ngoName: data.fullName ?? null, userType: normalizedRole })
        );
        localStorage.removeItem("currentVolunteer");
      } else if (normalizedRole === "ADMIN") {
        localStorage.setItem(
          "currentAdmin",
          JSON.stringify({ email: data.email, userType: normalizedRole })
        );
        localStorage.removeItem("currentVolunteer");
        localStorage.removeItem("currentNGO");
      }

      return data;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  registerVolunteer: async (
    payload: RegisterVolunteerRequest
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER_VOLUNTEER,
      payload
    );
    return response.data;
  },

  registerNGO: async (payload: RegisterNGORequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER_NGO,
      payload
    );
    return response.data;
  },

  me: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get<AuthMeResponse>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentVolunteer");
    localStorage.removeItem("currentNGO");
    localStorage.removeItem("currentAdmin");
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: (): boolean => {
    return !!(localStorage.getItem("token") || localStorage.getItem("authToken"));
  },

  /**
   * Get current user type
   */
  getUserType: (): "volunteer" | "ngo" | "admin" | null => {
    const volunteer = localStorage.getItem("currentVolunteer");
    const ngo = localStorage.getItem("currentNGO");
    const admin = localStorage.getItem("currentAdmin");

    if (volunteer) return "volunteer";
    if (ngo) return "ngo";
    if (admin || authService.isAdminToken()) return "admin";
    return null;
  },
};