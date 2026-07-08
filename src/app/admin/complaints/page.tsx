"use client";

import { useState } from "react";
import { MessageSquare, Search, Filter, Clock, CheckCircle2, AlertTriangle, UserCog } from "lucide-react";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([
    { id: "C-2001", title: "Loud noise from upper floor", description: "Continuous loud music and thumping sounds after 11 PM.", resident: "Priya Patel", flat: "B-205", apartment: "PropVista Heights", category: "Noise", status: "Open", createdDate: "2026-07-07", assignedTo: "" },
    { id: "C-2002", title: "Garbage not collected", description: "Trash was left in the corridor for the last two days.", resident: "Rahul Sharma", flat: "A-101", apartment: "PropVista Heights", category: "Cleanliness", status: "In Progress", createdDate: "2026-07-06", assignedTo: "Housekeeping Team" },
    { id: "C-2003", title: "Parking spot occupied", description: "An unknown vehicle is parked in my designated spot.", resident: "Amit Kumar", flat: "C-304", apartment: "Green Valley", category: "Parking", status: "Resolved", createdDate: "2026-07-02", assignedTo: "Security Desk" },
  ]);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Resolution Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  const filteredComplaints = complaints.filter(c => 
    (c.status === activeTab || activeTab === "All") &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || 
     c.resident.toLowerCase().includes(search.toLowerCase()) ||
     c.flat.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenModal = (comp: any) => {
    setSelectedComplaint(comp);
    setAssignedTo(comp.assignedTo);
    setStatusUpdate(comp.status);
    setIsModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      setComplaints(complaints.map(c => c.id === selectedComplaint.id ? { 
        ...c, 
        assignedTo, 
        status: statusUpdate !== "Open" && statusUpdate !== "Resolved" && assignedTo ? "In Progress" : statusUpdate 
      } : c));
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "text-orange-700 bg-orange-100 border-orange-200";
      case "In Progress": return "text-blue-700 bg-blue-100 border-blue-200";
      case "Resolved": return "text-emerald-700 bg-emerald-100 border-emerald-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resident Complaints</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and resolve community issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-bold">Total Complaints</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{complaints.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-bold">Open Issues</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{complaints.filter(c => c.status === 'Open').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-bold">In Progress</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{complaints.filter(c => c.status === 'In Progress').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Resolved</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{complaints.filter(c => c.status === 'Resolved').length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["All", "Open", "In Progress", "Resolved"].map(tab => (
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
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredComplaints.map((comp) => (
            <div key={comp.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-400">#{comp.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    {comp.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(comp.status)}`}>
                    {comp.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{comp.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{comp.description}</p>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> {comp.resident} ({comp.flat}, {comp.apartment})</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Logged on {comp.createdDate}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px]">
                <div className="text-sm">
                  <span className="text-slate-500 block mb-1 text-xs font-bold uppercase tracking-widest">Assigned To</span>
                  {comp.assignedTo ? (
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                        {comp.assignedTo.charAt(0)}
                      </div>
                      {comp.assignedTo}
                    </div>
                  ) : (
                    <span className="text-orange-600 font-medium italic text-xs">Unassigned</span>
                  )}
                </div>
                
                {comp.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleOpenModal(comp)}
                    className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <UserCog className="h-3.5 w-3.5" /> Update Issue
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {filteredComplaints.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No complaints found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Update Issue #{selectedComplaint.id}</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Responsible Party</label>
                <select 
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Assignee --</option>
                  <option value="Security Desk">Security Desk</option>
                  <option value="Housekeeping Team">Housekeeping Team</option>
                  <option value="Estate Manager">Estate Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Status</label>
                <select 
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
