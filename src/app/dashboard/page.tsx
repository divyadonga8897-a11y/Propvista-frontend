"use client";

import Sidebar from "@/components/Sidebar";
import { usePropVista } from "@/components/Providers";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import Link from "next/link";
import { Building, ArrowRight, Clock, XCircle } from "lucide-react";

export default function CustomerDashboard() {
  const { wishlist, compareList } = usePropVista();
  const [bookings, setBookings] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getBookingHistory(),
      apiService.getMyResidentAccessRequests().catch(() => [])
    ]).then(([bData, aData]) => {
      setBookings(bData);
      setAccessRequests(aData);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const hasPendingApproval = accessRequests.some(r => r.status === "Pending");
  const rejectedRequests = accessRequests.filter(r => r.status === "Rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sold":
      case "Rented":
      case "Booked":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Held":
      case "Payment Pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="flex-grow flex bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-black text-brand-dark mb-2">Customer Hub</h1>
        <p className="text-xs text-brand-gray mb-8">Review your booking requests, active bids, and property stats.</p>

        {/* Approval Pending Status Banner */}
        {hasPendingApproval && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 shadow-sm animate-pulse">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-800">Approval Pending</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Your Resident Access Request is awaiting Admin review. Once approved, you will gain full access to the resident dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Request Rejected Banner */}
        {rejectedRequests.map((req) => (
          <div key={req.id} className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 shadow-sm">
            <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Request Rejected</h4>
              <p className="text-xs text-red-700 mt-0.5">
                Your resident access request was rejected by the administrator.
              </p>
              {req.remarks && (
                <p className="text-xs text-red-800 font-semibold mt-1.5 bg-red-100/50 p-2 rounded-lg border border-red-200/50">
                  Reason: {req.remarks}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Saved Favorites</div>
            <div className="text-2xl font-black text-brand-emerald mt-1">{wishlist.length}</div>
            <Link href="/wishlist" className="mt-2 text-[10px] font-bold text-brand-blue flex items-center gap-1 hover:underline">
              Inspect Wishlist <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Comparison Queue</div>
            <div className="text-2xl font-black text-brand-blue mt-1">{compareList.length} / 3</div>
            <Link href="/compare" className="mt-2 text-[10px] font-bold text-brand-blue flex items-center gap-1 hover:underline">
              Compare Slots <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Bookings</div>
            <div className="text-2xl font-black text-brand-dark mt-1">{bookings.length}</div>
            <Link href="/my-bookings" className="mt-2 text-[10px] font-bold text-brand-blue flex items-center gap-1 hover:underline">
              Manage Bookings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Booking requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-3 mb-4">My Bids & Bookings</h3>
          {loading ? (
            <div className="space-y-2 animate-pulse py-4">
              <div className="h-8 bg-slate-100 rounded w-full" />
              <div className="h-8 bg-slate-100 rounded w-full" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No bookings made yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">Property Unit</th>
                    <th className="p-3">Transaction</th>
                    <th className="p-3">Date Initiated</th>
                    <th className="p-3">Amount Paid</th>
                    <th className="p-3">Request Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="text-slate-800">
                      <td className="p-3">
                        <div className="font-bold">Unit {b.flat?.flat_number || "N/A"}</div>
                        <div className="text-[10px] text-slate-400">{b.flat?.apartment_name || "Community"}</div>
                      </td>
                      <td className="p-3 font-semibold">{b.booking_type}</td>
                      <td className="p-3">{new Date(b.created_at).toLocaleDateString()}</td>
                      <td className="p-3 font-bold">₹{b.amount_paid.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(b.status)}`}>
                          <Clock className="h-3.5 w-3.5" />
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
