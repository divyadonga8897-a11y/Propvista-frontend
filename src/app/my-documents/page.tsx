"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { FileText, Download, Eye } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch user token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token);
      }
    });

    // 2. Load user documents
    apiService.getDocuments().then((data) => {
      setDocuments(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8008";
    return `${baseUrl}${path}`;
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "sold" || s === "rented") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "pending" || s === "held") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="flex-grow flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-black text-brand-dark mb-2">Legal Documents Center</h1>
          <p className="text-xs text-brand-gray">Download agreements, invoices, certificates, and receipts.</p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-xl w-full" />
            <div className="h-10 bg-slate-200 rounded-xl w-full" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-2xl">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-700">No Legal Papers Generated Yet</h3>
            <p className="text-xs text-slate-400 mt-1">Complete booking or pay maintenance to access contracts.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-4">Document Type</th>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Apartment</th>
                    <th className="p-4">Floor</th>
                    <th className="p-4">Flat Number</th>
                    <th className="p-4">Booking Type</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="text-slate-800 hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-brand-blue" />
                          <span className="font-extrabold">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-slate-500">
                        {doc.booking_id ? `${doc.booking_id.substring(0, 8)}...` : "N/A"}
                      </td>
                      <td className="p-4 text-slate-700 font-semibold">
                        {doc.apartment_name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {doc.floor_name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-700 font-bold">
                        {doc.flat_number || "N/A"}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {doc.booking_type || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(doc.status)}`}>
                          {doc.status || "Completed"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <a
                            href={getApiUrl(`/api/v1/documents/${doc.id}/view?token=${token}`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </a>
                          <a
                            href={getApiUrl(`/api/v1/documents/${doc.id}/download?token=${token}`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Download PDF
                          </a>
                        </div>
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
