"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { FacilityBooking } from "@/types";
import { CalendarDays, Calendar, Clock, ClipboardList, PlusCircle, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function FacilitiesBookingPage() {
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [facilityName, setFacilityName] = useState("Club House");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [durationHours, setDurationHours] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadBookings() {
    try {
      setLoading(true);
      const res = await apiService.getFacilityBookings();
      setBookings(res);
    } catch (err: any) {
      console.error("Facilities load error", err);
      setError("Failed to fetch facility bookings registry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handleBookFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.bookFacility({
        facility_name: facilityName,
        booking_date: bookingDate,
        booking_time: bookingTime,
        duration_hours: durationHours,
        notes: notes || undefined
      });
      toast.success("Facility slot booked successfully!");
      setNotes("");
      setBookingDate("");
      loadBookings();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to book facility.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Approved</span>;
      case "Cancelled":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Facility Booking</h1>
            <p className="text-xs text-slate-500 mt-1">Book common spaces, meeting rooms, gyms or play zones within your community.</p>
          </div>
          <button onClick={loadBookings} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-500" /> Reserve Facility
            </h3>
            <form onSubmit={handleBookFacility} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Facility</label>
                <select
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-850 focus:outline-none"
                >
                  <option>Club House</option>
                  <option>Gym</option>
                  <option>Meeting Hall</option>
                  <option>Community Hall</option>
                  <option>Indoor Games Room</option>
                  <option>Children Play Area</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Booking Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start Time</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Remarks / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  placeholder="Optional requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-xs shadow-md transition-all"
              >
                {submitting ? "Booking..." : "Confirm Reservation"}
              </button>
            </form>
          </div>

          {/* Bookings registry */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <ClipboardList className="h-4.5 w-4.5 text-slate-700" />
              Reservation Logs ({bookings.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-indigo-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                You haven't reserved any facility slots.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-xs font-bold text-slate-800">{b.facility_name}</h4>
                      {getStatusBadge(b.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {b.booking_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {b.booking_time} ({b.duration_hours} hrs)
                      </span>
                    </div>
                    {b.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-1 font-semibold leading-relaxed">Note: {b.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
