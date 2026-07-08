"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { RentRecord } from "@/types";
import { FileText, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";

export default function RentRecordsPage() {
  const [rentHistory, setRentHistory] = useState<RentRecord[]>([]);
  const [outstandingTotal, setOutstandingTotal] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRentData() {
    try {
      setLoading(true);
      const res = await apiService.getRentRecords();
      setRentHistory(res.records);
      setOutstandingTotal(res.outstanding_total);
    } catch (err: any) {
      console.error("Rent records load error", err);
      setError("Only Tenant users can access rent records. Owner profiles do not have rent dues.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRentData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Paid</span>;
      case "Overdue":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full"><AlertCircle className="h-3 w-3" /> Overdue</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  const formatMonth = (m: number) => {
    const dates = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return dates[m - 1] || m;
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Monthly Rent</h1>
            <p className="text-xs text-slate-500 mt-1">For Tenants: Track monthly rent schedules, outstanding balance, and transaction history.</p>
          </div>
          <button onClick={loadRentData} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-emerald-600"></div>
            <p className="text-xs text-slate-500">Retrieving rent schedule logs...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center space-y-4">
            <FileText className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-sm font-bold text-amber-800">No Rent Dues Registered</h2>
            <p className="text-xs text-amber-700 leading-relaxed">
              This dashboard is only applicable to community Tenants. Owner residents do not have monthly rent records.
            </p>
          </div>
        ) : (
          <>
            {/* Outstanding Balance Banner */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding Rent Balance</p>
                <p className="text-3xl font-black text-slate-800 mt-2">₹{outstandingTotal.toLocaleString()}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                outstandingTotal > 0 ? "bg-red-50 text-red-700 border border-red-150" : "bg-emerald-50 text-emerald-700 border border-emerald-150"
              }`}>
                {outstandingTotal > 0 ? "Outstanding Dues" : "All Clear"}
              </span>
            </div>

            {/* Rent Records Table */}
            {rentHistory.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                No rent records have been generated.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-4">Period</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4">Rent Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {rentHistory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">{formatMonth(rec.month)} {rec.year}</td>
                          <td className="p-4 text-slate-500">{rec.due_date}</td>
                          <td className="p-4 font-bold">₹{rec.amount.toLocaleString()}</td>
                          <td className="p-4">{getStatusBadge(rec.payment_status)}</td>
                          <td className="p-4 text-slate-400">{rec.payment_date?.split("T")[0] || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
