"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { Phone, Loader2, Ambulance, ShieldAlert, Zap, Flame, Building2 } from "lucide-react";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getEmergencyContacts();
        setContacts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Medical': return <Ambulance className="h-6 w-6" />;
      case 'Security': return <ShieldAlert className="h-6 w-6" />;
      case 'Fire': return <Flame className="h-6 w-6" />;
      case 'Maintenance': return <Zap className="h-6 w-6" />;
      default: return <Building2 className="h-6 w-6" />;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'Medical': return 'bg-red-50 text-red-600 border-red-200';
      case 'Security': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Fire': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Maintenance': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Emergency Contacts</h1>
              <p className="text-sm text-slate-500">Quick access to important community services</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <Phone className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Contacts Found</h3>
              <p className="text-sm text-slate-500">Emergency contacts will appear here once added by administration.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact) => (
                <div key={contact.id} className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between ${getColor(contact.category)}`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
                        {getIcon(contact.category)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm opacity-80">
                        {contact.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{contact.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{contact.description}</p>
                  </div>
                  <a 
                    href={`tel:${contact.phone_number}`}
                    className="mt-6 flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 text-slate-900 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors border border-slate-100"
                  >
                    <Phone className="h-4 w-4" /> {contact.phone_number}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
