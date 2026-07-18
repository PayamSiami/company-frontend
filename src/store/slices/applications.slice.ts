// frontend-company/src/store/slices/applications.slice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { applicationsApi } from "../../api/applications.api";
import type { IApplication } from "../../types";
import type {
  UpdateApplicationStatusDto,
  ApplicationFiltersDto,
} from "../../types/dto.types";
import { ApplicationStatus } from "../../types";

interface ApplicationsState {
  applications: IApplication[];
  selectedApplication: IApplication | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  filters: ApplicationFiltersDto;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ApplicationsState = {
  applications: [],
  selectedApplication: null,
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
};

// ==================== Async Thunks ====================

// ✅ Typed thunks with rejectValue
export const fetchApplications = createAsyncThunk<
  IApplication[], // Success return type
  ApplicationFiltersDto | undefined, // First argument type
  { rejectValue: string } // Reject value type
>("applications/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const { data }: any = await applicationsApi.getAll(params);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch applications",
    );
  }
});

export const fetchApplicationById = createAsyncThunk<
  IApplication,
  string,
  { rejectValue: string }
>("applications/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data }: any = await applicationsApi.getById(id);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch application",
    );
  }
});

export const updateApplicationStatus = createAsyncThunk<
  IApplication,
  { id: string; data: UpdateApplicationStatusDto },
  { rejectValue: string }
>("applications/updateStatus", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await applicationsApi.updateStatus(id, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update application status",
    );
  }
});

export const bulkUpdateApplications = createAsyncThunk<
  IApplication[],
  { ids: string[]; status: ApplicationStatus; notes?: string },
  { rejectValue: string }
>(
  "applications/bulkUpdate",
  async ({ ids, status, notes }, { rejectWithValue }) => {
    try {
      const updatePromises = ids.map((id) =>
        applicationsApi.updateStatus(id, { status, notes }),
      );
      const responses = await Promise.all(updatePromises);
      return responses.map((response) => response.data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to bulk update applications",
      );
    }
  },
);

// ==================== Slice ====================

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ApplicationFiltersDto>) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },
    clearApplicationsError: (state) => {
      state.error = null;
    },
    clearApplicationsSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        const { applications }: any = action.payload;
        state.applications = applications;
        state.pagination.total = action.payload.length;
        state.success = "Applications fetched successfully";
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch applications";
      })
      // Fetch By ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch application";
      })
      // Update Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.applications.findIndex(
          (app) => app._id === action.payload._id,
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.selectedApplication?._id === action.payload._id) {
          state.selectedApplication = action.payload;
        }
        state.success = "Application status updated successfully";
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update status";
      })
      // Bulk Update
      .addCase(bulkUpdateApplications.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(bulkUpdateApplications.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedIds = new Set(
          action.payload.map((app: IApplication) => app._id),
        );
        state.applications = state.applications.map((app) =>
          updatedIds.has(app._id)
            ? action.payload.find((a: IApplication) => a._id === app._id) || app
            : app,
        );
        state.success = `${action.payload.length} applications updated successfully`;
      })
      .addCase(bulkUpdateApplications.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to bulk update applications";
      });
  },
});

// ==================== Actions ====================
export const {
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  clearSelectedApplication,
  clearApplicationsError,
  clearApplicationsSuccess,
} = applicationsSlice.actions;

// ==================== Selectors ====================
export const selectApplications = (state: {
  applications: ApplicationsState;
}) => state.applications.applications;

export const selectSelectedApplication = (state: {
  applications: ApplicationsState;
}) => state.applications.selectedApplication;

export const selectApplicationsLoading = (state: {
  applications: ApplicationsState;
}) => state.applications.isLoading;

export const selectApplicationsUpdating = (state: {
  applications: ApplicationsState;
}) => state.applications.isUpdating;

export const selectApplicationsError = (state: {
  applications: ApplicationsState;
}) => state.applications.error;

export const selectApplicationsSuccess = (state: {
  applications: ApplicationsState;
}) => state.applications.success;

export const selectApplicationsFilters = (state: {
  applications: ApplicationsState;
}) => state.applications.filters;

export const selectApplicationsPagination = (state: {
  applications: ApplicationsState;
}) => state.applications.pagination;

export default applicationsSlice.reducer;
