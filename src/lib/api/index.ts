/**
 * API Index
 * Central export file for all API services
 */

// Export API client (default export from client.ts)
export { default as apiClient, getErrorMessage } from "./client";

// Export configuration
export * from "./config";

// Export shared types
export * from "./types";

// Export services (named exports only)
export * as authService from "./auth.service";
export * as ngoService from "./ngo.service";
export * as volunteerService from "./volunteer.service";
export * as projectService from "./project.service";
export * as adminService from "./admin.service";
export * as enrollmentService from "./enrollment.service";