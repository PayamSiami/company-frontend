// frontend-company/src/api/dashboard.api.ts
import { apiClient } from './axios.config';
import {  type AIScreeningDataDto, type DashboardStatsDto } from '../types/dto.types';

export const dashboardApi = {
  getStats: () => 
    apiClient.get<DashboardStatsDto>('/employer/dashboard/stats'),
  
  getAIScreeningData: () => 
    apiClient.get<AIScreeningDataDto>('/employer/dashboard/ai-screening'),
  
  getRecentActivity: (limit: number = 10) => 
    apiClient.get(`/employer/dashboard/recent-activity?limit=${limit}`),
  
  getApplicationStats: () => 
    apiClient.get('/employer/dashboard/application-stats'),
};