"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePropVista } from "./Providers";
import {
  Heart, Columns, LogIn, LogOut, ChevronDown, Building2,
  Home, Info, Phone, LayoutDashboard, UserCircle, Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, wishlist, compareList, user, signOut, authLoading } = usePropVista();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const getDashboardLink = () => {
    if (role === "Admin") return "/admin";
    if (role === "Resident") return "/resident";
    return "/dashboard";
  };

  const navLinks = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
    },
    {
      label: "Apartments",
      href: "/apartments",
      icon: Building2,
    },
    {
      label: "About",
      href: "/about",
      icon: Info,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    toast.success("Signed out successfully.");
    setSigningOut(false);
    router.push("/login");
  };

  const roleColor =
    role === "Admin"
      ? "bg-purple-600"
      : role === "Resident"
        ? "bg-emerald-600"
        : "bg-blue-600";

  // Hide Navbar on authentication and non-customer dashboard pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/resident")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Building2 className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              PropVista AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            title="Compare"
          >
            <Columns className="h-5 w-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
                {compareList.length}
              </span>
            )}
          </Link>

          {/* Auth-dependent section */}
          {authLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : user ? (
            /* Logged-in: user dropdown */
            <div className="flex items-center gap-3">

              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100"
                >
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white ${roleColor}`}>
                    {role}
                  </span>
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg animate-fade-in-scale z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <UserCircle className="h-3.5 w-3.5" /> Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        id="signout-btn"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged-out: Login + Register buttons */
            <>
              <Link
                href="/login"
                id="nav-login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                id="nav-register"
                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition-all shadow-sm shadow-blue-500/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
