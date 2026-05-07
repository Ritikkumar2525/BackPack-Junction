"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MapPin, CreditCard, Clock, Search } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { setBookings(d.bookings || []); setLoading(false); });
  }, []);

  const filtered = bookings.filter(b => b.tripTitle.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">All Bookings</h1>
          <p className="text-cream/35 text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..." className="glass rounded-xl pl-9 pr-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-cream/5 focus:border-burnt-orange/30 w-64" />
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-cream/30 text-xs text-left border-b border-cream/5 bg-cream/[0.02]">
              <th className="p-4 font-medium">Booking ID</th><th className="p-4 font-medium">Trip</th><th className="p-4 font-medium">Departure</th><th className="p-4 font-medium">Travelers</th><th className="p-4 font-medium">Amount</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Payment</th>
            </tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-cream/[0.03] hover:bg-cream/[0.02] transition-colors">
                  <td className="p-4 text-cream/50 font-mono text-xs">{b.id}</td>
                  <td className="p-4"><p className="text-cream/70 font-medium">{b.tripTitle}</p><p className="text-cream/25 text-xs">{b.destination}</p></td>
                  <td className="p-4 text-cream/40">{new Date(b.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="p-4 text-cream/50 text-center">{b.travelers}</td>
                  <td className="p-4 text-burnt-orange font-medium">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{b.status}</span></td>
                  <td className="p-4"><span className={`text-xs ${b.paymentStatus === "paid" ? "text-emerald-400/60" : "text-amber-400/60"}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
