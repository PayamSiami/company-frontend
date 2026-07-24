// frontend-company/src/api/candidates.api.ts
import { apiClient } from "./axios.config";
import type { ICandidate } from "../types";
import type { CandidateFiltersDto } from "../types/dto.types";

export const candidatesApi = {
  /**
   * Get all candidates with filters and pagination
   */
  getAll: async (
    params?: CandidateFiltersDto,
  ): Promise<{ data: ICandidate[] }> => {
    const response = await apiClient.get<ICandidate[]>("/candidates", {
      params: {
        search: params?.search,
        skills: params?.skills?.join(","),
        location: params?.location,
        minExperience: params?.minExperience,
        maxExperience: params?.maxExperience,
        // page: params?.page,
        // limit: params?.limit,
      },
    });
    return { data: response.data };
  },

  /**
   * Get candidate by ID with full details
   */
  getById: async (id: string): Promise<{ data: ICandidate }> => {
    const response = await apiClient.get<ICandidate>(
      `/candidates/${id}`,
    );
    return { data: response.data };
  },

  /**
   * Shortlist a candidate
   */
  shortlist: async (
    candidateId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/candidates/${candidateId}/shortlist`);
    return { data: response.data };
  },

  /**
   * Remove candidate from shortlist
   */
  unshortlist: async (
    candidateId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/candidates/${candidateId}/shortlist`);
    return { data: response.data };
  },

  /**
   * Get candidate's applications
   */
  getApplications: async (candidateId: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}`,
    );
    return { data: response.data };
  },

  /**
   * Get candidate's resume
   */
  getResume: async (candidateId: string): Promise<{ data: any }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/resume`,
    );
    return { data: response.data };
  },

  /**
   * Get candidate analytics and insights
   */
  getAnalytics: async (candidateId: string): Promise<{ data: any }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/analytics`,
    );
    return { data: response.data };
  },

  /**
   * Get candidate's skills
   */
  getSkills: async (candidateId: string): Promise<{ data: string[] }> => {
    const response = await apiClient.get<string[]>(
      `/candidates/${candidateId}/skills`,
    );
    return { data: response.data };
  },

  /**
   * Get candidate's experience
   */
  getExperience: async (candidateId: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/experience`,
    );
    return { data: response.data };
  },

  /**
   * Get candidate's education
   */
  getEducation: async (candidateId: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/education`,
    );
    return { data: response.data };
  },

  /**
   * Download candidate resume as PDF
   */
  downloadResume: async (candidateId: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/resume/download`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Send message to candidate
   */
  sendMessage: async (
    candidateId: string,
    message: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/candidates/${candidateId}/message`, { message });
    return { data: response.data };
  },

  /**
   * Schedule interview with candidate
   */
  scheduleInterview: async (
    candidateId: string,
    data: {
      date: string;
      time: string;
      duration?: number;
      location?: string;
      meetingLink?: string;
      notes?: string;
    },
  ): Promise<{
    data: { success: boolean; message: string; interviewId: string };
  }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      interviewId: string;
    }>(`/candidates/${candidateId}/schedule-interview`, data);
    return { data: response.data };
  },

  /**
   * Get candidate's status (active, inactive, etc.)
   */
  getStatus: async (
    candidateId: string,
  ): Promise<{ data: { status: string; lastActivity: string } }> => {
    const response = await apiClient.get<{
      status: string;
      lastActivity: string;
    }>(`/candidates/${candidateId}/status`);
    return { data: response.data };
  },

  /**
   * Update candidate status
   */
  updateStatus: async (
    candidateId: string,
    status: "ACTIVE" | "INACTIVE" | "BLACKLISTED",
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/candidates/${candidateId}/status`, { status });
    return { data: response.data };
  },

  /**
   * Add note to candidate profile
   */
  addNote: async (
    candidateId: string,
    note: string,
  ): Promise<{
    data: { success: boolean; message: string; noteId: string };
  }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      noteId: string;
    }>(`/candidates/${candidateId}/notes`, { note });
    return { data: response.data };
  },

  /**
   * Get candidate notes
   */
  getNotes: async (
    candidateId: string,
  ): Promise<{
    data: { id: string; note: string; createdAt: string; createdBy: string }[];
  }> => {
    const response = await apiClient.get(
      `/candidates/${candidateId}/notes`,
    );
    return { data: response.data };
  },

  /**
   * Search candidates by keyword
   */
  search: async (keyword: string): Promise<{ data: ICandidate[] }> => {
    const response = await apiClient.get<ICandidate[]>(
      `/candidates/search`,
      {
        params: { keyword },
      },
    );
    return { data: response.data };
  },

  /**
   * Get recommended candidates for a job
   */
  getRecommendations: async (
    jobId: string,
  ): Promise<{ data: ICandidate[] }> => {
    const response = await apiClient.get<ICandidate[]>(
      `/candidates/recommendations`,
      {
        params: { jobId },
      },
    );
    return { data: response.data };
  },

  /**
   * Get candidate statistics
   */
  getStats: async (): Promise<{
    data: {
      total: number;
      active: number;
      shortlisted: number;
      newThisWeek: number;
      averageSkills: number;
    };
  }> => {
    const response = await apiClient.get("/candidates/stats");
    return { data: response.data };
  },
};
