// frontend-company/src/store/slices/dashboard.slice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { dashboardApi } from "../../api/dashboard.api";
import type {
  DashboardStatsDto,
  AIScreeningDataDto,
} from "../../types/dto.types";

interface DashboardState {
  stats: DashboardStatsDto | null;
  screeningData: AIScreeningDataDto | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: null,
  screeningData: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
};

// ==================== Async Thunks ====================

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: any = await dashboardApi.getStats();
      return data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats",
      );
    }
  },
);

export const fetchAIScreeningData = createAsyncThunk(
  "dashboard/fetchAIScreening",
  async (_, { rejectWithValue }) => {
    try {
      const { data }: any = await dashboardApi.getAIScreeningData();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch AI screening data",
      );
    }
  },
);

export const refreshDashboard = createAsyncThunk(
  "dashboard/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all([
        dispatch(fetchDashboardStats()).unwrap(),
        dispatch(fetchAIScreeningData()).unwrap(),
      ]);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to refresh dashboard");
    }
  },
);

// ==================== Slice ====================

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.stats = null;
      state.screeningData = null;
      state.error = null;
      state.lastUpdated = null;
    },
    setLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ====== Fetch Dashboard Stats ======
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch dashboard stats";
      })

      // ====== Fetch AI Screening Data ======
      .addCase(fetchAIScreeningData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAIScreeningData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screeningData = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIScreeningData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch AI screening data";
      })

      .addCase(refreshDashboard.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshDashboard.fulfilled, (state) => {
        state.isRefreshing = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error =
          (action.payload as string) || "Failed to refresh dashboard";
      });
  },
});

// ==================== Actions ====================
export const { clearDashboardError, clearDashboardData, setLastUpdated } =
  dashboardSlice.actions;

// ==================== Selectors ====================
export const selectDashboardStats = (state: { dashboard: DashboardState }) =>
  state.dashboard.stats;
export const selectAIScreeningData = (state: { dashboard: DashboardState }) =>
  state.dashboard.screeningData;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) =>
  state.dashboard.isLoading;
export const selectDashboardRefreshing = (state: {
  dashboard: DashboardState;
}) => state.dashboard.isRefreshing;
export const selectDashboardError = (state: { dashboard: DashboardState }) =>
  state.dashboard.error;
export const selectDashboardLastUpdated = (state: {
  dashboard: DashboardState;
}) => state.dashboard.lastUpdated;

export default dashboardSlice.reducer;
