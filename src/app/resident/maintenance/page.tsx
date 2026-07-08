"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { MaintenanceBill } from "@/types";
import { Wrench, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [bills, setBills] = useState<MaintenanceBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pay states
  const [payingId, setPayingId] = useState<string | null>(null);

  async function loadMaintenanceData() {
    try {
      setLoading(true);
      const res = await apiService.getMaintenanceBills();
      setBills(res.records);
    } catch (err: any) {
      console.error("Maintenance load error", err);
      setError("Failed to retrieve maintenance bills.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const handlePay = async (billId: string) => {
    try {
      setPayingId(billId);
      await apiService.payMaintenanceBill(billId);
      toast.success("Payment successful! Bill status updated.");
      loadMaintenanceData();
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Paid</span>;
      case "Overdue":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><AlertCircle className="h-3 w-3" /> Overdue</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" /> Pending</span>;
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
            <h1 className="text-2xl font-black text-slate-800">Maintenance Bills</h1>
            <p className="text-xs text-slate-500 mt-1">Review society maintenance fee invoices, payments, and late charges.</p>
          </div>
          <button onClick={loadMaintenanceData} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-emerald-600"></div>
            <p className="text-xs text-slate-500">Checking maintenance record registry...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">{error}</div>
        ) : bills.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            No maintenance records found for your unit.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4">Period</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Base Amount</th>
                    <th className="p-4">Late Fee</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        {formatMonth(bill.month)} {bill.year}
                      </td>
                      <td className="p-4 text-slate-500">{bill.due_date}</td>
                      <td className="p-4">₹{bill.amount.toLocaleString()}</td>
                      <td className="p-4 text-red-500">₹{bill.late_fee.toLocaleString()}</td>
                      <td className="p-4 font-bold text-slate-900">₹{(bill.amount + bill.late_fee).toLocaleString()}</td>
                      <td className="p-4">{getStatusBadge(bill.payment_status)}</td>
                      <td className="p-4 text-right">
                        {bill.payment_status !== "Paid" ? (
                          <button
                            onClick={() => handlePay(bill.id)}
                            disabled={payingId !== null}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 shadow-sm transition-all disabled:opacity-50"
                          >
                            {payingId === bill.id ? "Paying..." : "Pay Now"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Cleared on {bill.payment_date?.split("T")[0]}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
