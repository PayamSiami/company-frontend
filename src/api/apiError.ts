// frontend-company/src/api/apiError.ts
import axios from 'axios';

interface ApiErrorBody {
  message?: string;
}

/**
 * Safely extract a user-facing message from an unknown error.
 *
 * Handles the three shapes used across this app:
 * - Axios errors (network/API errors): prefers `response.data.message`
 * - Redux thunk rejections: plain strings thrown by `unwrap()`
 * - Native `Error` instances
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string' && error.length > 0) {
    return error;
  }
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}