"use client";

import { useState } from "react";
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Home, CheckCircle2, XCircle } from "lucide-react";

export default function AdminResidents() {
  const [residents, setResidents] = useState([
    { id: "1", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", apartment: "PropVista Heights", flat: "A-101", status: "Active", joinDate: "2023-10-15" },
    { id: "2", name: "Priya Patel", email: "priya@example.com", phone: "+91 9876543211", apartment: "PropVista Heights", flat: "B-205", status: "Active", joinDate: "2023-11-02" },
    { id: "3", name: "Amit Kumar", email: "amit@example.com", phone: "+91 9876543212", apartment: "Green Valley", flat: "C-304", status: "Inactive", joinDate: "2024-01-20" },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [apartment, setApartment] = useState("");
  const [flat, setFlat] = useState("");
  const [status, setStatus] = useState("Active");

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.apartment.toLowerCase().includes(search.toLowerCase()) ||
    r.flat.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResident) {
      setResidents(residents.map(r => r.id === editingResident.id ? { ...r, name, email, phone, apartment, flat, status } : r));
    } else {
      const newResident = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone,
        apartment,
        flat,
        status,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setResidents([...residents, newResident]);
    }
    closeModal();
  };

  const handleEdit = (resident: any) => {
    setEditingResident(resident);
    setName(resident.name);
    setEmail(resident.email);
    setPhone(resident.phone);
    setApartment(resident.apartment);
    setFlat(resident.flat);
    setStatus(resident.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this resident?")) {
      setResidents(residents.filter(r => r.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResident(null);
    setName("");
    setEmail("");
    setPhone("");
    setApartment("");
    setFlat("");
    setStatus("Active");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resident Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered residents across your communities</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Resident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Users className="h-5 w-5" />
            <h3 className="font-bold">Total Residents</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{residents.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Active Residents</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{residents.filter(r => r.status === 'Active').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-bold">Inactive Profiles</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{residents.filter(r => r.status === 'Inactive').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-600">
            <Home className="h-5 w-5" />
            <h3 className="font-bold">Allocated Flats</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{new Set(residents.map(r => r.flat)).size}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, flat, or apartment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resident Info</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Allocation</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">
                      {resident.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{resident.name}</p>
                      <p className="text-xs text-slate-500">Joined {resident.joinDate}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400" /> {resident.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" /> {resident.phone}</div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{resident.flat}</p>
                  <p className="text-xs text-slate-500">{resident.apartment}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resident.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {resident.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(resident)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(resident.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredResidents.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No residents found matching your search.</td>
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
              <h2 className="text-lg font-bold text-slate-900">{editingResident ? 'Edit Resident Profile' : 'Add New Resident'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apartment Community</label>
                  <input 
                    type="text" required value={apartment} onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flat Number</label>
                  <input 
                    type="text" required value={flat} onChange={(e) => setFlat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
