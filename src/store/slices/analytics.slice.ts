// frontend-company/src/store/slices/analytics.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/axios.config';

interface AnalyticsState {
  analytics: any | null;
  funnel: any[] | null;
  stats: any | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AnalyticsState = {
  analytics: null,
  funnel: null,
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Fetch AI Analytics
export const fetchAIAnalytics = createAsyncThunk(
  'analytics/fetchAIAnalytics',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/analytics/ai?range=${timeRange}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Fetch Hiring Funnel
export const fetchHiringFunnel = createAsyncThunk(
  'analytics/fetchHiringFunnel',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/analytics/funnel?range=${timeRange}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch funnel data');
    }
  }
);

// Fetch Screening Stats
export const fetchScreeningStats = createAsyncThunk(
  'analytics/fetchScreeningStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/analytics/screening-stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch screening stats');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch AI Analytics
      .addCase(fetchAIAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAIAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAIAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Hiring Funnel
      .addCase(fetchHiringFunnel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHiringFunnel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.funnel = action.payload;
      })
      .addCase(fetchHiringFunnel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Screening Stats
      .addCase(fetchScreeningStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScreeningStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchScreeningStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;