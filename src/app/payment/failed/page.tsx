"use client";

import Link from "next/link";
import { AlertCircle, HelpCircle } from "lucide-react";
import Footer from "@/components/Footer";

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-16 w-full flex-grow flex flex-col justify-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fade-in-scale">
          <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-100">
            <AlertCircle className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900">Transaction Failed</h1>
            <p className="text-xs text-slate-500 leading-relaxed px-2">
              Razorpay could not authorize your payment. Your bank account was not debited, or a signature verification mismatch occurred.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/apartments"
              className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow"
            >
              Browse Other Flats
            </Link>
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
            >
              Return to Console
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
