"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiService } from "@/services/apiService";
import Link from "next/link";
import {
  CheckCircle, Download, LayoutDashboard, FileText, Loader2,
  Clock, ShieldCheck, Building2, Home, Layers
} from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const paymentId = searchParams.get("paymentId");

  // Flat context passed from booking page (local payment flow)
  const aptName = searchParams.get("aptName");
  const flatNumber = searchParams.get("flatNumber");
  const floorName = searchParams.get("floorName");
  const bookingType = searchParams.get("bookingType");
  const amount = searchParams.get("amount");

  const isLocalPayment = bookingId?.startsWith("BK-");

  const [booking, setBooking] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isLocalPayment);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token);
      }
    });

    // For locally-generated booking IDs (like BK-... which was old mock flow), skip backend fetch
    // Real bookingId is a UUID
    if (isLocalPayment || !bookingId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [bk, docs] = await Promise.all([
          apiService.getBookingById(bookingId),
          apiService.getDocuments().catch(() => []),
        ]);
        setBooking(bk);
        setDocuments((docs || []).filter((d: any) => d.booking_id === bookingId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchData, 5000);
    return () => clearTimeout(t);
  }, [bookingId, isLocalPayment]);

  const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8008";
    return `${baseUrl}${path}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700">Finalising your booking...</p>
        <p className="text-xs text-slate-400 mt-1">Generating legal documents & sending approval request</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-16 w-full flex-grow flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">

          {/* Success Icon */}
          <div className="h-18 w-18 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>

          {/* Title */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900">Payment Successful!</h1>
            <p className="text-sm text-slate-500">Your booking has been confirmed and documents are being generated.</p>
          </div>

          {/* Property Details */}
          {(aptName || booking) && (
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Property Booked</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                  <Building2 className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Apartment</p>
                  <p className="font-bold text-slate-800 truncate">{aptName || booking?.flat?.apartment_name || "—"}</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                  <Layers className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Floor</p>
                  <p className="font-bold text-slate-800">{floorName || booking?.flat?.floor_name || "—"}</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                  <Home className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">Flat</p>
                  <p className="font-bold text-slate-800">{flatNumber || booking?.flat?.flat_number || "—"}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs mt-2 pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Booking ID</span>
                <span className="font-mono font-bold text-slate-700 text-[10px]">{bookingId?.substring(0, 18)}...</span>
              </div>
              {paymentId && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Payment ID</span>
                  <span className="font-mono font-bold text-slate-700 text-[10px]">{paymentId}</span>
                </div>
              )}
              {(bookingType || booking?.booking_type) && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Type</span>
                  <span className="font-bold text-slate-700">{bookingType || booking?.booking_type}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Amount Paid</span>
                  <span className="font-bold text-emerald-700">₹{Number(amount).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Status Banner */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Pending Admin Approval</p>
              <p className="text-xs text-amber-700 mt-0.5">Your Resident Access Request has been sent to the Admin. Once approved, you'll gain full access to the Resident Dashboard.</p>
            </div>
          </div>

          {/* Generated Documents */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Generated Documents</p>
              {documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <div className="flex items-center gap-2.5 text-xs">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="font-semibold text-slate-700">{doc.name}</span>
                  </div>
                  {doc.id && (
                    <a
                      href={getApiUrl(`/api/v1/documents/${doc.id}/download?token=${token}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Download PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/my-documents"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="h-4 w-4" /> View My Documents
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
