"use client";

import { useState } from "react";
import { Mail, Search, Send, FileText, CheckCircle2, Clock, XCircle, LayoutTemplate } from "lucide-react";

export default function AdminEmails() {
  const [emails, setEmails] = useState([
    { id: "E-1001", subject: "July Rent Invoice", recipient: "Priya Patel", community: "PropVista Heights", status: "Sent", date: "2026-07-01 10:00 AM", type: "Automated" },
    { id: "E-1002", subject: "Maintenance Update: Lift C", recipient: "All Residents", community: "PropVista Heights", status: "Draft", date: "2026-07-08 09:30 AM", type: "Manual" },
    { id: "E-1003", subject: "Welcome to Green Valley!", recipient: "Amit Kumar", community: "Green Valley", status: "Failed", date: "2026-07-07 02:15 PM", type: "Automated" },
  ]);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Compose Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("All Residents");
  const [community, setCommunity] = useState("All Communities");
  const [message, setMessage] = useState("");

  const filteredEmails = emails.filter(e => 
    (e.status === activeTab || activeTab === "All") &&
    (e.subject.toLowerCase().includes(search.toLowerCase()) || 
     e.recipient.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmail = {
      id: "E-" + Math.floor(Math.random() * 9000 + 1000),
      subject,
      recipient,
      community,
      status: "Sent",
      date: new Date().toLocaleString(),
      type: "Manual"
    };
    setEmails([newEmail, ...emails]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubject("");
    setRecipient("All Residents");
    setCommunity("All Communities");
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "Draft": return "text-slate-700 bg-slate-100 border-slate-200";
      case "Failed": return "text-red-700 bg-red-100 border-red-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Email Communications</h1>
          <p className="text-sm text-slate-500 mt-1">Manage automated notices and manual broadcasts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Send className="h-4 w-4" /> Compose Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Mail className="h-5 w-5" />
            <h3 className="font-bold">Total Emails</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{emails.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Successfully Sent</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{emails.filter(e => e.status === 'Sent').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold">Drafts</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{emails.filter(e => e.status === 'Draft').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-bold">Failed Deliveries</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{emails.filter(e => e.status === 'Failed').length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["All", "Sent", "Draft", "Failed"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subject or recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email Details</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Recipient</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Type</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map((email) => (
              <tr key={email.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{email.subject}</p>
                      <p className="text-xs text-slate-500 font-mono">{email.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{email.recipient}</p>
                  <p className="text-xs text-slate-500">{email.community}</p>
                </td>
                <td className="p-4">
                  <div className="text-sm font-semibold text-slate-700">{email.date}</div>
                  <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1">
                    {email.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(email.status)}`}>
                    {email.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Content">
                      <FileText className="h-4 w-4" />
                    </button>
                    {email.status === 'Draft' && (
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Send Now">
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredEmails.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No emails found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Compose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-600" /> New Email Broadcast
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><XCircle className="h-6 w-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <form id="email-form" onSubmit={handleSend} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Community</label>
                    <select 
                      value={community} onChange={(e) => setCommunity(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="All Communities">All Communities</option>
                      <option value="PropVista Heights">PropVista Heights</option>
                      <option value="Green Valley">Green Valley</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Group</label>
                    <select 
                      value={recipient} onChange={(e) => setRecipient(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="All Residents">All Residents</option>
                      <option value="Owners Only">Owners Only</option>
                      <option value="Tenants Only">Tenants Only</option>
                      <option value="Defaulters Only">Rent Defaulters Only</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Subject Line</label>
                    <button type="button" className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                      <LayoutTemplate className="h-3 w-3" /> Use Template
                    </button>
                  </div>
                  <input 
                    type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm font-medium"
                    placeholder="Enter email subject"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Body</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:border-indigo-500">
                    <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex gap-2">
                      <button type="button" className="p-1 text-slate-500 hover:text-slate-800 font-bold text-sm">B</button>
                      <button type="button" className="p-1 text-slate-500 hover:text-slate-800 italic text-sm">I</button>
                      <button type="button" className="p-1 text-slate-500 hover:text-slate-800 underline text-sm">U</button>
                    </div>
                    <textarea 
                      required value={message} onChange={(e) => setMessage(e.target.value)} rows={8}
                      className="w-full px-4 py-3 focus:outline-none resize-none text-sm"
                      placeholder="Write your email content here..."
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50 shrink-0">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                Save Draft
              </button>
              <button type="submit" form="email-form" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                <Send className="h-4 w-4" /> Send Email Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
