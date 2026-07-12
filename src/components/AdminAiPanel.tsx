"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, Sparkles, BarChart3, RefreshCw, MessageSquare, TrendingUp, Shield } from "lucide-react";
import apiService from "@/services/apiService";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ADMIN_QUICK_PROMPTS = [
  "Total apartments and flats",
  "Available flats count",
  "Revenue this month",
  "Top complaint categories",
  "Maintenance pending",
  "Occupancy rate",
  "Residents with overdue rent",
  "Most booked apartment",
];

export default function AdminAiPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Admin! 📊 I'm your **PropVista Admin AI**, powered by Groq's LLaMA 3.3.\n\nI have access to your platform's live database metrics — total apartments, flats, occupancy rates, complaint statistics, maintenance dues, revenue summaries, and more.\n\nWhat analytics report would you like?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await apiService.aiAdminChat(history);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Could not connect to the AI service. Ensure Groq API key is configured.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
            <BrainCircuit className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Admin AI Analytics</p>
            <p className="text-[9px] text-indigo-300 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Live Data Assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: "assistant", content: "Chat cleared! Ready for new queries.", timestamp: new Date() }])}
          className="p-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white/10 text-slate-200 rounded-bl-none border border-white/10"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-xs max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="h-3.5 w-3.5 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-white animate-spin" />
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {ADMIN_QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-[10px] bg-indigo-900/60 hover:bg-indigo-700/60 text-indigo-300 hover:text-white border border-indigo-800/50 px-2.5 py-1.5 rounded-xl transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask for reports, statistics, occupancy, revenue..."
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white disabled:opacity-40 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
