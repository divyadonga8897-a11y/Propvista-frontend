"use client";

import { useState } from "react";
import { Bell, Search, Plus, Trash2, CheckCircle2, Clock, Send, Smartphone, Mail, AlertTriangle } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    { id: "N-7001", title: "Rent Due Reminder", message: "Your rent for July 2026 is due on July 5th.", channel: "Push + Email", target: "All Tenants", status: "Delivered", sentDate: "2026-07-01", readRate: "78%" },
    { id: "N-7002", title: "Elevator Maintenance", message: "Elevator B will be under maintenance on July 12.", channel: "Push", target: "PropVista Heights", status: "Scheduled", sentDate: "2026-07-10", readRate: "—" },
    { id: "N-7003", title: "New Parking Rules", message: "Updated parking rules are now in effect. Please review.", channel: "Email", target: "All Residents", status: "Delivered", sentDate: "2026-06-28", readRate: "62%" },
    { id: "N-7004", title: "Water Supply Disruption", message: "Water supply disrupted from 2 PM - 5 PM today.", channel: "Push + SMS", target: "Green Valley", status: "Failed", sentDate: "2026-07-07", readRate: "0%" },
  ]);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("Push");
  const [target, setTarget] = useState("All Residents");

  const filteredNotifications = notifications.filter(n =>
    (n.status === activeTab || activeTab === "All") &&
    (n.title.toLowerCase().includes(search.toLowerCase()) ||
     n.target.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotification = {
      id: "N-" + Math.floor(Math.random() * 9000 + 1000),
      title,
      message,
      channel,
      target,
      status: "Delivered",
      sentDate: new Date().toISOString().split("T")[0],
      readRate: "0%",
    };
    setNotifications([newNotification, ...notifications]);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this notification record?")) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setMessage("");
    setChannel("Push");
    setTarget("All Residents");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "text-emerald-700 bg-emerald-100";
      case "Scheduled": return "text-blue-700 bg-blue-100";
      case "Failed": return "text-red-700 bg-red-100";
      default: return "text-slate-700 bg-slate-100";
    }
  };

  const getChannelIcon = (ch: string) => {
    if (ch.includes("Push")) return <Smartphone className="h-3.5 w-3.5" />;
    if (ch.includes("Email")) return <Mail className="h-3.5 w-3.5" />;
    return <Bell className="h-3.5 w-3.5" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Notification Center</h1>
          <p className="text-sm text-slate-500 mt-1">Send and track push notifications, emails, and SMS alerts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Send className="h-4 w-4" /> Send Notification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Bell className="h-5 w-5" />
            <h3 className="font-bold">Total Sent</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{notifications.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Delivered</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{notifications.filter(n => n.status === "Delivered").length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold">Scheduled</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{notifications.filter(n => n.status === "Scheduled").length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-bold">Failed</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{notifications.filter(n => n.status === "Failed").length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["All", "Delivered", "Scheduled", "Failed"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Notification</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Audience & Channel</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status & Read Rate</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((notif) => (
              <tr key={notif.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 max-w-xs truncate">{notif.message}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{notif.target}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    {getChannelIcon(notif.channel)}
                    <span>{notif.channel}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-700">{notif.sentDate}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(notif.status)}`}>
                    {notif.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Read: {notif.readRate}</p>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(notif.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredNotifications.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Send Notification</h2>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Water Supply Update"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  required value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={target} onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All Residents">All Residents</option>
                    <option value="All Tenants">All Tenants</option>
                    <option value="PropVista Heights">PropVista Heights</option>
                    <option value="Green Valley">Green Valley</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Channel</label>
                  <select
                    value={channel} onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Push">Push Notification</option>
                    <option value="Email">Email</option>
                    <option value="Push + Email">Push + Email</option>
                    <option value="Push + SMS">Push + SMS</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
