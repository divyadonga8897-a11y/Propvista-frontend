"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePropVista } from "@/components/Providers";
import { Loader2 } from "lucide-react";
import AiChatWidget from "@/components/AiChatWidget";

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const { role, authLoading } = usePropVista();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && role !== "Resident" && role !== "Admin") {
      router.replace("/dashboard");
    }
  }, [role, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (role !== "Resident" && role !== "Admin") {
    return null; // Let the redirect happen
  }

  return (
    <>
      {children}
      <AiChatWidget role="resident" />
    </>
  );
}
