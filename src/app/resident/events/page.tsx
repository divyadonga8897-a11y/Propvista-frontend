"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { CalendarDays, Loader2, MapPin, Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function CommunityEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await apiService.getCommunityEvents();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRSVP = async (eventId: string, status: string) => {
    try {
      await apiService.rsvpEvent(eventId, { status });
      toast.success(`RSVP ${status} successfully recorded.`);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to record RSVP.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center shadow-sm">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Community Events</h1>
              <p className="text-sm text-slate-500">Upcoming gatherings and celebrations</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <CalendarDays className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Upcoming Events</h3>
              <p className="text-sm text-slate-500">There are no community events scheduled at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                  <div className="relative h-48 bg-slate-200">
                    <img 
                      src={event.cover_image || "/placeholder.jpg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-center shadow-md">
                      <p className="text-xs font-bold text-red-500 uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</p>
                      <p className="text-xl font-black text-slate-900 leading-none">{new Date(event.event_date).getDate()}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{event.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users className="h-4 w-4" />
                        Organizer: {event.organizer}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => handleRSVP(event.id, 'Attending')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Attend
                      </button>
                      <button 
                        onClick={() => handleRSVP(event.id, 'Not Attending')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                      >
                        <XCircle className="h-4 w-4" /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
