"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_FLATS, MOCK_APARTMENTS, STATUS_COLORS } from "@/data/mockData";
import { usePropVista } from "@/components/Providers";
import Link from "next/link";
import {
  Heart, Search, MapPin, Grid, Layers, Compass, IndianRupee,
  ArrowRight, SlidersHorizontal, Building, X, Home
} from "lucide-react";
import Footer from "@/components/Footer";

const FACINGS = ["All", "North", "South", "East", "West", "North East", "North West", "South East", "South West"];
const STATUSES = ["All", "Available", "Held", "Booked", "Sold", "Rented"];
const BHK_OPTIONS = ["All", "2BHK", "3BHK"];
const APARTMENTS_FILTER = ["All", "Happy Homes", "Green Valley Residency", "Skyline Residency"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "area", label: "Area: Largest First" },
];

export default function Properties() {
  const searchParams = useSearchParams();
  const { wishlist, toggleWishlist } = usePropVista();

  const [search, setSearch] = useState("");
  const [apartmentFilter, setApartmentFilter] = useState("All");
  const [bhk, setBhk] = useState("All");
  const [facing, setFacing] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceType, setPriceType] = useState<"buy" | "rent" | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearch(urlSearch);
    const urlBhk = searchParams.get("bhk");
    if (urlBhk && urlBhk !== "All") setBhk(urlBhk);
  }, [searchParams]);

  // Filter & Sort
  let filtered = MOCK_FLATS.filter((flat) => {
    const matchesSearch =
      flat.flat_number.toLowerCase().includes(search.toLowerCase()) ||
      (flat.apartment_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (flat.short_description || "").toLowerCase().includes(search.toLowerCase());
    const matchesApt = apartmentFilter === "All" || flat.apartment_name === apartmentFilter;
    const matchesBhk = bhk === "All" || flat.flat_type === bhk;
    const matchesFacing = facing === "All" || flat.facing_direction === facing;
    const matchesStatus = statusFilter === "All" || flat.status === statusFilter;

    let matchesPrice = true;
    if (priceType === "buy") {
      matchesPrice = !!flat.price_buy;
      if (maxPrice > 0 && flat.price_buy) matchesPrice = matchesPrice && flat.price_buy <= maxPrice;
    } else if (priceType === "rent") {
      matchesPrice = !!flat.price_rent;
      if (maxPrice > 0 && flat.price_rent) matchesPrice = matchesPrice && flat.price_rent <= maxPrice;
    }

    return matchesSearch && matchesApt && matchesBhk && matchesFacing && matchesStatus && matchesPrice;
  });

  if (sortBy === "price_low") {
    filtered = [...filtered].sort((a, b) =>
      priceType === "rent" ? (a.price_rent ?? 0) - (b.price_rent ?? 0) : (a.price_buy ?? 0) - (b.price_buy ?? 0)
    );
  } else if (sortBy === "price_high") {
    filtered = [...filtered].sort((a, b) =>
      priceType === "rent" ? (b.price_rent ?? 0) - (a.price_rent ?? 0) : (b.price_buy ?? 0) - (a.price_buy ?? 0)
    );
  } else if (sortBy === "area") {
    filtered = [...filtered].sort((a, b) => b.area_sqft - a.area_sqft);
  }

  const formatPrice = (n?: number) => {
    if (!n) return "N/A";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Page Header ─────────────────────────────────────── */}
      <section className="bg-slate-900 py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Home className="h-3.5 w-3.5" />
            <span>/</span>
            <span className="text-slate-200 font-medium">Browse Flats</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            Available Flats — Nandyal
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Showing {filtered.length} of {MOCK_FLATS.length} flats across 3 communities
          </p>

          {/* Top bar: search + filters toggle */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
              <input
                id="flat-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by flat number, apartment, description..."
                className="w-full rounded-lg bg-slate-800 border border-slate-700 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-blue"
              />
            </div>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg bg-slate-800 border border-slate-700 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-brand-blue"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              id="toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 py-2.5 px-4 text-sm text-white font-medium transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {showFilters && <X className="h-3.5 w-3.5 text-slate-300" />}
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              {/* Apartment */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Community</label>
                <select
                  id="filter-apt"
                  value={apartmentFilter}
                  onChange={(e) => setApartmentFilter(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                >
                  {APARTMENTS_FILTER.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              {/* BHK */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">BHK Type</label>
                <select
                  id="filter-bhk"
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                >
                  {BHK_OPTIONS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Status</label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Facing */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Facing</label>
                <select
                  id="filter-facing"
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                >
                  {FACINGS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              {/* Price type */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Intent</label>
                <select
                  id="filter-price-type"
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value as any)}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">Buy or Rent</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              {/* Max price */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Max Price ({priceType === "rent" ? "/mo" : "total"})
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  value={maxPrice || ""}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder={priceType === "rent" ? "15000" : "5000000"}
                  className="w-full rounded-md bg-slate-900 border border-slate-700 py-2 px-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Flat Grid ────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
            <Building className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No flats found</h3>
            <p className="mt-1 text-xs text-slate-500">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((flat) => {
              const isWishlisted = wishlist.includes(flat.id);
              const coverImage = flat.images[0]?.image_url;

              return (
                <div
                  key={flat.id}
                  id={`flat-card-${flat.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                    {coverImage && (
                      <img
                        src={coverImage}
                        alt={`${flat.apartment_name} Flat ${flat.flat_number}`}
                        className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                      />
                    )}
                    {/* Status badge */}
                    <span
                      className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm"
                      style={{ backgroundColor: STATUS_COLORS[flat.status] + "cc" }}
                    >
                      {flat.status}
                    </span>
                    {/* Wishlist btn */}
                    <button
                      id={`wishlist-${flat.id}`}
                      onClick={() => toggleWishlist(flat.id)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                      />
                    </button>
                    {/* Floor badge */}
                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Floor {flat.floor_number}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{flat.apartment_name}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                      Flat {flat.flat_number} — {flat.flat_type}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-grow">
                      {flat.short_description}
                    </p>

                    {/* Specs row */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <Layers className="h-3 w-3" /> {flat.bedrooms}BR / {flat.bathrooms}BA
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <Grid className="h-3 w-3" /> {flat.area_sqft} sqft
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <Compass className="h-3 w-3" /> {flat.facing_direction}
                      </span>
                    </div>

                    {/* Price row */}
                    <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
                      {flat.price_buy && (
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Buy</p>
                          <p className="text-sm font-extrabold text-slate-900">{formatPrice(flat.price_buy)}</p>
                        </div>
                      )}
                      {flat.price_rent && (
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rent/mo</p>
                          <p className="text-sm font-extrabold text-slate-900">{formatPrice(flat.price_rent)}</p>
                        </div>
                      )}
                      <Link
                        href={`/properties/${flat.apartment_id}/flat/${flat.id}`}
                        className="ml-auto flex items-center gap-1 text-xs font-bold text-brand-emerald hover:underline"
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
