"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, CalendarCheck, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-cream/30 text-center py-20">Failed to load analytics</div>;

  const stats = [
    { label: "Total Revenue", value: `₹${data.stats.totalRevenue.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+23%" },
    { label: "Total Bookings", value: data.stats.total, icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-500/10", change: "+12%" },
    { label: "Active Trips", value: data.stats.upcomingTrips, icon: MapPin, color: "text-burnt-orange", bg: "bg-burnt-orange/10", change: "+4" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", change: "+8%" },
  ];

  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream">Admin Dashboard</h1>
        <p className="text-cream/35 text-sm mt-1">Overview of BackPack Junction operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}><s.icon size={18} /></div>
              <span className="text-emerald-400 text-xs flex items-center gap-0.5"><ArrowUpRight size={12} />{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-cream font-[family-name:var(--font-heading)]">{s.value}</p>
            <p className="text-cream/30 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-cream font-semibold mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {data.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-cream/30 text-[10px]">₹{(m.revenue / 1000).toFixed(0)}k</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-burnt-orange/40 to-burnt-orange/10 min-h-[4px]" />
                <span className="text-cream/20 text-[10px]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Occupancy */}
        <div className="glass-card p-6">
          <h2 className="text-cream font-semibold mb-4">Trip Occupancy</h2>
          <div className="space-y-4">
            {data.tripPopularity.map((t, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream/60">{t.name}</span>
                  <span className="text-cream/30 text-xs">{t.bookings}/{t.capacity}</span>
                </div>
                <div className="w-full bg-cream/5 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${t.occupancy}%` }} transition={{ delay: i * 0.1 }}
                    className={`h-2 rounded-full ${t.occupancy > 80 ? "bg-emerald-500" : t.occupancy > 50 ? "bg-burnt-orange" : "bg-amber-500"}`} />
                </div>
                <p className="text-right text-[10px] text-cream/20 mt-0.5">{t.occupancy}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass-card p-6">
        <h2 className="text-cream font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-cream/30 text-xs text-left border-b border-cream/5">
              <th className="pb-3 font-medium">ID</th><th className="pb-3 font-medium">Trip</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Payment</th>
            </tr></thead>
            <tbody>
              {data.recentBookings.map(b => (
                <tr key={b.id} className="border-b border-cream/[0.03] hover:bg-cream/[0.02]">
                  <td className="py-3 text-cream/50 font-mono text-xs">{b.id}</td>
                  <td className="py-3 text-cream/70">{b.tripTitle}</td>
                  <td className="py-3 text-cream/40">{new Date(b.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="py-3 text-burnt-orange font-medium">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{b.status}</span></td>
                  <td className="py-3"><span className={`text-xs ${b.paymentStatus === "paid" ? "text-emerald-400/60" : "text-amber-400/60"}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
