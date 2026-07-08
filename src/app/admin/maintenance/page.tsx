"use client";

import { useState } from "react";
import { Wrench, Plus, Receipt, AlertTriangle, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function AdminMaintenance() {
  const [loading, setLoading] = useState(false);

  const mockBills = [
    { id: "1", resident: "Ravi Kumar", flat: "A-101", amount: 4500, status: "Paid", due_date: "2024-03-05" },
    { id: "2", resident: "Priya Sharma", flat: "B-205", amount: 4500, status: "Pending", due_date: "2024-03-05" },
    { id: "3", resident: "Amit Patel", flat: "C-304", amount: 5000, status: "Overdue", due_date: "2024-02-05" },
  ];

  const handleGenerateBills = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Monthly maintenance bills generated for all active residents.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Maintenance Management</h1>
          <p className="text-sm text-slate-500 mt-1">Generate bills, track payments, and apply late fees</p>
        </div>
        <button 
          onClick={handleGenerateBills}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
        >
          {loading ? <span className="animate-pulse">Processing...</span> : <><Plus className="h-4 w-4" /> Generate Monthly Bills</>}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Total Collected</p>
            <p className="text-xl font-black text-emerald-700">₹45,000</p>
          </div>
        </div>
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Pending Dues</p>
            <p className="text-xl font-black text-orange-700">₹18,000</p>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Overdue Amount</p>
            <p className="text-xl font-black text-red-700">₹5,000</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resident</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Flat</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBills.map((bill) => (
              <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-indigo-400" />
                    <span className="font-bold text-slate-900">{bill.resident}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-700">{bill.flat}</td>
                <td className="p-4 font-bold text-slate-900">₹{bill.amount}</td>
                <td className="p-4 text-sm text-slate-600">{bill.due_date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                    bill.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
