"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { Bell, Loader2, Pin, Calendar, FileText, CheckCircle2 } from "lucide-react";

export default function NoticeBoard() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getNoticeBoard();
        setNotices(data || []);
      } catch (err) {
        console.error("Failed to load notices:", err);
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Notice Board</h1>
              <p className="text-sm text-slate-500">Important updates from the community management</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Active Notices</h3>
              <p className="text-sm text-slate-500">You're all caught up! Check back later.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {notices.map((notice) => (
                <div key={notice.id} className={`rounded-2xl border bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start ${notice.priority === 'High' ? 'border-red-200' : 'border-slate-200'}`}>
                  {/* Icon Column */}
                  <div className={`shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                    notice.priority === 'High' ? 'bg-red-50 text-red-600' : 
                    notice.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {notice.priority === 'High' ? <Pin className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                      {notice.priority === 'High' && (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(notice.created_at).toLocaleDateString()}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-full">{notice.category}</span>
                    </div>
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
