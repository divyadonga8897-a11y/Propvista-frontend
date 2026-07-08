"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { BellRing, Loader2, Info, AlertTriangle, FileText } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getAnnouncements();
        setNotifications(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-500">Recent activity and alerts</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <BellRing className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No new notifications</h3>
              <p className="text-sm text-slate-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${notif.announcement_type === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {notif.announcement_type === 'Emergency' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.content}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">{new Date(notif.publish_date).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
