"use client";

import { useState } from "react";
import { FileText, Download, FileSignature, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminDocuments() {
  const [loading, setLoading] = useState(false);

  const mockDocuments = [
    { id: "1", type: "Sale Agreement", resident: "Ravi Kumar", flat: "A-101", date: "2023-11-01", status: "Signed" },
    { id: "2", type: "Rental Agreement", resident: "Priya Sharma", flat: "B-205", date: "2024-01-15", status: "Pending Signature" },
    { id: "3", type: "Booking Confirmation", resident: "Amit Patel", flat: "C-304", date: "2024-02-10", status: "Generated" },
  ];

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Document generated and saved to Supabase Storage.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Legal Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and manage official property documentation</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
        >
          {loading ? <span className="animate-pulse">Generating...</span> : <><FileText className="h-4 w-4" /> Generate New</>}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Sale Agreements</p>
            <p className="text-xs text-slate-500">View generated contracts</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <FileSignature className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Rental Agreements</p>
            <p className="text-xs text-slate-500">Manage lease documents</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">NOC & Certificates</p>
            <p className="text-xs text-slate-500">Clearance documents</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Documents</h3>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Document Type</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resident / Flat</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDocuments.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-400" />
                    <span className="font-bold text-slate-900">{doc.type}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium text-slate-900">{doc.resident}</p>
                  <p className="text-xs text-slate-500">Flat {doc.flat}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    doc.status === 'Signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">{doc.date}</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
