// frontend-company/src/config/env.ts

/**
 * Simple environment configuration using Vite's import.meta.env
 * Provides typed access to environment variables
 */

// Environment
export const NODE_ENV = import.meta.env.MODE || "development";

export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_TEST = NODE_ENV === "test";
export const IS_STAGING = NODE_ENV === "staging";

// API
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_TIMEOUT = parseInt(
  import.meta.env.VITE_API_TIMEOUT || "30000",
  10,
);
export const API_RETRY_ATTEMPTS = parseInt(
  import.meta.env.VITE_API_RETRY_ATTEMPTS || "3",
  10,
);

// Application
export const APP_NAME = import.meta.env.VITE_APP_NAME || "AI Job Portal";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
export const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

// Feature Flags
export const ENABLE_AI = import.meta.env.VITE_ENABLE_AI === "true";
export const ENABLE_ANALYTICS =
  import.meta.env.VITE_ENABLE_ANALYTICS === "true";
export const ENABLE_DEBUG =
  import.meta.env.VITE_ENABLE_DEBUG === "true" || IS_DEVELOPMENT;

// External Services
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

// Authentication
export const JWT_SECRET =
  import.meta.env.VITE_JWT_SECRET || "default-secret-key";
export const JWT_EXPIRY = import.meta.env.VITE_JWT_EXPIRY || "7d";
export const REFRESH_TOKEN_EXPIRY =
  import.meta.env.VITE_REFRESH_TOKEN_EXPIRY || "30d";

// Database (only used in backend)
export const DATABASE_URL =
  import.meta.env.VITE_DATABASE_URL || "mongodb://localhost:27017/jobportal";

// File Upload
export const MAX_FILE_SIZE = parseInt(
  import.meta.env.VITE_MAX_FILE_SIZE || "10485760",
  10,
);
export const UPLOAD_DIR = import.meta.env.VITE_UPLOAD_DIR || "./uploads";

// CORS
export const CORS_ORIGIN = import.meta.env.VITE_CORS_ORIGIN
  ? import.meta.env.VITE_CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

// Export all as default
export default {
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  IS_TEST,
  IS_STAGING,
  API_URL,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  APP_NAME,
  APP_VERSION,
  APP_URL,
  ENABLE_AI,
  ENABLE_ANALYTICS,
  ENABLE_DEBUG,
  GEMINI_API_KEY,
  SENTRY_DSN,
  JWT_SECRET,
  JWT_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  DATABASE_URL,
  MAX_FILE_SIZE,
  UPLOAD_DIR,
  CORS_ORIGIN,
};
