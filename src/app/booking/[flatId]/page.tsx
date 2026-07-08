"use client";

import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";
import type { Flat } from "@/types/real-estate";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingCart, HelpCircle } from "lucide-react";
import Footer from "@/components/Footer";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingSummaryPage({ params }: { params: Promise<{ flatId: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookingType = (searchParams.get("type") || "buy").toUpperCase(); // BUY or RENT
  const [flat, setFlat] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    apiService.getFlatById(resolvedParams.flatId).then((data) => {
      setFlat(data);
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
  const bookingAmount = bookingType === "BUY" ? 100000 : basePrice; // BUY requires 1 Lakh advance booking fee; RENT requires 1st Month Rent + 1 Month Advance security
  const deposit = bookingType === "RENT" ? (basePrice * 2) : 0;
  const taxes = bookingType === "BUY" ? (bookingAmount * 0.18) : (bookingAmount * 0.05); // Sample taxes
  const totalAmount = bookingAmount + deposit + taxes + maintenance;

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      // 1. Create backend pending booking record
      const booking = await apiService.createBooking(flat.id, bookingType as "BUY" | "RENT");
      
      // 2. Initialize Razorpay order
      const order = await apiService.createPaymentOrder(booking.id, totalAmount, bookingType === "BUY" ? "Advance Booking" : "Rental Security Deposit");
      
      // Check if this is a simulated checkout for mock data
      // Direct simulation bypass for mock Razorpay order
      if (order.razorpay_key_id.includes("mock") || booking.id.startsWith("mock-")) {
        // Direct simulation bypass
        setTimeout(async () => {
          try {
            await apiService.verifyPayment(
              order.order_id || "mock-order-id",
              "pay_mockpaymentid",
              "mock_signature"
            );
            router.push(`/payment/success?bookingId=${booking.id}`);
          } catch (err) {
            console.error("Mock verification error", err);
            router.push("/payment/failed");
          }
        }, 1500);
        return;
      }

      // Load Razorpay script dynamically for real DB checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setCheckoutLoading(false);
        return;
      }

      // 3. Open Razorpay checkout Standard Checkout
      const options = {
        key: order.razorpay_key_id,
        amount: order.amount * 100,
        currency: order.currency,
        name: "PropVista AI",
        description: `${bookingType} flat ${flat.flat_number} - ${flat.apartment_name}`,
        order_id: order.order_id,
        handler: async function (response: any) {
          // 4. Verify payment in backend
          try {
            await apiService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            router.push(`/payment/success?bookingId=${booking.id}`);
          } catch (err) {
            console.error("Signature verification error", err);
            router.push("/payment/failed");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@propvista.com",
          contact: "9999999999"
        },
        theme: {
          color: "#2563eb"
        },
        modal: {
          ondismiss: function() {
            setCheckoutLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Error initiating Razorpay checkout");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <Link href={`/flat/${flat.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-blue mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to flat details
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Booking Summary Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Unit Information</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Apartment community</span>
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
                  <span className="text-slate-400 font-semibold block">Config facing</span>
                  <span className="text-slate-800 font-bold block text-sm mt-0.5">{flat.flat_type} · {flat.facing_direction} facing</span>
                </div>
              </div>
            </div>

            {/* Spec grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">Specs & Rooms</h3>
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
          </div>

          {/* Pricing Outline card */}
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
                <span className="text-slate-500">Processing Fees & GST</span>
                <span className="font-bold text-slate-800">₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t pt-3">
                <span>Total Amount Dues</span>
                <span className="text-brand-blue">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white py-3 text-xs font-bold transition-all shadow-md"
            >
              <CreditCard className="h-4.5 w-4.5" />
              {checkoutLoading ? "Launching Checkout..." : "Pay via Razorpay"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
