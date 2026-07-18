// frontend-company/src/api/jobs.api.ts
import { apiClient } from "./axios.config";
import type { CreateJobDto, IJob, UpdateJobDto } from "../types";

export const jobsApi = {
  getAll: (params?: { status?: string; isActive?: boolean }) =>
    apiClient.get<IJob[]>("/employer/jobs", { params }),

  getById: (id: string) => apiClient.get<IJob>(`/jobs/${id}`),

  create: async (data: CreateJobDto): Promise<{ data: IJob }> => {
    // ✅ Clean up data before sending
    const payload: any = {
      title: data.title,
      company: data.company,
      description: data.description,
      location: data.location,
    };

    // ✅ Only include optional fields if they have values
    if (data.minSalary !== undefined && data.minSalary > 0) {
      payload.minSalary = data.minSalary;
    }
    if (data.maxSalary !== undefined && data.maxSalary > 0) {
      payload.maxSalary = data.maxSalary;
    }
    if (data.salary !== undefined && data.salary > 0) {
      payload.salary = data.salary;
    }
    if (data.requirements) payload.requirements = data.requirements;
    if (data.responsibilities) payload.responsibilities = data.responsibilities;
    if (data.benefits) payload.benefits = data.benefits;
    if (data.skills && data.skills.length > 0) payload.skills = data.skills;
    if (data.tags && data.tags.length > 0) payload.tags = data.tags;
    if (data.jobType) payload.jobType = data.jobType;
    if (data.workMode) payload.workMode = data.workMode;
    if (data.experienceLevel) payload.experienceLevel = data.experienceLevel;
    if (data.openings) payload.openings = data.openings;
    if (data.applicationDeadline)
      payload.applicationDeadline = data.applicationDeadline;
    if (data.expiresAt) payload.expiresAt = data.expiresAt;

    const response = await apiClient.post<IJob>("/jobs", payload);
    return { data: response.data };
  },

  update: (id: string, data: UpdateJobDto) =>
    apiClient.put<IJob>(`/employer/jobs/${id}`, data),

  delete: (id: string) => apiClient.delete(`/employer/jobs/${id}`),

  publish: (id: string) =>
    apiClient.patch<IJob>(`/employer/jobs/${id}/publish`),

  close: (id: string) => apiClient.patch<IJob>(`/employer/jobs/${id}/close`),

  getApplications: (jobId: string) =>
    apiClient.get(`/employer/jobs/${jobId}/applications`),

  getAnalytics: async (timeRange?: string): Promise<any> => {
    const response = await apiClient.get("/jobs/employer/analytics", {
      params: { timeRange: timeRange || "30d" },
    });
    return response.data.data;
  },
  getCandidateRecommendations: async (params?: any): Promise<any> => {
    const response = await apiClient.get(
      "/employer/candidates/recommendations",
      {
        params,
      },
    );
    return response.data.data;
  },
};
