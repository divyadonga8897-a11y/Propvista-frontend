"use client";

import { use, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { ApartmentDetail, Flat } from "@/types/real-estate";
import { usePropVista } from "@/components/Providers";
import Link from "next/link";
import {
  Building, MapPin, Grid, Compass, Heart, ArrowLeft,
  Layers, Home, CheckCircle2, Phone, Mail, Navigation, Search, SlidersHorizontal
} from "lucide-react";
import Footer from "@/components/Footer";

export default function ApartmentDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { wishlist, toggleWishlist } = usePropVista();

  const [apt, setApt] = useState<ApartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);

  // Filters
  const [flatType, setFlatType] = useState("All");
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Lightbox / Zoom gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState("");

  useEffect(() => {
    fetchApartmentDetails();
  }, [resolvedParams.id]);

  const fetchApartmentDetails = async () => {
    try {
      setLoading(true);
      const data = await apiService.getApartmentById(resolvedParams.id);
      setApt(data);
      if (data.floors && data.floors.length > 0) {
        // Default to first floor
        setActiveFloorIdx(0);
      }
    } catch (err) {
      console.error("Error fetching apartment detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Building className="h-16 w-16 text-slate-300 animate-pulse mb-4" />
        <h2 className="text-sm font-semibold text-slate-600">Loading Community Details...</h2>
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Building className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Apartment Not Found</h2>
        <Link href="/apartments" className="mt-4 text-xs font-bold text-brand-blue hover:underline">
          Back to Communities
        </Link>
      </div>
    );
  }

  const allFlats = apt.floors ? apt.floors.flatMap((f) => f.flats || []) : [];
  const availableFlats = allFlats.filter((f) => f.status === "Available").length;
  
  // Calculate minimum prices safely
  const buyPrices = allFlats.filter((f) => f.price_buy).map((f) => f.price_buy!);
  const rentPrices = allFlats.filter((f) => f.price_rent).map((f) => f.price_rent!);
  const minBuyPrice = buyPrices.length > 0 ? Math.min(...buyPrices) : 0;
  const minRentPrice = rentPrices.length > 0 ? Math.min(...rentPrices) : 0;

  const formatPrice = (n: number) => {
    if (!n) return "N/A";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const STATUS_COLORS: Record<string, string> = {
    Available: "#10b981", // Green
    Held: "#f59e0b",      // Orange
    Rented: "#3b82f6",    // Blue
    Sold: "#ef4444",      // Red
    Reserved: "#6b7280",  // Gray
  };

  // Decode amenities stored as JSON array string or regular array
  const amenitiesList = Array.isArray(apt.amenities)
    ? apt.amenities
    : (() => {
        try {
          return apt.amenities ? JSON.parse(apt.amenities) : [];
        } catch {
          return [];
        }
      })();

  // Filter flats within the active floor
  const selectedFloor = apt.floors ? apt.floors[activeFloorIdx] : null;
  const floorFlats = selectedFloor?.flats || [];
  
  const filteredFloorFlats = floorFlats.filter((flat) => {
    const matchesType = flatType === "All" || flat.flat_type === flatType;
    const matchesStatus = status === "All" || flat.status === status;
    const matchesSearch = searchQuery === "" || flat.flat_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-800">
        {apt.cover_image ? (
          <img
            src={apt.cover_image}
            alt={apt.name}
            className="h-full w-full object-cover object-center opacity-85"
          />
        ) : (
          <div className="h-full w-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-8 pb-6 max-w-7xl mx-auto">
          <Link href="/apartments" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Communities
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>Nandyal, Andhra Pradesh</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">{apt.name}</h1>
          <p className="mt-1 text-xs text-slate-300">{apt.address}</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Visual Floor map and details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Floor Map View */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-blue" />
                    Interactive Visual Floor Map
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">Select floor and click any flat to view specs.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={flatType}
                    onChange={(e) => setFlatType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 focus:outline-none"
                  >
                    <option value="All">All BHKs</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="Studio">Studio</option>
                  </select>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Held">Held</option>
                    <option value="Rented">Rented</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Flat No."
                    className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-semibold text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Floor Selector Tab bar */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
                {apt.floors && apt.floors.map((floor, idx) => (
                  <button
                    key={floor.id}
                    onClick={() => setActiveFloorIdx(idx)}
                    className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                      activeFloorIdx === idx
                        ? "bg-brand-blue text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {floor.floor_name || `Floor ${floor.floor_number}`}
                  </button>
                ))}
              </div>

              {/* Flats Grid for Selected Floor */}
              {filteredFloorFlats.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No flats match filters on this floor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredFloorFlats.map((flat) => {
                    const isWishlisted = wishlist.includes(flat.id);
                    const statusColor = STATUS_COLORS[flat.status] || "#6b7280";
                    return (
                      <div
                        key={flat.id}
                        className="relative group rounded-xl border-2 p-3 transition-all hover:shadow-md cursor-pointer bg-white"
                        style={{ borderColor: statusColor + "80" }}
                      >
                        {/* Color-coded Status Dot */}
                        <div
                          className="h-2.5 w-2.5 rounded-full mb-2"
                          style={{ backgroundColor: statusColor }}
                        />
                        <p className="text-[11px] font-bold text-slate-900">Flat {flat.flat_number}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{flat.flat_type}</p>
                        <p className="text-[10px] text-slate-400">{flat.area_sqft} sqft</p>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: statusColor }}>
                          {flat.status}
                        </p>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 rounded-xl bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
                          <Link
                            href={`/flat/${flat.id}`}
                            className="w-full text-center rounded-lg bg-brand-blue py-1.5 text-[10px] font-bold text-white shadow"
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
              )}

              {/* Status Color Legend */}
              <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                {Object.entries(STATUS_COLORS).map(([st, color]) => (
                  <span key={st} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* About Gated Community */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3">About the Community</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {apt.description || "No description provided."}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Community Amenities</h2>
              {amenitiesList.length === 0 ? (
                <p className="text-xs text-slate-400">Amenities list not provided.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {amenitiesList.map((am: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                      <span className="text-base">⭐</span>
                      <span className="text-xs font-bold text-slate-800">{am}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Community Gallery */}
            {apt.gallery_images && apt.gallery_images.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4">Premium Image Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {apt.gallery_images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => {
                        setSelectedGalleryImg(img.image_url);
                        setGalleryOpen(true);
                      }}
                      className="group relative h-28 overflow-hidden rounded-xl bg-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={img.image_url}
                        alt="Community gallery preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Zoom View
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Sidebar overview stats and Developer contact info */}
          <div className="space-y-6">
            
            {/* Quick stats panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Overview</h2>
              <div className="space-y-3">
                {[
                  { label: "Construction Status", value: apt.construction_status },
                  { label: "Possession Status", value: apt.possession_status },
                  { label: "Total Floors", value: apt.total_floors },
                  { label: "Total Flats", value: allFlats.length },
                  { label: "Available Flats", value: availableFlats },
                  { label: "Buy Price starts", value: minBuyPrice ? formatPrice(minBuyPrice) : "N/A" },
                  { label: "Rent starts", value: minRentPrice ? `${formatPrice(minRentPrice)}/mo` : "N/A" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability status distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Availability Summary</h2>
              {["Available", "Held", "Rented", "Sold", "Reserved"].map((st) => {
                const count = allFlats.filter((f) => f.status === st).length;
                const pct = allFlats.length > 0 ? Math.round((count / allFlats.length) * 100) : 0;
                const statusColor = STATUS_COLORS[st] || "#6b7280";
                return (
                  <div key={st} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">{st}</span>
                      <span className="font-bold" style={{ color: statusColor }}>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: statusColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Developer Contact information panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Developer Details</h2>
              <p className="text-xs text-slate-500 font-medium mb-4">{apt.builder_name || "Sri Venkata Raju Constructions"}</p>
              
              <div className="space-y-3 mb-5 text-xs text-slate-600">
                {apt.contact_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-brand-blue" />
                    <span>{apt.contact_number}</span>
                  </div>
                )}
                {apt.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-brand-blue" />
                    <span>{apt.email}</span>
                  </div>
                )}
              </div>

              <a
                href={apt.contact_number ? `tel:${apt.contact_number}` : "#"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-2.5 text-xs font-bold text-white hover:bg-brand-blue-hover transition-colors mb-2"
              >
                <Phone className="h-3.5 w-3.5" /> Call Developer
              </a>
              <a
                href={apt.email ? `mailto:${apt.email}` : "#"}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-blue py-2.5 text-xs font-bold text-brand-blue hover:bg-blue-50 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Send Email Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Lightbox Modal for Gallery Images */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setGalleryOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
            <img
              src={selectedGalleryImg}
              alt="Expanded gallery image"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-slate-900/60 p-2 text-white hover:bg-slate-900"
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
