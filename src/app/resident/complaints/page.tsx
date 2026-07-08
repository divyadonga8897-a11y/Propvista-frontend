"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { Complaint } from "@/types";
import { MessageSquare, Calendar, ChevronRight, PlusCircle, AlertCircle, RefreshCw, BrainCircuit, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState("Plumbing");
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // AI classifier states
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  async function loadComplaints() {
    try {
      setLoading(true);
      const res = await apiService.getComplaintsHistory();
      setComplaints(res);
    } catch (err: any) {
      console.error("Complaints load error", err);
      setError("Failed to fetch support tickets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.createComplaint({
        category,
        priority,
        title,
        description
      });
      toast.success("Support ticket logged successfully!");
      setTitle("");
      setDescription("");
      setAiInput("");
      setAiSuggested(false);
      loadComplaints();
    } catch (err) {
      toast.error("Failed to create support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiClassify = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const res = await apiService.aiAnalyzeComplaint(aiInput);
      setCategory(res.category);
      setPriority(res.priority);
      setTitle(res.title);
      setDescription(res.summary);
      setAiSuggested(true);
      toast.success("AI has filled in the complaint form!");
    } catch {
      toast.error("AI classifier unavailable. Please fill the form manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High":
        return "bg-red-55 border-red-150 text-red-750";
      case "Low":
        return "bg-slate-100 border-slate-150 text-slate-700";
      default:
        return "bg-amber-50 border-amber-150 text-amber-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-700 border border-emerald-250";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-orange-100 text-orange-700 border border-orange-200";
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Support & Complaints</h1>
            <p className="text-xs text-slate-500 mt-1">Submit maintenance service tickets and track resolution status.</p>
          </div>
          <button onClick={loadComplaints} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Complaint Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-500" /> Log Support Ticket
            </h3>

            {/* AI Section */}
            <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="text-[10px] font-bold text-indigo-700 flex items-center gap-1.5 mb-2">
                <BrainCircuit className="h-3.5 w-3.5" /> AI Smart Fill (Groq · LLaMA 3.3)
              </p>
              <p className="text-[9px] text-indigo-500 mb-3">Describe the issue in plain English and the AI will auto-classify it.</p>
              <div className="flex gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiClassify()}
                  className="flex-1 rounded-lg border border-indigo-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Bathroom tap is leaking badly..."
                />
                <button
                  type="button"
                  onClick={handleAiClassify}
                  disabled={aiLoading || !aiInput.trim()}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                >
                  {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                  Auto-fill
                </button>
              </div>
              {aiSuggested && (
                <p className="text-[9px] text-emerald-600 mt-2 flex items-center gap-1">
                  ✓ AI has filled the form below — review and submit when ready.
                </p>
              )}
            </div>
            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-850 focus:outline-none"
                >
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Security</option>
                  <option>Lift</option>
                  <option>Cleaning</option>
                  <option>Parking</option>
                  <option>Water Supply</option>
                  <option>Internet</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Severity</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-850 focus:outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  placeholder="Summarize the issue..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  placeholder="Provide plumbing details or electrical details..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 text-xs shadow-md transition-all"
              >
                {submitting ? "Logging..." : "Create Support Ticket"}
              </button>
            </form>
          </div>

          {/* Ticket Listing */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-slate-700" />
              Ticket History ({complaints.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-indigo-600"></div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                You haven't logged any support tickets yet.
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{c.category}</span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1">{c.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                      {c.description}
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Logged on: {c.created_at?.split("T")[0]}
                      </span>
                      {c.assigned_to && (
                        <span>Assigned to: <strong className="text-slate-600">{c.assigned_to}</strong></span>
                      )}
                    </div>

                    {c.resolution_note && (
                      <div className="bg-emerald-50/30 border border-emerald-100 text-emerald-800 text-[11px] p-3 rounded-xl">
                        <strong>Resolution Note:</strong> {c.resolution_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
