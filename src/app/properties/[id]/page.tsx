"use client";

import { use, useState } from "react";
import { MOCK_APARTMENTS, STATUS_COLORS, getApartmentById } from "@/data/mockData";
import { usePropVista } from "@/components/Providers";
import Link from "next/link";
import {
  Building, MapPin, Grid, Compass, Heart, ArrowLeft,
  Layers, Home, Leaf, CheckCircle, Phone, Mail, Navigation, Calendar
} from "lucide-react";
import Footer from "@/components/Footer";
import SiteVisitModal from "@/components/SiteVisitModal";

export default function ApartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const apt = getApartmentById(resolvedParams.id);
  const { wishlist, toggleWishlist } = usePropVista();

  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  if (!apt) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Building className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Apartment Not Found</h2>
        <Link href="/properties" className="mt-4 text-xs font-bold text-brand-blue hover:underline">
          Back to Listings
        </Link>
      </div>
    );
  }

  const selectedFloor = apt.floors[activeFloorIdx];
  const allFlats = apt.floors.flatMap((f) => f.flats);
  const availableFlats = allFlats.filter((f) => f.status === "Available").length;
  const minBuyPrice = Math.min(...allFlats.filter((f) => f.price_buy).map((f) => f.price_buy!));
  const minRentPrice = Math.min(...allFlats.filter((f) => f.price_rent).map((f) => f.price_rent!));

  const formatPrice = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const ICON_MAP: Record<string, string> = {
    Waves: "🏊", Dumbbell: "🏋️", Shield: "🛡️", Utensils: "🍽️",
    Leaf: "🌿", Sun: "☀️", Droplets: "💧", Sprout: "🌱", Footprints: "🚶",
    Zap: "⚡", Gamepad2: "🎮", Users: "👥", ParkingSquare: "🅿️",
    Cpu: "💻", Building2: "🏢", BatteryCharging: "🔌", CheckCircle: "✅",
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-800">
        <img
          src={apt.cover_image}
          alt={apt.name}
          className="h-full w-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-8 pb-6 max-w-7xl mx-auto">
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Properties
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>Nandyal, Andhra Pradesh</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">{apt.name}</h1>
          <p className="mt-1 text-xs text-slate-300">{apt.address}</p>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Floor Plan Viewer ───────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Floor selector */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-blue" />
                Floor Plan — Select Floor
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {apt.floors.map((floor, idx) => (
                  <button
                    key={floor.id}
                    id={`floor-btn-${floor.floor_number}`}
                    onClick={() => setActiveFloorIdx(idx)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeFloorIdx === idx
                        ? "bg-brand-blue text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Floor {floor.floor_number}
                  </button>
                ))}
              </div>

              {/* Flat grid for selected floor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedFloor?.flats.map((flat) => {
                  const isWishlisted = wishlist.includes(flat.id);
                  return (
                    <div
                      key={flat.id}
                      className="relative group rounded-xl border-2 p-3 transition-all hover:shadow-md cursor-pointer"
                      style={{ borderColor: STATUS_COLORS[flat.status] + "80" }}
                    >
                      {/* Status dot */}
                      <div
                        className="h-2.5 w-2.5 rounded-full mb-2"
                        style={{ backgroundColor: STATUS_COLORS[flat.status] }}
                      />
                      <p className="text-[11px] font-bold text-slate-900">Flat {flat.flat_number}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{flat.flat_type}</p>
                      <p className="text-[10px] text-slate-400">{flat.area_sqft} sqft</p>
                      <p className="text-[10px] font-semibold mt-1" style={{ color: STATUS_COLORS[flat.status] }}>
                        {flat.status}
                      </p>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 rounded-xl bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                        <Link
                          href={`/properties/${apt.id}/flat/${flat.id}`}
                          className="w-full text-center rounded-lg bg-brand-blue py-1.5 text-[10px] font-bold text-white"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => toggleWishlist(flat.id)}
                          className="flex items-center gap-1 text-[10px] font-medium text-white"
                        >
                          <Heart className={`h-3 w-3 ${isWishlisted ? "fill-red-400 text-red-400" : ""}`} />
                          {isWishlisted ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <span key={status} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {status}
                  </span>
                ))}
              </div>
            </div>

            {/* About section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3">About {apt.name}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{apt.description}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {apt.amenities.map((am) => (
                  <div key={am.id} className="flex items-start gap-3">
                    <span className="text-xl">{ICON_MAP[am.icon] ?? "✦"}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{am.name}</p>
                      <p className="text-[10px] text-slate-500 leading-snug">{am.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-brand-blue" /> Nearby Places
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apt.nearby_places.map((place) => (
                  <div key={place.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="text-lg">
                      {{ School: "🏫", Hospital: "🏥", Shopping: "🛒", Transit: "🚌", Temple: "🛕", Bank: "🏦" }[place.category] ?? "📍"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{place.place_name}</p>
                      <p className="text-[10px] text-slate-500">{place.category} · {place.distance} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ─────────────────────────────────── */}
          <div className="space-y-5">
            {/* Construction Progress */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Construction Progress</h2>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{apt.status}</span>
                  <span className="text-[10px] font-bold text-slate-700">{apt.status === "Completed" ? 100 : 85}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${apt.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"}`} 
                    style={{ width: `${apt.status === "Completed" ? 100 : 85}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Overview</h2>
              <div className="space-y-3">
                {[
                  { label: "Total Floors", value: apt.total_floors },
                  { label: "Total Flats", value: allFlats.length },
                  { label: "Available Flats", value: availableFlats },
                  { label: "Buy from", value: formatPrice(minBuyPrice) },
                  { label: "Rent from", value: `${formatPrice(minRentPrice)}/mo` },
                  { label: "Maintenance", value: "₹2,500–₹3,500/mo" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flat Status Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Flat Availability</h2>
              {(["Available", "Held", "Booked", "Sold", "Rented"] as const).map((st) => {
                const count = allFlats.filter((f) => f.status === st).length;
                const pct = Math.round((count / allFlats.length) * 100);
                return (
                  <div key={st} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-slate-700">{st}</span>
                      <span className="font-bold" style={{ color: STATUS_COLORS[st] }}>{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[st] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Owner contact */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Developer</h2>
              <p className="text-xs text-slate-600 font-medium mb-4">{apt.owner_name}</p>
              <button 
                onClick={() => setIsVisitModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark py-2.5 text-xs font-bold text-white hover:bg-black transition-all mb-2"
              >
                <Calendar className="h-4 w-4" /> Schedule Site Visit
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-2.5 text-xs font-bold text-white hover:bg-brand-blue-hover transition-all mb-2">
                <Phone className="h-4 w-4" /> Contact Sales
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                <Mail className="h-4 w-4" /> Request Brochure
              </button>
            </div>

            {/* View all flats CTA */}
            <Link
              href={`/properties?search=${apt.name}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all"
            >
              <Home className="h-3.5 w-3.5" /> Browse All {apt.name} Flats
            </Link>
          </div>
        </div>
      </div>

      <SiteVisitModal 
        isOpen={isVisitModalOpen} 
        onClose={() => setIsVisitModalOpen(false)} 
        apartmentId={apt.id} 
        apartmentName={apt.name} 
      />

      <Footer />
    </div>
  );
}
