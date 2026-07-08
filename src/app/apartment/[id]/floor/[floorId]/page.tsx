"use client";

import { use, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Floor } from "@/types/real-estate";
import Link from "next/link";
import { ArrowLeft, Home, Building } from "lucide-react";
import Footer from "@/components/Footer";

export default function FloorViewPage({ params }: { params: Promise<{ id: string; floorId: string }> }) {
  const resolvedParams = use(params);
  const [floor, setFloor] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFloor();
  }, [resolvedParams.floorId]);

  const fetchFloor = async () => {
    try {
      setLoading(true);
      const data = await apiService.updateFloor(resolvedParams.floorId, {}); // Get floor detail wrapper
      setFloor(data);
    } catch (err) {
      console.error("Error fetching floor view:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50">
        <Building className="h-12 w-12 text-slate-300 animate-pulse mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading Floor Map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Link
          href={`/apartment/${resolvedParams.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-blue mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Community Overview
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">
            {floor?.floor_name || `Floor ${floor?.floor_number}`} Details
          </h1>
          <p className="text-xs text-slate-500 mb-6">{floor?.description || "Visual map of flats on this floor."}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {floor?.flats?.map((flat) => (
              <Link
                key={flat.id}
                href={`/flat/${flat.id}`}
                className="block p-4 border border-slate-100 hover:border-brand-blue rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all text-center"
              >
                <div className="h-2 w-2 rounded-full mx-auto mb-2 bg-emerald-500" />
                <span className="text-xs font-bold text-slate-900 block">Flat {flat.flat_number}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{flat.flat_type} · {flat.area_sqft} sqft</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
