// frontend-company/src/store/slices/notifications.slice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { notificationsApi } from "../../api/notifications.api";
import type {
  NotificationResponseDto,
  NotificationFiltersDto,
} from "../../types/dto.types";

interface NotificationsState {
  notifications: NotificationResponseDto[];
  selectedNotification: NotificationResponseDto | null;
  unreadCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  filters: NotificationFiltersDto;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  settings: any | null;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedNotification: null,
  unreadCount: 0,
  isLoading: false,
  isUpdating: false,
  error: null,
  success: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  settings: null,
};

// ==================== Async Thunks ====================

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params: NotificationFiltersDto, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getAll(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notification",
      );
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getUnreadCount();
      return response.data.count;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count",
      );
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.markAsRead(notificationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.markAllAsRead();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationsApi.delete(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification",
      );
    }
  },
);

export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.deleteAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete all notifications",
      );
    }
  },
);

export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getSettings();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings",
      );
    }
  },
);

export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (settings: any, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.updateSettings(settings);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings",
      );
    }
  },
);

// ==================== Slice ====================

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationFilters: (
      state,
      action: PayloadAction<NotificationFiltersDto>,
    ) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    clearNotificationFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setNotificationPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    clearNotificationsError: (state) => {
      state.error = null;
    },
    clearNotificationsSuccess: (state) => {
      state.success = null;
    },
    // Local notification (e.g., from WebSocket)
    addLocalNotification: (
      state,
      action: PayloadAction<NotificationResponseDto>,
    ) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      state.pagination.total += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch notifications";
      })

      // Fetch By ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedNotification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch notification";
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark as Read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id,
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        if (state.selectedNotification?._id === action.payload._id) {
          state.selectedNotification = action.payload;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.success = "Notification marked as read";
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to mark as read";
      })

      // Mark All as Read
      .addCase(markAllAsRead.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
        state.unreadCount = 0;
        state.success =
          action.payload.message || "All notifications marked as read";
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to mark all as read";
      })

      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isUpdating = false;
        const deleted = state.notifications.find(
          (n) => n._id === action.payload,
        );
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload,
        );
        if (deleted && !deleted.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedNotification?._id === action.payload) {
          state.selectedNotification = null;
        }
        state.success = "Notification deleted";
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to delete notification";
      })

      // Delete All
      .addCase(deleteAllNotifications.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteAllNotifications.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.notifications = [];
        state.unreadCount = 0;
        state.pagination.total = 0;
        state.success = action.payload?.message || "All notifications deleted";
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to delete all notifications";
      })

      // Fetch Settings
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })

      // Update Settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.settings = action.payload;
        state.success = "Settings updated successfully";
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update settings";
      });
  },
});

// ==================== Actions ====================
export const {
  setNotificationFilters,
  clearNotificationFilters,
  setNotificationPage,
  clearSelectedNotification,
  clearNotificationsError,
  clearNotificationsSuccess,
  addLocalNotification,
} = notificationsSlice.actions;

// ==================== Selectors ====================
export const selectNotifications = (state: {
  notifications: NotificationsState;
}) => state.notifications.notifications;
export const selectSelectedNotification = (state: {
  notifications: NotificationsState;
}) => state.notifications.selectedNotification;
export const selectUnreadCount = (state: {
  notifications: NotificationsState;
}) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: {
  notifications: NotificationsState;
}) => state.notifications.isLoading;
export const selectNotificationsUpdating = (state: {
  notifications: NotificationsState;
}) => state.notifications.isUpdating;
export const selectNotificationsError = (state: {
  notifications: NotificationsState;
}) => state.notifications.error;
export const selectNotificationsSuccess = (state: {
  notifications: NotificationsState;
}) => state.notifications.success;
export const selectNotificationFilters = (state: {
  notifications: NotificationsState;
}) => state.notifications.filters;
export const selectNotificationPagination = (state: {
  notifications: NotificationsState;
}) => state.notifications.pagination;
export const selectNotificationSettings = (state: {
  notifications: NotificationsState;
}) => state.notifications.settings;

export default notificationsSlice.reducer;
