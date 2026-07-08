"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import type { Vehicle } from "@/types";
import { Car, Bike, PlusCircle, CheckCircle, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [color, setColor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadVehicles() {
    try {
      setLoading(true);
      const res = await apiService.getVehicles();
      setVehicles(res);
    } catch (err: any) {
      console.error("Vehicles load error", err);
      setError("Failed to fetch vehicles list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiService.registerVehicle({
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber,
        vehicle_make: vehicleMake || undefined,
        vehicle_model: vehicleModel || undefined,
        color: color || undefined
      });
      toast.success("Vehicle registered successfully!");
      setVehicleNumber("");
      setVehicleMake("");
      setVehicleModel("");
      setColor("");
      loadVehicles();
    } catch (err) {
      toast.error("Failed to register vehicle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle registration?")) return;
    try {
      await apiService.deleteVehicle(id);
      toast.success("Vehicle registration removed.");
      loadVehicles();
    } catch (err) {
      toast.error("Failed to remove vehicle.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Vehicle Management</h1>
            <p className="text-xs text-slate-500 mt-1">Register household cars/bikes, view assigned parking slots, and update parking details.</p>
          </div>
          <button onClick={loadVehicles} className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5">
              <PlusCircle className="h-4.5 w-4.5 text-blue-500" /> Register Vehicle
            </h3>
            <form onSubmit={handleRegisterVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-slate-50 text-slate-850 focus:outline-none"
                >
                  <option>Car</option>
                  <option>Bike</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Plate Number</label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. AP-02-AB-1234"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Manufacturer</label>
                  <input
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    placeholder="e.g. Honda"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Model</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    placeholder="e.g. Civic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                  placeholder="e.g. Metallic Black"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 text-xs shadow-md transition-all"
              >
                {submitting ? "Registering..." : "Submit Registration"}
              </button>
            </form>
          </div>

          {/* Vehicles List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Car className="h-4.5 w-4.5 text-slate-700" />
              Registered Fleet ({vehicles.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-350 border-t-blue-600"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
                No vehicles registered to this profile yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                        {v.vehicle_type === "Car" ? <Car className="h-6 w-6" /> : <Bike className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{v.vehicle_number}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {v.color} {v.vehicle_make} {v.vehicle_model}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Parking Slot</span>
                        <span className="inline-block rounded bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 text-xs border border-emerald-100 mt-1">
                          {v.parking_slot || "Allocating..."}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete vehicle registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
