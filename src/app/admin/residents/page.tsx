"use client";

import { useEffect, useState } from "react";
import apiService from "@/services/apiService";
import { Users, Loader2, Edit, CheckCircle, Ban, Mail } from "lucide-react";

export default function AdminResidents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Since getResidents doesn't exist in apiService, we will mock for UI preview
        // const data = await apiService.getResidents();
        // setResidents(data);
        
        // Mock data
        setResidents([
          { id: "1", name: "Ravi Kumar", email: "ravi@example.com", flat: "A-101", apt: "Green Valley", status: "Active", type: "Owner", date: "2023-11-01" },
          { id: "2", name: "Priya Sharma", email: "priya@example.com", flat: "B-205", apt: "Green Valley", status: "Pending", type: "Tenant", date: "2024-01-15" },
        ]);
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
          <h1 className="text-2xl font-black text-slate-900">Resident Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage approvals, resident profiles, and history</p>
        </div>
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
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resident</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Property</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((res) => (
                <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                        {res.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{res.name}</p>
                        <p className="text-xs text-slate-500">{res.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{res.apt}</p>
                    <p className="text-xs text-slate-500">Flat {res.flat} • {res.type}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      res.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Email">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {residents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">No residents found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
