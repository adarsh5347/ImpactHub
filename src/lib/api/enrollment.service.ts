import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type { ProjectEnrollmentGroup, ProjectEnrollmentVolunteer } from './types';

export const enrollmentService = {
  getNgoEnrollments: async (ngoId: string | number): Promise<ProjectEnrollmentGroup[]> => {
    const response = await apiClient.get<ProjectEnrollmentGroup[]>(API_ENDPOINTS.NGOS.ENROLLMENTS(ngoId));
    return response.data ?? [];
  },

  getProjectEnrollments: async (
    ngoId: string | number,
    projectId: string | number
  ): Promise<ProjectEnrollmentVolunteer[]> => {
    const response = await apiClient.get<ProjectEnrollmentVolunteer[]>(
      API_ENDPOINTS.NGOS.PROJECT_ENROLLMENTS(ngoId, projectId)
    );
    return response.data ?? [];
  },
};
