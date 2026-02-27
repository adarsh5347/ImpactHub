/**
 * NGO Service
 * Handles all NGO-related API calls
 * Backend returns plain JSON (no ApiResponse wrapper)
 */

import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import type { NGOFilters, NGO, Project } from "./types";

export interface NgoLogoUploadResult {
  logoUrl: string;
  publicId?: string;
}

export interface NgoCoverUploadResult {
  coverImageUrl: string;
  publicId?: string;
}

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const CURRENT_NGO_KEY = "currentNGO";

export const ngoService = {
  /**
   * Get all NGOs with optional filters
   * Backend supports: city, state, cause, verified
   */
  getNGOs: async (filters?: NGOFilters): Promise<NGO[]> => {
    const params: Record<string, string | number | boolean> = {};

    if (filters?.cause && filters.cause !== "all") params.cause = filters.cause;
    if (filters?.city && filters.city !== "all") params.city = filters.city;
    if (filters?.state && filters.state !== "all") params.state = filters.state;
    if (filters?.verified !== undefined) params.verified = filters.verified;

    // NOTE: backend controller you showed doesn't implement search/page/limit
    // Keeping search only if you add it later:
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await apiClient.get<NGO[]>(API_ENDPOINTS.NGOS.LIST, { params });
    return response.data ?? [];
  },

  /**
   * Get single NGO by ID (protected in your backend)
   */
  getNGOById: async (id: string | number): Promise<NGO> => {
    const response = await apiClient.get<NGO>(API_ENDPOINTS.NGOS.DETAIL(id));
    return response.data;
  },

  getCurrentNGOFromSession: async (): Promise<NGO | null> => {
    const stored = safeParseJSON<{ id?: number; email?: string; userEmail?: string }>(
      localStorage.getItem(CURRENT_NGO_KEY)
    );

    if (stored?.id != null) {
      const full = await ngoService.getNGOById(stored.id);
      localStorage.setItem(CURRENT_NGO_KEY, JSON.stringify(full));
      return full;
    }

    const email = stored?.email || stored?.userEmail;
    if (!email) return null;

    const ngos = await ngoService.getNGOs();
    const current = ngos.find((ngo) => ngo.userEmail === email || ngo.email === email) ?? null;
    if (current) {
      localStorage.setItem(CURRENT_NGO_KEY, JSON.stringify(current));
    }
    return current;
  },

  /**
   * Update NGO profile (protected)
   */
  updateNGO: async (id: string | number, data: Partial<NGO>): Promise<NGO> => {
    const response = await apiClient.put<NGO>(API_ENDPOINTS.NGOS.UPDATE(id), data);

    const stored = safeParseJSON<NGO>(localStorage.getItem(CURRENT_NGO_KEY));
    if (stored?.id != null && String(stored.id) === String(id)) {
      localStorage.setItem(CURRENT_NGO_KEY, JSON.stringify({ ...stored, ...response.data }));
    }

    return response.data;
  },

  uploadNgoLogo: async (file: File): Promise<NgoLogoUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<NgoLogoUploadResult>(
      API_ENDPOINTS.NGOS.LOGO_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  uploadNgoCover: async (file: File): Promise<NgoCoverUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<NgoCoverUploadResult>(
      API_ENDPOINTS.NGOS.COVER_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  /**
   * Delete NGO (admin protected)
   */
  deleteNgo: async (id: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.NGO_DETAIL(id));

    const stored = safeParseJSON<NGO>(localStorage.getItem(CURRENT_NGO_KEY));
    if (stored?.id != null && String(stored.id) === String(id)) {
      localStorage.removeItem(CURRENT_NGO_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
    }
  },

  deleteNGO: async (id: string | number): Promise<void> => {
    await ngoService.deleteNgo(id);
  },

  /**
   * Get projects for a specific NGO
   */
  getNGOProjects: async (ngoId: string | number): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>(
      API_ENDPOINTS.NGOS.PROJECTS(ngoId)
    );
    return response.data ?? [];
  },

  /**
   * Create project NOT implemented (your endpoints don't have it yet)
   */
  createProject: async (): Promise<never> => {
    throw new Error("POST /api/ngos/{id}/projects is not implemented in backend");
  },
};