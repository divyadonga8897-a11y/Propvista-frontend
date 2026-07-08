import { supabase } from "@/lib/supabase";
import apiClient from "@/lib/apiClient";
import type { UserRole, AuthUser } from "@/types";

export const authService = {
  /** Sign in with email and password via Supabase */
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  /** Register new user with role metadata */
  signUp: async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
  },

  /** Sign out current user */
  signOut: async () => {
    return supabase.auth.signOut();
  },

  /** Get current logged-in user session */
  getSession: async () => {
    return supabase.auth.getSession();
  },

  /** Fetch user profile from backend */
  getProfile: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get("/api/v1/auth/me");
    return data;
  },
};

export default authService;
