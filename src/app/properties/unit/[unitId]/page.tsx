"use client";

import { use, useState } from "react";
import { MOCK_FLATS as MOCK_UNITS } from "@/data/mockData";
import { usePropVista } from "@/components/Providers";
import Link from "next/link";
import { 
  ArrowLeft, Grid, Compass, Heart, Columns, Building, 
  ShieldCheck, Loader2, DollarSign, CalendarDays 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function UnitDetails({ params }: { params: Promise<{ unitId: string }> }) {
  const resolvedParams = use(params);
  const { wishlist, toggleWishlist, compareList, addToCompare, removeFromCompare } = usePropVista();

  // Find unit
  const baseUnit = MOCK_UNITS.find((u) => u.id === resolvedParams.unitId);

  // Local state for holding or booking (for sandbox demo)
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [bookingModal, setBookingModal] = useState<"buy" | "rent" | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Active gallery image
  const [activeImg, setActiveImg] = useState("");

  if (!baseUnit) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-slate-50">
        <Building className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Unit Not Found</h2>
        <Link href="/properties" className="mt-4 text-xs font-bold text-brand-blue hover:underline">
          Back to Listings
        </Link>
      </div>
    );
  }

  const currentStatus = localStatus || baseUnit.status;

  if (baseUnit.images.length > 0 && !activeImg) {
    setActiveImg(baseUnit.images[0].image_url);
  }

  const handleHold = () => {
    if (currentStatus === "Available") {
      setLocalStatus("Held");
    } else if (currentStatus === "Held") {
      setLocalStatus("Available");
    }
  };

  const triggerPayment = (type: "buy" | "rent") => {
    setBookingModal(type);
    setPaymentLoading(true);
    // Simulate Razorpay Gateway
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentSuccess(true);
      setLocalStatus(type === "buy" ? "Sold" : "Rented");
    }, 2500);
  };

  const getStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case "Available": return "bg-green-500 text-white";
      case "Held": return "bg-orange-500 text-white";
      case "Booked": return "bg-blue-500 text-white";
      case "Sold": return "bg-red-500 text-white";
      case "Rented": return "bg-purple-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  const inWishlist = wishlist.includes(baseUnit.id);
  const inCompare = compareList.includes(baseUnit.id);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Back Link */}
        <Link
          href={`/properties/${baseUnit.apartment_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project Towers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={activeImg}
                alt="Main gallery view"
                className="w-full h-full object-cover object-center transition-all"
              />
            </div>
            
            {/* Thumbnails */}
            {baseUnit.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {baseUnit.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(img.image_url)}
                    className={`h-20 w-28 rounded-xl overflow-hidden border shrink-0 transition-all ${
                      activeImg === img.image_url 
                        ? "border-brand-blue ring-2 ring-brand-blue/10 scale-95" 
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.image_url} alt="thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className={`rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest ${getStatusBadge(currentStatus)}`}>
                  {currentStatus}
                </span>

                <div className="flex items-center gap-2">
                  {/* Save to Wishlist */}
                  <button
                    onClick={() => toggleWishlist(baseUnit.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                      inWishlist 
                        ? "bg-red-50 border-red-200 text-red-500" 
                        : "bg-white border-border text-brand-gray hover:bg-slate-50"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                    {inWishlist ? "Wishlisted" : "Wishlist"}
                  </button>

                  {/* Compare */}
                  <button
                    onClick={() => inCompare ? removeFromCompare(baseUnit.id) : addToCompare(baseUnit.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                      inCompare 
                        ? "bg-blue-50 border-brand-blue text-brand-blue" 
                        : "bg-white border-border text-brand-gray hover:bg-slate-50"
                    }`}
                  >
                    <Columns className="h-4 w-4" />
                    {inCompare ? "Compared" : "Compare"}
                  </button>
                </div>
              </div>

              <h1 className="mt-4 text-2xl font-black text-brand-dark sm:text-3xl">
                Unit {baseUnit.flat_number} — {baseUnit.apartment_name}
              </h1>
              <p className="mt-2 text-xs text-brand-gray font-semibold">
                Located on Floor {baseUnit.floor_number === 0 ? "G" : baseUnit.floor_number}
              </p>
            </div>

            {/* Pricing Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-sm">
              {baseUnit.price_buy && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Buy Price</div>
                  <div className="text-lg font-black text-brand-dark mt-1">₹{(baseUnit.price_buy / 100000).toFixed(1)} Lakhs</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Registration extra</div>
                </div>
              )}
              {baseUnit.price_rent && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</div>
                  <div className="text-lg font-bold text-brand-emerald mt-1">₹{baseUnit.price_rent.toLocaleString()}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Security deposit 3x</div>
                </div>
              )}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Maintenance</div>
                <div className="text-lg font-bold text-slate-700 mt-1">₹{baseUnit.maintenance_fee.toLocaleString()}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Paid monthly</div>
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-2">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">BHK Configuration</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.flat_type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">Carpet Area</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.area_sqft} Sq.ft</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">Facing Direction</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.facing_direction}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">Parking Bays</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.parking_slots} Slots</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">Bedrooms</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.bedrooms} Beds</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-brand-gray font-semibold">Bathrooms</span>
                  <span className="text-brand-dark font-extrabold">{baseUnit.bathrooms} Baths</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-brand-dark">About This Apartment</h3>
              <p className="text-xs text-brand-gray leading-relaxed">{baseUnit.long_description}</p>
            </div>

            {/* Checkout Action Panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Acquisition Center</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Hold Button */}
                <button
                  onClick={handleHold}
                  disabled={currentStatus !== "Available" && currentStatus !== "Held"}
                  className={`rounded-xl py-3 text-xs font-bold transition-all border ${
                    currentStatus === "Held"
                      ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                      : currentStatus === "Available"
                      ? "bg-white border-border text-brand-dark hover:bg-slate-50"
                      : "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed"
                  }`}
                >
                  {currentStatus === "Held" ? "Release Hold" : "Hold Unit"}
                </button>

                {/* Rent Button */}
                <button
                  onClick={() => triggerPayment("rent")}
                  disabled={currentStatus !== "Available"}
                  className="rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed py-3 text-xs font-bold text-white transition-all shadow-md"
                >
                  Rent Property
                </button>

                {/* Buy Button */}
                <button
                  onClick={() => triggerPayment("buy")}
                  disabled={currentStatus !== "Available"}
                  className="rounded-xl bg-brand-blue hover:bg-brand-blue-hover disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed py-3 text-xs font-bold text-white transition-all shadow-md"
                >
                  Purchase Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Checkout Modal Mock (Razorpay Test Mode) */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-fade-in">
            {paymentLoading ? (
              <div className="text-center py-10 space-y-4">
                <Loader2 className="mx-auto h-12 w-12 text-brand-blue animate-spin" />
                <h3 className="text-sm font-bold text-brand-dark">Connecting to Gateway...</h3>
                <p className="text-[11px] text-brand-gray">Razorpay sandbox test mode loading. Do not refresh.</p>
              </div>
            ) : paymentSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-brand-emerald">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">Transaction Reconciled!</h3>
                <p className="text-[11px] text-brand-gray leading-relaxed px-4">
                  Invoice generated and synced to Supabase Auth profile. You are now recognized as a **Resident** of {baseUnit.apartment_name}.
                </p>
                <button
                  onClick={() => {
                    setBookingModal(null);
                    setPaymentSuccess(false);
                  }}
                  className="mt-6 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2 text-xs font-bold text-white transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
