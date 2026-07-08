"use client";

import { useState } from "react";
import { Dumbbell, Search, Plus, Edit, Trash2, Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([
    { id: "F-101", name: "Community Gym", apartment: "PropVista Heights", capacity: 25, timing: "06:00 AM - 10:00 PM", status: "Open", requiresBooking: true },
    { id: "F-102", name: "Swimming Pool", apartment: "PropVista Heights", capacity: 40, timing: "07:00 AM - 08:00 PM", status: "Under Maintenance", requiresBooking: false },
    { id: "F-103", name: "Clubhouse Hall", apartment: "Green Valley", capacity: 150, timing: "09:00 AM - 11:00 PM", status: "Open", requiresBooking: true },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [timing, setTiming] = useState("");
  const [status, setStatus] = useState("Open");
  const [requiresBooking, setRequiresBooking] = useState(false);

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.apartment.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacility) {
      setFacilities(facilities.map(f => f.id === editingFacility.id ? { ...f, name, apartment, capacity, timing, status, requiresBooking } : f));
    } else {
      const newFacility = {
        id: "F-" + Math.floor(Math.random() * 900 + 100),
        name,
        apartment,
        capacity,
        timing,
        status,
        requiresBooking
      };
      setFacilities([newFacility, ...facilities]);
    }
    closeModal();
  };

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setName(facility.name);
    setApartment(facility.apartment);
    setCapacity(facility.capacity);
    setTiming(facility.timing);
    setStatus(facility.status);
    setRequiresBooking(facility.requiresBooking);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this facility?")) {
      setFacilities(facilities.filter(f => f.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFacility(null);
    setName("");
    setApartment("");
    setCapacity(10);
    setTiming("");
    setStatus("Open");
    setRequiresBooking(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Amenities & Facilities</h1>
          <p className="text-sm text-slate-500 mt-1">Manage community spaces and booking rules</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Dumbbell className="h-5 w-5" />
            <h3 className="font-bold">Total Facilities</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{facilities.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Operational</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{facilities.filter(f => f.status === 'Open').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Calendar className="h-5 w-5" />
            <h3 className="font-bold">Bookable Amenities</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{facilities.filter(f => f.requiresBooking).length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Facility</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Community</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rules</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.map((facility) => (
              <tr key={facility.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{facility.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{facility.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {facility.apartment}</p>
                </td>
                <td className="p-4">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Max {facility.capacity} pax</div>
                    <div className="flex items-center gap-1.5 font-medium">{facility.timing}</div>
                    {facility.requiresBooking ? (
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold mt-1">Requires Booking</span>
                    ) : (
                      <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1">Walk-in</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${facility.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : facility.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {facility.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(facility)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(facility.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFacilities.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No facilities found.</td>
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
              <h2 className="text-lg font-bold text-slate-900">{editingFacility ? 'Edit Facility Details' : 'Add New Facility'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facility Name</label>
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Clubhouse Hall A"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apartment Community</label>
                  <input 
                    type="text" required value={apartment} onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity (Persons)</label>
                  <input 
                    type="number" required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours</label>
                  <input 
                    type="text" required value={timing} onChange={(e) => setTiming(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 06:00 AM - 10:00 PM"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={requiresBooking} 
                      onChange={(e) => setRequiresBooking(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">Requires Booking in Advance</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
