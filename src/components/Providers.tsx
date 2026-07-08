"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { UserRole } from "@/types";

// ─── Context Types ────────────────────────────────────────────
interface PropVistaContextType {
  // Auth
  user: User | null;
  session: Session | null;
  role: UserRole;
  authLoading: boolean;
  signOut: () => Promise<void>;
  // Legacy wishlist / compare (kept for existing pages)
  wishlist: string[];
  toggleWishlist: (unitId: string) => void;
  compareList: string[];
  addToCompare: (unitId: string) => void;
  removeFromCompare: (unitId: string) => void;
  clearCompare: () => void;
}

const PropVistaContext = createContext<PropVistaContextType | undefined>(undefined);

export function usePropVista() {
  const context = useContext(PropVistaContext);
  if (!context) throw new Error("usePropVista must be used within Providers");
  return context;
}

// Helper: extract role from Supabase user metadata
function extractRole(user: User | null): UserRole {
  if (!user) return "Customer";

  const role = (
    user.user_metadata?.role ||
    user.app_metadata?.role ||
    user.email?.toLowerCase() ||
    "customer"
  )
    .toString()
    .toLowerCase();

  // Email‑based shortcuts for dev/admin accounts
  if (user.email?.toLowerCase().includes("admin@propvista.com") || user.email?.toLowerCase().includes("divyadonga8897@gmail.com") || user.email?.toLowerCase().includes("divyause2@gmail.com")) {
    return "Admin";
  }
  if (user.email?.toLowerCase().includes("resident@propvista.com")) {
    return "Resident";
  }

  switch (role) {
    case "admin":
      return "Admin";

    case "resident":
      return "Resident";

    default:
      return "Customer";
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>("Customer");
  const [authLoading, setAuthLoading] = useState(true);

  // Wishlist + Compare (localStorage)
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  // ── Supabase Auth listener ────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Supabase Auth Error:", error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setRole(extractRole(session?.user ?? null));
      })
      .catch((err) => {
        console.error("Session fetch error:", err);
      })
      .finally(() => {
        setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRole(session?.user ?? null));
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── localStorage hydration ────────────────────────────────
  useEffect(() => {
    try {
      const savedWish = localStorage.getItem("pv_wishlist");
      if (savedWish) setWishlist(JSON.parse(savedWish));
      const savedCompare = localStorage.getItem("pv_compare");
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
    } catch { }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleWishlist = (unitId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId];
      localStorage.setItem("pv_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const addToCompare = (unitId: string) => {
    setCompareList((prev) => {
      if (prev.includes(unitId) || prev.length >= 3) return prev;
      const next = [...prev, unitId];
      localStorage.setItem("pv_compare", JSON.stringify(next));
      return next;
    });
  };

  const removeFromCompare = (unitId: string) => {
    setCompareList((prev) => {
      const next = prev.filter((id) => id !== unitId);
      localStorage.setItem("pv_compare", JSON.stringify(next));
      return next;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("pv_compare");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PropVistaContext.Provider
        value={{
          user,
          session,
          role,
          authLoading,
          signOut,
          wishlist,
          toggleWishlist,
          compareList,
          addToCompare,
          removeFromCompare,
          clearCompare,
        }}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
      </PropVistaContext.Provider>
    </QueryClientProvider>
  );
}
