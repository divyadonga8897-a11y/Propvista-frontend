"use client";

import { useState } from "react";
import { Car, Search, Plus, Edit, Trash2, Hash, User, MapPin } from "lucide-react";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([
    { id: "V-6001", type: "Car", model: "Honda City", plate: "TS 07 EA 1234", resident: "Rahul Sharma", flat: "A-101", apartment: "PropVista Heights", status: "Verified" },
    { id: "V-6002", type: "Bike", model: "Royal Enfield", plate: "TS 08 BQ 9988", resident: "Priya Patel", flat: "B-205", apartment: "PropVista Heights", status: "Verified" },
    { id: "V-6003", type: "Car", model: "Hyundai Creta", plate: "AP 39 CD 5678", resident: "Amit Kumar", flat: "C-304", apartment: "Green Valley", status: "Pending" },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  
  // Form State
  const [type, setType] = useState("Car");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [resident, setResident] = useState("");
  const [flat, setFlat] = useState("");
  const [apartment, setApartment] = useState("");
  const [status, setStatus] = useState("Verified");

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(search.toLowerCase()) || 
    v.resident.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.flat.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, type, model, plate, resident, flat, apartment, status } : v));
    } else {
      const newVehicle = {
        id: "V-" + Math.floor(Math.random() * 9000 + 1000),
        type,
        model,
        plate,
        resident,
        flat,
        apartment,
        status
      };
      setVehicles([newVehicle, ...vehicles]);
    }
    closeModal();
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setType(vehicle.type);
    setModel(vehicle.model);
    setPlate(vehicle.plate);
    setResident(vehicle.resident);
    setFlat(vehicle.flat);
    setApartment(vehicle.apartment);
    setStatus(vehicle.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this vehicle record?")) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setType("Car");
    setModel("");
    setPlate("");
    setResident("");
    setFlat("");
    setApartment("");
    setStatus("Verified");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Vehicle Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Manage resident vehicles and parking allocations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Register Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Car className="h-5 w-5" />
            <h3 className="font-bold">Total Vehicles</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{vehicles.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <Hash className="h-5 w-5" />
            <h3 className="font-bold">Registered Cars</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{vehicles.filter(v => v.type === 'Car').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Hash className="h-5 w-5" />
            <h3 className="font-bold">Registered Bikes</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{vehicles.filter(v => v.type === 'Bike').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <User className="h-5 w-5" />
            <h3 className="font-bold">Pending Verification</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{vehicles.filter(v => v.status === 'Pending').length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by plate, owner, or flat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Vehicle Details</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Owner / Flat</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 font-mono tracking-wider">{vehicle.plate}</p>
                      <p className="text-xs text-slate-500">{vehicle.model}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{vehicle.resident}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {vehicle.flat}, {vehicle.apartment}
                  </p>
                </td>
                <td className="p-4">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-md">
                    {vehicle.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vehicle.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(vehicle)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No vehicles found.</td>
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
              <h2 className="text-lg font-bold text-slate-900">{editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">License Plate Number</label>
                  <input 
                    type="text" required value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. TS 07 EA 1234"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select 
                    value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike / Two-Wheeler</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Make & Model</label>
                  <input 
                    type="text" required value={model} onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Honda City"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                  <input 
                    type="text" required value={resident} onChange={(e) => setResident(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apartment Community</label>
                  <input 
                    type="text" required value={apartment} onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
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
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
