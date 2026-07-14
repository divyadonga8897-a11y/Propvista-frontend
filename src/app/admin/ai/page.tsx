"use client";


//import Link from "next/link";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import { Apartment, Floor, Flat, DashboardStats, City } from "@/types/real-estate";
import {
  Building, LayoutGrid, Plus, Trash2, Edit3, Image,
  MapPin, Check, Sparkles, Sliders, DollarSign, Calendar, Eye, Activity, Info,
  CreditCard, BookOpen, Download, FileText, BrainCircuit
} from "lucide-react";
import Footer from "@/components/Footer";
import AdminAiPanel from "@/components/AdminAiPanel";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/reportUtils';

export default function AdminDashboard() {
  // Tab states
  const [activeTab, setActiveTab] = useState<"stats" | "apartments" | "floors" | "flats" | "bookings" | "payments" | "ai" | "site-visits" | "audit-logs">("ai");

  // Booking, Payment, Site Visits & Audit Logs admin data
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [adminPayments, setAdminPayments] = useState<any[]>([]);
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [bkLoading, setBkLoading] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [svLoading, setSvLoading] = useState(false);
  const [alLoading, setAlLoading] = useState(false);

  // Shared entity lists
  const [cities, setCities] = useState<City[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedAptId, setSelectedAptId] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");

  // Create Apartment form states
  const [selectedCityId, setSelectedCityId] = useState("");
  const [aptName, setAptName] = useState("");
  const [aptDesc, setAptDesc] = useState("");
  const [aptAddress, setAptAddress] = useState("");
  const [aptCover, setAptCover] = useState("");
  const [aptFloorsCount, setAptFloorsCount] = useState(5);
  const [aptBuilder, setAptBuilder] = useState("");
  const [aptContact, setAptContact] = useState("");
  const [aptEmail, setAptEmail] = useState("");
  const [aptLat, setAptLat] = useState<number>(15.4775);
  const [aptLng, setAptLng] = useState<number>(78.4835);
  const [aptConstStatus, setAptConstStatus] = useState("Completed");
  const [aptPossStatus, setAptPossStatus] = useState("Ready to Move");
  const [aptAmenities, setAptAmenities] = useState<string[]>([
    "Lift", "Security", "Parking", "Power Backup", "CCTV", "Water Supply", "Garden"
  ]);

  // Floor form states
  const [newFloorNum, setNewFloorNum] = useState(1);
  const [newFloorName, setNewFloorName] = useState("");
  const [newFloorDesc, setNewFloorDesc] = useState("");

  // Flat form states
  const [flatNum, setFlatNum] = useState("");
  const [flatType, setFlatType] = useState("2BHK");
  const [flatArea, setFlatArea] = useState(1200);
  const [flatFacing, setFlatFacing] = useState("East");
  const [flatBedrooms, setFlatBedrooms] = useState(2);
  const [flatBathrooms, setFlatBathrooms] = useState(2);
  const [flatBalconies, setFlatBalconies] = useState(1);
  const [flatParking, setFlatParking] = useState(1);
  const [flatBuyPrice, setFlatBuyPrice] = useState(4500000);
  const [flatRentPrice, setFlatRentPrice] = useState(12000);
  const [flatMaintenance, setFlatMaintenance] = useState(2500);
  const [flatStatus, setFlatStatus] = useState("Available");
  const [flatShortDesc, setFlatShortDesc] = useState("");
  const [flatLongDesc, setFlatLongDesc] = useState("");

  // UI Notification helper
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    loadInitData();
  }, []);

  const loadInitData = async () => {
    try {
      setLoading(true);
      const cData = await apiService.getCities();
      setCities(cData);
      if (cData.length > 0) {
        setSelectedCityId(cData[0].id);
      }

      const aData = await apiService.getApartments();
      setApartments(aData);
      if (aData.length > 0) {
        setSelectedAptId(aData[0].id);
      }

      const statsData = await apiService.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading administrative data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reload stats whenever things modify
  const reloadStats = async () => {
    try {
      const statsData = await apiService.getDashboardStats();
      setStats(statsData);
      const aData = await apiService.getApartments();
      setApartments(aData);
    } catch (err) {
      console.error(err);
    }
  };

  // Load floors whenever selected Apartment changes
  useEffect(() => {
    if (selectedAptId) {
      apiService.getFloorsByApartment(selectedAptId).then((data) => {
        setFloors(data);
        if (data.length > 0) {
          setSelectedFloorId(data[0].id);
        } else {
          setSelectedFloorId("");
        }
      });
    }
  }, [selectedAptId]);

  // Load flats whenever selected Floor changes
  useEffect(() => {
    if (selectedFloorId) {
      apiService.getFlats({ floor_id: selectedFloorId }).then((data) => {
        setFlats(data);
      });
    } else {
      setFlats([]);
    }
  }, [selectedFloorId]);

  const handleCreateApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createApartment({
        city_id: selectedCityId,
        name: aptName,
        description: aptDesc,
        address: aptAddress,
        cover_image: aptCover || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
        status: "Active",
        total_floors: aptFloorsCount,
        owner_name: aptBuilder,
        builder_name: aptBuilder,
        contact_number: aptContact,
        email: aptEmail,
        latitude: aptLat,
        longitude: aptLng,
        construction_status: aptConstStatus,
        possession_status: aptPossStatus,
        amenities: aptAmenities,
        is_active: true,
      });

      setAlertMsg("Apartment Community successfully registered.");
      setAptName("");
      setAptDesc("");
      setAptAddress("");
      setAptCover("");
      setAptBuilder("");
      setAptContact("");
      setAptEmail("");
      reloadStats();
      setTimeout(() => setAlertMsg(""), 5000);
    } catch (err) {
      console.error("Apartment creation error:", err);
    }
  };

  const handleDeleteApartment = async (id: string) => {
    if (confirm("Are you sure you want to delete this apartment community and all its floors & flats?")) {
      try {
        await apiService.deleteApartment(id);
        setApartments(apartments.filter((a) => a.id !== id));
        reloadStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleApartment = async (apt: Apartment) => {
    try {
      if (apt.is_active) {
        await apiService.deactivateApartment(apt.id);
      } else {
        await apiService.activateApartment(apt.id);
      }
      reloadStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptId) return;
    try {
      await apiService.createFloor(selectedAptId, newFloorNum, newFloorName, newFloorDesc);
      setNewFloorName("");
      setNewFloorDesc("");
      // Refresh floor list
      const data = await apiService.getFloorsByApartment(selectedAptId);
      setFloors(data);
      reloadStats();
      setAlertMsg("Floor hierarchy added.");
      setTimeout(() => setAlertMsg(""), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFloor = async (id: string) => {
    if (confirm("Delete this floor and all flats inside it?")) {
      try {
        await apiService.deleteFloor(id);
        setFloors(floors.filter((f) => f.id !== id));
        reloadStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFloorId) return;
    try {
      await apiService.createFlat(selectedFloorId, {
        floor_id: selectedFloorId,
        flat_number: flatNum,
        flat_type: flatType,
        area_sqft: flatArea,
        facing_direction: flatFacing,
        bedrooms: flatBedrooms,
        bathrooms: flatBathrooms,
        balconies: flatBalconies,
        parking_slots: flatParking,
        hall: 1,
        kitchen: 1,
        dining: 0,
        price_buy: flatBuyPrice || null,
        price_rent: flatRentPrice || null,
        maintenance_fee: flatMaintenance,
        status: flatStatus,
        short_description: flatShortDesc,
        long_description: flatLongDesc,
      });

      setFlatNum("");
      setFlatShortDesc("");
      setFlatLongDesc("");

      // Refresh flat lists
      const data = await apiService.getFlats({ floor_id: selectedFloorId });
      setFlats(data);
      reloadStats();
      setAlertMsg("Flat successfully created.");
      setTimeout(() => setAlertMsg(""), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFlat = async (id: string) => {
    if (confirm("Delete this flat from inventory?")) {
      try {
        await apiService.deleteFlat(id);
        setFlats(flats.filter((f) => f.id !== id));
        reloadStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (flatId: string, nextStatus: string) => {
    try {
      await apiService.changeFlatStatus(flatId, nextStatus);
      const data = await apiService.getFlats({ floor_id: selectedFloorId });
      setFlats(data);
      reloadStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="flex-1 p-8 space-y-8 overflow-x-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-dark mb-2">Backoffice Property Console</h1>
            <p className="text-xs text-brand-gray">Create housing hierarchies, track occupancy metrics, and manage community inventory.</p>
          </div>
          {alertMsg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-bounce">
              <Check className="h-4 w-4" /> {alertMsg}
            </div>
          )}
        </div>

        {/* Toolbar Tabs */}
        <div className="flex border-b border-slate-200 gap-6 flex-wrap">
          {(["stats", "apartments", "floors", "flats", "bookings", "payments", "site-visits", "audit-logs", "ai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "bookings" && adminBookings.length === 0) {
                  setBkLoading(true);
                  apiService.getBookingHistory().then(d => { setAdminBookings(d); setBkLoading(false); }).catch(() => setBkLoading(false));
                }
                if (tab === "payments" && adminPayments.length === 0) {
                  setPyLoading(true);
                  apiService.getPaymentHistory().then(d => { setAdminPayments(d); setPyLoading(false); }).catch(() => setPyLoading(false));
                }
                if (tab === "site-visits" && siteVisits.length === 0) {
                  setSvLoading(true);
                  apiService.getSiteVisits().then(d => { setSiteVisits(d); setSvLoading(false); }).catch(() => setSvLoading(false));
                }
                if (tab === "audit-logs" && auditLogs.length === 0) {
                  setAlLoading(true);
                  apiService.getAuditLogs(100).then(d => { setAuditLogs(d); setAlLoading(false); }).catch(() => setAlLoading(false));
                }
              }}
              className={`pb-3 text-xs font-bold capitalize transition-all border-b-2 ${activeTab === tab
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-brand-gray hover:text-brand-dark"
                }`}
            >
              {tab === "stats" ? "Overview Stats"
                : tab === "apartments" ? "Communities"
                  : tab === "floors" ? "Floors"
                    : tab === "flats" ? "Flats Inventory"
                      : tab === "bookings" ? "Bookings"
                        : tab === "payments" ? "Payments"
                          : tab === "site-visits" ? "Site Visits"
                            : tab === "audit-logs" ? "Audit Logs"
                              : <span className="flex items-center gap-1.5"><BrainCircuit className="h-3.5 w-3.5 text-indigo-500" /> AI Analytics</span>}
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        {activeTab === "stats" && stats && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Communities</div>
                <div className="text-2xl font-black text-brand-dark mt-1">{stats.total_apartments}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Floors</div>
                <div className="text-2xl font-black text-brand-dark mt-1">{stats.total_floors}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Available Flats</div>
                <div className="text-2xl font-black text-brand-emerald mt-1">{stats.available_flats}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Occupied Flats (Sold/Rented)</div>
                <div className="text-2xl font-black text-red-500 mt-1">{stats.sold_flats + stats.rented_flats}</div>
              </div>
            </div>

            {/* Availability Chart representation */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Apartment Availability Allocations</h3>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Available', value: stats.available_flats, color: '#10b981' },
                      { name: 'Held', value: stats.held_flats, color: '#f59e0b' },
                      { name: 'Rented', value: stats.rented_flats, color: '#3b82f6' },
                      { name: 'Sold', value: stats.sold_flats, color: '#ef4444' },
                      { name: 'Reserved', value: stats.reserved_flats, color: '#8b5cf6' },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {
                        [
                          { color: '#10b981' },
                          { color: '#f59e0b' },
                          { color: '#3b82f6' },
                          { color: '#ef4444' },
                          { color: '#8b5cf6' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Communities Tab */}
        {activeTab === "apartments" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Create form */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-sm font-bold text-brand-dark border-b border-slate-100 pb-3 mb-6 flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-brand-blue" />
                Initialize New Apartment Community
              </h3>
              <form onSubmit={handleCreateApartment} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Community Name</label>
                    <input
                      type="text"
                      required
                      value={aptName}
                      onChange={(e) => setAptName(e.target.value)}
                      placeholder="e.g. PropVista Heights"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Builder Agency</label>
                    <input
                      type="text"
                      required
                      value={aptBuilder}
                      onChange={(e) => setAptBuilder(e.target.value)}
                      placeholder="e.g. Sri Venkata Raju Constructions"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={aptAddress}
                      onChange={(e) => setAptAddress(e.target.value)}
                      placeholder="Kurnool Road, Nandyal..."
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">City</label>
                    <select
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Floors Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={aptFloorsCount}
                      onChange={(e) => setAptFloorsCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={aptLat}
                      onChange={(e) => setAptLat(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={aptLng}
                      onChange={(e) => setAptLng(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Contact Number</label>
                    <input
                      type="text"
                      value={aptContact}
                      onChange={(e) => setAptContact(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={aptEmail}
                      onChange={(e) => setAptEmail(e.target.value)}
                      placeholder="info@builder.com"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Construction Status</label>
                    <select
                      value={aptConstStatus}
                      onChange={(e) => setAptConstStatus(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      <option>Completed</option>
                      <option>Under Construction</option>
                      <option>Planned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Possession Status</label>
                    <input
                      type="text"
                      value={aptPossStatus}
                      onChange={(e) => setAptPossStatus(e.target.value)}
                      placeholder="e.g. Ready to Move"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Cover Image URL</label>
                    <input
                      type="text"
                      value={aptCover}
                      onChange={(e) => setAptCover(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Community Description</label>
                  <textarea
                    rows={3}
                    required
                    value={aptDesc}
                    onChange={(e) => setAptDesc(e.target.value)}
                    placeholder="Provide overview of structure, sustainability ratings..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Initialize Community
                </button>
              </form>
            </div>

            {/* List of projects */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Communities</h3>
              {apartments.map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-brand-dark flex items-center gap-2">
                      {a.name}
                      <span className={`inline-block h-2 w-2 rounded-full ${a.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">{a.builder_name || "Sri Venkata Raju Constructions"}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{a.total_floors} Floors configured</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleApartment(a)}
                      className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors ${a.is_active
                        ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                    >
                      {a.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteApartment(a.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Gated Community"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floors Tab */}
        {activeTab === "floors" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Left selector and listing */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Apartment Community</label>
                <select
                  value={selectedAptId}
                  onChange={(e) => setSelectedAptId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-white text-slate-800 focus:outline-none"
                >
                  <option value="">-- Choose Community --</option>
                  {apartments.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              {selectedAptId && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configured Floors</h3>
                  {floors.length === 0 ? (
                    <div className="text-center py-10 bg-white border rounded-2xl">
                      <p className="text-xs text-slate-400">No floors added to this community yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {floors.map((fl) => (
                        <div key={fl.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-slate-400">Floor Level {fl.floor_number}</span>
                            <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">{fl.floor_name || `Floor ${fl.floor_number}`}</h4>
                            {fl.description && <p className="text-[9px] text-slate-400 mt-1">{fl.description}</p>}
                          </div>
                          <button
                            onClick={() => handleDeleteFloor(fl.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Floor Side form */}
            {selectedAptId && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Add Floor Hierarchy</h3>
                <form onSubmit={handleAddFloor} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Floor level Number</label>
                    <input
                      type="number"
                      required
                      value={newFloorNum}
                      onChange={(e) => setNewFloorNum(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Floor Display Name (optional)</label>
                    <input
                      type="text"
                      value={newFloorName}
                      onChange={(e) => setNewFloorName(e.target.value)}
                      placeholder="e.g. Ground Floor, Penthouse"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Floor Description</label>
                    <textarea
                      rows={2}
                      value={newFloorDesc}
                      onChange={(e) => setNewFloorDesc(e.target.value)}
                      placeholder="Notes or unit details..."
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-blue hover:bg-brand-blue-hover py-2.5 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Add Floor
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Flats Tab */}
        {activeTab === "flats" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Left selectors & Flat Inventory Listing table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Apartment Community</label>
                  <select
                    value={selectedAptId}
                    onChange={(e) => setSelectedAptId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-white text-slate-800 focus:outline-none"
                  >
                    <option value="">-- Choose Community --</option>
                    {apartments.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Floor Level</label>
                  <select
                    value={selectedFloorId}
                    onChange={(e) => setSelectedFloorId(e.target.value)}
                    disabled={!selectedAptId}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs bg-white text-slate-800 focus:outline-none"
                  >
                    <option value="">-- Choose Floor --</option>
                    {floors.map((f) => (
                      <option key={f.id} value={f.id}>{f.floor_name || `Floor ${f.floor_number}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inventory Table */}
              {selectedFloorId && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
                  <h3 className="text-sm font-bold text-brand-dark mb-4">Flat Inventory status</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3">Flat Number</th>
                          <th className="p-3">BHK Config</th>
                          <th className="p-3">Super Area</th>
                          <th className="p-3">Occupancy Status</th>
                          <th className="p-3 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {flats.map((u) => (
                          <tr key={u.id} className="text-slate-800">
                            <td className="p-3 font-bold">Flat {u.flat_number}</td>
                            <td className="p-3">{u.flat_type}</td>
                            <td className="p-3">{u.area_sqft} sqft</td>
                            <td className="p-3">
                              <select
                                value={u.status}
                                onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                className="rounded border border-slate-200 py-1 px-2 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
                              >
                                <option>Available</option>
                                <option>Held</option>
                                <option>Rented</option>
                                <option>Sold</option>
                                <option>Reserved</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteFlat(u.id)}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Flat creation form */}
            {selectedFloorId && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Create Flat Inventory</h3>
                <form onSubmit={handleAddFlat} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Flat Number</label>
                      <input
                        type="text"
                        required
                        value={flatNum}
                        onChange={(e) => setFlatNum(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Flat Type</label>
                      <select
                        value={flatType}
                        onChange={(e) => setFlatType(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-xs bg-white text-slate-800 focus:outline-none"
                      >
                        <option>1BHK</option>
                        <option>2BHK</option>
                        <option>3BHK</option>
                        <option>4BHK</option>
                        <option>Studio</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Super Area (sqft)</label>
                      <input
                        type="number"
                        required
                        value={flatArea}
                        onChange={(e) => setFlatArea(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Facing Direction</label>
                      <select
                        value={flatFacing}
                        onChange={(e) => setFlatFacing(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-xs bg-white text-slate-800 focus:outline-none"
                      >
                        <option>East</option>
                        <option>West</option>
                        <option>North</option>
                        <option>South</option>
                        <option>North-East</option>
                        <option>North-West</option>
                        <option>South-East</option>
                        <option>South-West</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Buy Price (₹)</label>
                      <input
                        type="number"
                        value={flatBuyPrice}
                        onChange={(e) => setFlatBuyPrice(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Rent Price (₹)</label>
                      <input
                        type="number"
                        value={flatRentPrice}
                        onChange={(e) => setFlatRentPrice(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Monthly Maintenance (₹)</label>
                    <input
                      type="number"
                      required
                      value={flatMaintenance}
                      onChange={(e) => setFlatMaintenance(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={flatShortDesc}
                      onChange={(e) => setFlatShortDesc(e.target.value)}
                      placeholder="e.g. Spacious East facing unit..."
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-blue hover:bg-brand-blue-hover py-2.5 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Create Flat
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Admin Tab ── */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-blue" /> All Bookings
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">{adminBookings.length} total records</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(adminBookings.map(b => ({
                    Customer: b.user?.full_name || b.user?.email || 'N/A',
                    Email: b.user?.email || 'N/A',
                    Flat: b.flat?.flat_number || 'N/A',
                    Community: b.flat?.apartment_name || 'N/A',
                    Type: b.booking_type,
                    Amount: b.amount_paid,
                    Status: b.status,
                    Date: new Date(b.created_at).toLocaleDateString()
                  })), 'Bookings_Report')}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> CSV
                </button>
                <button
                  onClick={() => exportToExcel(adminBookings.map(b => ({
                    Customer: b.user?.full_name || b.user?.email || 'N/A',
                    Email: b.user?.email || 'N/A',
                    Flat: b.flat?.flat_number || 'N/A',
                    Community: b.flat?.apartment_name || 'N/A',
                    Type: b.booking_type,
                    Amount: b.amount_paid,
                    Status: b.status,
                    Date: new Date(b.created_at).toLocaleDateString()
                  })), 'Bookings_Report')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" /> Excel
                </button>
                <button
                  onClick={() => exportToPDF(
                    adminBookings.map(b => ({
                      customer: b.user?.full_name || b.user?.email || 'N/A',
                      flat: b.flat?.flat_number || 'N/A',
                      type: b.booking_type,
                      amount: b.amount_paid,
                      status: b.status,
                      date: new Date(b.created_at).toLocaleDateString()
                    })),
                    [
                      { header: 'Customer', dataKey: 'customer' },
                      { header: 'Flat', dataKey: 'flat' },
                      { header: 'Type', dataKey: 'type' },
                      { header: 'Amount', dataKey: 'amount' },
                      { header: 'Status', dataKey: 'status' },
                      { header: 'Date', dataKey: 'date' }
                    ],
                    'Bookings_Report',
                    'PropVista AI - Bookings Report'
                  )}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> PDF
                </button>
              </div>
            </div>

            {bkLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-200 rounded-xl" />)}
              </div>
            ) : adminBookings.length === 0 ? (
              <div className="text-center py-16 bg-white border rounded-2xl">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400">No bookings found yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Flat / Community</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Booked On</th>
                        <th className="p-4">Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminBookings.map((b: any) => (
                        <tr key={b.id} className="text-slate-800 hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="font-extrabold">{b.user?.full_name || b.user?.email || "N/A"}</div>
                            <div className="text-[10px] text-slate-400">{b.user?.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold">Flat {b.flat?.flat_number || "N/A"}</div>
                            <div className="text-[10px] text-slate-400">{b.flat?.apartment_name || "—"}</div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${b.booking_type === "BUY" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}>
                              {b.booking_type}
                            </span>
                          </td>
                          <td className="p-4 font-bold">₹{(b.amount_paid || 0).toLocaleString("en-IN")}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${b.status === "Sold" || b.status === "Rented"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : b.status === "Held"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            {b.documents && b.documents.length > 0 ? (
                              <div className="space-y-1">
                                {b.documents.map((doc: any) => (
                                  <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline">
                                    <Download className="h-3 w-3" /> {doc.doc_type}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Payments Admin Tab ── */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-blue" /> Payment Ledger
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">{adminPayments.length} transactions</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(adminPayments.map(p => ({
                    OrderID: p.razorpay_order_id || 'sandbox',
                    PaymentID: p.razorpay_payment_id || '-',
                    Type: p.payment_type,
                    Amount: p.amount,
                    Status: p.status,
                    Date: new Date(p.payment_date || p.created_at).toLocaleDateString()
                  })), 'Payments_Report')}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> CSV
                </button>
                <button
                  onClick={() => exportToExcel(adminPayments.map(p => ({
                    OrderID: p.razorpay_order_id || 'sandbox',
                    PaymentID: p.razorpay_payment_id || '-',
                    Type: p.payment_type,
                    Amount: p.amount,
                    Status: p.status,
                    Date: new Date(p.payment_date || p.created_at).toLocaleDateString()
                  })), 'Payments_Report')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" /> Excel
                </button>
                <button
                  onClick={() => exportToPDF(
                    adminPayments.map(p => ({
                      orderId: p.razorpay_order_id || 'sandbox',
                      type: p.payment_type,
                      amount: p.amount,
                      status: p.status,
                      date: new Date(p.payment_date || p.created_at).toLocaleDateString()
                    })),
                    [
                      { header: 'Order ID', dataKey: 'orderId' },
                      { header: 'Type', dataKey: 'type' },
                      { header: 'Amount', dataKey: 'amount' },
                      { header: 'Status', dataKey: 'status' },
                      { header: 'Date', dataKey: 'date' }
                    ],
                    'Payments_Report',
                    'PropVista AI - Payments Report'
                  )}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> PDF
                </button>
              </div>
            </div>

            {pyLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-200 rounded-xl" />)}
              </div>
            ) : adminPayments.length === 0 ? (
              <div className="text-center py-16 bg-white border rounded-2xl">
                <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400">No payment transactions recorded yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-4">Razorpay Order ID</th>
                        <th className="p-4">Payment ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminPayments.map((p: any) => (
                        <tr key={p.id} className="text-slate-800 hover:bg-slate-50/50">
                          <td className="p-4">
                            <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                              {p.razorpay_order_id || "sandbox"}
                            </code>
                          </td>
                          <td className="p-4">
                            <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                              {p.razorpay_payment_id || "—"}
                            </code>
                          </td>
                          <td className="p-4 font-semibold text-slate-600">{p.payment_type}</td>
                          <td className="p-4 font-extrabold text-slate-900">₹{(p.amount || 0).toLocaleString("en-IN")}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.status === "Successful"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.status === "Failed"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{new Date(p.payment_date || p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Site Visits Admin Tab ── */}
        {activeTab === "site-visits" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-blue" /> Site Visits
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">{siteVisits.length} total</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(siteVisits.map(sv => ({
                    Visitor: sv.visitor_name,
                    Phone: sv.visitor_phone,
                    Apartment: sv.apartment?.name || 'N/A',
                    Date: new Date(sv.visit_date).toLocaleString(),
                    Status: sv.status
                  })), 'Site_Visits')}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> CSV
                </button>
              </div>
            </div>

            {svLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-200 rounded-xl" />)}
              </div>
            ) : siteVisits.length === 0 ? (
              <div className="text-center py-16 bg-white border rounded-2xl">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400">No site visits scheduled.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-4">Visitor Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Community</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {siteVisits.map((sv: any) => (
                        <tr key={sv.id} className="text-slate-800 hover:bg-slate-50/50">
                          <td className="p-4 font-bold">{sv.visitor_name}</td>
                          <td className="p-4">{sv.visitor_phone}</td>
                          <td className="p-4 font-medium">{sv.apartment?.name || "N/A"}</td>
                          <td className="p-4 text-slate-500">{new Date(sv.visit_date).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sv.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : sv.status === "Cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                              {sv.status}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {sv.status === "Scheduled" && (
                              <>
                                <button
                                  onClick={async () => {
                                    await apiService.updateSiteVisitStatus(sv.id, "Completed");


                                    await apiService.createNotification({
                                      user_id: sv.user_id,
                                      title: "Site Visit Completed",
                                      message: "Your site visit has been completed"
                                    });

                                    setSiteVisits(
                                      siteVisits.map(s =>
                                        s.id === sv.id ? { ...s, status: "Completed" } : s
                                      )
                                    );
                                  }}
                                  className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100"
                                >
                                  Mark Done
                                </button>

                                <button
                                  onClick={async () => {
                                    await apiService.updateSiteVisitStatus(sv.id, "Cancelled");
                                    setSiteVisits(siteVisits.map(s => s.id === sv.id ? { ...s, status: "Cancelled" } : s));
                                  }}
                                  className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded hover:bg-rose-100"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Audit Logs Admin Tab ── */}
        {activeTab === "audit-logs" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-blue" /> System Audit Logs
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">{auditLogs.length} recent events</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(auditLogs.map(al => ({
                    User: al.user_email || 'System',
                    Action: al.action,
                    Resource: al.resource_type,
                    ResourceId: al.resource_id,
                    IP: al.ip_address || 'N/A',
                    Date: new Date(al.created_at).toLocaleString()
                  })), 'Audit_Logs')}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3" /> CSV
                </button>
              </div>
            </div>

            {alLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-200 rounded-xl" />)}
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-16 bg-white border rounded-2xl">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400">No audit logs available.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Action</th>
                        <th className="p-4">Resource</th>
                        <th className="p-4">User</th>
                        <th className="p-4">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map((al: any) => (
                        <tr key={al.id} className="text-slate-800 hover:bg-slate-50/50">
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {new Date(al.created_at).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-700">{al.action}</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                              {al.resource_type}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-600">{al.user_email || "System"}</td>
                          <td className="p-4 text-slate-400 font-mono text-[10px]">{al.ip_address || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Analytics Tab */}
        {activeTab === "ai" && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: "600px" }}>
            <AdminAiPanel />
          </div>
        )}

      </main>
    </div>
  );
}
