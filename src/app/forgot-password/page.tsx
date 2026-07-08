"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
          <p className="mt-2 text-xs text-slate-400">
            We will send you a secure link to reset your password.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-brand-blue" />
              <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check your inbox at **{email}** for instructions to configure a new password.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-brand-blue hover:bg-brand-blue-hover py-3 text-xs font-bold text-white transition-all shadow-md"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
