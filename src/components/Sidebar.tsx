"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePropVista } from "./Providers";
import {
  LayoutDashboard, Building2, Home, Wrench, MessageSquare,
  Bell, Users, BrainCircuit, FileText, BarChart3, Settings,
  Car, CalendarDays, ShieldCheck, ChevronRight,
} from "lucide-react";

// ── Sidebar nav definitions per role ─────────────────────────

const CUSTOMER_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Apartments", href: "/apartments", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: FileText },
  { label: "My Documents", href: "/my-documents", icon: BarChart3 },
  { label: "Wishlist", href: "/wishlist", icon: Home },
  { label: "Profile", href: "/profile", icon: Settings },
];

const RESIDENT_NAV = [
  { label: "My Dashboard", href: "/resident", icon: LayoutDashboard },
  { label: "My Property", href: "/resident/property", icon: Home },
  { label: "Maintenance Bills", href: "/resident/maintenance", icon: Wrench },
  { label: "Monthly Rent", href: "/resident/rent", icon: FileText },
  { label: "Community Rules", href: "/resident/rules", icon: ShieldCheck },
  { label: "Complaints Hub", href: "/resident/complaints", icon: MessageSquare },
  { label: "Announcements", href: "/resident/announcements", icon: Bell },
  { label: "Visitor Passes", href: "/resident/visitors", icon: Users },
  { label: "Vehicle Slots", href: "/resident/vehicles", icon: Car },
  { label: "Facility Booking", href: "/resident/facilities", icon: CalendarDays },
  { label: "Document Center", href: "/resident/documents", icon: FileText },
  { label: "Profile", href: "/profile", icon: Settings },
];

const ADMIN_NAV = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Apartments", href: "/dashboard/admin", icon: Building2 },
  { label: "Flats", href: "/dashboard/admin", icon: Home },
  { label: "Bookings", href: "/dashboard/admin", icon: FileText },
  { label: "Payments", href: "/dashboard/admin", icon: BarChart3 },
  { label: "Residents", href: "/dashboard/admin", icon: Users },
  { label: "Maintenance", href: "/dashboard/admin", icon: Wrench },
  { label: "Complaints", href: "/dashboard/admin", icon: MessageSquare },
  { label: "Visitors", href: "/dashboard/admin", icon: Car },
  { label: "Announcements", href: "/dashboard/admin", icon: Bell },
  { label: "Analytics", href: "/dashboard/admin", icon: BarChart3 },
  { label: "AI Dashboard", href: "/dashboard/admin", icon: BrainCircuit },
];

const ROLE_CONFIG = {
  Admin: {
    nav: ADMIN_NAV,
    label: "Admin Panel",
    color: "text-purple-400",
    badge: "bg-purple-600",
    accent: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  Resident: {
    nav: RESIDENT_NAV,
    label: "Resident Portal",
    color: "text-emerald-400",
    badge: "bg-emerald-600",
    accent: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  Customer: {
    nav: CUSTOMER_NAV,
    label: "Customer Hub",
    color: "text-blue-400",
    badge: "bg-blue-600",
    accent: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { role, user } = usePropVista();
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.Customer;

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-900 border-r border-slate-800 min-h-full">
      {/* Role Header */}
      <div className="p-5 border-b border-slate-800">
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.accent}`}>
          <ShieldCheck className="h-3 w-3" />
          {config.label}
        </div>
        {user && (
          <p className="mt-2 text-xs text-slate-400 truncate">{user.email}</p>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {config.nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all group ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? config.color : "group-hover:text-slate-300"}`} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className={`h-3 w-3 ${config.color}`} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-300">PropVista AI</p>
            <p className="text-[9px] text-slate-500">Stage 3 — Booking & Payments</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
