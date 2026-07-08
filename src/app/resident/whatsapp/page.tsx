"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { MessageCircle, Loader2, ExternalLink, ShieldCheck } from "lucide-react";

export default function WhatsAppGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiService.getCommunityWhatsApp();
        setGroups(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">WhatsApp Groups</h1>
              <p className="text-sm text-slate-500">Join official community groups</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3 mb-6">
            <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-800 leading-relaxed">
              <strong>Official Groups Only.</strong> These groups are moderated by the management committee. Please adhere to the community guidelines when participating. Spam or inappropriate behavior may result in removal.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <MessageCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Groups Found</h3>
              <p className="text-sm text-slate-500">No official WhatsApp groups have been set up yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{group.group_name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{group.description}</p>
                  </div>
                  <a 
                    href={group.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" /> Join Group
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
