// frontend-company/src/api/auth.api.ts
import { apiClient } from "./axios.config";
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ChangePasswordDto,
  ResendVerificationDto,
  SocialLoginDto,
  UpdateProfileDto,
} from "../types";

// Response types
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await apiClient.post<AuthResponseDto>("/auth/login", data);
    return response.data;
  },

  /**
   * Logout user - invalidate token
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      {
        refreshToken,
      },
    );
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<AuthResponseDto["user"]> => {
    const response = await apiClient.get<AuthResponseDto["user"]>("/auth/me");
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (
    data: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    data: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (data: VerifyEmailDto): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      data,
    );
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (
    data: ResendVerificationDto,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post("/auth/resend-verification", data);
    return response.data;
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (
    data: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },

  /**
   * Social login (Google, LinkedIn, etc.)
   */
  socialLogin: async (data: SocialLoginDto): Promise<AuthResponseDto> => {
    const response = await apiClient.post<AuthResponseDto>(
      `/auth/social/${data.provider}`,
      {
        token: data.token,
      },
    );
    return response.data;
  },

  /**
   * Check if user is authenticated (token valid)
   */
  checkAuth: async (): Promise<{
    authenticated: boolean;
    user?: AuthResponseDto["user"];
  }> => {
    try {
      const response = await apiClient.get("/auth/check");
      return response.data;
    } catch {
      return { authenticated: false };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: UpdateProfileDto,
  ): Promise<AuthResponseDto["user"]> => {
    const response = await apiClient.put<AuthResponseDto["user"]>(
      "/auth/profile",
      data,
    );
    return response.data;
  },
};

// Auth token management utilities
export const authTokenManager = {
  /**
   * Set auth tokens in localStorage
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Set default auth header for future requests
    apiClient.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  /**
   * Clear all tokens
   */
  clearTokens: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete apiClient.defaults.headers.common["Authorization"];
  },

  /**
   * Check if tokens exist
   */
  hasTokens: (): boolean => {
    return (
      !!localStorage.getItem("accessToken") &&
      !!localStorage.getItem("refreshToken")
    );
  },

  /**
   * Store user data
   */
  setUser: (user: AuthResponseDto["user"]): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  /**
   * Get stored user data
   */
  getUser: (): AuthResponseDto["user"] | null => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Clear user data
   */
  clearUser: (): void => {
    localStorage.removeItem("user");
  },
};
