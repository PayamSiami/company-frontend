import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { activityApi } from '../../api/activity.api'

interface ActivityState {
  activity: null
  isLoading: boolean
  pagination: { page: number; limit: number; total: number; pages: number }
}

const initialState = {
  activity: null,
  isLoading: false,
  pagination: null,
}

// ==================== Async Thunks ====================

export const fetchActivity = createAsyncThunk(
  'activity/fetchActivity',
  async (data: { limit: number; page: number }, { rejectWithValue }) => {
    try {
      const response = await activityApi.getActivities(data)
      return response?.data?.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity')
    }
  }
)

// ==================== Slice ====================

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ====== Fetch Activity ======
      .addCase(fetchActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.activity = action.payload?.activities || null
        state.pagination = action.payload?.pagination || null
      })
      .addCase(fetchActivity.rejected, (state, _action) => {
        state.isLoading = false
      })
  },
})

// ==================== Actions ====================
export const {} = activitySlice.actions

// ==================== Selectors ====================
export const selectActivity = (state: { activity: ActivityState }) => state.activity.activity
export const selectActivityLoading = (state: { activity: ActivityState }) =>
  state.activity.isLoading
export const selectActivityPagination = (state: { activity: ActivityState }) =>
  state.activity.pagination
export default activitySlice.reducer
