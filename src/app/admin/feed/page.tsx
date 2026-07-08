"use client";

import { useState } from "react";
import { Search, Heart, MessageCircle, AlertOctagon, Trash2, Shield, EyeOff, CheckCircle2 } from "lucide-react";

export default function AdminFeed() {
  const [posts, setPosts] = useState([
    { id: "P-8001", author: "Rahul Sharma", flat: "A-101", apartment: "PropVista Heights", content: "Does anyone have a good contact for a reliable plumber?", likes: 4, comments: 2, date: "2 Hours ago", status: "Active" },
    { id: "P-8002", author: "Priya Patel", flat: "B-205", apartment: "PropVista Heights", content: "Found a set of keys near the clubhouse. Left them with the security desk.", likes: 12, comments: 1, date: "4 Hours ago", status: "Active" },
    { id: "P-8003", author: "Unknown User", flat: "C-304", apartment: "Green Valley", content: "Spam message containing inappropriate links.", likes: 0, comments: 0, date: "1 Day ago", status: "Flagged" },
  ]);
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredPosts = posts.filter(p => 
    (p.status === activeTab || activeTab === "All") &&
    (p.content.toLowerCase().includes(search.toLowerCase()) || 
     p.author.toLowerCase().includes(search.toLowerCase()))
  );

  const handleHide = (id: string) => {
    if (confirm("Hide this post from the community feed?")) {
      setPosts(posts.map(p => p.id === id ? { ...p, status: "Hidden" } : p));
    }
  };

  const handleApprove = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: "Active" } : p));
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this post?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Community Social Feed</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and moderate resident posts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-bold">Total Posts</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{posts.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-bold">Active Posts</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{posts.filter(p => p.status === 'Active').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <AlertOctagon className="h-5 w-5" />
            <h3 className="font-bold">Flagged / Reported</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{posts.filter(p => p.status === 'Flagged').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <EyeOff className="h-5 w-5" />
            <h3 className="font-bold">Hidden Posts</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{posts.filter(p => p.status === 'Hidden').length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex gap-2">
            {["All", "Active", "Flagged", "Hidden"].map(tab => (
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
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 bg-slate-50/50 p-6 space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition-colors">
              <div className="flex items-start justify-between gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{post.author}</p>
                    <p className="text-xs text-slate-500">{post.flat}, {post.apartment} • {post.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : post.status === 'Flagged' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    {post.status}
                  </span>
                </div>
              </div>

              <div className="text-slate-700 mb-6 font-medium">
                {post.content}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-4 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> {post.likes} Likes</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 text-blue-500" /> {post.comments} Comments</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {post.status === 'Flagged' && (
                    <button onClick={() => handleApprove(post.id)} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {post.status !== 'Hidden' && (
                    <button onClick={() => handleHide(post.id)} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </button>
                  )}
                  <button onClick={() => handleDelete(post.id)} className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">No posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
