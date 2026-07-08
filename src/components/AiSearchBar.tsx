"use client";

import { useState, useRef, useEffect } from "react";
import { Search, FileText, Home, User, AlertCircle, X, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import apiService from "@/services/apiService";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  type: string;
  title: string;
  detail: string;
  link: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Flat: <Home className="h-3.5 w-3.5" />,
  Resident: <User className="h-3.5 w-3.5" />,
  Complaint: <AlertCircle className="h-3.5 w-3.5" />,
  Document: <FileText className="h-3.5 w-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  Flat: "bg-emerald-100 text-emerald-700",
  Resident: "bg-indigo-100 text-indigo-700",
  Complaint: "bg-orange-100 text-orange-700",
  Document: "bg-slate-100 text-slate-700",
};

export default function AiSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    apiService
      .aiSearch(debouncedQuery)
      .then((res) => setResults(res.results))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (link: string) => {
    setQuery("");
    setResults([]);
    setFocused(false);
    router.push(link);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className={`flex items-center gap-2 bg-white/10 border rounded-xl px-3 py-2 transition-all ${focused ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-white/20"}`}>
        {loading ? (
          <Loader2 className="h-4 w-4 text-indigo-300 animate-spin shrink-0" />
        ) : (
          <Sparkles className="h-4 w-4 text-indigo-300 shrink-0" />
        )}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="AI Search: flats, residents, complaints..."
          className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }}>
            <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {focused && (query.length >= 2) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          {results.length === 0 && !loading && (
            <p className="px-4 py-3 text-xs text-slate-400">No results found for "{query}"</p>
          )}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r.link)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left border-b border-slate-100 last:border-0 transition-colors"
            >
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide shrink-0 mt-0.5 ${TYPE_COLORS[r.type] ?? "bg-slate-100 text-slate-600"}`}>
                {TYPE_ICONS[r.type]}
                {r.type}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-800">{r.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{r.detail}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
