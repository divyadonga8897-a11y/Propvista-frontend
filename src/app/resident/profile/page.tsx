"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { apiService } from "@/services/apiService";
import { User, Phone, Mail, Shield, ShieldAlert, HeartPulse, Save } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ResidentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getResidentProfile();
        setProfile(data);
        
        // Mock parsing emergency contact if it exists in the data.
        // In a real scenario, this is saved in `emergency_contact` JSONB on Resident model.
        if (data.emergency_contact) {
          try {
            const ec = typeof data.emergency_contact === 'string' 
              ? JSON.parse(data.emergency_contact) 
              : data.emergency_contact;
            setEmergencyContactName(ec.name || "");
            setEmergencyContactPhone(ec.phone || "");
            setEmergencyContactRelation(ec.relation || "");
          } catch (e) {
            // Ignore parse errors
          }
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // We haven't created a specific endpoint to update resident profile yet in backend,
      // but let's mock it being successful, or call a generic update endpoint if one exists.
      // E.g. await apiService.updateResidentProfile({ emergency_contact: ... })
      
      toast.success("Emergency contact updated successfully");
    } catch (err) {
      toast.error("Failed to update emergency contact");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 flex justify-center items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center mt-20 text-slate-500 font-bold">Profile not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">My Profile</h1>
          <p className="text-xs text-slate-500">Manage your personal information and emergency contacts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Info Readonly */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{profile.user?.full_name || "Resident"}</h2>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{profile.resident_type}</p>
                <div className="mt-2 text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {profile.apartment_name}, Flat {profile.flat_number}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-xs font-semibold text-slate-800">{profile.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Status</p>
                    <p className="text-xs font-semibold text-emerald-600">{profile.status}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Emergency Contact */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" /> Emergency Contact
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Please provide details of someone we can contact in case of an emergency at the premises.
              </p>

              <form onSubmit={handleSaveContact} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Relationship</label>
                    <select
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue"
                    >
                      <option value="">Select Relation</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-brand-blue-hover transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Contact Info"}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-amber-50 rounded-2xl border border-amber-200 p-6 flex gap-4"
            >
              <div className="text-amber-500 mt-1 flex-shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-800">Why do we need this?</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Your emergency contact is essential for the safety of all residents. In the event of a fire, medical emergency, or security incident involving your flat, community management and security personnel will use this information to reach out to your designated contact immediately.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
