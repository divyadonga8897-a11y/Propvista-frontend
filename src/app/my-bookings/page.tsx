"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Download, FileText, Calendar, DollarSign, Building } from "lucide-react";
import Footer from "@/components/Footer";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getBookingHistory(),
      apiService.getPaymentHistory()
    ]).then(([bData, pData]) => {
      setBookings(bData);
      setPayments(pData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const formatPrice = (n: number) => {
    if (!n) return "N/A";
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sold":
      case "Booked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rented":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Held":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex-grow flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-black text-brand-dark mb-2">My Bookings & Payments</h1>
          <p className="text-xs text-brand-gray">View live acquisitions, transaction metrics, and contract papers.</p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-slate-200 rounded-2xl w-full" />
            <div className="h-20 bg-slate-200 rounded-2xl w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Bookings list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-brand-dark border-b pb-2 mb-4">Acquisition Inventory</h3>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-10">
                    <Building className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs text-slate-400">No properties booked yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow transition-shadow">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(b.status)}`}>
                              {b.status}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{b.booking_type}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 mt-2">Flat {b.flat?.flat_number || "N/A"} - {b.flat?.apartment_name || "Community"}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Booking Date: {new Date(b.created_at).toLocaleDateString()}</span>
                        </div>

                        {b.documents && b.documents.length > 0 && (
                          <div className="space-y-1.5 self-stretch sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                            {b.documents.map((doc: any) => (
                              <a
                                key={doc.id}
                                href={doc.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                              >
                                <Download className="h-3 w-3" /> {doc.doc_type}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payments History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-dark border-b pb-2">Payments ledger</h3>
              
              {payments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No transaction logs available.</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((p) => (
                    <div key={p.id} className="border-b border-slate-50 last:border-b-0 pb-3 last:pb-0 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-slate-900">{p.payment_type}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(p.payment_date).toLocaleDateString()}</span>
                        </div>
                        <span className="font-bold text-slate-800">{formatPrice(p.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[9px] font-bold">
                        <span className="text-slate-400">Order Ref: {p.razorpay_order_id || "N/A"}</span>
                        <span className={p.status === "Successful" ? "text-emerald-600" : "text-amber-500"}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
