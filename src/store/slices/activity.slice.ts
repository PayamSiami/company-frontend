import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { activityApi } from '../../api/activity.api'
import { getErrorMessage } from '../../api/apiError'
import type { ActivityItem, ActivityPagination } from '../../types/activity.types'

interface ActivityState {
  activities: ActivityItem[] | null
  isLoading: boolean
  pagination: ActivityPagination | null
}

const initialState: ActivityState = {
  activities: null,
  isLoading: false,
  pagination: null,
}

// ==================== Async Thunks ====================

/** Shape returned by `GET /activities` → `{ data: { data: { activities, pagination } } }` */
interface ActivityListResponse {
  activities?: ActivityItem[]
  pagination?: ActivityPagination | null
}

export const fetchActivity = createAsyncThunk<
  { activities: ActivityItem[]; pagination: ActivityPagination | null },
  { limit: number; page: number },
  { rejectValue: string }
>('activity/fetchActivity', async (params, { rejectWithValue }) => {
  try {
    const response = await activityApi.getActivities(params)
    const body = response.data as { data?: ActivityListResponse } | undefined
    return {
      activities: Array.isArray(body?.data?.activities) ? body.data.activities : [],
      pagination: body?.data?.pagination ?? null,
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch activity'))
  }
})

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
        state.activities = action.payload.activities
        state.pagination = action.payload.pagination
      })
      .addCase(fetchActivity.rejected, (state) => {
        state.isLoading = false
      })
  },
})

// ==================== Actions ====================
// No actions - this slice is managed entirely by async thunks

// ==================== Selectors ====================
export const selectActivity = (state: { activity: ActivityState }) =>
  state.activity.activities
export const selectActivityLoading = (state: { activity: ActivityState }) =>
  state.activity.isLoading
export const selectActivityPagination = (state: { activity: ActivityState }) =>
  state.activity.pagination
export default activitySlice.reducer