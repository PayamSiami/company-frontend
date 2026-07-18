// frontend-company/src/api/notifications.api.ts
import { apiClient } from "./axios.config";
import type {
  NotificationResponseDto,
  NotificationFiltersDto,
} from "../types/dto.types";

export const notificationsApi = {
  /**
   * Get all notifications with pagination and filters
   */
  getAll: async (
    params?: NotificationFiltersDto,
  ): Promise<{ data: NotificationResponseDto[] }> => {
    const response = await apiClient.get<NotificationResponseDto[]>(
      "/employer/notifications",
      {
        params: {
          // page: params?.page,
          // limit: params?.limit,
          type: params?.type,
          read: params?.read,
          dateFrom: params?.dateFrom,
          dateTo: params?.dateTo,
        },
      },
    );
    return { data: response.data };
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<{ data: { count: number } }> => {
    const response = await apiClient.get<{ count: number }>(
      "/employer/notifications/unread/count",
    );
    return { data: response.data };
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (
    notificationId: string,
  ): Promise<{ data: NotificationResponseDto }> => {
    const response = await apiClient.patch<NotificationResponseDto>(
      `/employer/notifications/${notificationId}/read`,
    );
    return { data: response.data };
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{
    data: { success: boolean; message: string };
  }> => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
    }>("/employer/notifications/read-all");
    return { data: response.data };
  },

  /**
   * Delete a single notification
   */
  delete: async (
    notificationId: string,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/employer/notifications/${notificationId}`);
    return { data: response.data };
  },

  /**
   * Delete all notifications
   */
  deleteAll: async (): Promise<{
    data: { success: boolean; message: string };
  }> => {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>("/employer/notifications");
    return { data: response.data };
  },

  /**
   * Get notification by ID
   */
  getById: async (
    notificationId: string,
  ): Promise<{ data: NotificationResponseDto }> => {
    const response = await apiClient.get<NotificationResponseDto>(
      `/employer/notifications/${notificationId}`,
    );
    return { data: response.data };
  },

  /**
   * Get notification settings
   */
  getSettings: async (): Promise<{ data: any }> => {
    const response = await apiClient.get("/employer/notifications/settings");
    return { data: response.data };
  },

  /**
   * Update notification settings
   */
  updateSettings: async (
    settings: any,
  ): Promise<{ data: { success: boolean; message: string } }> => {
    const response = await apiClient.put(
      "/employer/notifications/settings",
      settings,
    );
    return { data: response.data };
  },
};
