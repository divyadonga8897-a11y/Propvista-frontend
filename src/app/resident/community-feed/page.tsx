"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import apiService from "@/services/apiService";
import { Loader2, MessageSquare, Heart, Share2, Send, RadioReceiver, Image as ImageIcon } from "lucide-react";
import { usePropVista } from "@/components/Providers";

export default function CommunityFeed() {
  const { user } = usePropVista();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await apiService.getCommunityFeed();
      setPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setSubmitting(true);
    try {
      await apiService.createCommunityPost({ content: newPost });
      setNewPost("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 flex justify-center">
        <div className="max-w-2xl w-full space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <RadioReceiver className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Community Feed</h1>
              <p className="text-sm text-slate-500">Connect with your neighbors</p>
            </div>
          </div>

          {/* Create Post */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <form onSubmit={handlePost}>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's happening in the community?"
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-0 focus:bg-slate-100 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <button type="button" className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !newPost.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No Posts Yet</h3>
              <p className="text-sm text-slate-500">Be the first to say hello to your neighbors!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {post.author_name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{post.author_name || "Neighbor"}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  {post.image_url && (
                    <div className="mt-4 rounded-xl overflow-hidden bg-slate-100">
                      <img src={post.image_url} alt="Post attachment" className="w-full h-auto object-cover max-h-96" />
                    </div>
                  )}

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" /> Like ({post.likes_count})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">
                      <MessageSquare className="h-4 w-4" /> Reply ({post.comments_count})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors ml-auto">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
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
