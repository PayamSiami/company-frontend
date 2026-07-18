// frontend-company/src/store/slices/candidates.slice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { candidatesApi } from "../../api/candidates.api";
import type { ICandidate } from "../../types";
import type { CandidateFiltersDto } from "../../types/dto.types";

interface CandidatesState {
  candidates: ICandidate[];
  selectedCandidate: ICandidate | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  filters: CandidateFiltersDto;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  shortlistedIds: string[];
  stats: {
    total: number;
    active: number;
    shortlisted: number;
    newThisWeek: number;
    averageSkills: number;
  } | null;
  candidateNotes: {
    id: string;
    note: string;
    createdAt: string;
    createdBy: string;
  }[];
  candidateApplications: any[];
  candidateResume: any | null;
}

const initialState: CandidatesState = {
  candidates: [],
  selectedCandidate: null,
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
  shortlistedIds: [],
  stats: null,
  candidateNotes: [],
  candidateApplications: [],
  candidateResume: null,
};

// ==================== Async Thunks ====================

export const fetchCandidates = createAsyncThunk(
  "candidates/fetchAll",
  async (params: CandidateFiltersDto, { rejectWithValue }) => {
    try {
      const { data }: any = await candidatesApi.getAll(params);
      return data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidates",
      );
    }
  },
);

export const fetchCandidateById = createAsyncThunk(
  "candidates/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data }: any = await candidatesApi.getById(id);
      return data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidate",
      );
    }
  },
);

export const shortlistCandidate = createAsyncThunk(
  "candidates/shortlist",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.shortlist(candidateId);
      return { candidateId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to shortlist candidate",
      );
    }
  },
);

export const unshortlistCandidate = createAsyncThunk(
  "candidates/unshortlist",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.unshortlist(candidateId);
      return { candidateId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unshortlist candidate",
      );
    }
  },
);

export const fetchCandidateApplications = createAsyncThunk(
  "candidates/fetchApplications",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.getApplications(candidateId);
      return { candidateId, applications: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const fetchCandidateResume = createAsyncThunk(
  "candidates/fetchResume",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.getResume(candidateId);
      return { candidateId, resume: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch resume",
      );
    }
  },
);

export const addCandidateNote = createAsyncThunk(
  "candidates/addNote",
  async (
    { candidateId, note }: { candidateId: string; note: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await candidatesApi.addNote(candidateId, note);
      return { candidateId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add note",
      );
    }
  },
);

export const fetchCandidateNotes = createAsyncThunk(
  "candidates/fetchNotes",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.getNotes(candidateId);
      return { candidateId, notes: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes",
      );
    }
  },
);

// ✅ Add fetchCandidateStats thunk
export const fetchCandidateStats = createAsyncThunk(
  "candidates/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await candidatesApi.getStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidate stats",
      );
    }
  },
);

// ==================== Slice ====================

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    setCandidateFilters: (
      state,
      action: PayloadAction<CandidateFiltersDto>,
    ) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    clearCandidateFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setCandidatePage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
    clearCandidatesError: (state) => {
      state.error = null;
    },
    clearCandidatesSuccess: (state) => {
      state.success = null;
    },
    clearShortlisted: (state) => {
      state.shortlistedIds = [];
    },
    clearCandidateData: (state) => {
      state.selectedCandidate = null;
      state.candidateNotes = [];
      state.candidateApplications = [];
      state.candidateResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch candidates";
      })
      // Fetch By ID
      .addCase(fetchCandidateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch candidate";
      })
      // Shortlist
      .addCase(shortlistCandidate.fulfilled, (state, action) => {
        if (!state.shortlistedIds.includes(action.payload.candidateId)) {
          state.shortlistedIds.push(action.payload.candidateId);
        }
        state.success = action.payload.message || "Candidate shortlisted";
        // const candidate = state.candidates.find(
        //   (c) => c._id === action.payload.candidateId,
        // );
        // if (candidate) {
        //   candidate.isShortlisted = true;
        // }
        if (state.selectedCandidate?._id === action.payload.candidateId) {
          // state.selectedCandidate.isShortlisted = true;
        }
      })
      .addCase(shortlistCandidate.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to shortlist";
      })
      // Unshortlist
      .addCase(unshortlistCandidate.fulfilled, (state, action) => {
        state.shortlistedIds = state.shortlistedIds.filter(
          (id) => id !== action.payload.candidateId,
        );
        state.success = action.payload.message || "Candidate unshortlisted";
        // const candidate = state.candidates.find(
        //   (c) => c._id === action.payload.candidateId,
        // );
        // if (candidate) {
        //   candidate.isShortlisted = false;
        // }
        if (state.selectedCandidate?._id === action.payload.candidateId) {
          // state.selectedCandidate.isShortlisted = false;
        }
      })
      .addCase(unshortlistCandidate.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to unshortlist";
      })
      // Fetch Applications
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.candidateApplications = action.payload.applications;
      })
      // Fetch Resume
      .addCase(fetchCandidateResume.fulfilled, (state, action) => {
        state.candidateResume = action.payload.resume;
      })
      // Fetch Notes
      .addCase(fetchCandidateNotes.fulfilled, (state, action) => {
        state.candidateNotes = action.payload.notes;
      })
      // Add Note
      .addCase(addCandidateNote.fulfilled, (state, action) => {
        state.success = action.payload.message || "Note added";
      })
      // ✅ Fetch Stats
      .addCase(fetchCandidateStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCandidateStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch candidate stats";
      });
  },
});

// ==================== Actions ====================
export const {
  setCandidateFilters,
  clearCandidateFilters,
  setCandidatePage,
  clearSelectedCandidate,
  clearCandidatesError,
  clearCandidatesSuccess,
  clearShortlisted,
  clearCandidateData,
} = candidatesSlice.actions;

// ==================== Selectors ====================
export const selectCandidates = (state: { candidates: CandidatesState }) =>
  state.candidates.candidates;
export const selectSelectedCandidate = (state: {
  candidates: CandidatesState;
}) => state.candidates.selectedCandidate;
export const selectCandidatesLoading = (state: {
  candidates: CandidatesState;
}) => state.candidates.isLoading;
export const selectCandidatesError = (state: { candidates: CandidatesState }) =>
  state.candidates.error;
export const selectCandidatesSuccess = (state: {
  candidates: CandidatesState;
}) => state.candidates.success;
export const selectShortlistedIds = (state: { candidates: CandidatesState }) =>
  state.candidates.shortlistedIds;
export const selectCandidatesPagination = (state: {
  candidates: CandidatesState;
}) => state.candidates.pagination;
export const selectCandidateFilters = (state: {
  candidates: CandidatesState;
}) => state.candidates.filters;
// ✅ Add selector for stats
export const selectCandidateStats = (state: { candidates: CandidatesState }) =>
  state.candidates.stats;
export const selectCandidateNotes = (state: { candidates: CandidatesState }) =>
  state.candidates.candidateNotes;
export const selectCandidateApplications = (state: {
  candidates: CandidatesState;
}) => state.candidates.candidateApplications;
export const selectCandidateResume = (state: { candidates: CandidatesState }) =>
  state.candidates.candidateResume;

export default candidatesSlice.reducer;
