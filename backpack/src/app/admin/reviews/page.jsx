"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, X, Eye, Trash2, Award, MessageSquare, Filter } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateReview = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchReviews();
        if (selected?._id === id) {
          const data = await res.json();
          setSelected(data.review);
        }
      }
    } catch (err) { console.error(err); }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
      if (selected?._id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const filtered = filter === "all" ? reviews : reviews.filter(r => {
    if (filter === "featured") return r.isFeatured;
    return r.status?.toLowerCase() === filter;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === "Pending").length,
    approved: reviews.filter(r => r.status === "Approved").length,
    featured: reviews.filter(r => r.isFeatured).length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Review Management</h1>
        <p className="text-cream/35 text-sm mt-1">{reviews.length} total reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center"><p className="text-cream/30 text-[10px] uppercase tracking-wider">Total</p><p className="text-cream text-2xl font-bold">{stats.total}</p></div>
        <div className="glass-card p-4 text-center"><p className="text-amber-400/50 text-[10px] uppercase tracking-wider">Pending</p><p className="text-amber-400 text-2xl font-bold">{stats.pending}</p></div>
        <div className="glass-card p-4 text-center"><p className="text-emerald-400/50 text-[10px] uppercase tracking-wider">Approved</p><p className="text-emerald-400 text-2xl font-bold">{stats.approved}</p></div>
        <div className="glass-card p-4 text-center"><p className="text-burnt-orange/50 text-[10px] uppercase tracking-wider">Featured</p><p className="text-burnt-orange text-2xl font-bold">{stats.featured}</p></div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "pending", "approved", "rejected", "featured"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all whitespace-nowrap ${filter === f ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30" : "text-cream/30 hover:text-cream/50 border border-cream/[0.03]"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center"><MessageSquare size={40} className="mx-auto text-cream/15 mb-4" /><p className="text-cream/30 text-sm">No reviews found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card p-4 sm:p-5 hover:border-cream/10 transition-all cursor-pointer"
              onClick={() => setSelected(r)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {r.userId?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-cream font-medium text-sm">{r.userId?.name || "Unknown"}</p>
                      <p className="text-cream/30 text-[10px]">{r.tripId?.title || "Unknown Trip"} · {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.isFeatured && <Award size={14} className="text-burnt-orange" />}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" : r.status === "Rejected" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? "text-amber-400 fill-amber-400" : "text-cream/10"} />)}
                  </div>
                  <p className="text-cream/50 text-xs mt-2 line-clamp-2">{r.review}</p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-cream/5">
                {r.status === "Pending" && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); updateReview(r._id, { status: "Approved" }); }} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 border border-emerald-500/20 px-2.5 py-1 rounded-lg"><Check size={10}/> Approve</button>
                    <button onClick={(e) => { e.stopPropagation(); updateReview(r._id, { status: "Rejected" }); }} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-500/20 px-2.5 py-1 rounded-lg"><X size={10}/> Reject</button>
                  </>
                )}
                {r.status === "Approved" && (
                  <button onClick={(e) => { e.stopPropagation(); updateReview(r._id, { isFeatured: !r.isFeatured }); }} className={`text-[10px] flex items-center gap-1 border px-2.5 py-1 rounded-lg ${r.isFeatured ? "text-burnt-orange border-burnt-orange/30" : "text-cream/40 border-cream/10 hover:text-burnt-orange"}`}>
                    <Award size={10}/> {r.isFeatured ? "Unfeature" : "Feature on Homepage"}
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); deleteReview(r._id); }} className="text-[10px] text-red-400/40 hover:text-red-400 flex items-center gap-1 ml-auto"><Trash2 size={10}/> Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card p-6 shadow-2xl">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-cream/50 hover:text-cream"><X size={16} /></button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center font-bold text-lg">{selected.userId?.name?.charAt(0) || "?"}</div>
                <div>
                  <p className="text-cream font-semibold">{selected.userId?.name}</p>
                  <p className="text-cream/30 text-xs">{selected.userId?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm"><span className="text-cream/40">Trip</span><span className="text-cream">{selected.tripId?.title}</span></div>
                <div className="flex justify-between text-sm"><span className="text-cream/40">Booking</span><span className="text-cream/70 font-mono text-xs">{selected.bookingId?.bookingId || "N/A"}</span></div>
                <div className="flex justify-between text-sm items-center"><span className="text-cream/40">Rating</span><div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= selected.rating ? "text-amber-400 fill-amber-400" : "text-cream/10"} />)}</div></div>
                <div className="flex justify-between text-sm"><span className="text-cream/40">Submitted</span><span className="text-cream/60">{new Date(selected.createdAt).toLocaleString()}</span></div>
              </div>

              <div className="bg-cream/5 rounded-xl p-4 mb-4">
                <p className="text-cream/70 text-sm leading-relaxed">{selected.review}</p>
              </div>

              {selected.photos?.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {selected.photos.map((p, i) => (
                    <img key={i} src={p} alt="" className="w-24 h-24 rounded-xl object-cover border border-cream/10" />
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {selected.status !== "Approved" && (
                  <button onClick={() => updateReview(selected._id, { status: "Approved" })} className="text-xs text-emerald-400 flex items-center gap-1 border border-emerald-500/20 px-3 py-2 rounded-xl hover:bg-emerald-500/5"><Check size={12}/> Approve</button>
                )}
                {selected.status !== "Rejected" && (
                  <button onClick={() => updateReview(selected._id, { status: "Rejected" })} className="text-xs text-red-400 flex items-center gap-1 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/5"><X size={12}/> Reject</button>
                )}
                {selected.status === "Approved" && (
                  <button onClick={() => updateReview(selected._id, { isFeatured: !selected.isFeatured })} className={`text-xs flex items-center gap-1 border px-3 py-2 rounded-xl ${selected.isFeatured ? "text-burnt-orange border-burnt-orange/30 bg-burnt-orange/5" : "text-cream/40 border-cream/10"}`}>
                    <Award size={12}/> {selected.isFeatured ? "Remove from Homepage" : "Feature on Homepage"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
