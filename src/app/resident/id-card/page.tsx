"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { BadgeInfo, Home, CalendarDays, Loader2, CreditCard, Download } from "lucide-react";
import { usePropVista } from "@/components/Providers";

export default function DigitalResidentID() {
  const { user } = usePropVista();
  const [idCard, setIdCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIdCard() {
      try {
        const data = await apiService.getResidentIdCard();
        setIdCard(data);
      } catch (err: any) {
        console.error(err);
        setError("Could not load Resident ID. Please make sure you are an active resident.");
      } finally {
        setLoading(false);
      }
    }
    fetchIdCard();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">Generating Digital ID...</p>
          </div>
        ) : error || !idCard ? (
          <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 max-w-md w-full shadow-sm">
            <BadgeInfo className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Resident ID Found</h3>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
          </div>
        ) : (
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-slate-900">Digital Resident ID</h1>
              <p className="text-sm text-slate-500">Present this ID at community gates</p>
            </div>

            {/* ID Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white border border-indigo-500/20">
              {/* Background Accents */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-white/10 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/10">
                      <CreditCard className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Resident ID</p>
                      <p className="text-sm font-bold">{idCard.apartment_name}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {idCard.status}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Resident Name</p>
                    <p className="text-xl font-bold tracking-wide">{idCard.user_name || user?.email?.split("@")[0]}</p>
                  </div>
                  
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Home className="h-3 w-3" /> Unit
                      </p>
                      <p className="text-lg font-bold">{idCard.flat_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> Valid From
                      </p>
                      <p className="text-sm font-medium mt-1">{idCard.move_in_date || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Role</p>
                      <p className="text-sm font-medium">{idCard.resident_type}</p>
                    </div>
                    {idCard.resident_id && (
                      <div className="text-right">
                        <p className="text-[8px] text-slate-400 font-mono tracking-widest mb-1">ID NUMBER</p>
                        <p className="text-xs font-mono bg-white/5 px-2 py-1 rounded border border-white/10">{idCard.resident_id.substring(0, 13).toUpperCase()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors">
              <Download className="h-4 w-4" /> Download Pass
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
