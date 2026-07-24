// frontend-company/src/config/env.ts

/**
 * Simple environment configuration using Vite's import.meta.env
 * Provides typed access to environment variables
 */

// Environment
export const NODE_ENV = import.meta.env.MODE || "development";

export const IS_PRODUCTION = NODE_ENV === "production";

// API
export const API_URL = import.meta.env.VITE_API_URL;

// Export all as default
export default {
  NODE_ENV,
  IS_PRODUCTION,
  API_URL,
};
