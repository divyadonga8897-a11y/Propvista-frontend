"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Hammer, BellRing, ClipboardList, HelpCircle, Loader2, AlertTriangle, FileText } from "lucide-react";
import Footer from "@/components/Footer";

export default function ResidentDashboard() {
  const [tickets, setTickets] = useState([
    { id: "tk-1", title: "Balcony ceiling leakage", priority: "High", status: "Pending Allocation", date: "2026-06-30" },
    { id: "tk-2", title: "Smart meter calibration", priority: "Medium", status: "Resolved", date: "2026-06-25" }
  ]);

  const [ticketTitle, setTicketTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);

  // Payment modal state
  const [payModal, setPayModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTk = {
      id: `tk-${tickets.length + 1}`,
      title: ticketTitle,
      priority,
      status: "Pending Allocation",
      date: new Date().toISOString().split("T")[0]
    };
    setTickets([newTk, ...tickets]);
    setTicketTitle("");
    setDesc("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 3000);
  };

  const getPriorityColor = (p: string) => {
    return p === "High" ? "text-red-500 bg-red-50 border-red-200" : "text-amber-500 bg-amber-50 border-amber-200";
  };

  return (
    <div className="flex-grow flex bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8 space-y-10">
        <h1 className="text-2xl font-black text-brand-dark mb-2">Resident Portal</h1>
        <p className="text-xs text-brand-gray mb-8 font-semibold">Welcome home! Manage your apartment dues, notices, and repair requests.</p>

        {/* Dues & Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Outstanding Invoice Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Maintenance Bill Due</div>
              <div className="text-2xl font-black text-slate-800 mt-2">
                {paid ? "₹0.00" : "₹3,500.00"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Due Date: July 05, 2026</p>
            </div>
            {!paid ? (
              <button
                onClick={() => setPayModal(true)}
                className="mt-6 w-full rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white text-xs font-bold py-2 shadow-sm transition-all"
              >
                Pay Bill
              </button>
            ) : (
              <div className="mt-6 text-center text-xs font-bold text-brand-emerald bg-emerald-50 py-2 rounded">
                Invoice Paid ✓
              </div>
            )}
          </div>

          {/* Bulletin Notice Board */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <BellRing className="h-4.5 w-4.5 text-brand-blue" />
              Notices & Bulletins
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 border-l-2 border-brand-blue pl-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Lift Maintenance Schedule</h4>
                  <p className="text-[10px] text-brand-gray leading-relaxed mt-0.5">
                    Towers A and B elevator shaft servicing will take place on July 02 from 10:00 AM to 02:00 PM.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-l-2 border-brand-emerald pl-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Water Storage Tank Cleaning</h4>
                  <p className="text-[10px] text-brand-gray leading-relaxed mt-0.5">
                    Recurrent annual cleaning of roof reservoirs scheduled for July 06. Water supply may fluctuate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Ticket Creation & Registry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <Hammer className="h-4.5 w-4.5 text-brand-emerald" />
              Create Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-blue"
                  placeholder="e.g. Broken corridor light or plumber required"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Severity</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-850"
                  >
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Apartment Unit</label>
                  <input
                    type="text"
                    disabled
                    value="A-201"
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Context Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  placeholder="Provide plumbing details or electrical details..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-blue hover:bg-brand-blue-hover py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Log Ticket
              </button>
              {success && (
                <div className="text-[11px] text-brand-emerald font-semibold text-center">Ticket created successfully!</div>
              )}
            </form>
          </div>

          {/* Ticket Listing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <ClipboardList className="h-4.5 w-4.5 text-brand-blue" />
              Ticket Logs
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[300px]">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-150 p-4 flex items-center justify-between gap-4 bg-slate-50/20">
                  <div>
                    <h4 className="text-xs font-bold text-brand-dark">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Logged on: {t.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${t.status === "Resolved" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Pay Bill Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-fade-in text-center">
            {paying ? (
              <div className="py-8 space-y-4">
                <Loader2 className="mx-auto h-12 w-12 text-brand-emerald animate-spin" />
                <h3 className="text-sm font-bold text-brand-dark font-sans">Clearing outstanding invoice...</h3>
                <p className="text-[10px] text-slate-400">Razorpay gateway payment in progress.</p>
              </div>
            ) : paid ? (
              <div className="py-8 space-y-4">
                <h3 className="text-sm font-bold text-brand-dark">Payment Confirmed</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The invoice of **₹3,500** for maintenance services has been paid. Status synced.
                </p>
                <button
                  onClick={() => setPayModal(false)}
                  className="mt-6 rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2 text-xs font-bold text-white transition-colors"
                >
                  Close Panel
                </button>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <AlertTriangle className="mx-auto h-10 w-10 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-800">Clear Maintenance Fee</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Proceed to payment portal for invoice **₹3,500** (Unit A-201, PropVista Heights).
                </p>
                <div className="flex gap-3 justify-center pt-4">
                  <button
                    onClick={() => setPayModal(false)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-brand-gray hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    className="rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white text-xs font-bold px-4 py-2"
                  >
                    Authorize Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
