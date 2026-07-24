// frontend-company/src/store/slices/jobs.slice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jobsApi } from "../../api/jobs.api";
import type { IJob } from "../../types";
import type { CreateJobDto, UpdateJobDto } from "../../types/dto.types";

interface JobsState {
  jobs: IJob[];
  selectedJob: IJob | null;
  stats: any | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  filters: {
    status?: string;
    isActive?: boolean;
  };
  analytics: {
    data: null;
    loading: boolean;
    error: string | null;
    timeRange: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  recommendations: {
    data: [];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
      jobId?: string;
      minScore?: number;
      skills?: string[];
      experienceMin?: number;
      experienceMax?: number;
    };
  };
  createdAt: Date | string;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  stats: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  success: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  analytics: {
    data: null,
    loading: false,
    error: null,
    timeRange: "",
  },
  recommendations: {
    data: [],
    loading: false,
    error: null,
    total: 0,
    filters: {
      minScore: 0,
    },
  },
  createdAt: "",
};

// ==================== Async Thunks ====================

export const fetchJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (
    params: { status?: string; isActive?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const { data }: any = await jobsApi.getAll(params);
      return data?.data?.jobs;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobsApi.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job",
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "jobs/create",
  async (body: CreateJobDto, { rejectWithValue }) => {
    try {
      const { data }: any = await jobsApi.create(body);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/update",
  async (
    { id, data }: { id: string; data: UpdateJobDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await jobsApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job",
      );
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await jobsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job",
      );
    }
  },
);

export const publishJob = createAsyncThunk(
  "jobs/publish",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobsApi.publish(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to publish job",
      );
    }
  },
);

export const closeJob = createAsyncThunk(
  "jobs/close",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobsApi.close(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to close job",
      );
    }
  },
);

export const fetchJobAnalytics = createAsyncThunk<
  any,
  string | undefined,
  { rejectValue: string }
>("jobs/fetchAnalytics", async (timeRange = "30d", { rejectWithValue }) => {
  try {
    const response = await jobsApi.getAnalytics(timeRange);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch job analytics",
    );
  }
});

export const fetchCandidateRecommendations = createAsyncThunk(
  "employer/fetchCandidateRecommendations",
  async (params: {
    jobId?: string;
    limit?: number;
    minScore?: number;
    skills?: string[];
    experienceMin?: number;
    experienceMax?: number;
  }) => {
    const response = await jobsApi.getCandidateRecommendations(params);
    return response; // or return response.data depending on your API
  },
);

// ==================== Slice ====================

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    clearJobsError: (state) => {
      state.error = null;
    },
    clearJobsSuccess: (state) => {
      state.success = null;
    },
    setJobFilters: (state, action: PayloadAction<JobsState["filters"]>) => {
      state.filters = action.payload;
    },
    setJobPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setAnalyticsTimeRange: (state, action: PayloadAction<string>) => {
      state.analytics.timeRange = action.payload;
    },
    clearAnalytics: (state) => {
      state.analytics.data = null;
      state.analytics.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(
        fetchJobAnalytics.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.analytics.loading = false;
          state.analytics.data = action.payload;
        },
      )
      .addCase(fetchJobAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error =
          action.payload || "Failed to fetch job analytics";
      })
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
        state.pagination.total = action.payload.length;
        state.success = "Jobs fetched successfully";
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch jobs";
      })
      // Fetch By ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch job";
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isCreating = false;
        state.jobs.unshift(action.payload);
        state.success = "Job created successfully";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isCreating = false;
        state.error = (action.payload as string) || "Failed to create job";
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id,
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob?._id === action.payload._id) {
          state.selectedJob = action.payload;
        }
        state.success = "Job updated successfully";
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update job";
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.selectedJob?._id === action.payload) {
          state.selectedJob = null;
        }
        state.success = "Job deleted successfully";
      })
      // Publish Job
      .addCase(publishJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id,
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob?._id === action.payload._id) {
          state.selectedJob = action.payload;
        }
        state.success = "Job published successfully";
      })
      .addCase(closeJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id,
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob?._id === action.payload._id) {
          state.selectedJob = action.payload;
        }
        state.success = "Job closed successfully";
      })
      // ===== Fetch Candidate Recommendations =====
      .addCase(fetchCandidateRecommendations.pending, (state) => {
        state.recommendations.loading = true;
        state.recommendations.error = null;
      })
      .addCase(fetchCandidateRecommendations.fulfilled, (state, action) => {
        state.recommendations.loading = false;
        state.recommendations.data = action.payload.recommendations;
        // state.recommendations.total = action.payload.pagination.total;
        state.recommendations.error = null;
        // Update pagination for recommendations
        // state.pagination.page = action.payload.pagination.page;
        // state.pagination.limit = action.payload.pagination.limit;
        // state.pagination.total = action.payload.pagination.total;
      })
      .addCase(fetchCandidateRecommendations.rejected, (state, action) => {
        state.recommendations.loading = false;
        state.recommendations.error =
          (action.payload as string) ||
          "Failed to fetch candidate recommendations";
        state.recommendations.data = [];
      });
  },
});

// ==================== Actions ====================
export const {
  clearSelectedJob,
  clearJobsError,
  clearJobsSuccess,
  setJobFilters,
  setJobPage,
  setAnalyticsTimeRange,
  clearAnalytics,
} = jobsSlice.actions;

// ==================== Selectors ====================
export const selectJobs = (state: { jobs: JobsState }) => state.jobs.jobs;
export const selectSelectedJob = (state: { jobs: JobsState }) =>
  state.jobs.selectedJob;
export const selectJobStats = (state: { jobs: JobsState }) => state.jobs.stats;
export const selectJobsLoading = (state: { jobs: JobsState }) =>
  state.jobs.isLoading;
export const selectJobsError = (state: { jobs: JobsState }) => state.jobs.error;
export const selectJobsSuccess = (state: { jobs: JobsState }) =>
  state.jobs.success;
export const selectJobsPagination = (state: { jobs: JobsState }) =>
  state.jobs.pagination;
export const selectJobFilters = (state: { jobs: JobsState }) =>
  state.jobs.filters;
export const selectJobAnalytics = (state: { jobs: JobsState }) =>
  state.jobs.analytics.data;
export const selectJobAnalyticsLoading = (state: { jobs: JobsState }) =>
  state.jobs.analytics.loading;
export const selectJobAnalyticsError = (state: { jobs: JobsState }) =>
  state.jobs.analytics.error;
export const selectJobAnalyticsTimeRange = (state: { jobs: JobsState }) =>
  state.jobs.analytics.timeRange;
export const selectJobRecommendation = (state: { jobs: JobsState }) =>
  state.jobs.recommendations.data;

export default jobsSlice.reducer;
