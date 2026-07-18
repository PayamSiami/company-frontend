// frontend-company/src/store/slices/company.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyApi } from "../../api/company.api";
import type { ICompany } from "../../types";
import type { UpdateCompanyDto, CreateCompanyDto } from "../../types/dto.types";

interface CompanyState {
  company: ICompany | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  teamMembers: any[];
  settings: any | null;
}

const initialState: CompanyState = {
  company: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  success: null,
  teamMembers: [],
  settings: null,
};

// ==================== Async Thunks ====================

export const fetchCompany = createAsyncThunk(
  "company/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company",
      );
    }
  },
);

export const updateCompany = createAsyncThunk(
  "company/update",
  async (data: UpdateCompanyDto, { rejectWithValue }) => {
    try {
      const response = await companyApi.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update company",
      );
    }
  },
);

export const createCompany = createAsyncThunk(
  "company/create",
  async (data: CreateCompanyDto, { rejectWithValue }) => {
    try {
      const response = await companyApi.createProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create company",
      );
    }
  },
);

// ✅ Add uploadCompanyLogo thunk
export const uploadCompanyLogo = createAsyncThunk(
  "company/uploadLogo",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await companyApi.uploadLogo(file);
      return response.data.logoUrl;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload logo",
      );
    }
  },
);

// ✅ Add fetchTeamMembers thunk
export const fetchTeamMembers = createAsyncThunk(
  "company/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyApi.getTeamMembers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch team members",
      );
    }
  },
);

// ✅ Add inviteTeamMember thunk
export const inviteTeamMember = createAsyncThunk(
  "company/inviteTeam",
  async (data: { email: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await companyApi.inviteTeamMember(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to invite team member",
      );
    }
  },
);

// ✅ Add removeTeamMember thunk
export const removeTeamMember = createAsyncThunk(
  "company/removeTeam",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await companyApi.removeTeamMember(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove team member",
      );
    }
  },
);

// ==================== Slice ====================

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    clearCompanySuccess: (state) => {
      state.success = null;
    },
    clearCompany: (state) => {
      state.company = null;
      state.teamMembers = [];
      state.settings = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Company
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.success = "Company fetched successfully";
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch company";
      })
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.company = action.payload;
        state.success = "Company updated successfully";
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update company";
      })
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.success = "Company created successfully";
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create company";
      })
      // ✅ Upload Logo
      .addCase(uploadCompanyLogo.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.company) {
          state.company.logoUrl = action.payload;
        }
        state.success = "Logo uploaded successfully";
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to upload logo";
      })
      // Fetch Team
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamMembers = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch team members";
      })
      // Invite Team Member
      .addCase(inviteTeamMember.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.teamMembers.push(action.payload);
        state.success = "Team member invited successfully";
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to invite team member";
      })
      // Remove Team Member
      .addCase(removeTeamMember.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.teamMembers = state.teamMembers.filter(
          (member: any) => member.id !== action.payload,
        );
        state.success = "Team member removed successfully";
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          (action.payload as string) || "Failed to remove team member";
      });
  },
});

// ==================== Actions ====================
export const { clearCompanyError, clearCompanySuccess, clearCompany } =
  companySlice.actions;

// ==================== Selectors ====================
export const selectCompany = (state: { company: CompanyState }) =>
  state.company.company;
export const selectCompanyLoading = (state: { company: CompanyState }) =>
  state.company.isLoading;
export const selectCompanyUpdating = (state: { company: CompanyState }) =>
  state.company.isUpdating;
export const selectCompanyError = (state: { company: CompanyState }) =>
  state.company.error;
export const selectCompanySuccess = (state: { company: CompanyState }) =>
  state.company.success;
export const selectTeamMembers = (state: { company: CompanyState }) =>
  state.company.teamMembers;

export default companySlice.reducer;
