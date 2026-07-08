"use client";

import { useState } from "react";
import { Building2, Search, Plus, Edit, Trash2, MapPin, Map, Home, Activity } from "lucide-react";

export default function AdminCities() {
  const [cities, setCities] = useState([
    { id: "1", name: "Nandyal", state: "Andhra Pradesh", status: "Active", apartmentsCount: 12, propertiesCount: 450 },
    { id: "2", name: "Kurnool", state: "Andhra Pradesh", status: "Active", apartmentsCount: 8, propertiesCount: 320 },
    { id: "3", name: "Hyderabad", state: "Telangana", status: "Inactive", apartmentsCount: 0, propertiesCount: 0 },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
  
  // Form State
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [status, setStatus] = useState("Active");

  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCity) {
      setCities(cities.map(c => c.id === editingCity.id ? { ...c, name: cityName, state: stateName, status } : c));
    } else {
      const newCity = {
        id: Math.random().toString(36).substr(2, 9),
        name: cityName,
        state: stateName,
        status,
        apartmentsCount: 0,
        propertiesCount: 0
      };
      setCities([...cities, newCity]);
    }
    closeModal();
  };

  const handleEdit = (city: any) => {
    setEditingCity(city);
    setCityName(city.name);
    setStateName(city.state);
    setStatus(city.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this city?")) {
      setCities(cities.filter(c => c.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCity(null);
    setCityName("");
    setStateName("");
    setStatus("Active");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">City Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage operational cities and their statuses</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Add City
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Map className="h-5 w-5" />
            <h3 className="font-bold">Total Cities</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{cities.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <Activity className="h-5 w-5" />
            <h3 className="font-bold">Active Cities</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{cities.filter(c => c.status === 'Active').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-600">
            <Building2 className="h-5 w-5" />
            <h3 className="font-bold">Communities</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{cities.reduce((acc, c) => acc + c.apartmentsCount, 0)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-violet-600">
            <Home className="h-5 w-5" />
            <h3 className="font-bold">Properties Managed</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{cities.reduce((acc, c) => acc + c.propertiesCount, 0)}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">City Info</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Communities</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Properties</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city) => (
              <tr key={city.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{city.name}</p>
                      <p className="text-xs text-slate-500">{city.state}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${city.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {city.status}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-700">{city.apartmentsCount}</td>
                <td className="p-4 font-semibold text-slate-700">{city.propertiesCount}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(city)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(city.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCities.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No cities found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{editingCity ? 'Edit City' : 'Add New City'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City Name</label>
                <input 
                  type="text" 
                  required 
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                <input 
                  type="text" 
                  required 
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
