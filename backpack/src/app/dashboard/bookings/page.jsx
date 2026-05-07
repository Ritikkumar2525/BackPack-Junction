"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, MapPin, ArrowRight, CreditCard, Clock } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { setBookings(d.bookings || []); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">My Bookings</h1>
          <p className="text-cream/35 text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <Link href="/dashboard/book-trip" className="btn-primary text-sm py-2.5 px-5"><span className="relative z-10 flex items-center gap-2"><MapPin size={14} /> Book New Trip</span></Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "confirmed", "pending", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30" : "text-cream/30 hover:text-cream/60 border border-cream/5"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CalendarCheck size={40} className="mx-auto text-cream/15 mb-4" />
          <p className="text-cream/30 text-sm">No {filter !== "all" ? filter : ""} bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/dashboard/bookings/${b.id}`}
                className="glass-card p-5 flex items-center gap-5 hover:border-cream/10 transition-all group block">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burnt-orange/20 to-burnt-orange/5 text-burnt-orange flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-medium truncate">{b.tripTitle}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-cream/30">
                    <span className="flex items-center gap-1"><CalendarCheck size={12} /> {new Date(b.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {b.travelers} traveler{b.travelers > 1 ? "s" : ""}</span>
                    <span className="flex items-center gap-1"><CreditCard size={12} /> ₹{b.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : b.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                    {b.status}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${b.paymentStatus === "paid" ? "bg-emerald-500/5 text-emerald-400/60" : "bg-amber-500/5 text-amber-400/60"}`}>
                    {b.paymentStatus}
                  </span>
                  <ArrowRight size={14} className="text-cream/15 group-hover:text-cream/40 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
