"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiService } from "@/services/apiService";
import Link from "next/link";
import { CheckCircle, Download, LayoutDashboard, FileText } from "lucide-react";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      apiService.getBookingById(bookingId).then((data) => {
        setBooking(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-16 w-full flex-grow flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fade-in-scale">
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
            <CheckCircle className="h-9 w-9" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900">Payment Reconciled!</h1>
            <p className="text-xs text-slate-500 leading-relaxed px-2">
              Order verified. You are now officially registered as a **Resident** of {booking?.flat?.apartment_name || "the apartment community"}.
            </p>
          </div>

          {booking && booking.documents && booking.documents.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b pb-1.5">Generated Documents</span>
              {booking.documents.map((doc: any) => (
                <div key={doc.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-brand-blue" />
                    {doc.name}
                  </span>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-brand-blue flex items-center gap-1 hover:underline"
                  >
                    <Download className="h-3 w-3" /> View/Download
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow flex items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
            <Link
              href="/my-documents"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <FileText className="h-4 w-4" /> View All Documents
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
