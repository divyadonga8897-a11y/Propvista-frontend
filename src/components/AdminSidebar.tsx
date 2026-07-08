"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Building2, Home, FileText, 
  CreditCard, Users, ShieldCheck, Wrench, IndianRupee,
  MessageSquare, Bell, RadioReceiver, UserPlus, Car, 
  Building, FolderOpen, Mail, BellRing, BarChart3, 
  BrainCircuit, Settings, LogOut
} from "lucide-react";
import { usePropVista } from "@/components/Providers";

const ADMIN_ROUTES = [
  { group: "Overview", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "City Management", href: "/admin/cities", icon: Building },
  ]},
  { group: "Property Management", items: [
    { label: "Apartment Communities", href: "/admin/apartments", icon: Building2 },
    { label: "Floors", href: "/admin/floors", icon: LayoutDashboard },
    { label: "Flats", href: "/admin/flats", icon: Home },
  ]},
  { group: "Financials & Bookings", items: [
    { label: "Bookings", href: "/admin/bookings", icon: FileText },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    { label: "Rent Collection", href: "/admin/rent", icon: IndianRupee },
  ]},
  { group: "Resident & Community", items: [
    { label: "Residents", href: "/admin/residents", icon: Users },
    { label: "Resident Approvals", href: "/admin/approvals", icon: ShieldCheck },
    { label: "Complaints", href: "/admin/complaints", icon: MessageSquare },
    { label: "Announcements", href: "/admin/announcements", icon: Bell },
    { label: "Community Feed", href: "/admin/feed", icon: RadioReceiver },
  ]},
  { group: "Operations", items: [
    { label: "Visitors", href: "/admin/visitors", icon: UserPlus },
    { label: "Vehicles", href: "/admin/vehicles", icon: Car },
    { label: "Facility Bookings", href: "/admin/facilities", icon: Building2 },
    { label: "Documents", href: "/admin/documents", icon: FolderOpen },
  ]},
  { group: "System & Tools", items: [
    { label: "Email Management", href: "/admin/emails", icon: Mail },
    { label: "Notifications", href: "/admin/notifications", icon: BellRing },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "AI Assistant", href: "/admin/ai", icon: BrainCircuit },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]}
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = usePropVista();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto custom-scrollbar text-slate-300">
      <div className="p-6 sticky top-0 bg-slate-900/90 backdrop-blur-md z-10 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            PV
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none">PropVista</h1>
            <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-1">Control Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {ADMIN_ROUTES.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{group.group}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md" 
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-200' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto sticky bottom-0 bg-slate-900">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
