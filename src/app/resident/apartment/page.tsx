"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { Building2, Loader2, Home, Grid, Compass, ArrowRight, UserCircle, Wrench } from "lucide-react";
import type { ResidentProperty } from "@/types";

export default function ViewApartment() {
  const [property, setProperty] = useState<ResidentProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getMyProperty();
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">View Apartment</h1>
              <p className="text-sm text-slate-500">Details of your current residence</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : !property ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Property Found</h3>
              <p className="text-sm text-slate-500">You don't have an active resident property linked to your account.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
              <div className="h-48 bg-gradient-to-br from-emerald-600 to-teal-700 relative flex items-center justify-center overflow-hidden p-8">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
                <div className="relative z-10 w-full flex justify-between items-end">
                  <div className="text-white">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border border-white/20 mb-3 inline-block">
                      {property.resident_type}
                    </span>
                    <h2 className="text-3xl font-black">{property.apartment_name}</h2>
                    <p className="text-emerald-100 mt-1 flex items-center gap-2">
                      <Home className="h-4 w-4" /> Flat {property.flat_number} • Floor {property.floor_number}
                    </p>
                  </div>
                  <div className="bg-white text-emerald-700 font-black text-2xl h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg">
                    {property.flat_number}
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Grid className="h-3 w-3" /> Area
                      </p>
                      <p className="text-lg font-bold text-slate-900">{property.area_sqft} <span className="text-xs text-slate-500 font-medium">sqft</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Home className="h-3 w-3" /> Type
                      </p>
                      <p className="text-lg font-bold text-slate-900">{property.flat_type}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Compass className="h-3 w-3" /> Facing
                      </p>
                      <p className="text-lg font-bold text-slate-900">{property.facing_direction}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> Maintenance
                      </p>
                      <p className="text-lg font-bold text-slate-900">₹{property.maintenance_fee.toLocaleString()}<span className="text-xs text-slate-500 font-medium">/mo</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Resident Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <UserCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Name</p>
                        <p className="text-sm font-bold text-slate-900">{property.owner_name || "Self"}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move-In Date</p>
                        <p className="text-sm font-bold text-slate-900">{property.move_in_date || "N/A"}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                        <Grid className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                        <p className="text-sm font-bold text-slate-900">{property.status}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
