"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Apartment } from "@/types/real-estate";
import Link from "next/link";
import {
  Search, MapPin, Building2, Layers, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import Footer from "@/components/Footer";

export default function Apartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getApartments();
      setApartments(data);
    } catch (err) {
      console.error("Error fetching apartments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = apartments.filter((apt) =>
    apt.name.toLowerCase().includes(search.toLowerCase()) ||
    (apt.description && apt.description.toLowerCase().includes(search.toLowerCase())) ||
    apt.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-slate-900 py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Apartment Communities</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
          Explore premier residential societies and find your dream home in Nandyal, Andhra Pradesh.
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by community name, location..."
            className="w-full rounded-xl bg-white/10 border border-white/20 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white border border-slate-100 overflow-hidden h-96">
                <div className="bg-slate-200 h-48 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded-lg w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Communities Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((apt) => (
              <div key={apt.id} className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {apt.cover_image ? (
                    <img
                      src={apt.cover_image}
                      alt={apt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-bold text-white">
                    {apt.construction_status}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-brand-blue mb-1">
                    <MapPin className="h-3 w-3" /> Nandyal, AP
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">{apt.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {apt.description || "Premium residential gated community offering world-class infrastructure and modern amenities."}
                  </p>

                  {/* Quick stats/amenities */}
                  <div className="mt-auto space-y-3 border-t border-slate-50 pt-4">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Address:</span>
                      <span className="font-semibold text-slate-700 max-w-[180px] truncate">{apt.address}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Floors:</span>
                      <span className="font-semibold text-slate-700">{apt.total_floors} Floors</span>
                    </div>
                  </div>

                  {/* View Details Action */}
                  <Link
                    href={`/apartment/${apt.id}`}
                    className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-blue py-2.5 text-xs font-bold text-white hover:bg-brand-blue-hover transition-colors"
                  >
                    View Community
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
