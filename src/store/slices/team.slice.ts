// frontend-company/src/store/slices/team.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/axios.config';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'member' | 'owner';
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  joinedAt: string;
  avatar?: string;
  lastActive?: string;
  department?: string;
  phone?: string;
  position?: string;
}

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  lastUpdated: string | null;
}

const initialState: TeamState = {
  members: [],
  isLoading: false,
  error: null,
  pagination: null,
  lastUpdated: null,
};

// Fetch team members
export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async (params: { page: number; limit: number; search?: string; role?: string; status?: string }) => {
    const response = await apiClient.get('/team/members', { params });
    return response.data;
  }
);

// Invite team member
export const inviteTeamMember = createAsyncThunk(
  'team/inviteMember',
  async (data: { email: string; role: string; department?: string; message?: string }) => {
    const response = await apiClient.post('/team/invite', data);
    return response.data;
  }
);

// Remove team member
export const removeTeamMember = createAsyncThunk(
  'team/removeMember',
  async (userId: string) => {
    const response = await apiClient.delete(`/team/members/${userId}`);
    return response.data;
  }
);

// Update member role
export const updateMemberRole = createAsyncThunk(
  'team/updateRole',
  async ({ userId, role }: { userId: string; role: string }) => {
    const response = await apiClient.patch(`/team/members/${userId}/role`, { role });
    return response.data;
  }
);

// Resend invite
export const resendInvite = createAsyncThunk(
  'team/resendInvite',
  async (userId: string) => {
    const response = await apiClient.post(`/team/invite/${userId}/resend`);
    return response.data;
  }
);

// Update member status
export const updateMemberStatus = createAsyncThunk(
  'team/updateStatus',
  async ({ userId, status }: { userId: string; status: string }) => {
    const response = await apiClient.patch(`/team/members/${userId}/status`, { status });
    return response.data;
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearTeamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.data;
        state.pagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch team members';
      })
      // Invite Member
      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.members.push(action.payload.data);
        state.lastUpdated = new Date().toISOString();
      })
      // Remove Member
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.id !== action.payload.userId);
        state.lastUpdated = new Date().toISOString();
      })
      // Update Role
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m.id === action.payload.userId);
        if (index !== -1) {
          state.members[index].role = action.payload.role;
        }
        state.lastUpdated = new Date().toISOString();
      })
      // Resend Invite
      .addCase(resendInvite.fulfilled, (state) => {
        state.lastUpdated = new Date().toISOString();
      })
      // Update Status
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        const index = state.members.findIndex((m) => m.id === action.payload.userId);
        if (index !== -1) {
          state.members[index].status = action.payload.status;
        }
        state.lastUpdated = new Date().toISOString();
      });
  },
});

export const { clearTeamError } = teamSlice.actions;
export default teamSlice.reducer;