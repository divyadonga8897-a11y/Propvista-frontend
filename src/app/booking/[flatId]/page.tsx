"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";
import { supabase } from "@/lib/supabase";
import type { Flat } from "@/types/real-estate";
import Link from "next/link";
import {
  ArrowLeft, CreditCard, ShieldCheck, ShoppingCart,
  CheckCircle, Loader2, Building2, Layers, Home, AlertCircle,
} from "lucide-react";
import Footer from "@/components/Footer";





// ── Page Component ─────────────────────────────────────────────────────────────
export default function BookingSummaryPage({ params }: { params: Promise<{ flatId: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingType = (searchParams.get("type") || "buy").toUpperCase();
  const [flat, setFlat] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [apartment, setApartment] = useState<any>(null);

  useEffect(() => {
    apiService.getFlatById(resolvedParams.flatId).then(async (data) => {
      setFlat(data);
      if (data.apartment_id) {
        try {
          const apt = await apiService.getApartmentById(data.apartment_id);
          setApartment(apt);
        } catch (e) {
          console.error("Failed to load apartment details:", e);
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [resolvedParams.flatId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50">
        <ShoppingCart className="h-12 w-12 text-slate-300 animate-pulse mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Generating Booking Outlay...</p>
      </div>
    );
  }

  if (!flat) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50">
        <h2 className="text-sm font-bold text-slate-700">Flat not found.</h2>
      </div>
    );
  }

  const basePrice = bookingType === "BUY" ? (flat.price_buy || 0) : (flat.price_rent || 0);
  const maintenance = flat.maintenance_fee || 0;
  const bookingAmount = bookingType === "BUY" ? 100000 : basePrice;
  const deposit = bookingType === "RENT" ? (basePrice * 2) : 0;
  const taxes = bookingType === "BUY" ? (bookingAmount * 0.18) : (bookingAmount * 0.05);
  const totalAmount = bookingAmount + deposit + taxes + maintenance;

  const handleProceedToPayment = async () => {
    setPayError(null);
    setPaying(true);

    try {
      // 1. Create a real booking in the backend
      const booking = await apiService.createBooking(flat.id, bookingType as "BUY" | "RENT");
      if (!booking || !booking.id) {
        throw new Error("Unable to create booking on the server.");
      }

      // 2. Complete payment locally on the backend
      const paymentResult = await apiService.completePaymentLocal(
        booking.id,
        Math.round(totalAmount),
        bookingType === "BUY" ? "Purchase Booking" : "Rental Booking"
      );

      if (!paymentResult || paymentResult.status !== "success") {
        throw new Error("Payment completion failed on the server.");
      }

      // Pass flat context in URL so success page can display property details
      const params = new URLSearchParams({
        bookingId: booking.id,
        paymentId: paymentResult.payment_id,
        flatNumber: flat.flat_number || "",
        aptName: flat.apartment_name || "",
        floorName: flat.floor_name || String(flat.floor_number || ""),
        bookingType,
        amount: String(Math.round(totalAmount)),
      });

      router.push(`/payment/success?${params.toString()}`);

    } catch (err: any) {
      console.error("Payment error:", err);
      // Display the friendly requirement error message
      setPayError(
        err.response?.data?.detail || 
        "Unable to generate your booking documents. Please contact the administrator."
      );
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <Link href={`/flat/${flat.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-blue mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to flat details
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Booking Summary</h1>

        {/* Error Banner */}
        {payError && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">{payError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Unit Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Apartment Community</span>
                  <span className="text-slate-800 font-bold block text-sm mt-0.5">{flat.apartment_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Flat Level</span>
                  <span className="text-slate-800 font-bold block text-sm mt-0.5">{flat.floor_name || `Floor ${flat.floor_number}`}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Flat Number</span>
                  <span className="text-slate-800 font-bold block text-sm mt-0.5">Flat {flat.flat_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Configuration</span>
                  <span className="text-slate-800 font-bold block text-sm mt-0.5">{flat.flat_type} · {flat.facing_direction} facing</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">Specs &amp; Rooms</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block">Bedrooms</span>
                  <span className="text-slate-800 font-bold block mt-1">{flat.bedrooms} BHK</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block">Bathrooms</span>
                  <span className="text-slate-800 font-bold block mt-1">{flat.bathrooms} Baths</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-400 block">Super Area</span>
                  <span className="text-slate-800 font-bold block mt-1">{flat.area_sqft} sqft</span>
                </div>
              </div>
            </div>

            {/* Property preview chips */}
            <div className="flex gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 shadow-sm flex-1">
                <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">{flat.apartment_name}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 shadow-sm flex-1">
                <Layers className="h-4 w-4 text-purple-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">{flat.floor_name || `Floor ${flat.floor_number}`}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 shadow-sm flex-1">
                <Home className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Flat {flat.flat_number}</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 space-y-0.5">
                <p className="font-bold">Secure &amp; Safe Transaction</p>
                <p className="text-emerald-700 opacity-80">256-bit SSL encrypted. Legal agreement auto-generated upon payment. Admin approval required for resident access.</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Acquisition Pricing</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Amount</span>
                <span className="font-bold text-slate-800">₹{bookingAmount.toLocaleString()}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Refundable Security Deposit</span>
                  <span className="font-bold text-slate-800">₹{deposit.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Maintenance</span>
                <span className="font-bold text-slate-800">₹{maintenance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Fees &amp; GST</span>
                <span className="font-bold text-slate-800">₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t pt-3">
                <span>Total Amount Dues</span>
                <span className="text-brand-blue">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              id="btn-proceed-to-payment"
              onClick={handleProceedToPayment}
              disabled={paying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white py-3 text-xs font-bold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initiating Razorpay...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              <span>Secured by Razorpay · SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
