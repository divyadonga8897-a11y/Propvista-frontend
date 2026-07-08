"use client";

import { useState } from "react";
import { Megaphone, Search, Plus, Calendar, Eye, Edit, Trash2, Bell } from "lucide-react";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    { id: "A-5001", title: "Scheduled Power Outage", message: "There will be a scheduled power outage on July 10th from 10 AM to 2 PM for maintenance.", target: "PropVista Heights", date: "2026-07-08", status: "Active" },
    { id: "A-5002", title: "New Gym Equipment Installed", message: "We have installed new treadmills and weights in the community gym. Enjoy!", target: "All Communities", date: "2026-07-05", status: "Active" },
    { id: "A-5003", title: "Annual General Meeting", message: "The AGM will be held on June 30th in the clubhouse.", target: "Green Valley", date: "2026-06-15", status: "Expired" },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Communities");
  const [status, setStatus] = useState("Active");

  const filteredAnns = announcements.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.message.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      setAnnouncements(announcements.map(a => a.id === editingAnn.id ? { ...a, title, message, target, status } : a));
    } else {
      const newAnn = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        target,
        status,
        date: new Date().toISOString().split('T')[0]
      };
      setAnnouncements([newAnn, ...announcements]);
    }
    closeModal();
  };

  const handleEdit = (ann: any) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setMessage(ann.message);
    setTarget(ann.target);
    setStatus(ann.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnn(null);
    setTitle("");
    setMessage("");
    setTarget("All Communities");
    setStatus("Active");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500 mt-1">Broadcast important messages to residents</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Megaphone className="h-5 w-5" />
            <h3 className="font-bold">Total Announcements</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{announcements.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <Bell className="h-5 w-5" />
            <h3 className="font-bold">Active Broadcasts</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{announcements.filter(a => a.status === 'Active').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Eye className="h-5 w-5" />
            <h3 className="font-bold">Reach (Est. Residents)</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">4,520</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredAnns.map((ann) => (
            <div key={ann.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${ann.status === 'Active' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ann.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {ann.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 max-w-3xl leading-relaxed">{ann.message}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Published {ann.date}</span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded text-slate-600">Target: {ann.target}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(ann)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAnns.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">No announcements found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{editingAnn ? 'Edit Announcement' : 'Create Broadcast'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Subject</label>
                <input 
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                <textarea 
                  required value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
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
                    <option value="All Communities">All Communities</option>
                    <option value="PropVista Heights">PropVista Heights</option>
                    <option value="Green Valley">Green Valley</option>
                    <option value="Staff Only">Staff Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  <Megaphone className="h-4 w-4" /> Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
