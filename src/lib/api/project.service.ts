/**
 * Project Service
 * Handles all project-related API calls
 * Backend returns plain JSON (no ApiResponse wrapper)
 */

import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import type {
  EnrollmentResponse,
  ProjectFilters,
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from "./types";

function shouldFallbackCreate(status?: number): boolean {
  return status === 401 || status === 403 || status === 404 || status === 405;
}

export const projectService = {
  createProject: async (ngoId: string | number, data: ProjectCreateRequest): Promise<Project> => {
    const cleanedPayload: ProjectCreateRequest = {
      title: data.title.trim(),
      ...(data.description?.trim() ? { description: data.description.trim() } : {}),
      ...(data.objectives?.trim() ? { objectives: data.objectives.trim() } : {}),
      ...(data.cause?.trim() ? { cause: data.cause.trim() } : {}),
      ...(data.location?.trim() ? { location: data.location.trim() } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.startDate ? { startDate: data.startDate } : {}),
      ...(data.endDate ? { endDate: data.endDate } : {}),
      ...(typeof data.beneficiaries === "number" && data.beneficiaries > 0
        ? { beneficiaries: data.beneficiaries }
        : {}),
      ...(data.imageUrl?.trim() ? { imageUrl: data.imageUrl.trim() } : {}),
      ...(Array.isArray(data.requiredResources) && data.requiredResources.length > 0
        ? { requiredResources: data.requiredResources }
        : {}),
      ...(typeof data.volunteersNeeded === "number" && data.volunteersNeeded > 0
        ? { volunteersNeeded: data.volunteersNeeded }
        : {}),
    };

    try {
      const response = await apiClient.post<Project>(API_ENDPOINTS.NGOS.PROJECTS(ngoId), cleanedPayload);
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status as number | undefined;
      if (!shouldFallbackCreate(status)) {
        throw error;
      }

      const fallbackPayload = {
        ...cleanedPayload,
        ngoId,
      };
      const fallbackResponse = await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, fallbackPayload);
      return fallbackResponse.data;
    }
  },

  /**
   * Get all projects with optional filters
   * Supported filters (from types.ts): status, cause, location, ngoId
   */
  getProjects: async (filters?: ProjectFilters): Promise<Project[]> => {
    try {
      const params: Record<string, string | number> = {};

      if (filters?.cause && filters.cause !== "all") params.cause = filters.cause;
      if (filters?.location && filters.location !== "all") params.location = filters.location;
      if (filters?.status) params.status = filters.status;
      if (filters?.ngoId != null) params.ngoId = filters.ngoId;

      const response = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST, { params });
      return response.data ?? [];
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  },

  /**
   * Get single project by ID
   */
  getProjectById: async (id: string | number): Promise<Project> => {
    try {
      const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch project with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update project
   */
  updateProject: async (
    id: string | number,
    data: Partial<ProjectUpdateRequest>
  ): Promise<Project> => {
    try {
      const response = await apiClient.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update project with ID ${id}:`, error);
      throw error;
    }
  },

  getNgoProjectById: async (ngoId: string | number, projectId: string | number): Promise<Project> => {
    const response = await apiClient.get<Project>(API_ENDPOINTS.NGOS.PROJECT_DETAIL(ngoId, projectId));
    return response.data;
  },

  updateNgoProject: async (
    ngoId: string | number,
    projectId: string | number,
    data: Partial<ProjectUpdateRequest>
  ): Promise<Project> => {
    const response = await apiClient.put<Project>(API_ENDPOINTS.NGOS.UPDATE_PROJECT(ngoId, projectId), data);
    return response.data;
  },

  deleteProject: async (id: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },

  /**
   * Enroll volunteer in a project
   * Creates a VolunteerEnrollment record
   * 
   * TODO: Backend implementation required
   * Endpoint: POST /projects/{projectId}/enroll
   * Auth: Required (Bearer token)
   * Request: Empty body or { volunteerId?: number }
   * Response: 200 OK or { volunteerCount: number }
   * 
   * Should:
   * 1. Create VolunteerEnrollment record linking volunteer to project
   * 2. Increment project.volunteersEnrolled counter
   * 3. Return updated volunteer count or 200 OK
   */
  enrollAsVolunteer: async (projectId: string | number): Promise<EnrollmentResponse> => {
    try {
      const response = await apiClient.post<EnrollmentResponse>(
        API_ENDPOINTS.PROJECTS.ENROLL(projectId),
        {}
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to enroll in project ${projectId}:`, error);
      throw error;
    }
  },

  getEnrollmentStatus: async (projectId: string | number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(API_ENDPOINTS.PROJECTS.ENROLLMENT_STATUS(projectId));
    return !!response.data;
  },

  markProjectCompleted: async (ngoId: string | number, projectId: string | number): Promise<Project> => {
    const response = await apiClient.patch<Project>(
      API_ENDPOINTS.NGOS.COMPLETE_PROJECT(ngoId, projectId),
      {}
    );
    return response.data;
  },
};