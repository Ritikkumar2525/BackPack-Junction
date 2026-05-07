"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users, Phone, Shield, Backpack, Route, Cloud, Thermometer, Wind, Droplets, Star, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function BookingDetailPage({ params }) {
  const { id } = use(params);
  const [booking, setBooking] = useState(null);
  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [tab, setTab] = useState("itinerary");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const bRes = await fetch("/api/bookings");
        const bData = await bRes.json();
        const b = bData.bookings?.find(bk => bk.id === id);
        setBooking(b);
        if (b) {
          const [tRes, wRes] = await Promise.all([
            fetch(`/api/trips/${b.tripId}`),
            fetch(`/api/weather?location=${encodeURIComponent(b.destination)}`),
          ]);
          const tData = await tRes.json();
          const wData = await wRes.json();
          setTrip(tData.trip);
          setWeather(wData);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  if (!booking || !trip) return <div className="text-center py-20 text-cream/30">Booking not found</div>;

  const tabs = [
    { id: "itinerary", label: "Itinerary" },
    { id: "captain", label: "Trip Captain" },
    { id: "kit", label: "Trip Kit" },
    { id: "partners", label: "Trip Partners" },
    { id: "route", label: "Route Map" },
    { id: "emergency", label: "Emergency" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href="/dashboard/bookings" className="flex items-center gap-2 text-cream/30 text-sm hover:text-cream transition-colors"><ArrowLeft size={16} /> Back to Bookings</Link>

      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-6">
        <img src={trip.image} alt={trip.title} className="w-full md:w-48 h-36 object-cover rounded-xl" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">{trip.title}</h1>
              <p className="text-cream/40 text-sm mt-1 flex items-center gap-2"><MapPin size={14} /> {trip.destination} · {trip.duration}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{booking.status}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
              <p className="text-cream/30 text-[10px] uppercase">Booking ID</p>
              <p className="text-cream text-sm font-mono font-medium mt-1">{booking.id}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
              <p className="text-cream/30 text-[10px] uppercase">Departure</p>
              <p className="text-cream text-sm font-medium mt-1">{new Date(booking.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
              <p className="text-cream/30 text-[10px] uppercase">Travelers</p>
              <p className="text-cream text-sm font-medium mt-1">{booking.travelers}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
              <p className="text-cream/30 text-[10px] uppercase">Amount Paid</p>
              <p className="text-burnt-orange text-sm font-bold mt-1">₹{booking.paidAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather */}
      {weather && (
        <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{weather.icon}</span>
            <div>
              <p className="text-cream font-semibold">{weather.temp}°C — {weather.condition}</p>
              <p className="text-cream/30 text-xs">Live weather at {weather.location}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-cream/40"><Thermometer size={14} className="text-red-400" /> Feels {weather.feelsLike}°C</div>
            <div className="flex items-center gap-1.5 text-xs text-cream/40"><Droplets size={14} className="text-blue-400" /> {weather.humidity}%</div>
            <div className="flex items-center gap-1.5 text-xs text-cream/40"><Wind size={14} className="text-teal" /> {weather.wind} km/h</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/20" : "text-cream/30 hover:text-cream/60 border border-transparent"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        {tab === "itinerary" && (
          <div className="space-y-0">
            {trip.itinerary.map((day, i) => (
              <div key={i} className="flex gap-4 pb-6 relative">
                {i < trip.itinerary.length - 1 && <div className="absolute left-[17px] top-10 bottom-0 w-[2px] bg-cream/5" />}
                <div className="w-9 h-9 rounded-full bg-burnt-orange/15 text-burnt-orange flex items-center justify-center text-xs font-bold flex-shrink-0 relative z-10">{day.day}</div>
                <div className="flex-1 pt-1">
                  <h3 className="text-cream font-semibold text-sm">{day.title}</h3>
                  <p className="text-cream/35 text-xs mt-1 leading-relaxed">{day.description}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-cream/20">
                    <span>📏 {day.distance}</span>
                    <span>🚌 {day.transport}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "captain" && (
          <div className="flex flex-col md:flex-row gap-6">
            <img src={trip.captain.image} alt={trip.captain.name} className="w-32 h-32 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="text-cream text-xl font-bold font-[family-name:var(--font-heading)]">{trip.captain.name}</h3>
              <p className="text-burnt-orange text-sm">{trip.captain.speciality}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(trip.captain.rating) ? "text-amber-400 fill-amber-400" : "text-cream/10"} />)}
                <span className="text-cream/50 text-xs ml-1">{trip.captain.rating}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-cream/[0.03]"><p className="text-cream/30 text-[10px]">Experience</p><p className="text-cream text-sm font-medium">{trip.captain.experience}</p></div>
                <div className="p-3 rounded-xl bg-cream/[0.03]"><p className="text-cream/30 text-[10px]">Trips Led</p><p className="text-cream text-sm font-medium">{trip.captain.tripsLed}</p></div>
              </div>
              <div className="mt-4"><p className="text-cream/30 text-xs mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">{trip.captain.certifications.map((c, i) => <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400/70">{c}</span>)}</div>
              </div>
              <a href={`tel:${trip.captain.phone}`} className="inline-flex items-center gap-2 mt-4 text-sm text-burnt-orange hover:text-copper-light"><Phone size={14} /> {trip.captain.phone}</a>
            </div>
          </div>
        )}

        {tab === "kit" && (
          <div className="space-y-2">
            <div className="flex gap-4 mb-4 text-xs text-cream/30">
              <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-400" /> Provided by us</span>
              <span className="flex items-center gap-1"><Backpack size={12} className="text-amber-400" /> You need to bring</span>
            </div>
            {trip.kit.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream/[0.02] transition-colors">
                {item.provided ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" /> : <Backpack size={16} className="text-amber-400 flex-shrink-0" />}
                <span className="text-cream/70 text-sm flex-1">{item.item}</span>
                {item.essential && <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/60">Essential</span>}
              </div>
            ))}
          </div>
        )}

        {tab === "partners" && (
          <div>
            <p className="text-cream/40 text-sm mb-4">Fellow travelers on this trip ({trip.booked}/{trip.groupSize} seats booked)</p>
            <div className="w-full bg-cream/5 rounded-full h-2 mb-6"><div className="bg-gradient-to-r from-burnt-orange to-copper h-2 rounded-full" style={{ width: `${(trip.booked / trip.groupSize) * 100}%` }} /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: trip.booked }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-cream/[0.02]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-burnt-orange/20 to-purple-500/20 flex items-center justify-center text-cream/50 text-xs font-bold">{String.fromCharCode(65 + (i % 26))}</div>
                  <div><p className="text-cream/60 text-xs font-medium">Traveler {i + 1}</p><p className="text-cream/20 text-[10px]">{i === 0 ? "You" : "Fellow traveler"}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "route" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div><p className="text-cream font-semibold">Route Overview</p><p className="text-cream/30 text-xs">{trip.route.totalDistance} · {trip.route.estimatedTime}</p></div>
            </div>
            <div className="rounded-xl overflow-hidden h-64 md:h-96 bg-cream/[0.03] relative">
              <iframe
                width="100%" height="100%" style={{ border: 0 }}
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${trip.route.coordinates[0].lat},${trip.route.coordinates[0].lng}&destination=${trip.route.coordinates[trip.route.coordinates.length - 1].lat},${trip.route.coordinates[trip.route.coordinates.length - 1].lng}&mode=driving`}
              />
            </div>
            <div className="mt-4 space-y-2">
              {trip.route.coordinates.map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 || i === trip.route.coordinates.length - 1 ? "bg-burnt-orange/20 text-burnt-orange" : "bg-cream/5 text-cream/30"}`}>{i + 1}</div>
                  <span className="text-cream/60">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "emergency" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 mb-4">
              <p className="text-red-400 text-sm font-medium flex items-center gap-2"><AlertTriangle size={16} /> Emergency Information</p>
              <p className="text-cream/30 text-xs mt-1">Save these contacts before starting your trip.</p>
            </div>
            {Object.entries(trip.emergency).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-cream/[0.02] hover:bg-cream/[0.04] transition-colors">
                <span className="text-cream/40 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                <a href={`tel:${value}`} className="text-cream text-sm font-medium hover:text-burnt-orange transition-colors">{value}</a>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
