// frontend-company/src/api/applications.api.ts
import { apiClient } from "./axios.config";
import type { IApplication } from "../types/model.types";
import type { UpdateApplicationStatusDto } from "../types/dto.types";

// ✅ Token is automatically added by axios interceptor
// The interceptor adds: Authorization: Bearer ${token}

export const applicationsApi = {
  /**
   * Get all applications for the employer
   * ✅ Token added by interceptor
   */
  getAll: (params?: {
    status?: string;
    jobId?: string;
    minScore?: number;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    return apiClient.get<IApplication[]>("/applications/employer", {
      params: {
        status: params?.status,
        jobId: params?.jobId,
        minScore: params?.minScore,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      },
    });
  },

  /**
   * Get application by ID
   * ✅ Token added by interceptor
   */
  getById: (id: string) => {
    return apiClient.get<IApplication>(`/applications/${id}`);
  },

  /**
   * Update application status
   * ✅ Token added by interceptor
   */
  updateStatus: (id: string, data: UpdateApplicationStatusDto) => {
    return apiClient.patch<IApplication>(`/applications/${id}/status`, data);
  },

  /**
   * Get application statistics
   * ✅ Token added by interceptor
   */
  getStats: () => {
    return apiClient.get("/employer/applications/stats");
  },

  /**
   * Bulk update applications
   * ✅ Token added by interceptor
   */
  bulkUpdate: (ids: string[], status: string, notes?: string) => {
    return apiClient.patch("/employer/applications/bulk", {
      ids,
      status,
      notes,
    });
  },

  /**
   * Get applications by job ID
   * ✅ Token added by interceptor
   */
  getByJobId: (
    jobId: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    },
  ) => {
    return apiClient.get<IApplication[]>(
      `/employer/applications/job/${jobId}`,
      {
        params: {
          status: params?.status,
          page: params?.page,
          limit: params?.limit,
        },
      },
    );
  },

  /**
   * Get applications for a specific candidate
   * ✅ Token added by interceptor
   */
  getByCandidateId: (candidateId: string) => {
    return apiClient.get<IApplication[]>(
      `/employer/applications/candidate/${candidateId}`,
    );
  },

  /**
   * Withdraw application (candidate)
   * ✅ Token added by interceptor
   */
  withdraw: (id: string) => {
    return apiClient.post(`/applications/${id}/withdraw`);
  },

  /**
   * Delete application (admin only)
   * ✅ Token added by interceptor
   */
  delete: (id: string) => {
    return apiClient.delete(`/admin/applications/${id}`);
  },
};
