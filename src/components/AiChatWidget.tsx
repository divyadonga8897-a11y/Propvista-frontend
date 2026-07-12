"use client";

import { useState, useRef, useEffect } from "react";
import { BrainCircuit, X, Send, Sparkles, Minimize2, Maximize2, ChevronDown } from "lucide-react";
import apiService from "@/services/apiService";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const QUICK_SUGGESTIONS: Record<string, string[]> = {
  customer: ["Show available flats", "Show 2BHK east-facing flats", "Show flats under ₹45 lakh", "Best apartment community"],
  resident: ["My maintenance due", "Rent status", "Community rules", "My complaints", "Latest announcements"],
  admin: ["Total flats sold", "Revenue report", "Complaint statistics", "Occupancy rate"],
};

interface AiChatWidgetProps {
  role?: "customer" | "resident" | "admin";
}

export default function AiChatWidget({ role = "customer" }: AiChatWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        role === "resident"
          ? "Hi! I'm your PropVista Resident AI. I can check your maintenance dues, rent status, complaints, community rules, announcements, and more. What would you like to know?"
          : role === "admin"
            ? "Hello Admin! I can pull real-time analytics — total flats, revenue, complaint categories, occupancy rates, and more. What report do you need?"
            : "Welcome to PropVista AI! 🏠 I can help you discover apartments, find available flats by budget, type, or facing direction. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");

    const userMsg: Message = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      let res;
      if (role === "resident") {
        res = await apiService.aiResidentChat(history);
      } else if (role === "admin") {
        res = await apiService.aiAdminChat(history);
      } else {
        res = await apiService.aiChat(history);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I couldn't reach the AI service right now. Please ensure the backend is running and the Groq API key is configured.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = QUICK_SUGGESTIONS[role] ?? QUICK_SUGGESTIONS.customer;

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-2xl shadow-2xl hover:shadow-indigo-400/50 hover:scale-105 transition-all duration-300 animate-bounce-subtle"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-bold hidden sm:block">PropVista AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className={`fixed z-50 right-4 bottom-4 shadow-2xl rounded-3xl flex flex-col border border-slate-200/60 overflow-hidden transition-all duration-300 ${expanded ? "w-[600px] h-[80vh]" : "w-[370px] h-[540px]"
            }`}
          style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">PropVista-AI</p>
                <p className="text-[9px] text-indigo-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="h-6 w-6 rounded-lg bg-indigo-600/80 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white/10 text-slate-200 rounded-bl-none border border-white/10 backdrop-blur-sm"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-invert prose-xs max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-indigo-600/80 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-white animate-spin" />
                </div>
                <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 border border-white/10 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] bg-white/10 hover:bg-indigo-600/60 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/10 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2 items-center"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about flats, amenities, dues..."
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white/15 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl hover:opacity-90 disabled:opacity-40 transition-all shadow-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
