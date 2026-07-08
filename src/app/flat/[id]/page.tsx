"use client";

import { use, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Flat } from "@/types/real-estate";
import { usePropVista } from "@/components/Providers";
import Link from "next/link";
import {
  ArrowLeft, Heart, Layers, Compass, Ruler, Home, Bed, Bath, LogIn, Key, HelpCircle
} from "lucide-react";
import Footer from "@/components/Footer";

export default function FlatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { wishlist, toggleWishlist } = usePropVista();

  const [flat, setFlat] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Gallery zoom modal
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    fetchFlatDetails();
  }, [resolvedParams.id]);

  const fetchFlatDetails = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFlatById(resolvedParams.id);
      setFlat(data);
    } catch (err) {
      console.error("Error fetching flat details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Home className="h-16 w-16 text-slate-300 animate-pulse mb-4" />
        <h2 className="text-sm font-semibold text-slate-600">Loading Flat Details...</h2>
      </div>
    );
  }

  if (!flat) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Home className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Flat Not Found</h2>
        <Link href="/apartments" className="mt-4 text-xs font-bold text-brand-blue hover:underline">
          Back to Communities
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(flat.id);

  const formatPrice = (n: number) => {
    if (!n) return "N/A";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const STATUS_COLORS: Record<string, string> = {
    Available: "#10b981",
    Held: "#f59e0b",
    Rented: "#3b82f6",
    Sold: "#ef4444",
    Reserved: "#6b7280",
  };

  const statusColor = STATUS_COLORS[flat.status] || "#6b7280";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Back button header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <Link
          href={`/apartment/${flat.apartment_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {flat.apartment_name || "Community"} Map
        </Link>
      </div>

      {/* Flat Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Image gallery */}
          <div className="space-y-4">
            {flat.images && flat.images.length > 0 ? (
              <>
                <div
                  className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 cursor-zoom-in"
                  onClick={() => setZoomOpen(true)}
                >
                  <img
                    src={flat.images[activeImageIdx].image_url}
                    alt={flat.images[activeImageIdx].caption || `Flat ${flat.flat_number}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Action Button */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(flat.id);
                      }}
                      className="rounded-full bg-white p-2.5 shadow-md hover:bg-slate-50 transition-colors"
                    >
                      <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
                    </button>
                  </div>

                  {/* Caption banner */}
                  {flat.images[activeImageIdx].caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 backdrop-blur px-4 py-2.5 text-xs text-white">
                      {flat.images[activeImageIdx].caption}
                    </div>
                  )}
                </div>

                {/* Thumbnail carousels */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {flat.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 bg-slate-100 transition-all ${
                        activeImageIdx === idx ? "border-brand-blue" : "border-transparent"
                      }`}
                    >
                      <img src={img.image_url} alt="Thumbnail view" className="w-full h-full object-cover" />
                      {img.image_type && (
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/50 text-[8px] font-semibold text-white text-center py-0.5 capitalize truncate">
                          {img.image_type.replace("_", " ")}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-80 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400">
                No flat images available
              </div>
            )}
          </div>

          {/* Right: Technical specifications and pricing metrics */}
          <div className="space-y-6">
            
            {/* Core Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <span
                    className="inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: statusColor }}
                  >
                    {flat.status}
                  </span>
                  <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Flat {flat.flat_number}</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {flat.apartment_name} · {flat.floor_name || `Floor ${flat.floor_number}`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Pricing Starts</p>
                  {flat.price_buy ? (
                    <p className="text-xl font-black text-brand-blue">{formatPrice(flat.price_buy)}</p>
                  ) : flat.price_rent ? (
                    <p className="text-xl font-black text-brand-blue">{formatPrice(flat.price_rent)}/mo</p>
                  ) : (
                    <p className="text-xl font-black text-slate-500">Contact Us</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                {flat.long_description || flat.short_description || "Spacious, highly-ventilated, luxury apartment featuring modular fittings and modern high-end specifications."}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Flat Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Layers, label: "Flat Type", val: flat.flat_type },
                  { icon: Ruler, label: "Super Area", val: `${flat.area_sqft} sqft` },
                  { icon: Compass, label: "Facing", val: flat.facing_direction },
                  { icon: Bed, label: "Bedrooms", val: `${flat.bedrooms} BHK` },
                  { icon: Bath, label: "Bathrooms", val: `${flat.bathrooms} Baths` },
                  { icon: Home, label: "Kitchens", val: flat.kitchen ? `${flat.kitchen} Kitchen` : "1 Kitchen" },
                  { icon: Key, label: "Parking slots", val: `${flat.parking_slots} Car` },
                  { icon: Key, label: "Balcony count", val: `${flat.balconies} Balconies` },
                ].map(({ icon: Icon, label, val }, i) => (
                  <div key={i} className="flex flex-col rounded-xl bg-slate-50 p-3">
                    <span className="text-slate-400 text-xs mb-1.5"><Icon className="h-4 w-4" /></span>
                    <span className="text-[10px] text-slate-400 font-semibold">{label}</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-0.5">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pricing & Financial Outlay</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Outright Buy Price</span>
                  <span className="font-extrabold text-slate-900">{flat.price_buy ? formatPrice(flat.price_buy) : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Monthly Rent Dues</span>
                  <span className="font-extrabold text-slate-900">{flat.price_rent ? `${formatPrice(flat.price_rent)}/mo` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2">
                  <span className="text-slate-500">Monthly Maintenance Fee</span>
                  <span className="font-bold text-slate-800">₹{flat.maintenance_fee.toLocaleString("en-IN")}/mo</span>
                </div>
              </div>
            </div>

            {/* Hold & Acquisition Stepper Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acquisition Center</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  disabled={flat.status !== "Available" && flat.status !== "Held"}
                  onClick={async () => {
                    try {
                      await apiService.holdFlat(flat.id);
                      fetchFlatDetails();
                    } catch (e: any) {
                      alert(e?.response?.data?.error || "Error holding flat");
                    }
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all border ${
                    flat.status === "Held"
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : flat.status === "Available"
                      ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                  }`}
                >
                  {flat.status === "Held" ? "Held (Locked)" : "Hold 24 Hours"}
                </button>

                <Link
                  href={flat.status === "Available" || flat.status === "Held" ? `/booking/${flat.id}?type=rent` : "#"}
                  onClick={(e) => {
                    if (flat.status !== "Available" && flat.status !== "Held") e.preventDefault();
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold text-center transition-all ${
                    flat.status === "Available" || flat.status === "Held"
                      ? "bg-brand-emerald hover:bg-brand-emerald-hover text-white cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Rent Flat
                </Link>

                <Link
                  href={flat.status === "Available" || flat.status === "Held" ? `/booking/${flat.id}?type=buy` : "#"}
                  onClick={(e) => {
                    if (flat.status !== "Available" && flat.status !== "Held") e.preventDefault();
                  }}
                  className={`rounded-xl py-2.5 text-xs font-bold text-center transition-all ${
                    flat.status === "Available" || flat.status === "Held"
                      ? "bg-brand-blue hover:bg-brand-blue-hover text-white cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Buy Flat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Lightbox zoom modal */}
      {zoomOpen && flat.images && flat.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-xl">
            <img
              src={flat.images[activeImageIdx].image_url}
              alt="Flat detail expanded"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <button
              onClick={() => setZoomOpen(false)}
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
