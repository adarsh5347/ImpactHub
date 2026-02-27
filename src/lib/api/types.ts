/**
 * Shared API Types (aligned with current backend)
 */

// ==================== Common ====================

export type Id = number;

export type UserType = "VOLUNTEER" | "NGO" | "ADMIN";

// Backend mostly returns direct payloads (not { success, data } wrappers).
// Keep only if some endpoints still use wrapper format in frontend code.
export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ==================== Auth ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string | null;
  userType: UserType | null;
  role?: UserType | null;
  userId?: number | null;
  fullName?: string | null;
  email: string | null;
  message: string | null;
}

export interface AuthMeResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserType;
}

export interface AuthUser {
  id: number | null;
  fullName: string | null;
  email: string | null;
}

// ==================== Volunteer ====================

export type VolunteerGender = "Male" | "Female" | "Other" | "PreferNotToSay";
export type VolunteerExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface RegisterVolunteerRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string; // yyyy-mm-dd
  gender?: VolunteerGender;
  address?: string;
  city?: string;
  state?: string;
   pincode?: string;
  skills?: string[];
  interests?: string[];
  availability?: string;
  preferredCauses?: string[];
  experienceLevel?: VolunteerExperienceLevel;
  education?: string;
  occupation?: string;
  linkedinUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface VolunteerUpdateRequest {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string; // yyyy-mm-dd
  gender?: VolunteerGender;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  skills?: string[];
  interests?: string[];
  availability?: string;
  preferredCauses?: string[];
  experienceLevel?: VolunteerExperienceLevel;
  education?: string;
  occupation?: string;
  linkedinUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Volunteer {
  id: Id;
  email: string | null;
  fullName: string;
  phone?: string | null;
  dateOfBirth?: string | null; // yyyy-mm-dd
  gender?: VolunteerGender | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  skills?: string[] | null;
  interests?: string[] | null;
  availability?: string | null;
   preferredCauses?: string[] | null;
  experienceLevel?: VolunteerExperienceLevel | null;
  education?: string | null;
  occupation?: string | null;
  linkedinUrl?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface VolunteerActivity {
  enrollmentId: Id;
  projectId: Id | null;
  projectTitle: string | null;
  status: string | null; // ACTIVE | COMPLETED | CANCELLED
  hoursContributed: number | null;
  enrollmentDate: string | null;
}

// ==================== NGO ====================

export type NGOType = "Trust" | "Society" | "Section8Company" | "Other";

export interface RegisterNGORequest {
  email: string;
  password: string;
   ngoName: string;
  registrationNumber: string;
  yearFounded?: number;
  ngoType?: NGOType;
  causeFocus?: string[];
  mission?: string;
  vision?: string;
  websiteUrl?: string;
  phone?: string;
  ngoEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  tanNumber?: string;
  gstNumber?: string;
  is12aRegistered?: boolean;
  is80gRegistered?: boolean;
  fcraRegistered?: boolean;
  bankAccountNumber?: string;
  bankName?: string;
  bankIfsc?: string;
  bankBranch?: string;
  primaryContactName?: string;
  primaryContactDesignation?: string;
  primaryContactPhone?: string;
  primaryContactEmail?: string;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
}

export interface NGOUpdateRequest {
  ngoName?: string;
  yearFounded?: number;
  ngoType?: NGOType;
  causeFocus?: string[];
  mission?: string;
  vision?: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  tanNumber?: string;
  gstNumber?: string;
  is12aRegistered?: boolean;
  is80gRegistered?: boolean;
  fcraRegistered?: boolean;
  bankAccountNumber?: string;
  bankName?: string;
  bankIfsc?: string;
  bankBranch?: string;
  primaryContactName?: string;
  primaryContactDesignation?: string;
  primaryContactPhone?: string;
  primaryContactEmail?: string;
  logoUrl?: string;
  logoPublicId?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
}

export interface NGO {
  id: Id;
  userEmail: string | null;
  ngoName: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | string | null;
  registrationNumber: string;
  yearFounded?: number | null;
  ngoType?: NGOType | null;
  causeFocus?: string[] | null;
  mission?: string | null;
  vision?: string | null;
  websiteUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  tanNumber?: string | null;
  gstNumber?: string | null;
  is12aRegistered?: boolean | null;
  is80gRegistered?: boolean | null;
  fcraRegistered?: boolean | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
  primaryContactName?: string | null;
  primaryContactDesignation?: string | null;
  primaryContactPhone?: string | null;
  primaryContactEmail?: string | null;
  isVerified?: boolean | null;
  verificationDate?: string | null;
  activeProjects?: number | null;
  completedProjects?: number | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
export type NGOFilters = {
  cause?: string;
  city?: string;
  state?: string;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

// ==================== Project ====================

export type ProjectStatus = "DRAFT" | "OPEN" | "ONGOING" | "COMPLETED";

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  objectives?: string;
  cause?: string;
  location?: string;
  status?: ProjectStatus;
  startDate?: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd
  beneficiaries?: number;
  imageUrl?: string;
  requiredResources?: string[];
  volunteersNeeded?: number;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  objectives?: string;
  cause?: string;
  location?: string;
  status?: ProjectStatus;
  startDate?: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd
  beneficiaries?: number;
  imageUrl?: string;
  requiredResources?: string[];
  volunteersNeeded?: number;
  volunteersEnrolled?: number;
}
export interface Project {
  id: Id;
  ngoId: Id | null;
  ngoName: string | null;
  title: string;
  description?: string | null;
  objectives?: string | null;
  cause?: string | null;
  location?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  beneficiaries: number | null;
  imageUrl?: string | null;
  requiredResources?: string[] | null;
  volunteersNeeded: number | null;
  volunteersEnrolled: number | null;
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  cause?: string;
  location?: string;
  ngoId?: number;
}

export interface EnrollmentResponse {
  message: string;
  enrollmentId: number;
  projectId: number;
  volunteerId: number;
  status: string;
  enrolledAt: string;
}

export interface ProjectEnrollmentVolunteer {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  enrolledAt: string;
}

export interface ProjectEnrollmentGroup {
  projectId: number;
  projectTitle: string;
  location: string;
  status: string;
  enrolledVolunteers: ProjectEnrollmentVolunteer[];
}

// ==================== Admin ====================

export type AdminNgoStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface AdminStats {
  pendingNgos: number;
  approvedNgos: number;
  rejectedNgos: number;
  totalVolunteers: number;
  totalProjects: number;
}

export interface AdminNgoListItem {
  id: Id;
  ngoName: string;
  registrationNumber?: string | null;
  email?: string | null;
  userEmail?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  status: AdminNgoStatus;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminNgoDetails extends AdminNgoListItem {
  mission?: string | null;
  vision?: string | null;
  websiteUrl?: string | null;
  ngoType?: string | null;
  yearFounded?: number | null;
  causeFocus?: string[] | null;
  address?: string | null;
  pincode?: string | null;
  panNumber?: string | null;
  tanNumber?: string | null;
  gstNumber?: string | null;
  is12aRegistered?: boolean | null;
  is80gRegistered?: boolean | null;
  fcraRegistered?: boolean | null;
  primaryContactName?: string | null;
  primaryContactPhone?: string | null;
  primaryContactEmail?: string | null;
  auditCreatedBy?: string | null;
  auditUpdatedBy?: string | null;
}

export interface AdminNgoListResponse {
  items: AdminNgoListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminNgoListFilters {
  status?: AdminNgoStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminVolunteerSummary {
  id: Id;
  fullName: string;
  email: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  createdAt?: string | null;
}

export interface AdminVolunteerListResponse {
  items: AdminVolunteerSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminVolunteerListFilters {
  search?: string;
  page?: number;
  limit?: number;
}