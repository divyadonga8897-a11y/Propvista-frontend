"use client";

import { useState } from "react";
import { Settings, Save, Building2, Bell, Shield, Palette, Globe, Database, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  // General Settings
  const [companyName, setCompanyName] = useState("PropVista AI");
  const [supportEmail, setSupportEmail] = useState("support@propvista.ai");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");

  // Notification Settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [rentReminder, setRentReminder] = useState(3);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  // Security Settings
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [passwordPolicy, setPasswordPolicy] = useState("Strong");

  // Appearance
  const [theme, setTheme] = useState("Light");
  const [accentColor, setAccentColor] = useState("Indigo");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure platform behavior, notifications, and security</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4" /> All settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" /> General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone</label>
                <input
                  type="text" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                <select
                  value={timezone} onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                <select
                  value={currency} onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" /> Notification Preferences
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                <p className="text-xs text-slate-500">Send transactional emails to residents</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors">
                  <div className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${emailNotifs ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                <p className="text-xs text-slate-500">In-app and mobile push alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors">
                  <div className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${pushNotifs ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">SMS Notifications</p>
                <p className="text-xs text-slate-500">Text message alerts (additional charges apply)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors">
                  <div className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${smsNotifs ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rent Reminder (Days Before Due)</label>
              <input
                type="number" min={1} max={15} value={rentReminder} onChange={(e) => setRentReminder(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" /> Security & Access
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Require OTP for admin logins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors">
                  <div className={`absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFactor ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Timeout (Minutes)</label>
              <select
                value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password Policy</label>
              <select
                value={passwordPolicy} onChange={(e) => setPasswordPolicy(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="Basic">Basic (8+ characters)</option>
                <option value="Moderate">Moderate (8+ chars, mixed case)</option>
                <option value="Strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Palette className="h-5 w-5 text-violet-500" /> Appearance & Branding
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Theme</label>
              <div className="flex gap-3">
                {["Light", "Dark", "System"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${theme === t
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Accent Color</label>
              <div className="flex gap-3">
                {[
                  { name: "Indigo", color: "bg-indigo-500" },
                  { name: "Blue", color: "bg-blue-500" },
                  { name: "Emerald", color: "bg-emerald-500" },
                  { name: "Violet", color: "bg-violet-500" },
                  { name: "Rose", color: "bg-rose-500" },
                ].map(c => (
                  <button
                    key={c.name}
                    onClick={() => setAccentColor(c.name)}
                    className={`h-10 w-10 rounded-xl ${c.color} transition-all ${accentColor === c.name
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "hover:scale-105"
                      }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Database Status</p>
                  <p className="text-xs text-emerald-600 font-semibold">Connected • Supabase Cloud</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
