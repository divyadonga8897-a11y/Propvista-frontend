"use client";

import { useState } from "react";
import { ShieldCheck, Search, CheckCircle, XCircle, FileText, AlertCircle, Clock } from "lucide-react";

export default function AdminApprovals() {
  const [approvals, setApprovals] = useState([
    { id: "1", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 9988776655", apartment: "PropVista Heights", flat: "A-402", type: "Owner", status: "Pending", submitDate: "2026-07-07", documentUrl: "#" },
    { id: "2", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 9988776656", apartment: "PropVista Heights", flat: "B-105", type: "Tenant", status: "Pending", submitDate: "2026-07-08", documentUrl: "#" },
    { id: "3", name: "Ravi Kumar", email: "ravi@example.com", phone: "+91 9988776657", apartment: "Green Valley", flat: "C-201", type: "Tenant", status: "Approved", submitDate: "2026-07-05", documentUrl: "#" },
  ]);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");

  const filteredApprovals = approvals.filter(a => 
    (a.status === activeTab || activeTab === "All") &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || 
     a.apartment.toLowerCase().includes(search.toLowerCase()) ||
     a.flat.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApprove = (id: string) => {
    if (confirm("Are you sure you want to approve this resident?")) {
      setApprovals(approvals.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt("Enter reason for rejection (optional):");
    if (reason !== null) {
      setApprovals(approvals.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resident Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">Verify and approve new resident registrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold">Pending Reviews</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{approvals.filter(a => a.status === 'Pending').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-bold">Approved</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{approvals.filter(a => a.status === 'Approved').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-bold">Rejected</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{approvals.filter(a => a.status === 'Rejected').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-bold">Action Required</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{approvals.filter(a => a.status === 'Pending').length > 0 ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["Pending", "Approved", "Rejected", "All"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Applicant</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Property</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type & Docs</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovals.map((app) => (
              <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{app.name}</p>
                      <p className="text-xs text-slate-500">{app.email} • {app.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{app.flat}</p>
                  <p className="text-xs text-slate-500">{app.apartment}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-md w-fit">
                      {app.type}
                    </span>
                    <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                      <FileText className="h-3.5 w-3.5" /> View Documents
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {app.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Submitted {app.submitDate}</p>
                </td>
                <td className="p-4 text-right">
                  {app.status === 'Pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleApprove(app.id)} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => handleReject(app.id)} className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredApprovals.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No applications found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
