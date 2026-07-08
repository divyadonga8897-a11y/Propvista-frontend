"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { Visitor } from "@/types";
import { Users, Calendar, QrCode, PlusCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selected QR Code display modal
  const [selectedPass, setSelectedPass] = useState<Visitor | null>(null);

  async function loadVisitors() {
    try {
      setLoading(true);
      const res = await apiService.getVisitors();
      setVisitors(res);
    } catch (err: any) {
      console.error("Visitors load error", err);
      setError("Failed to fetch visitor logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const newPass = await apiService.registerVisitor({
        visitor_name: visitorName,
        phone: phone || undefined,
        purpose: purpose || undefined,
        visit_date: visitDate,
        visit_time: visitTime
      });
      toast.success("Visitor pass registered successfully!");
      setVisitorName("");
      setPhone("");
      setPurpose("");
      setVisitDate("");
      setVisitTime("");
      setSelectedPass(newPass); // Show QR code modal immediately
      loadVisitors();
    } catch (err) {
      toast.error("Failed to generate visitor pass.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Visitor Passes</h1>
            <p className="text-xs text-slate-500 mt-1">Pre-register visitors, generate entry QR codes, and review historical visitor logs.</p>
          </div>
          <button onClick={loadVisitors} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pre-Register form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-emerald-500" /> Pre-Register Visitor
            </h3>
            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visitor Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-550"
                  placeholder="Visitor full name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-550"
                  placeholder="Optional phone number"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Purpose of Visit</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  placeholder="e.g. Delivery, Guest, Service"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-xs shadow-md transition-all"
              >
                {submitting ? "Registering..." : "Generate Gate Pass"}
              </button>
            </form>
          </div>

          {/* Visitor logs listing */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-slate-700" />
              Pre-Registration Registry ({visitors.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-emerald-600"></div>
              </div>
            ) : visitors.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                No visitor gate passes registered.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-4">Visitor</th>
                        <th className="p-4">Purpose</th>
                        <th className="p-4">Visit Schedule</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Gate Pass</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {visitors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{v.visitor_name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{v.phone || "No phone number"}</p>
                          </td>
                          <td className="p-4 text-slate-500">{v.purpose || "N/A"}</td>
                          <td className="p-4">
                            <p className="text-slate-700">{v.visit_date}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{v.visit_time}</p>
                          </td>
                          <td className="p-4">{getStatusBadge(v.approval_status)}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedPass(v)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
                            >
                              <QrCode className="h-3.5 w-3.5" /> View Pass
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Gate Pass Modal */}
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-fade-in text-center flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-800">Visitor Gate Pass</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">{selectedPass.id.slice(0, 8)}</p>
              
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl my-6">
                <QrCode className="h-44 w-44 text-slate-800 animate-pulse-once" />
              </div>

              <div className="space-y-1 mt-2 text-xs">
                <p className="font-bold text-slate-800">{selectedPass.visitor_name}</p>
                <p className="text-slate-500">Scheduled: {selectedPass.visit_date} @ {selectedPass.visit_time}</p>
                <p className="text-slate-400 italic">Purpose: {selectedPass.purpose || "N/A"}</p>
              </div>

              <button
                onClick={() => setSelectedPass(null)}
                className="mt-6 w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 text-xs transition-colors"
              >
                Close Pass
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
