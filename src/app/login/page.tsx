"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
  Building2,
  Users,
  ShieldCheck,
  Home
} from "lucide-react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type UserRole = "customer" | "resident" | "admin";

export default function LoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<UserRole>("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setCheckingSession(false);
        return;
      }

      const role =
        (
          session.user.user_metadata?.role ||
          session.user.app_metadata?.role ||
          "customer"
        )
          .toString()
          .toLowerCase();

      switch (role) {
        case "admin":
          router.replace("/admin");
          break;
        case "resident":
          router.replace("/resident");
          break;
        default:
          router.replace("/home");
          break;
      }
      router.refresh();
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      toast.error(authError.message);
      return;
    }

    if (!data.user) {
      setLoading(false);
      toast.error("Unable to login.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    let actualRole = "customer";
    const userEmail = data.user.email?.toLowerCase() ?? "";

    if (session?.user?.user_metadata?.role) {
      actualRole = String(session.user.user_metadata.role).toLowerCase();
    } else if (session?.user?.app_metadata?.role) {
      actualRole = String(session.user.app_metadata.role).toLowerCase();
    }

    if (actualRole === "customer") {
      const adminEmails = [
        "divyadonga8897@gmail.com",
        "divyause2@gmail.com",
        "admin@propvista.com",
      ];
      const residentEmails = ["resident@propvista.com"];

      if (
        adminEmails.includes(userEmail) ||
        (userEmail.includes("admin") && userEmail.endsWith("@propvista.com"))
      ) {
        actualRole = "admin";
      } else if (
        residentEmails.includes(userEmail) ||
        userEmail.startsWith("resident")
      ) {
        actualRole = "resident";
      }
    }

    // Explicitly check that the user used the right tab.
    if (actualRole !== activeTab) {
      setLoading(false);
      await supabase.auth.signOut();
      const msg = `You attempted to log in as a ${activeTab}, but your account is a ${actualRole}. Please use the correct login tab.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(false);
    toast.success("Login successful! Redirecting…");

    switch (actualRole) {
      case "admin":
        router.replace("/admin");
        break;
      case "resident":
        router.replace("/resident");
        break;
      default:
        router.replace("/home");
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_70%)]" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black text-white">PropVista AI</h1>
              <p className="text-sm text-slate-400">Real Estate & Society Platform</p>
            </div>
          </Link>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white text-center mb-6">Select Login Type</h2>

            <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab("customer"); setError(""); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === "customer"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
              >
                <Home className="h-4 w-4" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => { setActiveTab("resident"); setError(""); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === "resident"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
              >
                <Users className="h-4 w-4" />
                <span>Resident</span>
              </button>

              <button
                onClick={() => { setActiveTab("admin"); setError(""); }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === "admin"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-700 ${activeTab === "customer" ? "bg-blue-600 hover:bg-blue-500" :
                activeTab === "resident" ? "bg-emerald-600 hover:bg-emerald-500" :
                  "bg-violet-600 hover:bg-violet-500"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {activeTab === "customer" && (
            <div className="mt-8 border-t border-slate-800 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Don&apos;t have an account?
              </p>
              <Link
                href="/register"
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 px-5 py-3 font-semibold transition hover:bg-blue-600/30"
              >
                Create Customer Account
              </Link>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-3 text-center text-sm font-semibold text-slate-300">
              Development Accounts
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between rounded-lg bg-slate-900 px-3 py-2">
                <span>Admin</span>
                <span>admin@propvista.com</span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-900 px-3 py-2">
                <span>Resident</span>
                <span>resident@propvista.com</span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-900 px-3 py-2">
                <span>Customer</span>
                <span>user@propvista.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}