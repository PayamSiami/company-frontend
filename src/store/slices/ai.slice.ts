// frontend-company/src/store/slices/ai.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiApi } from "../../api/ai.api";
import type {
  AIJobGenerationDto,
  AIScreeningResponseDto,
  AISalarySuggestionResponseDto,
  AIResumeAnalysisResponseDto,
  AIInterviewQuestionsDto,
  AIInterviewQuestionsResponseDto,
} from "../../types/dto.types";

interface AIState {
  // Generation
  isGenerating: boolean;
  generatedContent: Record<string, any>;

  // Screening
  screeningInProgress: boolean;
  screeningResults: AIScreeningResponseDto | null;

  // Analytics
  screeningInsights: any | null;
  salarySuggestions: AISalarySuggestionResponseDto | null;
  resumeAnalysis: AIResumeAnalysisResponseDto | null;
  interviewQuestions: AIInterviewQuestionsResponseDto | null;

  // Error state
  error: string | null;
  success: string | null;
}

const initialState: AIState = {
  // Generation
  isGenerating: false,
  generatedContent: {},

  // Screening
  screeningInProgress: false,
  screeningResults: null,

  // Analytics
  screeningInsights: null,
  salarySuggestions: null,
  resumeAnalysis: null,
  interviewQuestions: null,

  // Error state
  error: null,
  success: null,
};

// ==================== Async Thunks ====================

/**
 * Generate job content (description, requirements, etc.)
 */
export const generateJobContent = createAsyncThunk(
  "ai/generateContent",
  async (body: AIJobGenerationDto, { rejectWithValue }) => {
    try {
      const { data }: any = await aiApi.generateJobContent(body);
      return data?.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate content",
      );
    }
  },
);

/**
 * Get screening insights
 */
export const getScreeningInsights = createAsyncThunk(
  "ai/getScreeningInsights",
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiApi.getScreeningInsights();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get screening insights",
      );
    }
  },
);

/**
 * Generate interview questions
 */
export const generateInterviewQuestions = createAsyncThunk(
  "ai/generateInterviewQuestions",
  async (data: AIInterviewQuestionsDto, { rejectWithValue }) => {
    try {
      const response = await aiApi.generateInterviewQuestions(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to generate interview questions",
      );
    }
  },
);

// ==================== Slice ====================

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAIError: (state) => {
      state.error = null;
    },
    clearAISuccess: (state) => {
      state.success = null;
    },
    clearGeneratedContent: (state) => {
      state.generatedContent = {};
    },
    clearScreeningResults: (state) => {
      state.screeningResults = null;
    },
    clearSalarySuggestions: (state) => {
      state.salarySuggestions = null;
    },
    clearResumeAnalysis: (state) => {
      state.resumeAnalysis = null;
    },
    clearInterviewQuestions: (state) => {
      state.interviewQuestions = null;
    },
    resetAIState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ==================== Generate Content ====================
      .addCase(generateJobContent.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(generateJobContent.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedContent = action.payload;
        state.success = "Content generated successfully!";
      })
      .addCase(generateJobContent.rejected, (state, action) => {
        state.isGenerating = false;
        state.error =
          (action.payload as string) || "Failed to generate content";
      })

      // ==================== Get Screening Insights ====================
      .addCase(getScreeningInsights.pending, (state) => {
        state.error = null;
      })
      .addCase(getScreeningInsights.fulfilled, (state, action) => {
        state.screeningInsights = action.payload;
      })
      .addCase(getScreeningInsights.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Failed to get screening insights";
      })

      // ==================== Generate Interview Questions ====================
      .addCase(generateInterviewQuestions.pending, (state) => {
        state.error = null;
        state.success = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => {
        state.interviewQuestions = action.payload;
        state.success = "Interview questions generated!";
      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          "Failed to generate interview questions";
      });
  },
});

// ==================== Actions ====================
export const {
  clearAIError,
  clearAISuccess,
  clearGeneratedContent,
  clearScreeningResults,
  clearSalarySuggestions,
  clearResumeAnalysis,
  clearInterviewQuestions,
  resetAIState,
} = aiSlice.actions;

// ==================== Selectors ====================
export const selectIsGenerating = (state: { ai: AIState }) =>
  state.ai.isGenerating;
export const selectGeneratedJob = (state: { ai: AIState }) =>
  state.ai.generatedContent;
export const selectScreeningInProgress = (state: { ai: AIState }) =>
  state.ai.screeningInProgress;
export const selectScreeningResults = (state: { ai: AIState }) =>
  state.ai.screeningResults;
export const selectScreeningInsights = (state: { ai: AIState }) =>
  state.ai.screeningInsights;
export const selectSalarySuggestions = (state: { ai: AIState }) =>
  state.ai.salarySuggestions;
export const selectResumeAnalysis = (state: { ai: AIState }) =>
  state.ai.resumeAnalysis;
export const selectInterviewQuestions = (state: { ai: AIState }) =>
  state.ai.interviewQuestions;
export const selectAIError = (state: { ai: AIState }) => state.ai.error;
export const selectAISuccess = (state: { ai: AIState }) => state.ai.success;

export default aiSlice.reducer;
