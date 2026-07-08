"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { Announcement } from "@/types";
import { BellRing, Calendar, ShieldCheck, RefreshCw } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const res = await apiService.getAnnouncements();
      setAnnouncements(res);
    } catch (err: any) {
      console.error("Announcements load error", err);
      setError("Failed to fetch community announcements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Emergency":
        return "bg-red-50 text-red-700 border-red-200";
      case "Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Event":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Announcements</h1>
            <p className="text-xs text-slate-500 mt-1">Stay updated with official bulletins, events, and maintenance alerts from your community.</p>
          </div>
          <button onClick={loadAnnouncements} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-emerald-600"></div>
            <p className="text-xs text-slate-500">Checking bulletin registry...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            No official bulletins or announcements posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getTypeStyle(a.announcement_type)}`}>
                      {a.announcement_type}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-slate-400">
                      <Calendar className="h-3.5 w-3.5" /> {a.publish_date?.split("T")[0] || a.created_at?.split("T")[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-3">{a.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{a.content}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authorized broadcast by: <strong className="text-slate-600">{a.created_by || "Management"}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
