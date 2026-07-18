// frontend-company/src/api/ai.api.ts
import { apiClient } from "./axios.config";
import type { AIJobGenerationDto } from "../types/dto.types";

export const aiApi = {
  generateJobContent: (data: AIJobGenerationDto) =>
    apiClient.post<{ content: string | string[] }>(
      "/jobs/generate-content",
      data,
    ),
  getScreeningInsights: () => apiClient.get("/employer/ai/screening-insights"),
  generateInterviewQuestions: (data: any) =>
    apiClient.post("/employer/ai/screening-insights", { data }),
};
