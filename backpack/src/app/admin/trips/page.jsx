"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Edit, Trash2, Plus, Mountain, DollarSign } from "lucide-react";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trips").then(r => r.json()).then(d => { setTrips(d.trips || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Manage Trips</h1>
          <p className="text-cream/35 text-sm mt-1">{trips.length} trips configured</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-5"><span className="relative z-10 flex items-center gap-2"><Plus size={14} /> Create Trip</span></button>
      </div>

      <div className="space-y-3">
        {trips.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex flex-col md:flex-row items-start gap-5">
            <img src={t.image} alt={t.title} className="w-full md:w-36 h-24 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-cream font-semibold">{t.title}</h3>
                  <p className="text-cream/30 text-xs mt-0.5 flex items-center gap-2"><MapPin size={12} />{t.destination} · {t.duration}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full ${t.status === "upcoming" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/5 text-cream/30"}`}>{t.status}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-cream/30">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(t.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {t.booked}/{t.groupSize} booked</span>
                <span className="flex items-center gap-1"><Mountain size={12} /> {t.difficulty}</span>
                <span className="flex items-center gap-1 text-burnt-orange"><DollarSign size={12} /> ₹{t.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-2 w-full max-w-xs bg-cream/5 rounded-full h-1.5">
                <div className="bg-burnt-orange/50 h-1.5 rounded-full" style={{ width: `${(t.booked / t.groupSize) * 100}%` }} />
              </div>
            </div>
            <div className="flex gap-2 md:flex-col">
              <button className="p-2.5 rounded-xl glass border border-cream/5 text-cream/30 hover:text-cream hover:border-cream/15 transition-all"><Edit size={14} /></button>
              <button className="p-2.5 rounded-xl glass border border-cream/5 text-red-400/30 hover:text-red-400 hover:border-red-500/20 transition-all"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
