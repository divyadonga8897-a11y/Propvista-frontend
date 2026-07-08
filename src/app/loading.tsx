import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50 min-h-[400px]">
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-10 w-10 text-brand-blue animate-spin" />
        <h3 className="text-xs font-bold text-brand-dark uppercase tracking-widest">Populating Layout...</h3>
        <p className="text-[10px] text-slate-400">Loading details from database. Please wait.</p>
      </div>
    </div>
  );
}
