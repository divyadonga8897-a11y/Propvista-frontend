"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { Document } from "@/types";
import { FileText, Download, ShieldCheck, RefreshCw } from "lucide-react";

export default function DocumentCenterPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDocuments() {
    try {
      setLoading(true);
      const res = await apiService.getDocuments();
      setDocuments(res);
    } catch (err: any) {
      console.error("Documents load error", err);
      setError("Failed to fetch documents checklist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Document Center</h1>
            <p className="text-xs text-slate-500 mt-1">Download official purchase files, tenancy lease agreements, invoice receipts, and parking permits.</p>
          </div>
          <button onClick={loadDocuments} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-emerald-600"></div>
            <p className="text-xs text-slate-500">Checking secure documents registry...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">{error}</div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            No official documents have been generated or associated with your flat unit yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{doc.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{doc.doc_type}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Storage
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3 w-3" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
