"use client";

import { useState } from "react";
import { DollarSign, Search, CheckCircle, Clock, AlertTriangle, FileText, Download } from "lucide-react";

export default function AdminRent() {
  const [rentRecords, setRentRecords] = useState([
    { id: "R-3001", resident: "Priya Patel", flat: "B-205", apartment: "PropVista Heights", amount: 15000, month: "July 2026", dueDate: "2026-07-05", status: "Paid", paidDate: "2026-07-03" },
    { id: "R-3002", resident: "Rahul Sharma", flat: "A-101", apartment: "PropVista Heights", amount: 18000, month: "July 2026", dueDate: "2026-07-05", status: "Overdue", paidDate: null },
    { id: "R-3003", resident: "Amit Kumar", flat: "C-304", apartment: "Green Valley", amount: 12000, month: "August 2026", dueDate: "2026-08-05", status: "Pending", paidDate: null },
  ]);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  const filteredRecords = rentRecords.filter(r => 
    (r.status === activeTab || activeTab === "All") &&
    (r.resident.toLowerCase().includes(search.toLowerCase()) || 
     r.flat.toLowerCase().includes(search.toLowerCase()) ||
     r.month.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "Overdue": return "text-red-700 bg-red-100 border-red-200";
      case "Pending": return "text-orange-700 bg-orange-100 border-orange-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  const handleMarkPaid = (id: string) => {
    if (confirm("Mark this rent as paid?")) {
      setRentRecords(rentRecords.map(r => r.id === id ? { ...r, status: "Paid", paidDate: new Date().toISOString().split('T')[0] } : r));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Rent Collection</h1>
          <p className="text-sm text-slate-500 mt-1">Track monthly rent payments and dues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <DollarSign className="h-5 w-5" />
            <h3 className="font-bold">Total Expected</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">₹{rentRecords.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-bold">Collected</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">₹{rentRecords.filter(r => r.status === 'Paid').reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-bold">Overdue Amount</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">₹{rentRecords.filter(r => r.status === 'Overdue').reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold">Pending Residents</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{rentRecords.filter(r => r.status === 'Pending' || r.status === 'Overdue').length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["All", "Paid", "Pending", "Overdue"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resident</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount & Month</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Due Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {record.resident.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{record.resident}</p>
                      <p className="text-xs text-slate-500">{record.flat}, {record.apartment}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-900 text-base">₹{record.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 font-medium">{record.month}</p>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-700">{record.dueDate}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  {record.paidDate && (
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Paid on {record.paidDate}</p>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {record.status === 'Paid' ? (
                      <button className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Receipt
                      </button>
                    ) : (
                      <button onClick={() => handleMarkPaid(record.id)} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No rent records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
