import { apiClient } from './axios.config'
import { type AIScreeningDataDto, type DashboardStatsDto } from '../types/dto.types'

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStatsDto>('/dashboard/stats'),

  getAIScreeningData: () => apiClient.get<AIScreeningDataDto>('/dashboard/ai-screening'),
}
