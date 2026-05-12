"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, MapPin, CreditCard, TrendingUp, ArrowRight, Cloud, Thermometer, Wind, Droplets } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [weatherList, setWeatherList] = useState([]);
  const [weatherIndex, setWeatherIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bRes, wRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/weather?all=true"),
        ]);
        const bData = await bRes.json();
        const wData = await wRes.json();
        setBookings(bData.bookings || []);
        setWeatherList(wData.weatherList || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (weatherList.length > 0) {
      const interval = setInterval(() => {
        setWeatherIndex((prev) => (prev + 1) % weatherList.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [weatherList]);

  const weather = weatherList.length > 0 ? weatherList[weatherIndex] : null;

  const confirmed = bookings.filter(b => b.bookingStatus === "Confirmed").length;
  const totalSpent = bookings.reduce((s, b) => s + (b.amountPaid || 0), 0);
  const upcoming = bookings.filter(b => b.bookingStatus === "Confirmed" || b.bookingStatus === "Pending");

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: CalendarCheck, color: "text-blue-400" },
    { label: "Confirmed Trips", value: confirmed, icon: MapPin, color: "text-emerald-400" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-burnt-orange" },
    { label: "Upcoming", value: upcoming.length, icon: TrendingUp, color: "text-purple-400" },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1 className="font-[family-name:var(--font-heading)] text-xl sm:text-3xl font-bold text-cream">
          Welcome back, <span className="text-burnt-orange">{session?.user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-cream/35 text-xs sm:text-sm mt-1">Here&apos;s your travel dashboard overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-3 sm:p-5 hover:border-cream/10 transition-colors">
            <s.icon size={18} className={`${s.color} mb-2 sm:mb-3`} />
            <p className="text-lg sm:text-2xl font-bold text-cream font-[family-name:var(--font-heading)] truncate">{s.value}</p>
            <p className="text-cream/30 text-[10px] sm:text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {/* Upcoming Trips */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-cream font-semibold">Upcoming Trips</h2>
            <Link href="/dashboard/bookings" className="text-burnt-orange text-xs hover:text-copper-light flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cream/25 text-sm mb-4">No upcoming trips yet.</p>
              <Link href="/dashboard/book-trip" className="btn-primary text-sm py-2.5 px-6 inline-block"><span className="relative z-10">Book Your First Trip</span></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <Link key={b._id || b.bookingId} href={`/dashboard/bookings/${b._id || b.bookingId}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-cream/[0.02] hover:bg-cream/[0.04] border border-cream/5 transition-all group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-burnt-orange/10 text-burnt-orange flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-xs sm:text-sm font-medium truncate">{b.tripId?.title || "Trip Package"}</p>
                    <p className="text-cream/30 text-[10px] sm:text-xs">Date: To be confirmed</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${b.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-cream/20 group-hover:text-cream/50 transition-colors hidden sm:block" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Weather Widget */}
        <div className="glass-card p-6 overflow-hidden">
          <h2 className="text-cream font-semibold mb-4">Live Weather</h2>
          <AnimatePresence mode="wait">
            {weather && (
              <motion.div
                key={weather.location}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-cream/40 text-xs mb-1">{weather.location}</p>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl">{weather.icon}</span>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-cream">{weather.temp}°C</p>
                    <p className="text-cream/30 text-[10px] sm:text-xs">{weather.condition}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-cream/[0.03]">
                    <Thermometer size={14} className="mx-auto text-red-400 mb-1" />
                    <p className="text-cream/40 text-[10px]">Feels like</p>
                    <p className="text-cream text-xs font-medium">{weather.feelsLike}°C</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-cream/[0.03]">
                    <Droplets size={14} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-cream/40 text-[10px]">Humidity</p>
                    <p className="text-cream text-xs font-medium">{weather.humidity}%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-cream/[0.03]">
                    <Wind size={14} className="mx-auto text-teal mb-1" />
                    <p className="text-cream/40 text-[10px]">Wind</p>
                    <p className="text-cream text-xs font-medium">{weather.wind} km/h</p>
                  </div>
                </div>
                <h3 className="text-cream/40 text-xs mb-2 uppercase tracking-wider">5-Day Forecast</h3>
                <div className="space-y-1.5">
                  {weather.forecast?.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-cream/[0.02]">
                      <span className="text-cream/40 w-16">{f.day}</span>
                      <span>{f.condition}</span>
                      <span className="text-cream/60">{f.high}° / {f.low}°</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Link href="/dashboard/book-trip" className="glass-card p-5 hover:border-burnt-orange/20 transition-all group text-center">
          <MapPin size={24} className="text-burnt-orange mx-auto mb-3" />
          <p className="text-cream text-sm font-medium">Book a New Trip</p>
          <p className="text-cream/25 text-xs mt-1">Explore Himalayan destinations</p>
        </Link>
        <Link href="/dashboard/gallery" className="glass-card p-5 hover:border-burnt-orange/20 transition-all group text-center">
          <Cloud size={24} className="text-blue-400 mx-auto mb-3" />
          <p className="text-cream text-sm font-medium">Upload Photos</p>
          <p className="text-cream/25 text-xs mt-1">Share your travel memories</p>
        </Link>
        <a href="https://instagram.com/backpack_junction" target="_blank" rel="noopener noreferrer"
          className="glass-card p-5 hover:border-pink-500/20 transition-all group text-center">
          <svg className="mx-auto mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "#E1306C"}}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
          </svg>
          <p className="text-cream text-sm font-medium">Share Reels</p>
          <p className="text-cream/25 text-xs mt-1">Collaborate on @backpack_junction</p>
        </a>
      </motion.div>
    </div>
  );
}
