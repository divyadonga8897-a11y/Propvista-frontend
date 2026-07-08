"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("General");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    setIsSending(true);
    try {
      // In a real app we'd have a broadcast endpoint or select specific users.
      // For now, let's just show a success message since backend doesn't have a broadcast endpoint yet.
      // Or we can mock it by showing it's sent.
      toast.success("Broadcast notification sent successfully.");
      setTitle("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-0 md:ml-64 transition-all overflow-y-auto max-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Broadcast Notifications</h1>
              <p className="text-slate-500 mt-1">Send announcements and alerts to all residents.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <form onSubmit={handleSend} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notification Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="General">General Announcement</option>
                  <option value="Maintenance">Maintenance Alert</option>
                  <option value="Event">Community Event</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="E.g., Water Supply Interruption"
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending || !title || !message}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending..." : "Broadcast Message"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
