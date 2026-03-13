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

type ProjectCreateVariant = {
  endpoint: string;
  payload: Record<string, unknown>;
};

function shouldRetryCreate(status?: number): boolean {
  return status === 400 || status === 401 || status === 403 || status === 404 || status === 405;
}

function extractProjectResponse(data: unknown): Project {
  if (data && typeof data === "object" && "data" in (data as Record<string, unknown>)) {
    return (data as { data: Project }).data;
  }

  return data as Project;
}

function toObjectiveList(value?: string): string[] | undefined {
  if (!value?.trim()) return undefined;

  const objectives = value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return objectives.length ? objectives : undefined;
}

function toBackendEnum(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  return value
    .trim()
    .replace(/&/g, " AND ")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .toUpperCase();
}

function uniqueVariants(variants: ProjectCreateVariant[]): ProjectCreateVariant[] {
  const seen = new Set<string>();

  return variants.filter((variant) => {
    const key = `${variant.endpoint}:${JSON.stringify(variant.payload)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildCreateVariants(
  ngoId: string | number,
  payload: ProjectCreateRequest
): ProjectCreateVariant[] {
  const objectivesList = toObjectiveList(payload.objectives);
  const enumCause = toBackendEnum(payload.cause);
  const enumStatus = toBackendEnum(payload.status);

  const basePayload = {
    title: payload.title.trim(),
    ...(payload.description?.trim() ? { description: payload.description.trim() } : {}),
    ...(payload.objectives?.trim() ? { objectives: payload.objectives.trim() } : {}),
    ...(payload.cause?.trim() ? { cause: payload.cause.trim() } : {}),
    ...(payload.location?.trim() ? { location: payload.location.trim() } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(typeof payload.fundingGoal === "number" && !Number.isNaN(payload.fundingGoal)
      ? { fundingGoal: payload.fundingGoal }
      : { fundingGoal: 0 }),
    ...(payload.startDate ? { startDate: payload.startDate } : {}),
    ...(payload.endDate ? { endDate: payload.endDate } : {}),
    ...(typeof payload.beneficiaries === "number" && payload.beneficiaries > 0
      ? { beneficiaries: payload.beneficiaries }
      : {}),
    ...(payload.imageUrl?.trim() ? { imageUrl: payload.imageUrl.trim() } : {}),
    ...(Array.isArray(payload.requiredResources) && payload.requiredResources.length > 0
      ? { requiredResources: payload.requiredResources }
      : {}),
    ...(typeof payload.volunteersNeeded === "number" && payload.volunteersNeeded > 0
      ? { volunteersNeeded: payload.volunteersNeeded }
      : {}),
  };

  const enumPayload: Record<string, unknown> = {
    ...basePayload,
    ...(enumCause ? { cause: enumCause } : {}),
    ...(enumStatus ? { status: enumStatus } : {}),
  };

  const statuslessPayload: Record<string, unknown> = {
    ...basePayload,
  };
  delete statuslessPayload.status;

  const enumStatuslessPayload: Record<string, unknown> = {
    ...enumPayload,
  };
  delete enumStatuslessPayload.status;

  const minimalPayload: Record<string, unknown> = {
    title: basePayload.title,
    ...(basePayload.description ? { description: basePayload.description } : {}),
    ...(basePayload.cause ? { cause: basePayload.cause } : {}),
    ...(basePayload.location ? { location: basePayload.location } : {}),
    fundingGoal: basePayload.fundingGoal,
    ...(basePayload.startDate ? { startDate: basePayload.startDate } : {}),
    ...(basePayload.endDate ? { endDate: basePayload.endDate } : {}),
    ...(typeof basePayload.beneficiaries === "number" ? { beneficiaries: basePayload.beneficiaries } : {}),
    ...(typeof basePayload.volunteersNeeded === "number" ? { volunteersNeeded: basePayload.volunteersNeeded } : {}),
  };

  const enumMinimalPayload: Record<string, unknown> = {
    title: basePayload.title,
    ...(basePayload.description ? { description: basePayload.description } : {}),
    ...(enumCause ? { cause: enumCause } : {}),
    ...(basePayload.location ? { location: basePayload.location } : {}),
    fundingGoal: basePayload.fundingGoal,
    ...(basePayload.startDate ? { startDate: basePayload.startDate } : {}),
    ...(basePayload.endDate ? { endDate: basePayload.endDate } : {}),
    ...(typeof basePayload.beneficiaries === "number" ? { beneficiaries: basePayload.beneficiaries } : {}),
    ...(typeof basePayload.volunteersNeeded === "number" ? { volunteersNeeded: basePayload.volunteersNeeded } : {}),
  };

  const arrayObjectivesPayload: Record<string, unknown> = {
    ...minimalPayload,
    ...(objectivesList ? { objectives: objectivesList } : {}),
  };

  const enumArrayObjectivesPayload: Record<string, unknown> = {
    ...enumMinimalPayload,
    ...(objectivesList ? { objectives: objectivesList } : {}),
  };

  const baseWithNgoId = { ...basePayload, ngoId };
  const enumWithNgoId = { ...enumPayload, ngoId };
  const statuslessWithNgoId = { ...statuslessPayload, ngoId };
  const enumStatuslessWithNgoId = { ...enumStatuslessPayload, ngoId };
  const minimalWithNgoId = { ...minimalPayload, ngoId };
  const enumMinimalWithNgoId = { ...enumMinimalPayload, ngoId };
  const arrayObjectivesWithNgoId = { ...arrayObjectivesPayload, ngoId };
  const enumArrayObjectivesWithNgoId = { ...enumArrayObjectivesPayload, ngoId };

  return uniqueVariants([
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: basePayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: enumPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: statuslessPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: enumStatuslessPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: minimalPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: enumMinimalPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: arrayObjectivesPayload },
    { endpoint: API_ENDPOINTS.NGOS.PROJECTS(ngoId), payload: enumArrayObjectivesPayload },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: baseWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: enumWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: statuslessWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: enumStatuslessWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: minimalWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: enumMinimalWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: arrayObjectivesWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE, payload: enumArrayObjectivesWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: baseWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: enumWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: statuslessWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: enumStatuslessWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: minimalWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: enumMinimalWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: arrayObjectivesWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: enumArrayObjectivesWithNgoId },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: minimalPayload },
    { endpoint: API_ENDPOINTS.PROJECTS.CREATE_ALT, payload: enumMinimalPayload },
  ]);
}

export const projectService = {
  createProject: async (ngoId: string | number, data: ProjectCreateRequest): Promise<Project> => {
    const variants = buildCreateVariants(ngoId, data);
    let lastError: unknown = null;
    let bestBadRequestError: unknown = null;

    for (const variant of variants) {
      try {
        const response = await apiClient.post<Project | { data: Project }>(variant.endpoint, variant.payload);
        return extractProjectResponse(response.data);
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status as number | undefined;
        if (status === 400 && !bestBadRequestError) {
          bestBadRequestError = error;
        }
        if (!shouldRetryCreate(status)) {
          throw error;
        }
      }
    }

    throw bestBadRequestError ?? lastError;
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