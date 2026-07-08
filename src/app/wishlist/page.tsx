"use client";

import { usePropVista } from "@/components/Providers";
import { MOCK_FLATS as MOCK_UNITS } from "@/data/mockData";
import Link from "next/link";
import { Heart, ArrowRight, Grid, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = usePropVista();

  const wishlistedUnits = MOCK_UNITS.filter((u) => wishlist.includes(u.id));

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <h1 className="text-2xl font-extrabold text-brand-dark mb-2">My Saved Wishlist</h1>
        <p className="text-xs text-brand-gray mb-8">Quick access to units you have favorited during search.</p>

        {wishlistedUnits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlistedUnits.map((unit) => (
              <div
                key={unit.id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img src={unit.images[0]?.image_url} alt="unit thumbnail" className="h-full w-full object-cover" />
                  <button
                    onClick={() => toggleWishlist(unit.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white text-red-500 hover:text-red-600 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wider">{unit.flat_type} | {unit.facing_direction}</span>
                    <h3 className="mt-1 text-sm font-bold text-brand-dark">Unit {unit.flat_number} - {unit.apartment_name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{unit.area_sqft} sqft | Maintenance: ₹{unit.maintenance_fee}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {unit.price_buy && <div className="text-xs font-bold text-slate-800">₹{(unit.price_buy/100000).toFixed(1)}L</div>}
                      {unit.price_rent && <div className="text-[11px] font-semibold text-brand-emerald">₹{unit.price_rent.toLocaleString()}/mo</div>}
                    </div>
                    <Link
                      href={`/properties/unit/${unit.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
            <Heart className="mx-auto h-12 w-12 text-slate-200 fill-current" />
            <h3 className="mt-2 text-sm font-bold text-slate-900">Your wishlist is empty</h3>
            <p className="mt-1 text-xs text-slate-500">Go to properties catalog to mark units as favorites.</p>
            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
