"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-lg font-bold text-transparent">
              PropVista AI
            </span>
            <p className="mt-4 text-xs leading-5">
              Next-generation intelligent booking engine and real estate society management platform. Elevating modern real estate logistics.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/properties" className="hover:text-white transition-colors">Property Listings</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Side-by-Side Comparison</Link></li>
              <li><Link href="/dashboard/resident" className="hover:text-white transition-colors">Resident Operations</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support & Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">SLA Agreement</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-800 pt-8 flex items-center justify-between text-[11px]">
          <p>&copy; {new Date().getFullYear()} PropVista AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500">❤️</span> for modern living.
          </p>
        </div>
      </div>
    </footer>
  );
}
