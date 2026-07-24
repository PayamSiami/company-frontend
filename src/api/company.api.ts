// frontend-company/src/api/company.api.ts
import { apiClient } from "./axios.config";
import type { ICompany } from "../types";
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
} from "../types/dto.types";

export const companyApi = {
  /**
   * Get company profile
   */
  getProfile: async (): Promise<{ data: ICompany }> => {
    const response = await apiClient.get<ICompany>("/company");
    return { data: response.data };
  },

  /**
   * Update company profile
   */
  updateProfile: async (
    data: UpdateCompanyDto,
  ): Promise<{ data: ICompany }> => {
    const response = await apiClient.put<ICompany>(
      "/company",
      data,
    );
    return { data: response.data };
  },

  /**
   * Create company profile (first time setup)
   */
  createProfile: async (
    data: CreateCompanyDto,
  ): Promise<{ data: ICompany }> => {
    const response = await apiClient.post<ICompany>("/company", data);
    return { data: response.data };
  },

  /**
   * Upload company logo
   */
  uploadLogo: async (file: File): Promise<{ data: { logoUrl: string } }> => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await apiClient.post<{ logoUrl: string }>(
      "/company/upload-logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return { data: response.data };
  },

  /**
   * Get company settings
   */
  getSettings: async (): Promise<{ data: any }> => {
    const response = await apiClient.get("/company/settings");
    return { data: response.data };
  },

  /**
   * Update company settings
   */
  updateSettings: async (data: any): Promise<{ data: any }> => {
    const response = await apiClient.put("/company/settings", data);
    return { data: response.data };
  },

  /**
   * Get company team members
   */
  getTeamMembers: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get("/company/team");
    return { data: response.data };
  },

  /**
   * Invite team member
   */
  inviteTeamMember: async (data: {
    email: string;
    role: string;
  }): Promise<{ data: any }> => {
    const response = await apiClient.post(
      "/company/team/invite",
      data,
    );
    return { data: response.data };
  },

  /**
   * Remove team member
   */
  removeTeamMember: async (
    userId: string,
  ): Promise<{ data: { success: boolean } }> => {
    const response = await apiClient.delete(`/company/team/${userId}`);
    return { data: response.data };
  },

  /**
   * Update team member role
   */
  updateTeamMemberRole: async (
    userId: string,
    role: string,
  ): Promise<{ data: any }> => {
    const response = await apiClient.put(
      `/company/team/${userId}/role`,
      { role },
    );
    return { data: response.data };
  },
};
