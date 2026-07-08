import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_70%)] pointer-events-none" />
      <div className="space-y-6 relative z-10 max-w-md">
        <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl mx-auto mb-4 animate-bounce">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h2>
        <h3 className="text-lg font-bold text-slate-200">Apartment Location Not Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested coordinate portal, property index, or dashboard configuration is currently unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover px-5 py-3 text-xs font-bold text-white transition-all shadow-md mt-6"
        >
          Return to Home Listing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
