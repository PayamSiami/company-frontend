// frontend-company/src/api/axios.config.ts
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "../config/env";

// Types
interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: InternalAxiosRequestConfig;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      (error) => Promise.reject(error),
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this),
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  }

  private async handleResponseError(
    error: AxiosError<ApiErrorResponse>,
  ): Promise<unknown> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      return this.handleUnauthorized(originalRequest);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      this.handleForbidden();
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 5;
      await new Promise((resolve) =>
        setTimeout(resolve, Number(retryAfter) * 1000),
      );
      return this.client(originalRequest);
    }

    return Promise.reject(this.formatError(error));
  }

  private async handleUnauthorized(
    originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  ): Promise<unknown> {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        this.clearTokens();
        window.location.href = "/login";
        return Promise.reject(new Error("No refresh token available"));
      }

      // Attempt to refresh token
      const response = await this.client.post<RefreshTokenResponse>(
        "/auth/refresh",
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      this.setTokens(accessToken, newRefreshToken);

      // Retry all queued requests
      this.processQueue(null, accessToken);

      // Retry the original request with new token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      return this.client(originalRequest);
    } catch (refreshError) {
      this.clearTokens();
      this.processQueue(refreshError, null);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: unknown | null, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
        return;
      }

      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      resolve(this.client(config));
    });

    this.failedQueue = [];
  }

  private handleForbidden(): void {
    // User doesn't have permission for this action
    console.warn("Access forbidden");
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  private formatError(error: AxiosError<ApiErrorResponse>): {
    message: string;
    status?: number;
    data?: unknown;
  } {
    if (error.response) {
      return {
        message:
          error.response.data?.message || error.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    }

    if (error.request) {
      return {
        message: "No response from server. Please check your connection.",
        status: 0,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
    };
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public setAuthToken(token: string): void {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  public removeAuthToken(): void {
    delete this.client.defaults.headers.common["Authorization"];
  }
}

// Export singleton instance
export const apiClient = new ApiClient().getClient();

// Export utility functions
export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = (): void => {
  delete apiClient.defaults.headers.common["Authorization"];
};
