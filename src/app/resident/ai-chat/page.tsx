"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { BrainCircuit, Send, Sparkles, RefreshCw, Zap, Shield, MessageSquare } from "lucide-react";
import apiService from "@/services/apiService";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "My maintenance due",
  "Rent status",
  "Community rules",
  "My complaints",
  "Latest announcements",
  "Facilities I can book",
  "My registered vehicles",
  "Visitor rules",
];

export default function ResidentAiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your **PropVista Resident AI Assistant**, powered by Groq's LLaMA 3.3.\n\nI have access to your real-time community data — maintenance dues, rent records, complaints, visitors, vehicles, announcements, and community rules.\n\nHow can I help you today?",
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
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await apiService.aiResidentChat(history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ I couldn't reach the AI service right now. Please make sure the backend is running and the Groq API key is configured in your `.env` file.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! I'm ready to help. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white">Resident AI Assistant</h1>
              <p className="text-[10px] text-indigo-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                Powered by Groq · LLaMA 3.3-70B · Live Database
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 border border-white/10">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-300 font-semibold">Secure · Private</span>
            </div>
            <button
              onClick={resetChat}
              className="p-2 bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
              title="Clear Chat"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Capability badges */}
        <div className="bg-slate-900/90 border-b border-white/5 px-6 py-2 flex gap-2 flex-wrap">
          {["Maintenance", "Rent", "Complaints", "Visitors", "Facilities", "Announcements", "Documents"].map((cap) => (
            <span
              key={cap}
              className="text-[9px] bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
            >
              <Zap className="h-2.5 w-2.5" /> {cap}
            </span>
          ))}
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5"
          style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-900/50"
                    : "bg-white/10 text-slate-200 rounded-bl-sm border border-white/10 backdrop-blur-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
                <p className="text-[9px] mt-1.5 opacity-50">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="h-4 w-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles className="h-4 w-4 text-white animate-spin" />
              </div>
              <div className="bg-white/10 rounded-2xl rounded-bl-sm px-5 py-3.5 border border-white/10 flex items-center gap-2">
                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="text-[10px] text-slate-400 ml-1">Querying database & AI...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div
            className="px-6 py-3 border-t border-white/5 flex flex-wrap gap-2"
            style={{ background: "linear-gradient(0deg, #0f172a 0%, #1e1b4b 100%)" }}
          >
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-[10px] bg-indigo-900/60 hover:bg-indigo-700/70 text-indigo-300 hover:text-white border border-indigo-800/50 px-3 py-1.5 rounded-xl transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="px-4 md:px-8 py-4 border-t border-white/10"
          style={{ background: "#0f172a" }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-3 items-center"
          >
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask about your maintenance dues, rent, complaints, community rules..."
                className="w-full bg-white/10 border border-white/15 rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-900/50 hover:opacity-90 disabled:opacity-40 transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="text-[9px] text-slate-600 text-center mt-2">
            AI responses are based on your live database records. No personal data is shared with third parties.
          </p>
        </div>
      </main>
    </div>
  );
}
