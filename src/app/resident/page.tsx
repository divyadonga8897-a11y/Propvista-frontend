"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { ResidentProfile, MaintenanceBill, RentRecord, Announcement, Complaint, Visitor, FacilityBooking } from "@/types";
import { 
  Building2, 
  Home, 
  Wrench, 
  DollarSign, 
  ClipboardList, 
  BellRing, 
  Users, 
  CalendarDays, 
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  Star
} from "lucide-react";
import Link from "next/link";

export default function ResidentDashboard() {
  const [profile, setProfile] = useState<ResidentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard Stats States
  const [stats, setStats] = useState({
    maintenanceDue: 0.0,
    rentDue: 0.0,
    openComplaints: 0,
    upcomingVisitors: 0,
    bookedFacilities: 0,
    unreadAnnouncements: 0
  });

  // Recent data lists
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load resident profile
        const prof = await apiService.getResidentProfile();
        setProfile(prof);

        // Load Dues, Complaints, Announcements, Visitors, Bookings in parallel
        const [bills, rents, complaints, announcements, visitors, bookings] = await Promise.all([
          apiService.getMaintenanceBills("Pending").catch(() => ({ records: [], total: 0 })),
          apiService.getRentRecords("Pending").catch(() => ({ records: [], outstanding_total: 0, total: 0 })),
          apiService.getComplaintsHistory().catch(() => []),
          apiService.getAnnouncements().catch(() => []),
          apiService.getVisitors().catch(() => []),
          apiService.getFacilityBookings().catch(() => [])
        ]);

        // Calculate dues
        const maintDueTotal = bills.records.reduce((acc, curr) => acc + curr.amount, 0);
        const rentDueTotal = rents.outstanding_total || 0;

        // Open complaints
        const openCompCount = complaints.filter(c => c.status !== "Closed" && c.status !== "Resolved").length;

        // Upcoming visitors (Pending approval or upcoming checkins today)
        const pendingVis = visitors.filter(v => v.approval_status === "Pending").length;

        // Active/upcoming bookings
        const activeBookings = bookings.filter(b => b.status === "Approved").length;

        setStats({
          maintenanceDue: maintDueTotal,
          rentDue: rentDueTotal,
          openComplaints: openCompCount,
          upcomingVisitors: pendingVis,
          bookedFacilities: activeBookings,
          unreadAnnouncements: announcements.length
        });

        setRecentAnnouncements(announcements.slice(0, 3));
        setRecentComplaints(complaints.slice(0, 3));
      } catch (err: any) {
        console.error("Dashboard load error", err);
        setError("Could not load resident dashboard. Please check if you have an active residency.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Render 'Residency Not Active' screen if loading has completed and no profile was found
  if (!loading && (error || !profile)) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center space-y-4">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Residency Not Active</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error || "It looks like you don't have an active resident profile. Make sure you've completed payment for a flat to automatically register as a resident."}
            </p>
            <div className="pt-2">
              <Link href="/properties" className="inline-block rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500">
                Browse Properties
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        {/* Profile Branding Header */}
        {profile ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-3xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.apartment_name}</h1>
                <p className="text-xs text-emerald-100 mt-1">
                  Flat {profile.flat_number} • Floor {profile.floor_number} • Resident: {profile.resident_type}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {profile.status} Member
              </span>
              <p className="text-[10px] text-emerald-100 mt-1.5">Joined: {profile.move_in_date || "N/A"}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-200 to-slate-300 p-6 rounded-3xl shadow-md animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-white/30 rounded" />
                <div className="h-3 w-32 bg-white/30 rounded" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-5 w-24 bg-white/30 rounded ml-auto" />
              <div className="h-3 w-16 bg-white/30 rounded ml-auto" />
            </div>
          </div>
        )}

        {/* Dashboard Cards Grid */}
        {!loading && profile ? (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Card: Community Rating */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Star className="h-4 w-4" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</div>
                  <div className="text-lg font-black text-slate-800 mt-1">4.8/5</div>
                </div>
                <div className="text-[10px] font-medium text-emerald-500 mb-1">+0.2</div>
              </div>
            </div>

            {/* Card 1: Maintenance Due */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Maint. Due</div>
                <div className="text-lg font-black text-slate-800 mt-1">₹{stats.maintenanceDue.toLocaleString()}</div>
              </div>
            </div>

            {/* Card 2: Rent Due */}
            {profile.resident_type === "Tenant" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                <div className="p-2 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="mt-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rent Due</div>
                  <div className="text-lg font-black text-slate-800 mt-1">₹{stats.rentDue.toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* Card 3: Open Complaints */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complaints</div>
                <div className="text-lg font-black text-slate-800 mt-1">{stats.openComplaints} Open</div>
              </div>
            </div>

            {/* Card 4: Upcoming Visitors */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visitors</div>
                <div className="text-lg font-black text-slate-800 mt-1">{stats.upcomingVisitors} Pending</div>
              </div>
            </div>

            {/* Card 5: Booked Facilities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Facilities</div>
                <div className="text-lg font-black text-slate-800 mt-1">{stats.bookedFacilities} Active</div>
              </div>
            </div>

            {/* Card 6: Bulletins */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div className="p-2 w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <BellRing className="h-4 w-4" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Announcements</div>
                <div className="text-lg font-black text-slate-800 mt-1">{stats.unreadAnnouncements} Total</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between animate-pulse min-h-[120px]">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="space-y-2 mt-4">
                  <div className="h-2 w-16 bg-slate-200 rounded" />
                  <div className="h-4 w-12 bg-slate-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Timeline Component */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5 mb-6 border-b border-slate-100 pb-3">
            <Activity className="h-4 w-4 text-emerald-500" />
            Resident Lifecycle Timeline
          </h3>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
            {/* Timeline connector line */}
            <div className="absolute top-1/2 left-4 md:left-0 md:w-full h-full md:h-0.5 bg-slate-100 -translate-y-1/2 -z-10 hidden md:block"></div>
            
            {[
              { label: "Registered", desc: "User Account Created", done: true },
              { label: "Booked Flat", desc: "Selected Community Unit", done: true },
              { label: "Payment Completed", desc: "Payment Confirmed", done: true },
              { label: "Resident Activated", desc: "Upgraded to Resident", done: true },
              { label: "Moved In", desc: "Active Occupant", done: true },
              { label: "Maintenance Active", desc: "Billing Cycle Commenced", done: true },
              { label: "Community Member", desc: "Society Rights & Access", done: true }
            ].map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 relative z-10 w-full md:w-auto">
                <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center text-xs font-bold ${
                  step.done ? "bg-emerald-600 border-emerald-100 text-white" : "bg-white border-slate-100 text-slate-400"
                }`}>
                  {step.done ? <CheckCircle2 className="h-4.5 w-4.5" /> : idx + 1}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">{step.label}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices and Complaints Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Notices */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BellRing className="h-4.5 w-4.5 text-emerald-500" />
                Latest Announcements
              </h3>
              <Link href="/resident/announcements" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                View All <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/20 animate-pulse space-y-3">
                    <div className="h-2 w-12 bg-slate-200 rounded" />
                    <div className="h-3.5 w-48 bg-slate-300 rounded" />
                    <div className="h-2 w-full bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent announcements found.</p>
            ) : (
              <div className="space-y-4">
                {recentAnnouncements.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/20">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{a.announcement_type}</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">{a.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{a.content}</p>
                    <p className="text-[9px] text-slate-400 mt-2">Published: {a.publish_date?.split("T")[0]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Tickets / Complaints */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Hammer className="h-4.5 w-4.5 text-indigo-500" />
                Active Support Tickets
              </h3>
              <Link href="/resident/complaints" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                Manage Hub <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border border-slate-150 rounded-xl bg-slate-50/20 animate-pulse flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-300 rounded" />
                      <div className="h-2 w-16 bg-slate-200 rounded" />
                    </div>
                    <div className="h-4 w-12 bg-slate-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentComplaints.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No active support tickets logged.</p>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((c) => (
                  <div key={c.id} className="p-3 border border-slate-150 rounded-xl flex items-center justify-between bg-slate-50/20">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">Category: {c.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[9px] font-bold rounded-full px-2 py-0.5 ${
                        c.priority === "High" ? "bg-red-50 text-red-600 border border-red-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {c.priority}
                      </span>
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                        {c.status}
                      </span>
                    </div>
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
