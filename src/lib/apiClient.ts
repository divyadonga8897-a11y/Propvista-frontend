import axios from "axios";
import { supabase } from "./supabase";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8002",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest.headers?.["X-Retry"]) {
      if (!originalRequest.headers) originalRequest.headers = {};
      originalRequest.headers["X-Retry"] = "true";

      // Try refreshing the Supabase session before giving up
      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && data?.session?.access_token) {
        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
        return apiClient(originalRequest);
      }

      // Refresh also failed — sign out and redirect to login
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      console.error("Permission denied");
    } else if (status === 404) {
      console.error("API not found:", error.config?.url);
    } else if (status === 500) {
      console.error("Internal Server Error");
    }

    return Promise.reject(error);
  }
);

export default apiClient;