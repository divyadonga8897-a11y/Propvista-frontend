"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { BrainCircuit, Wand2, Loader2, Send, FileText, CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  "Water shutdown notice",
  "Lift maintenance notice",
  "Security alert",
  "Community event invitation",
  "Parking regulation update",
  "Festival greeting",
  "Maintenance reminder",
  "Rent reminder",
  "Emergency notification",
  "Complaint resolution message",
];

interface Generated {
  title: string;
  content: string;
  announcement_type: string;
}

export default function AiGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [posting, setPosting] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGenerated(null);
    try {
      const res = await apiService.aiGenerateAnnouncement(topic);
      setGenerated(res);
      toast.success("AI generated your announcement!");
    } catch {
      toast.error("AI generation failed. Please check Groq API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!generated) return;
    setPosting(true);
    try {
      await apiService.createAnnouncement({
        title: generated.title,
        content: generated.content,
        announcement_type: generated.announcement_type,
      });
      toast.success("Announcement posted to all residents!");
      setGenerated(null);
      setTopic("");
    } catch {
      toast.error("Failed to post announcement.");
    } finally {
      setPosting(false);
    }
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(`${generated.title}\n\n${generated.content}`);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">AI Notice Generator</h1>
            <p className="text-xs text-slate-500 mt-1">
              Describe any notice topic and let Groq AI write a professional community announcement for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-indigo-500" /> Describe Your Notice
            </h2>

            {/* Quick templates */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Templates</p>
              <div className="flex flex-wrap gap-2">
                {DOCUMENT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-xl border transition-all font-medium ${
                      topic === t
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom topic */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Or write a custom prompt</p>
              <textarea
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Water supply will be shut off on Sunday for tank cleaning. Ask residents to store water in advance."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating with Groq AI...</>
              ) : (
                <><Wand2 className="h-4 w-4" /> Generate Announcement</>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" /> Generated Notice
            </h2>

            {!generated && !loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-4 bg-slate-100 rounded-2xl">
                  <BrainCircuit className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400">Your AI-generated announcement will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Groq LLaMA 3.3 is writing your notice...</p>
              </div>
            )}

            {generated && (
              <div className="space-y-4 animate-fade-in">
                {/* Type badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                    generated.announcement_type === "Emergency" ? "bg-red-50 text-red-700 border-red-200"
                    : generated.announcement_type === "Maintenance" ? "bg-amber-50 text-amber-700 border-amber-200"
                    : generated.announcement_type === "Event" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {generated.announcement_type}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                    <CheckCircle className="h-3 w-3" /> AI Generated
                  </span>
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title</p>
                  <p className="text-sm font-bold text-slate-800">{generated.title}</p>
                </div>

                {/* Body */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Content</p>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{generated.content}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[10px] border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={posting}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[10px] bg-emerald-600 text-white rounded-xl px-4 py-2 font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Post to Community
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
