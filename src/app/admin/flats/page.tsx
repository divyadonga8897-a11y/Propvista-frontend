"use client";

import { useEffect, useState } from "react";
import apiService from "@/services/apiService";
import { Home, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import type { Flat } from "@/types/real-estate";

export default function AdminFlats() {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiService.getFlats();
        setFlats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Flat Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all flat inventories, pricing, and availability</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
          <Plus className="h-4 w-4" /> Add Flat
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Unit</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type / Area</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flats.map((flat) => (
                <tr key={flat.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold">
                        {flat.flat_number}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{flat.apartment_name || "Unknown Apt"}</p>
                        <p className="text-xs text-slate-500">Floor {flat.floor_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{flat.flat_type}</p>
                    <p className="text-xs text-slate-500">{flat.area_sqft} sqft • {flat.facing_direction} Facing</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      flat.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
                      flat.status === 'Held' ? 'bg-orange-100 text-orange-700' :
                      flat.status === 'Sold' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {flat.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-900 text-sm">Buy: ₹{flat.price_buy?.toLocaleString() || "N/A"}</p>
                    <p className="text-xs text-slate-500">Rent: ₹{flat.price_rent?.toLocaleString() || "N/A"}</p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {flats.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">No flats found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
