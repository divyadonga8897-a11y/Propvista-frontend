"use client";

import Sidebar from "@/components/Sidebar";
import { User, Mail, Shield, Camera, Check } from "lucide-react";
import { useState } from "react";
import { usePropVista } from "@/components/Providers";

export default function Profile() {
  const { role, user } = usePropVista();
  const [saved, setSaved] = useState(false);

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Divya Kumar";
  const email = user?.email || "divya@propvista-ai.com";

  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const initials = (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase() || "DV";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 5000);
  };

  return (
    <div className="flex-grow flex bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8 max-w-4xl">
        <h1 className="text-2xl font-black text-brand-dark mb-2">My Profile Settings</h1>
        <p className="text-xs text-brand-gray mb-8">Manage your account information and authentication credentials.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center h-fit">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-blue to-brand-emerald flex items-center justify-center text-3xl font-bold text-white">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-blue text-white shadow hover:bg-brand-blue-hover transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 font-bold text-brand-dark">{fullName}</h3>
            <p className="text-[10px] text-slate-400 capitalize mt-1 font-bold bg-slate-100 rounded px-2 py-0.5">{role} View Mode</p>
          </div>

          {/* Form */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    key={`fn-${firstName}`}
                    defaultValue={firstName}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    key={`ln-${lastName}`}
                    defaultValue={lastName}
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    key={`em-${email}`}
                    defaultValue={email}
                    disabled
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Secure Role</label>
                <div className="relative">
                  <Shield className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={role}
                    disabled
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3.5 text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  Save Profile
                </button>
                {saved && (
                  <span className="text-xs text-brand-emerald font-semibold flex items-center gap-1">
                    <Check className="h-4 w-4" /> Profile saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
