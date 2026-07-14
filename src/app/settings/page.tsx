"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { usePropVista } from "@/components/Providers";
import { Check } from "lucide-react";

export default function Settings() {
  const { role } = usePropVista();
  const [success, setSuccess] = useState(false);

  return (
    <div className="flex-grow flex bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8 max-w-3xl">
        <h1 className="text-2xl font-black text-brand-dark mb-2">Workspace Settings</h1>
        <p className="text-xs text-brand-gray mb-8">Configure system preferences and notification logs.</p>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-bold text-brand-dark">Email Notices</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Receive monthly billing and booking receipts automatically.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand-blue" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-bold text-brand-dark">Society Alerts</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Receive immediate notifications regarding rules violations, fire drills, and power outages.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand-blue" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-bold text-brand-dark">AI Recommendations</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Enable OpenAI suggestion engine to match units based on your browsing logs.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand-blue" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-brand-dark">Developer Sandbox Mode</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Allows switching between roles in the header and viewing all dashboard pages.</p>
            </div>
            <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-350 text-brand-emerald cursor-not-allowed" />
          </div>

          <button
            onClick={() => {
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
            }}
            className="mt-4 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
          >
            Save Settings
          </button>
          {success && (
            <span className="text-xs text-brand-emerald font-semibold flex items-center gap-1">
              <Check className="h-4 w-4" /> Preferences updated!
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
