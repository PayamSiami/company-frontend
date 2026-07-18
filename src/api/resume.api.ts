// frontend-company/src/api/resume.api.ts
import { apiClient } from "./axios.config";
import type {
  ResumeResponseDto,
  CreateResumeDto,
  UpdateResumeDto,
  ResumeTemplate,
  ResumeVisibility,
} from "../types/dto.types";

export const resumeApi = {
  /**
   * Get all resumes for the current user
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    template?: ResumeTemplate;
    visibility?: ResumeVisibility;
  }): Promise<{ data: ResumeResponseDto[] }> => {
    const response = await apiClient.get<ResumeResponseDto[]>(
      "/employer/resumes",
      { params },
    );
    return { data: response.data };
  },

  /**
   * Get resume by ID
   */
  getById: async (id: string): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.get<ResumeResponseDto>(
      `/employer/resumes/${id}`,
    );
    return { data: response.data };
  },

  /**
   * Create a new resume
   */
  create: async (
    data: CreateResumeDto,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      "/employer/resumes",
      data,
    );
    return { data: response.data };
  },

  /**
   * Update resume
   */
  update: async (
    id: string,
    data: UpdateResumeDto,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${id}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete resume (soft delete)
   */
  delete: async (
    id: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/employer/resumes/${id}`);
    return { data: response.data };
  },

  /**
   * Get resume preview as HTML
   */
  getPreview: async (
    id: string,
  ): Promise<{ data: { html: string; css: string } }> => {
    const response = await apiClient.get<{ html: string; css: string }>(
      `/employer/resumes/${id}/preview`,
    );
    return { data: response.data };
  },

  /**
   * Download resume as PDF
   */
  downloadAsPdf: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/employer/resumes/${id}/download-pdf`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Download resume as Word document
   */
  downloadAsDocx: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(
      `/employer/resumes/${id}/download-docx`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  /**
   * Set resume as default
   */
  setDefault: async (
    id: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>(`/employer/resumes/${id}/set-default`);
    return { data: response.data };
  },

  /**
   * Get resume templates
   */
  getTemplates: async (): Promise<{
    data: { id: string; name: string; preview: string }[];
  }> => {
    const response = await apiClient.get<
      { id: string; name: string; preview: string }[]
    >("/employer/resumes/templates");
    return { data: response.data };
  },

  /**
   * Clone resume
   */
  clone: async (id: string): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${id}/clone`,
    );
    return { data: response.data };
  },

  /**
   * Get resume analytics
   */
  getAnalytics: async (
    id: string,
  ): Promise<{
    data: {
      views: number;
      downloads: number;
      applications: number;
      viewHistory: { date: string; count: number }[];
    };
  }> => {
    const response = await apiClient.get(`/employer/resumes/${id}/analytics`);
    return { data: response.data };
  },

  /**
   * Add work experience to resume
   */
  addWorkExperience: async (
    resumeId: string,
    data: {
      companyName: string;
      companyLogo?: string;
      jobTitle: string;
      employmentType: string;
      location?: string;
      startDate: string;
      endDate?: string;
      isCurrentJob: boolean;
      description?: string;
      technologies: string[];
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/work-experience`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update work experience
   */
  updateWorkExperience: async (
    resumeId: string,
    experienceId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/work-experience/${experienceId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete work experience
   */
  deleteWorkExperience: async (
    resumeId: string,
    experienceId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/work-experience/${experienceId}`,
    );
    return { data: response.data };
  },

  /**
   * Add education to resume
   */
  addEducation: async (
    resumeId: string,
    data: {
      institutionName: string;
      degree: string;
      fieldOfStudy: string;
      grade?: string;
      startDate: string;
      endDate?: string;
      isCurrentlyStudying: boolean;
      description?: string;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/education`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update education
   */
  updateEducation: async (
    resumeId: string,
    educationId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/education/${educationId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete education
   */
  deleteEducation: async (
    resumeId: string,
    educationId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/education/${educationId}`,
    );
    return { data: response.data };
  },

  /**
   * Add skill to resume
   */
  addSkill: async (
    resumeId: string,
    data: {
      skillName: string;
      proficiency: string;
      yearsOfExperience?: number;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/skills`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update skill
   */
  updateSkill: async (
    resumeId: string,
    skillId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/skills/${skillId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete skill
   */
  deleteSkill: async (
    resumeId: string,
    skillId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/skills/${skillId}`,
    );
    return { data: response.data };
  },

  /**
   * Add project to resume
   */
  addProject: async (
    resumeId: string,
    data: {
      title: string;
      description: string;
      technologies: string[];
      projectUrl?: string;
      sourceCodeUrl?: string;
      startDate: string;
      endDate?: string;
      isOngoing: boolean;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/projects`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update project
   */
  updateProject: async (
    resumeId: string,
    projectId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/projects/${projectId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete project
   */
  deleteProject: async (
    resumeId: string,
    projectId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/projects/${projectId}`,
    );
    return { data: response.data };
  },

  /**
   * Add certification to resume
   */
  addCertification: async (
    resumeId: string,
    data: {
      name: string;
      issuingOrganization: string;
      issueDate: string;
      expirationDate?: string;
      credentialId?: string;
      credentialUrl?: string;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/certifications`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update certification
   */
  updateCertification: async (
    resumeId: string,
    certificationId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/certifications/${certificationId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete certification
   */
  deleteCertification: async (
    resumeId: string,
    certificationId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/certifications/${certificationId}`,
    );
    return { data: response.data };
  },

  /**
   * Add award to resume
   */
  addAward: async (
    resumeId: string,
    data: {
      title: string;
      awardedBy: string;
      awardedDate: string;
      description?: string;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/awards`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update award
   */
  updateAward: async (
    resumeId: string,
    awardId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/awards/${awardId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete award
   */
  deleteAward: async (
    resumeId: string,
    awardId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/awards/${awardId}`,
    );
    return { data: response.data };
  },

  /**
   * Add language to resume
   */
  addLanguage: async (
    resumeId: string,
    data: {
      languageName: string;
      proficiency: string;
      displayOrder?: number;
    },
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.post<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/languages`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Update language
   */
  updateLanguage: async (
    resumeId: string,
    languageId: string,
    data: any,
  ): Promise<{ data: ResumeResponseDto }> => {
    const response = await apiClient.put<ResumeResponseDto>(
      `/employer/resumes/${resumeId}/languages/${languageId}`,
      data,
    );
    return { data: response.data };
  },

  /**
   * Delete language
   */
  deleteLanguage: async (
    resumeId: string,
    languageId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete(
      `/employer/resumes/${resumeId}/languages/${languageId}`,
    );
    return { data: response.data };
  },

  /**
   * Get resume completion score
   */
  getCompletionScore: async (
    id: string,
  ): Promise<{ data: { score: number; missingSections: string[] } }> => {
    const response = await apiClient.get<{
      score: number;
      missingSections: string[];
    }>(`/employer/resumes/${id}/completion-score`);
    return { data: response.data };
  },

  /**
   * Upload resume file (PDF/DOCX)
   */
  uploadFile: async (
    file: File,
  ): Promise<{
    data: { resumeId: string; fileName: string; fileUrl: string };
  }> => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await apiClient.post<{
      resumeId: string;
      fileName: string;
      fileUrl: string;
    }>("/employer/resumes/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { data: response.data };
  },

  /**
   * Parse resume file (AI extraction)
   */
  parseFile: async (
    resumeId: string,
  ): Promise<{ data: { sections: any; suggestions: string[] } }> => {
    const response = await apiClient.post<{
      sections: any;
      suggestions: string[];
    }>(`/employer/resumes/${resumeId}/parse`);
    return { data: response.data };
  },

  /**
   * Get resume suggestions (AI)
   */
  getSuggestions: async (
    id: string,
  ): Promise<{ data: { suggestions: string[]; improvements: string[] } }> => {
    const response = await apiClient.get<{
      suggestions: string[];
      improvements: string[];
    }>(`/employer/resumes/${id}/suggestions`);
    return { data: response.data };
  },
};
