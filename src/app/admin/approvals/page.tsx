"use client";

import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/apiService";
import {
  ShieldCheck, Search, CheckCircle, XCircle, FileText,
  AlertCircle, Clock, Download, Building2, Home, Layers, User, Mail, Phone, Loader2
} from "lucide-react";

export default function AdminApprovals() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  const loadApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getResidentAccessRequests();
      setApprovals(data);
    } catch (err) {
      console.error("Failed to load approvals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const filteredApprovals = approvals.filter(a =>
    (a.status === activeTab || activeTab === "All") &&
    (
      (a.customer?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.flat?.flat_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.flat?.apartment_name || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleApprove = async (id: string) => {
    const remarks = remarksMap[id] || "Approved by Admin";
    if (!confirm(`Approve this resident access request?\nRemarks: ${remarks}`)) return;
    try {
      setActionLoadingId(id);
      await apiService.approveResidentAccessRequest(id, remarks);
      await loadApprovals();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to approve request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = remarksMap[id] || prompt("Enter reason for rejection (optional):") || "";
    if (reason === null) return;
    try {
      setActionLoadingId(id);
      await apiService.rejectResidentAccessRequest(id, reason);
      await loadApprovals();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to reject request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusCounts = {
    Pending: approvals.filter(a => a.status === "Pending").length,
    Approved: approvals.filter(a => a.status === "Approved").length,
    Rejected: approvals.filter(a => a.status === "Rejected").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resident Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">Review and approve resident access requests after payment</p>
        </div>
        <button
          onClick={loadApprovals}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold text-sm">Pending</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{statusCounts.Pending}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            <h3 className="font-bold text-sm">Approved</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{statusCounts.Approved}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-bold text-sm">Rejected</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{statusCounts.Rejected}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-bold text-sm">Action Required</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{statusCounts.Pending > 0 ? "Yes" : "No"}</div>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex gap-2 flex-wrap">
            {["Pending", "Approved", "Rejected", "All"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email / flat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm font-medium">Loading approvals...</p>
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ShieldCheck className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No {activeTab.toLowerCase()} requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApprovals.map((req) => {
              const isProcessing = actionLoadingId === req.id;
              const isPending = req.status === "Pending";
              const docUrl = req.document?.file_url || null;

              return (
                <div key={req.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6" />
                    </div>

                    {/* Customer & Property Info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Customer */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Customer</p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {req.customer?.full_name || req.customer?.email?.split("@")[0] || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {req.customer?.email || "—"}
                        </div>
                      </div>

                      {/* Property */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Property</p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Building2 className="h-3.5 w-3.5 text-blue-400" />
                          {req.flat?.apartment_name || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Home className="h-3 w-3 text-slate-400" />
                          Flat {req.flat?.flat_number || "—"}
                        </div>
                      </div>

                      {/* Booking & Status */}
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status & Date</p>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "Approved" ? "bg-emerald-100 text-emerald-700"
                          : req.status === "Rejected" ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                        }`}>
                          {req.status}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {req.created_at ? new Date(req.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agreement + Remarks + Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Agreement Link */}
                    {docUrl ? (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Agreement PDF
                        <Download className="h-3 w-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic px-3 py-2">No document attached</span>
                    )}

                    {isPending && (
                      <>
                        {/* Remarks Input */}
                        <input
                          type="text"
                          placeholder="Add remarks (optional)..."
                          value={remarksMap[req.id] || ""}
                          onChange={(e) => setRemarksMap(prev => ({ ...prev, [req.id]: e.target.value }))}
                          className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400"
                        />

                        {/* Approve / Reject */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={isProcessing}
                            className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={isProcessing}
                            className="px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                            Reject
                          </button>
                        </div>
                      </>
                    )}

                    {!isPending && req.remarks && (
                      <p className="text-xs text-slate-500 italic ml-1">Remarks: {req.remarks}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
