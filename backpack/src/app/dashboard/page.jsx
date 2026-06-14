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

  const getTripDate = (b) => {
    const dateStr = b.travelDates?.startDate || b.tripId?.startDate;
    if (!dateStr) return "Date to be confirmed";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

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
              {upcoming.slice(0, 3).map((b) => {
                const tripImage = b.tripId?.image || b.tripId?.images?.[0];
                return (
                <Link key={b._id || b.bookingId} href={`/dashboard/bookings/${b._id || b.bookingId}`}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-cream/[0.02] hover:bg-cream/[0.06] border border-cream/5 hover:border-burnt-orange/20 transition-all duration-300 group shadow-lg">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-burnt-orange/10 overflow-hidden flex-shrink-0 relative border border-white/5">
                    {tripImage ? (
                      <img src={tripImage} alt={b.tripId?.title || "Trip"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-burnt-orange">
                        <MapPin size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm font-semibold truncate group-hover:text-burnt-orange transition-colors">{b.tripId?.title || "Custom Trip Package"}</p>
                    <p className="text-cream/40 text-xs mt-0.5">{getTripDate(b)}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <span className={`text-[10px] sm:text-xs px-3 py-1 rounded-full font-medium tracking-wide ${b.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cream/5 flex items-center justify-center group-hover:bg-burnt-orange group-hover:text-white transition-colors">
                    <ArrowRight size={14} className="text-cream/40 group-hover:text-white transition-colors" />
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Weather Widget */}
        <div className="relative rounded-3xl p-6 overflow-hidden border border-white/10 shadow-2xl group">
          {/* Dynamic weather background */}
          <div className="absolute inset-0 bg-[#0a1017] z-0" />
          <div className="absolute inset-0 opacity-40 mix-blend-screen transition-colors duration-1000 z-0"
               style={{ background: weather?.condition?.toLowerCase().includes("rain") ? "radial-gradient(circle at top right, #1e3a8a, transparent)" : weather?.condition?.toLowerCase().includes("cloud") ? "radial-gradient(circle at top right, #475569, transparent)" : "radial-gradient(circle at top right, #c67a3c, transparent)" }} 
          />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-[40px] z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-cream font-semibold tracking-wide flex items-center gap-2">
                <Cloud size={16} className="text-cream/60" /> Live Weather
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              {weather && (
                <motion.div
                  key={weather.location}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-cream/60 text-sm font-medium tracking-wider uppercase mb-2">{weather.location}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                      <span className="text-4xl drop-shadow-lg">{weather.icon}</span>
                    </div>
                    <div>
                      <p className="text-4xl font-[family-name:var(--font-heading)] font-bold text-white drop-shadow-md">{weather.temp}°<span className="text-2xl text-cream/50 font-medium">C</span></p>
                      <p className="text-cream/70 text-sm font-medium capitalize mt-1">{weather.condition}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                      <Thermometer size={16} className="mx-auto text-red-400 mb-2 drop-shadow" />
                      <p className="text-cream/50 text-[10px] uppercase tracking-wider font-semibold">Feels</p>
                      <p className="text-cream text-sm font-bold mt-0.5">{weather.feelsLike}°</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                      <Droplets size={16} className="mx-auto text-blue-400 mb-2 drop-shadow" />
                      <p className="text-cream/50 text-[10px] uppercase tracking-wider font-semibold">Humid</p>
                      <p className="text-cream text-sm font-bold mt-0.5">{weather.humidity}%</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
                      <Wind size={16} className="mx-auto text-teal mb-2 drop-shadow" />
                      <p className="text-cream/50 text-[10px] uppercase tracking-wider font-semibold">Wind</p>
                      <p className="text-cream text-sm font-bold mt-0.5">{weather.wind} <span className="text-[10px] text-cream/50">km/h</span></p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-cream/40 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">5-Day Forecast</h3>
                    <div className="space-y-2">
                      {weather.forecast?.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group">
                          <span className="text-cream/70 font-medium w-16 group-hover:text-white transition-colors">{f.day}</span>
                          <span className="text-lg w-8 text-center drop-shadow-sm">{f.icon || f.condition === 'Sunny' ? '☀️' : f.condition.includes('Rain') ? '🌧️' : '☁️'}</span>
                          <span className="text-cream/40 font-medium text-xs"><span className="text-cream group-hover:text-white transition-colors">{f.high}°</span> / {f.low}°</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
