"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { ResidentProperty, Document } from "@/types";
import { Building2, Landmark, QrCode, FileText, Download, Shield } from "lucide-react";

export default function MyPropertyPage() {
  const [property, setProperty] = useState<ResidentProperty | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPropertyData() {
      try {
        setLoading(true);
        const [prop, docs] = await Promise.all([
          apiService.getMyProperty(),
          apiService.getDocuments()
        ]);
        setProperty(prop);
        setDocuments(docs);
      } catch (err: any) {
        console.error("Property passport load error", err);
        setError("Failed to fetch property details. Please verify your active occupancy status.");
      } finally {
        setLoading(false);
      }
    }
    loadPropertyData();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
            <p className="text-sm font-semibold text-slate-500">Retrieving Property Records...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center space-y-4">
            <Shield className="h-12 w-12 text-slate-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Access Denied</h2>
            <p className="text-xs text-slate-500">
              {error || "Only active residents can access the digital property passport."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <h1 className="text-2xl font-black text-slate-800">My Property</h1>
        <p className="text-xs text-slate-500 -mt-6">Manage flat specifications, download agreements, and view your Digital Property Passport.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Digital Passport Card */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Landmark className="h-4.5 w-4.5 text-emerald-500" />
                Digital Property Passport
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider">
                Verified Resident
              </span>
            </div>

            {/* Passport Details Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Apartment Community</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.apartment_name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flat Number</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.flat_number} (Floor {property.floor_number})</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resident Class</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.resident_type}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Agreement Number</p>
                <p className="text-xs font-mono text-slate-700 mt-1">{property.agreement_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Built-up Area</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.area_sqft} Sq.Ft.</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Facing Direction</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.facing_direction}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Maintenance</p>
                <p className="text-sm font-bold text-slate-800 mt-1">₹{property.maintenance_fee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Owner Name</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{property.owner_name || "Nandyal PropVista Ltd"}</p>
              </div>
            </div>
          </div>

          {/* QR Passport Gate Pass */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Community Access Code</p>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
              <QrCode className="h-44 w-44 text-slate-800" />
            </div>
            <p className="text-[10px] text-slate-500 font-semibold max-w-[200px] leading-relaxed">
              Scan this QR code at society main gate or facility entrance.
            </p>
          </div>
        </div>

        {/* Legal Agreements & Documents Center */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-500" />
            Digital Document Repository
          </h3>

          {documents.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No documents uploaded or generated yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Type: {doc.doc_type} • Uploaded: {doc.created_at?.split("T")[0]}</p>
                    </div>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3 w-3" /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
