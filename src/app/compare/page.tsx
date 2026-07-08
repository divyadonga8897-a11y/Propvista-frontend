"use client";

import { usePropVista } from "@/components/Providers";
import { MOCK_FLATS as MOCK_UNITS } from "@/data/mockData";
import Link from "next/link";
import { Columns, ArrowRight, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = usePropVista();

  const comparedUnits = MOCK_UNITS.filter((u) => compareList.includes(u.id));

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark">Property Comparison Matrix</h1>
            <p className="text-xs text-brand-gray mt-1">Analyze specifications and pricing side-by-side (max 3 units).</p>
          </div>
          {comparedUnits.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear Comparison
            </button>
          )}
        </div>

        {comparedUnits.length >= 1 ? (
          <div className="overflow-x-auto border border-slate-200 bg-white rounded-2xl shadow-sm">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <th className="p-4 w-1/4">Specs / Attributes</th>
                  {comparedUnits.map((u) => (
                    <th key={u.id} className="p-4 w-1/4 border-l border-slate-100 font-bold">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-brand-blue font-black uppercase text-[10px] tracking-wider">{u.flat_type}</div>
                          <div className="text-brand-dark font-extrabold text-sm">Unit {u.flat_number}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{u.apartment_name}</div>
                        </div>
                        <button
                          onClick={() => removeFromCompare(u.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Fill remaining slots up to 3 */}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => (
                    <th key={i} className="p-4 w-1/4 border-l border-slate-100 bg-slate-50/20 text-slate-400 font-semibold italic text-center">
                      Empty Slot
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">City Location</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">{(u.apartment_name || "").includes("Heights") ? "Bangalore" : "Pune"}</td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Carpet Area</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-extrabold text-slate-800 border-l border-slate-100">{u.area_sqft} Sq.ft</td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Facing Direction</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">{u.facing_direction}</td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Configuration</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">{u.bedrooms} Bed, {u.bathrooms} Bath</td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Monthly Maintenance</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">₹{u.maintenance_fee.toLocaleString()}</td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Availability Status</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 border-l border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700`}>
                        {u.status}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Buy Valuation</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-black text-brand-dark border-l border-slate-100">
                      {u.price_buy ? `₹${(u.price_buy/100000).toFixed(1)} Lakhs` : "N/A"}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Rent Option</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 font-bold text-brand-emerald border-l border-slate-100">
                      {u.price_rent ? `₹${u.price_rent.toLocaleString()}/mo` : "N/A"}
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Action</td>
                  {comparedUnits.map((u) => (
                    <td key={u.id} className="p-4 border-l border-slate-100 text-center">
                      <Link
                        href={`/properties/unit/${u.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-[10px] font-bold px-3 py-1.5 transition-all shadow-sm"
                      >
                        Inspect Unit
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  ))}
                  {Array.from({ length: 3 - comparedUnits.length }).map((_, i) => <td key={i} className="border-l border-slate-100 bg-slate-50/20" />)}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
            <Columns className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-bold text-slate-900">Comparison Arena Empty</h3>
            <p className="mt-1 text-xs text-slate-500">Select up to 3 units from the property catalog lists to compare side-by-side.</p>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Search Properties
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
