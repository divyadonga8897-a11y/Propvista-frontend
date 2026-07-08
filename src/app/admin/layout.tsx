"use client";

import { usePropVista } from "@/components/Providers";
import AdminSidebar from "@/components/AdminSidebar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, authLoading } = usePropVista();
  console.log("Admin Layout");
  console.log("User:", user);
  console.log("Role:", role);

  useEffect(() => {
    if (!authLoading && (!user || role !== "Admin")) {
      router.replace("/dashboard");
    }
  }, [user, role, authLoading, router]);

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
              <p className="text-sm font-bold text-slate-900">{user.email}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">System Administrator</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-inner">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
