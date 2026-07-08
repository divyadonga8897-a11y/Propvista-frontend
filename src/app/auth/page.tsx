"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Users,
  ShieldCheck,
  Home,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setCheckingSession(false);
        return;
      }

      const role = (
        session.user.user_metadata?.role ||
        session.user.app_metadata?.role ||
        "customer"
      )
        .toString()
        .toLowerCase();

      switch (role) {
        case "admin":
          router.replace("/dashboard/admin");
          break;
        case "resident":
          router.replace("/resident");
          break;
        default:
          router.replace("/customer");
          break;
      }
    };

    checkSession();
  }, [router]);

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
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black text-white">PropVista AI</h1>
              <p className="text-sm text-slate-400">
                Real Estate &amp; Society Platform
              </p>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
          <h2 className="mb-2 text-center text-xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mb-8 text-center text-sm text-slate-400">
            Select your role to continue
          </p>

          <div className="space-y-4">
            {/* Customer */}
            <Link
              href="/login?role=customer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 transition-all hover:border-blue-500/50 hover:bg-blue-600/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                <Home className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Customer Login</h3>
                <p className="text-xs text-slate-400">
                  Browse apartments &amp; book flats
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-blue-400" />
            </Link>

            {/* Resident */}
            <Link
              href="/login?role=resident"
              className="group flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 transition-all hover:border-emerald-500/50 hover:bg-emerald-600/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Resident Login</h3>
                <p className="text-xs text-slate-400">
                  Society management &amp; services
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-emerald-400" />
            </Link>

            {/* Admin */}
            <Link
              href="/login?role=admin"
              className="group flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 transition-all hover:border-violet-500/50 hover:bg-violet-600/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 transition group-hover:bg-violet-600 group-hover:text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Admin Login</h3>
                <p className="text-xs text-slate-400">
                  Dashboard &amp; property management
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-violet-400" />
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?
            </p>
            <Link
              href="/register"
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600/20 px-5 py-3 font-semibold text-blue-400 transition hover:bg-blue-600/30"
            >
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
