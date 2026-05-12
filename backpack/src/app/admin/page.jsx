"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, CalendarCheck, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-cream/30 text-center py-20">Failed to load analytics</div>;

  const isPositive = (val) => !val?.startsWith("-") && val !== "0" && val !== "0%";

  const stats = [
    { label: "Total Revenue", value: `₹${data.stats.totalRevenue.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10", change: data.stats.revenueChange },
    { label: "Total Bookings", value: data.stats.total, icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-500/10", change: data.stats.bookingChange },
    { label: "Active Trips", value: data.stats.upcomingTrips, icon: MapPin, color: "text-burnt-orange", bg: "bg-burnt-orange/10", change: `${data.stats.totalTrips} total` },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", change: data.stats.userChange },
  ];

  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.revenue), 1);

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
              <span className={`text-xs flex items-center gap-0.5 ${isPositive(s.change) ? "text-emerald-400" : "text-cream/30"}`}>
                {isPositive(s.change) ? <ArrowUpRight size={12} /> : null}{s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-cream font-[family-name:var(--font-heading)]">{s.value}</p>
            <p className="text-cream/30 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Payments Alert */}
      {data.stats.pendingPayments > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-4 border-l-4 border-amber-500/50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} />
          </div>
          <div className="flex-1">
            <p className="text-cream font-medium text-sm">Pending Payments</p>
            <p className="text-cream/40 text-xs">₹{data.stats.pendingPayments.toLocaleString("en-IN")} in outstanding payments from {data.stats.pending} pending booking{data.stats.pending !== 1 ? "s" : ""}</p>
          </div>
        </motion.div>
      )}

      {/* Booking Status Breakdown + Revenue Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-cream font-semibold mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {data.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-cream/30 text-[10px]">₹{(m.revenue / 1000).toFixed(0)}k</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 3)}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-burnt-orange/40 to-burnt-orange/10 min-h-[4px]" />
                <span className="text-cream/20 text-[10px]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="glass-card p-6">
          <h2 className="text-cream font-semibold mb-4">Booking Status</h2>
          <div className="space-y-4">
            {[
              { label: "Confirmed", count: data.stats.confirmed, color: "bg-emerald-500", textColor: "text-emerald-400" },
              { label: "Pending", count: data.stats.pending, color: "bg-amber-500", textColor: "text-amber-400" },
              { label: "Cancelled", count: data.stats.cancelled, color: "bg-red-500", textColor: "text-red-400" },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-cream/60 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  <span className={`font-medium ${s.textColor}`}>{s.count}</span>
                </div>
                <div className="w-full bg-cream/5 rounded-full h-1.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${data.stats.total > 0 ? (s.count / data.stats.total) * 100 : 0}%` }} transition={{ delay: i * 0.1 }}
                    className={`h-1.5 rounded-full ${s.color}/60`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-cream/5">
            <h3 className="text-cream/50 text-xs font-medium mb-3">Trip Occupancy</h3>
            <div className="space-y-3">
              {data.tripPopularity.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream/50 truncate max-w-[140px]">{t.name}</span>
                    <span className="text-cream/30">{t.bookings}/{t.capacity}</span>
                  </div>
                  <div className="w-full bg-cream/5 rounded-full h-1.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${t.occupancy}%` }} transition={{ delay: i * 0.1 }}
                      className={`h-1.5 rounded-full ${t.occupancy > 80 ? "bg-emerald-500" : t.occupancy > 50 ? "bg-burnt-orange" : "bg-amber-500"}`} />
                  </div>
                </div>
              ))}
            </div>
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
                  <td className="py-3 text-burnt-orange font-medium">₹{b.totalAmount?.toLocaleString("en-IN")}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : b.status === "Cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{b.status}</span></td>
                  <td className="py-3"><span className={`text-xs ${b.paymentStatus === "Completed" ? "text-emerald-400/60" : b.paymentStatus === "Failed" ? "text-red-400/60" : "text-amber-400/60"}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
