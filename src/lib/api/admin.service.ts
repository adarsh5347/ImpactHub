import apiClient from "./client";
import { API_ENDPOINTS } from "./config";
import type {
  NGO,
  AdminNgoDetails,
  AdminNgoListFilters,
  AdminNgoListResponse,
  AdminNgoListItem,
  AdminVolunteerListFilters,
  AdminVolunteerListResponse,
  AdminVolunteerSummary,
  AdminStats,
} from "./types";

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function pickCount(data: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    if (key in data) {
      return toNumber(data[key]);
    }
  }
  return 0;
}

function normalizeAdminStats(data: unknown): AdminStats {
  const source = (data ?? {}) as Record<string, unknown>;
  const payload = (source.data && typeof source.data === "object"
    ? (source.data as Record<string, unknown>)
    : source) as Record<string, unknown>;

  return {
    pendingNgos: pickCount(payload, ["pendingNgos", "pendingNGOs", "pending_ngo", "pending_ngos"]),
    approvedNgos: pickCount(payload, ["approvedNgos", "approvedNGOs", "approved_ngo", "approved_ngos"]),
    rejectedNgos: pickCount(payload, ["rejectedNgos", "rejectedNGOs", "rejected_ngo", "rejected_ngos"]),
    totalVolunteers: pickCount(payload, [
      "totalVolunteers",
      "totalVolunteer",
      "volunteersCount",
      "volunteerCount",
      "registeredVolunteers",
      "total_volunteers",
    ]),
    totalProjects: pickCount(payload, ["totalProjects", "projectsCount", "projectCount", "total_projects"]),
  };
}

function normalizeNgoListResponse(
  data: AdminNgoListResponse | AdminNgoListItem[] | null | undefined,
  page: number,
  limit: number
): AdminNgoListResponse {
  if (!data) {
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page,
      limit,
    };
  }

  return {
    items: data.items ?? [],
    total: data.total ?? (data.items?.length ?? 0),
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
}

function normalizeNgoStatus(value: unknown): "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" {
  const raw = String(value ?? "").trim().toUpperCase();
  if (raw === "APPROVED") return "APPROVED";
  if (raw === "REJECTED") return "REJECTED";
  if (raw === "SUSPENDED") return "SUSPENDED";
  return "PENDING";
}

function mapNgoToAdminListItem(ngo: NGO): AdminNgoListItem {
  return {
    id: ngo.id,
    ngoName: ngo.ngoName,
    registrationNumber: ngo.registrationNumber,
    email: ngo.email ?? null,
    userEmail: ngo.userEmail ?? null,
    city: ngo.city ?? null,
    state: ngo.state ?? null,
    phone: ngo.phone ?? null,
    logoUrl: ngo.logoUrl ?? null,
    status: normalizeNgoStatus(ngo.status ?? (ngo.isVerified ? "APPROVED" : "PENDING")),
    createdAt: ngo.createdAt ?? null,
    updatedAt: ngo.updatedAt ?? null,
  };
}

function mapNgoToAdminDetails(ngo: NGO): AdminNgoDetails {
  return {
    ...mapNgoToAdminListItem(ngo),
    mission: ngo.mission ?? null,
    vision: ngo.vision ?? null,
    websiteUrl: ngo.websiteUrl ?? null,
    ngoType: ngo.ngoType ?? null,
    yearFounded: ngo.yearFounded ?? null,
    causeFocus: ngo.causeFocus ?? null,
    address: ngo.address ?? null,
    pincode: ngo.pincode ?? null,
    panNumber: ngo.panNumber ?? null,
    tanNumber: ngo.tanNumber ?? null,
    gstNumber: ngo.gstNumber ?? null,
    is12aRegistered: ngo.is12aRegistered ?? null,
    is80gRegistered: ngo.is80gRegistered ?? null,
    fcraRegistered: ngo.fcraRegistered ?? null,
    primaryContactName: ngo.primaryContactName ?? null,
    primaryContactPhone: ngo.primaryContactPhone ?? null,
    primaryContactEmail: ngo.primaryContactEmail ?? null,
  };
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.ADMIN.STATS);
    return normalizeAdminStats(response.data);
  },

  listNgos: async (filters?: AdminNgoListFilters): Promise<AdminNgoListResponse> => {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (filters?.status) {
      params.status = filters.status;
    }

    if (filters?.search?.trim()) {
      params.search = filters.search.trim();
    }

    const response = await apiClient.get<AdminNgoListResponse | AdminNgoListItem[]>(
      API_ENDPOINTS.ADMIN.NGOS,
      { params }
    );

    const normalized = normalizeNgoListResponse(response.data, page, limit);

    if (normalized.items.length > 0) {
      return normalized;
    }

    const ngoStatus = filters?.status;
    const ngoParams: Record<string, string | boolean> = {};
    if (filters?.search?.trim()) {
      ngoParams.search = filters.search.trim();
    }
    if (ngoStatus === "PENDING") {
      ngoParams.verified = false;
    }
    if (ngoStatus === "APPROVED") {
      ngoParams.verified = true;
    }

    const ngoResponse = await apiClient.get<NGO[]>(API_ENDPOINTS.NGOS.LIST, { params: ngoParams });
    const mapped = (ngoResponse.data ?? []).map(mapNgoToAdminListItem);
    const filteredByStatus = ngoStatus ? mapped.filter((ngo) => ngo.status === ngoStatus) : mapped;

    return {
      items: filteredByStatus,
      total: filteredByStatus.length,
      page,
      limit,
    };
  },

  getRegisteredVolunteers: async (
    filters?: AdminVolunteerListFilters
  ): Promise<AdminVolunteerListResponse> => {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const params: Record<string, string | number> = { page, limit };

    if (filters?.search?.trim()) {
      params.search = filters.search.trim();
    }

    const response = await apiClient.get<AdminVolunteerListResponse>(API_ENDPOINTS.ADMIN.VOLUNTEERS, {
      params,
    });

    const data = response.data as
      | (Partial<AdminVolunteerListResponse> & { data?: AdminVolunteerSummary[] })
      | undefined;
    const items = (data?.items ?? data?.data ?? []) as AdminVolunteerSummary[];

    return {
      items,
      total: data?.total ?? items.length,
      page: data?.page ?? page,
      limit: data?.limit ?? limit,
    };
  },

  getNgoDetails: async (id: string | number): Promise<AdminNgoDetails> => {
    try {
      const response = await apiClient.get<AdminNgoDetails>(API_ENDPOINTS.ADMIN.NGO_DETAIL(id));
      return response.data;
    } catch {
      const response = await apiClient.get<NGO>(API_ENDPOINTS.NGOS.DETAIL(id));
      return mapNgoToAdminDetails(response.data);
    }
  },

  deleteNgo: async (id: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN.NGO_DETAIL(id));
  },

  approveNgo: async (id: string | number): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ADMIN.APPROVE_NGO(id), {});
  },

  rejectNgo: async (id: string | number, reason: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ADMIN.REJECT_NGO(id), { reason });
  },

  suspendNgo: async (id: string | number, reason: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ADMIN.SUSPEND_NGO(id), { reason });
  },
};
