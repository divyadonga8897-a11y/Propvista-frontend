"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: "Customer",
    loading: true,
    error: null,
  });

  // Extract role from Supabase user metadata
  const extractRole = (user: User | null): UserRole => {
    if (!user) return "Customer";
    const meta = user.user_metadata;
    const appMeta = user.app_metadata;
    const role = meta?.role || appMeta?.role;
    if (role === "Admin") return "Admin";
    if (role === "Resident") return "Resident";
    // Email-based fallback for easy dev/testing
    if (user.email?.startsWith("admin")) return "Admin";
    if (user.email?.startsWith("resident")) return "Resident";
    return "Customer";
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        role: extractRole(session?.user ?? null),
        loading: false,
        error: null,
      });
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          role: extractRole(session?.user ?? null),
          loading: false,
          error: null,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }
    return { success: true, role: extractRole(data.user) };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, role: UserRole) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      if (error) {
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, role: "Customer", loading: false, error: null });
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!state.user,
  };
}
