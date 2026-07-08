import axios from "axios";
import { supabase } from "./supabase";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8002/api/v1",
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

    switch (status) {
      case 401:
        await supabase.auth.signOut();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        break;

      case 403:
        console.error("Permission denied");
        break;

      case 404:
        console.error("API not found");
        break;

      case 500:
        console.error("Internal Server Error");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default apiClient;