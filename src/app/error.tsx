"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Render Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50 min-h-[400px]">
      <div className="space-y-6 text-center max-w-sm">
        <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Application Error Encountered</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
            An unexpected scripting mismatch or API payload timeout occurred during page layout hydration.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 text-xs font-bold text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Page Hydration
        </button>
      </div>
    </div>
  );
}
