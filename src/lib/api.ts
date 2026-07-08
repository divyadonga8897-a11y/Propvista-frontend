import apiClient from "./apiClient";

/**
 * Central API instance used throughout the application.
 *
 * Future enhancements:
 * - Automatic token refresh
 * - Request logging
 * - Retry failed requests
 * - File upload helpers
 * - API versioning
 */
export const api = apiClient;

export default api;