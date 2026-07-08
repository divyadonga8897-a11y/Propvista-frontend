"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { Share2, Gift, CheckCircle2, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { usePropVista } from "@/components/Providers";

export default function ReferAFriend() {
  const { user } = usePropVista();
  const [formData, setFormData] = useState({
    referee_name: "",
    referee_email: "",
    referee_phone: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const referralCode = `PV-${user?.id?.substring(0,6).toUpperCase() || 'RESIDENT'}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createReferral(formData);
      toast.success("Referral submitted successfully! Thank you.");
      setFormData({ referee_name: "", referee_email: "", referee_phone: "", notes: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit referral.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border border-white/20">
                  Rewards Program
                </span>
                <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-3">Refer a Friend, Earn Rewards</h1>
                <p className="text-indigo-100 max-w-md leading-relaxed text-sm">
                  Love living here? Invite your friends and family to join PropVista communities. Earn 1 month of free maintenance for every successful booking!
                </p>
              </div>
              <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                <p className="text-xs text-indigo-100 uppercase tracking-widest font-bold mb-2">Your Referral Code</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-black tracking-widest">{referralCode}</span>
                  <button onClick={copyCode} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Copy Code">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* How it works */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">How it Works</h2>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-800">Submit Details</h4>
                    <p className="text-sm text-slate-500 mt-1">Enter your friend's contact details in the form.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-800">We Reach Out</h4>
                    <p className="text-sm text-slate-500 mt-1">Our sales team will contact them with exclusive offers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-800">You Get Rewarded</h4>
                    <p className="text-sm text-slate-500 mt-1">Once they complete a booking, you receive a free maintenance credit.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Share2 className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">Referral Form</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Friend's Name</label>
                  <input
                    required
                    name="referee_name"
                    value={formData.referee_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Friend's Email</label>
                  <input
                    required
                    type="email"
                    name="referee_email"
                    value={formData.referee_email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Friend's Phone</label>
                  <input
                    required
                    name="referee_phone"
                    value={formData.referee_phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                    placeholder="Looking for a 3BHK..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/20 mt-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                  Submit Referral
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
