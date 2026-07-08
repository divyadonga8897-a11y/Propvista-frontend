import Footer from "@/components/Footer";
import { Building, ShieldCheck, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center">
          About <span className="bg-gradient-to-r from-brand-blue to-brand-emerald bg-clip-text text-transparent">PropVista AI</span>
        </h1>
        <p className="mt-4 text-sm text-slate-500 text-center max-w-xl mx-auto leading-relaxed">
          Pioneering smart infrastructure workflows for real estate bookings and modern housing society logistics.
        </p>

        <div className="mt-16 space-y-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-blue-50 text-brand-blue rounded-xl shrink-0">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Advanced Project Hierarchy</h2>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                We empower builders and real estate managers to model projects recursively (Projects, Blocks, Floors, and Units) with granular metadata. This structural tree allows seamless lookup and real-time synchronization of property lifecycles.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-emerald-50 text-brand-emerald rounded-xl shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Unified Society Portal</h2>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Rather than treating sale as the final step, PropVista bridges the gap between customer purchasing and resident living. Residents gain automatic access to billing statements, maintenance ticket tracking, and official society noticeboards.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI-Powered Unit Logistics</h2>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Our backend embeds OpenAI API modules to evaluate floor-plan layouts, provide structural suggestions to engineers, suggest price bounds based on location metrics, and recommend properties contextually to searchers.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
