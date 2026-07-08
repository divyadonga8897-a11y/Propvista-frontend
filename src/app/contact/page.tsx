"use client";

import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center">
          Contact Our <span className="bg-gradient-to-r from-brand-blue to-brand-emerald bg-clip-text text-transparent">Support Team</span>
        </h1>
        <p className="mt-4 text-sm text-slate-500 text-center max-w-xl mx-auto leading-relaxed">
          Need help with apartment bookings, payment reconciliations, or society logs? Send us a message!
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info cards */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Email Us</h3>
                <p className="mt-1 text-xs text-brand-gray font-medium">support@propvista-ai.com</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-emerald shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Call Us</h3>
                <p className="mt-1 text-xs text-brand-gray font-medium">+1 (555) 389-2918</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Headquarters</h3>
                <p className="mt-1 text-xs text-brand-gray font-medium">Tech Corridor, Outer Ring Road, Bangalore</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-brand-emerald">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">Message Sent!</h3>
                <p className="mt-2 text-xs text-slate-500">Thank you. A PropVista support agent will email you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Divya Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. divya@propvista.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                    placeholder="e.g. Query regarding maintenance bills or unit A-202 hold status"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                    placeholder="Type details of your request here..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
