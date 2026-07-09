"use client";

import { usePropVista } from "@/components/Providers";
import AdminSidebar from "@/components/AdminSidebar";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, authLoading, signOut } = usePropVista();
  const [signingOut, setSigningOut] = useState(false);

  console.log("Admin Layout");

  useEffect(() => {
    if (!authLoading && (!user || role !== "Admin")) {
      router.replace("/dashboard");
    }
  }, [user, role, authLoading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    router.replace("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user || role !== "Admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen w-full font-sans text-slate-900">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        {/* Simple top header for the admin area */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-6 md:px-8 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Admin Control Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.email?.split("@")[0]}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">System Administrator</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-inner">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="ml-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
            >
              {signingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              {signingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
