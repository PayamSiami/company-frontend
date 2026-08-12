import { apiClient } from './axios.config'

export const activityApi = {
  getActivities: (params: { limit: number; page: number }) => apiClient.get('/activities', { params }),

  getActivityStats: () => apiClient.get('/activities/stats'),
}
