/**
 * Volunteer Service
 * Handles all volunteer-related API calls
 * Backend returns plain JSON (no ApiResponse wrapper)
 */

import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import type {
  Volunteer,
  VolunteerActivity,
  RegisterVolunteerRequest,
  AuthResponse,
  VolunteerUpdateRequest,
} from "./types";

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const TOKEN_KEY = "token";
const CURRENT_VOLUNTEER_KEY = "currentVolunteer";

export const volunteerService = {
  /**
   * Register a new volunteer (AUTH response)
   */
  registerVolunteer: async (
    data: RegisterVolunteerRequest
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER_VOLUNTEER,
      data
    );
    return response.data;
  },

  getMyProfile: async (): Promise<Volunteer> => {
    const response = await apiClient.get<Volunteer>(API_ENDPOINTS.VOLUNTEERS.ME);
    return response.data;
  },

  /**
   * Get volunteer by ID (protected)
   */
  getVolunteerById: async (id: string | number): Promise<Volunteer> => {
    const response = await apiClient.get<Volunteer>(
      API_ENDPOINTS.VOLUNTEERS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Update volunteer (protected)
   */
  updateVolunteer: async (
    id: string | number,
    data: Partial<VolunteerUpdateRequest>
  ): Promise<Volunteer> => {
    const response = await apiClient.put<Volunteer>(
      API_ENDPOINTS.VOLUNTEERS.UPDATE(id),
      data
    );

    // Update localStorage if this is the current volunteer
    const stored = safeParseJSON<Volunteer>(
      localStorage.getItem(CURRENT_VOLUNTEER_KEY)
    );

    if (stored?.id != null && String(stored.id) === String(id)) {
      localStorage.setItem(
        CURRENT_VOLUNTEER_KEY,
        JSON.stringify({ ...stored, ...response.data })
      );
    }

    return response.data;
  },

  /**
   * Delete volunteer (protected)
   */
  deleteVolunteer: async (id: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.VOLUNTEERS.DELETE(id));

    // Clear localStorage if this is the current volunteer
    const stored = safeParseJSON<Volunteer>(
      localStorage.getItem(CURRENT_VOLUNTEER_KEY)
    );

    if (stored?.id != null && String(stored.id) === String(id)) {
      localStorage.removeItem(CURRENT_VOLUNTEER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("authToken"); // optional if you used it earlier
    }
  },

  /**
   * Get volunteer activities (protected)
   */
  getVolunteerActivities: async (
    id: string | number
  ): Promise<VolunteerActivity[]> => {
    const response = await apiClient.get<VolunteerActivity[]>(
      API_ENDPOINTS.VOLUNTEERS.ACTIVITIES(id)
    );
    return response.data ?? [];
  },

  /**
   * Get current volunteer (from localStorage -> refresh from backend)
   */
  getCurrentVolunteer: async (): Promise<Volunteer | null> => {
    const stored = safeParseJSON<{ id?: string | number }>(
      localStorage.getItem(CURRENT_VOLUNTEER_KEY)
    );

    if (!stored?.id) {
      try {
        const me = await volunteerService.getMyProfile();
        localStorage.setItem(CURRENT_VOLUNTEER_KEY, JSON.stringify(me));
        return me;
      } catch {
        return null;
      }
    }

    try {
      const fresh = await volunteerService.getVolunteerById(stored.id);
      localStorage.setItem(CURRENT_VOLUNTEER_KEY, JSON.stringify(fresh));
      return fresh;
    } catch {
      localStorage.removeItem(CURRENT_VOLUNTEER_KEY);
      return null;
    }
  },

  /**
   * Not implemented in backend yet (keep explicit)
   */
  getVolunteers: async (): Promise<Volunteer[]> => {
    throw new Error("GET /api/volunteers is not implemented in backend");
  },

  /**
   * Not implemented in backend yet (keep explicit)
   */
  getVolunteerStats: async <T = unknown>(
    _id: string | number
  ): Promise<T> => {
    throw new Error("GET /api/volunteers/{id}/stats is not implemented in backend");
  },
};