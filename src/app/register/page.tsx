"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Loader2,
  ArrowRight,
  AlertCircle,
  Building2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [profilePhoto, setProfilePhoto] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    let imageUrl: string | null = null;

    if (profilePhoto) {
      const fileName = `${Date.now()}-${profilePhoto.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-images")
          .upload(fileName, profilePhoto);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }
    }

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: "customer",
            profile_photo: imageUrl,
          },
        },
      });

    if (error) {
      setLoading(false);

      setError(error.message);

      toast.error(error.message);

      return;
    }

    toast.success(
      "Customer account created successfully."
    );

    setLoading(false);

    if (data.session) {
      router.replace("/customer");
      router.refresh();
      return;
    }

    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_70%)]" />

      <div className="relative w-full max-w-lg">

        <div className="mb-8 text-center">

          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-2xl font-black text-white">
                PropVista AI
              </h1>

              <p className="text-sm text-slate-400">
                Smart Apartment Management Platform
              </p>
            </div>
          </Link>

        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur">

          <div className="mb-8 text-center">

            <h2 className="text-3xl font-bold text-white">
              Create Customer Account
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Register to browse apartment communities,
              reserve flats, make bookings and become a resident.
            </p>

          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="space-y-6"
          ><div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mobile Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Profile Photo (Optional)
              </label>

              <div className="relative">
                <Camera className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePhoto(
                      e.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>




          <div className="mt-8 border-t border-slate-800 pt-6 text-center">

            <p className="text-sm text-slate-400">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-3 inline-flex items-center justify-center rounded-xl border border-blue-500 px-5 py-3 font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
            >
              Sign In
            </Link>


          </div>

          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

            <h3 className="mb-3 text-center text-sm font-semibold text-emerald-400">
              What happens after registration?
            </h3>

            <div className="space-y-3 text-sm text-slate-300">

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                <p>Your account is created as a <strong>Customer</strong>.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                <p>Browse apartment communities across Nandyal.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                <p>Reserve or book your preferred flat.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                <p>After payment and admin approval, your account is upgraded to <strong>Resident</strong>.</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
                <p>You will then receive access to the Resident Hub and all community services.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>

  );
}
