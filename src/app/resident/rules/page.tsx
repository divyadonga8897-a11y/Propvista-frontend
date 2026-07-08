"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { apiService } from "@/services/apiService";
import type { CommunityRule } from "@/types";
import { ShieldCheck, BookOpen, ListChecks } from "lucide-react";

export default function ResidentRulesPage() {
  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getCommunityRules()
      .then(setRules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-grow flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8 space-y-8 max-w-6xl mx-auto w-full">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Community Rules</p>
          <h1 className="text-3xl font-black text-slate-900">Resident Guidelines</h1>
          <p className="text-sm text-slate-500 max-w-2xl">Review your apartment society rules and community policies to stay compliant and respectful.</p>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold">Important Rules</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">These rules apply to your apartment community and all residents of the complex.</p>

          {loading ? (
            <div className="mt-6 space-y-4">
              <div className="h-12 rounded-3xl bg-slate-100" />
              <div className="h-12 rounded-3xl bg-slate-100" />
            </div>
          ) : rules.length === 0 ? (
            <div className="mt-6 text-sm text-slate-500">No community rules have been published yet.</div>
          ) : (
            <div className="mt-6 space-y-4">
              {rules.map((rule) => (
                <article key={rule.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{rule.title}</h3>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{rule.category}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${rule.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{rule.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900">
            <ListChecks className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold">Community Conduct</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Following these rules helps maintain harmony, security, and shared responsibility across the society.</p>
        </section>

        <Footer />
      </main>
    </div>
  );
}
