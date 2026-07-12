"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Download, Eye, Calendar, DollarSign, Building } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token);
      }
    });

    Promise.all([
      apiService.getBookingHistory().catch(err => {
        console.error("Error fetching bookings:", err);
        return [];
      }),
      apiService.getPaymentHistory().catch(err => {
        console.error("Error fetching payments:", err);
        return [];
      }),
      apiService.getMyResidentAccessRequests().catch(err => {
        console.error("Error fetching access requests:", err);
        return [];
      })
    ]).then(([bData, pData, rData]) => {
      setBookings(bData || []);
      setPayments(pData || []);
      setRequests(rData || []);
      setLoading(false);
    }).catch(err => {
      console.error("Unexpected error loading bookings page data:", err);
      setLoading(false);
    });
  }, []);

  const handleRequestApproval = async (bookingId: string, flatId: string, documentId?: string) => {
    try {
      setSubmittingId(bookingId);
      await apiService.createResidentAccessRequest({
        booking_id: bookingId,
        flat_id: flatId,
        document_id: documentId
      });
      const reqs = await apiService.getMyResidentAccessRequests();
      setRequests(reqs);
    } catch (err: any) {
      console.error("Failed to request approval:", err);
      alert(err?.response?.data?.error || err?.response?.data?.detail || "Failed to submit request.");
    } finally {
      setSubmittingId(null);
    }
  };

  const formatPrice = (n: number) => {
    if (!n) return "N/A";
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const getApiUrl = (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8008";
    return `${baseUrl}${path}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sold":
      case "Booked":
      case "Completed":
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
                        <div className="flex-grow space-y-3">
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

                          {/* Resident Approval Request Widget */}
                          {(() => {
                            const bookingPdf = b.documents?.find((d: any) => d.doc_type === "Sale Agreement" || d.doc_type === "Rental Agreement");
                            const isCompleted = b.status === "Completed";
                            
                            if (isCompleted && bookingPdf) {
                              const request = requests.find((r: any) => r.booking_id === b.id);
                              if (request) {
                                if (request.status === "Pending") {
                                  return (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs space-y-1 w-fit">
                                      <p className="font-bold text-orange-700 flex items-center gap-1.5">
                                        ✔ Approval Request Sent
                                      </p>
                                      <p className="text-slate-600 font-medium">Status: Pending Admin Approval</p>
                                    </div>
                                  );
                                } else if (request.status === "Approved") {
                                  return (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1 w-fit">
                                      <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                                        ✔ Resident Access Approved
                                      </p>
                                      <p className="text-slate-600 font-medium">Status: Approved</p>
                                    </div>
                                  );
                                } else if (request.status === "Rejected") {
                                  return (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1 w-fit">
                                      <p className="font-bold text-red-700">
                                        ❌ Resident Access Request Rejected
                                      </p>
                                      <p className="text-slate-700 font-semibold mt-1">Rejection Reason: {request.rejection_reason || request.remarks || "No reason specified"}</p>
                                    </div>
                                  );
                                }
                              } else {
                                return (
                                  <button
                                    onClick={() => handleRequestApproval(b.id, b.flat_id, bookingPdf.id)}
                                    disabled={submittingId === b.id}
                                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-xl transition-all shadow-sm"
                                  >
                                    {submittingId === b.id ? "Sending Request..." : "Request for Resident Approval"}
                                  </button>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>

                        {b.documents && b.documents.length > 0 && (
                          <div className="space-y-2.5 self-stretch sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                            {b.documents.some((d: any) => d.doc_type === "Receipt") && (
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Receipt</span>
                                <div className="flex gap-2">
                                  <a
                                    href={getApiUrl(`/api/v1/documents/${b.documents.find((d: any) => d.doc_type === "Receipt").id}/view?token=${token}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                                  >
                                    <Eye className="h-3 w-3" /> View Receipt
                                  </a>
                                  <a
                                    href={getApiUrl(`/api/v1/documents/${b.documents.find((d: any) => d.doc_type === "Receipt").id}/download?token=${token}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                                  >
                                    <Download className="h-3 w-3" /> Download Receipt
                                  </a>
                                </div>
                              </div>
                            )}
                            {b.documents.some((d: any) => d.doc_type === "Sale Agreement" || d.doc_type === "Rental Agreement") && (
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Agreement</span>
                                <div className="flex gap-2">
                                  <a
                                    href={getApiUrl(`/api/v1/documents/${b.documents.find((d: any) => d.doc_type === "Sale Agreement" || d.doc_type === "Rental Agreement").id}/view?token=${token}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                                  >
                                    <Eye className="h-3 w-3" /> View Agreement
                                  </a>
                                  <a
                                    href={getApiUrl(`/api/v1/documents/${b.documents.find((d: any) => d.doc_type === "Sale Agreement" || d.doc_type === "Rental Agreement").id}/download?token=${token}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                                  >
                                    <Download className="h-3 w-3" /> Download Agreement
                                  </a>
                                </div>
                              </div>
                            )}
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block">Other Papers</span>
                              <div className="flex flex-col gap-1">
                                {b.documents.filter((d: any) => d.doc_type !== "Receipt" && d.doc_type !== "Sale Agreement" && d.doc_type !== "Rental Agreement").map((doc: any) => (
                                  <a
                                    key={doc.id}
                                    href={getApiUrl(`/api/v1/documents/${doc.id}/view?token=${token}`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 hover:text-brand-blue hover:underline"
                                  >
                                    <Eye className="h-2.5 w-2.5" /> {doc.doc_type}
                                  </a>
                                ))}
                              </div>
                            </div>
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
                        <span className={p.status === "Successful" || p.status === "Success" ? "text-emerald-600" : "text-amber-500"}>
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
