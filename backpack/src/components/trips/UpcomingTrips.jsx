"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Countdown({ date }) {
  const [time, setTime] = useState(() => {
    const target = new Date(date).getTime();
    if (isNaN(target)) return null;
    const diff = target - Date.now();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  });
  const [expired, setExpired] = useState(!time);

  useEffect(() => {
    const target = new Date(date).getTime();
    if (isNaN(target)) { setExpired(true); return; }

    const id = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { setExpired(true); clearInterval(id); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [date]);

  if (expired || !time) return null;

  const units = [
    { v: time.d, l: "DAYS" },
    { v: time.h, l: "HRS" },
    { v: time.m, l: "MIN" },
    { v: time.s, l: "SEC" },
  ];

  return (
    <div className="flex gap-1.5 sm:gap-2 drop-shadow-xl z-30 relative">
      {units.map((t, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="relative w-[32px] h-[40px] sm:w-[38px] sm:h-[46px] bg-gradient-to-b from-white to-gray-200 rounded shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center overflow-hidden border border-white/40 transform-gpu">
            {/* Split line for flip effect */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/20 shadow-[0_1px_1px_rgba(255,255,255,1)] z-10" />
            <span className="absolute inset-0 flex items-center justify-center z-0 text-[#111827] font-[family-name:var(--font-heading)] font-bold text-lg sm:text-xl tracking-tighter drop-shadow-sm mt-0.5 transform-gpu">
              {String(t.v).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[7px] sm:text-[8px] text-cream/90 font-bold tracking-[0.1em] mt-1.5 drop-shadow-md">
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function UpcomingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/trips?filter=upcoming");
        const data = await res.json();
        if (data && Array.isArray(data.trips)) {
          setTrips(data.trips);
        } else {
          console.error("Trips API did not return an array:", data);
          setTrips([]);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,122,60,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] uppercase tracking-[5px] text-burnt-orange mb-5 font-medium"
          >
            Limited Seats
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight"
          >
            Upcoming <span className="gradient-text-warm">Group Trips</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream/35 text-base md:text-lg leading-relaxed mt-5"
          >
            Join fellow adventurers on curated group experiences. Book early —
            these fill up fast.
          </motion.p>
        </div>

        {/* Trip Cards — 2 columns */}
        {loading ? (
           <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin"></div></div>
        ) : trips.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-burnt-orange/10 text-burnt-orange flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <p className="text-cream/50 text-lg font-medium">No upcoming trips at the moment</p>
            <p className="text-cream/25 text-sm mt-2">Check back soon — new adventures are being planned!</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {trips.slice(0, 4).map((trip, i) => {
                if (!trip) return null;

              // Safe seat parsing
              const totalSeats = Number(trip.totalSeats) || 20;
              const dbBooked = Number(trip.bookedSeats) || 0;
              const availableSeats = trip.availableSeats !== undefined 
                ? Number(trip.availableSeats) 
                : Math.max(0, totalSeats - dbBooked);
              const bookedSeats = totalSeats - availableSeats;
              const progress = Math.min(100, Math.max(0, (bookedSeats / totalSeats) * 100));
              
              // Safe image fallback
              const imageUrl = trip.images?.[0] || trip.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";
              
              // Extremely safe and STABLE date parsing
              let validDate;
              if (trip.startDate) {
                validDate = new Date(trip.startDate);
              }
              if (!validDate || isNaN(validDate.getTime())) {
                // Use a deterministic fallback date based on trip ID so it NEVER changes across re-renders
                const hash = String(trip._id || trip.id || "trip").charCodeAt(0);
                // Fallback to exactly 30 days from a fixed point or just a fixed future date
                validDate = new Date(2025, 11, Math.min(28, hash % 28 + 1));
              }
              const depDate = validDate.toISOString();
              
              // Safe pricing
              const safePrice = Number(trip.price) || 0;
              
              // Status & Booking Logic
              const startDateTime = validDate.getTime();
              // Default to 5 days after start if no endDate exists
              const endDateTime = trip.endDate ? new Date(trip.endDate).getTime() : startDateTime + (86400000 * 5);
              
              const isCompleted = endDateTime <= now;
              const isStarted = startDateTime <= now && endDateTime > now;
              const isSoldOut = availableSeats <= 0;
              
              let statusLabel = "Book Now";
              let canBook = true;
              let statusBadge = null;

              if (isCompleted) {
                statusLabel = "Completed";
                canBook = false;
                statusBadge = "Trip Completed";
              } else if (isStarted) {
                statusLabel = "Trip Started";
                canBook = false;
                statusBadge = "Currently Active";
              } else if (isSoldOut) {
                statusLabel = "Sold Out";
                canBook = false;
                statusBadge = "Fully Booked";
              }
              
              return (
                <Link
                  href={`/trips/${trip.id || trip._id}`}
                  key={trip._id || trip.id || `trip-${i}`}
                  className="relative group rounded-[1.5rem] p-[1px] overflow-hidden bg-white/5 shadow-2xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col block"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                  
                  <div className="relative bg-[#0d141e] rounded-[1.5rem] overflow-hidden flex flex-col h-full border border-white/5 z-20">
                    {/* Image Section */}
                    <div className="relative min-h-[240px] aspect-video sm:aspect-auto sm:h-60 overflow-hidden shrink-0 bg-black">
                      <Image
                        src={imageUrl}
                        alt={trip.title}
                        fill
                        priority={i < 2}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="absolute inset-0 object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d141e] via-[#0d141e]/20 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Difficulty badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <span className="text-[9px] font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded-xl backdrop-blur-md bg-black/40 text-cream border border-white/10 shadow-lg">
                          {trip.difficulty || "MODERATE"}
                        </span>
                      </div>

                      {/* Status / Countdown */}
                      <div className="absolute bottom-5 left-5 z-20">
                        {statusBadge ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">{statusBadge}</span>
                          </div>
                        ) : (
                          <Countdown date={depDate} />
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col relative bg-gradient-to-b from-[#0d141e] to-[#0a1017]">
                      {/* Floating Date Badge */}
                      <div className="absolute -top-10 right-5 bg-gradient-to-br from-burnt-orange to-[#a35e27] p-2.5 rounded-[14px] shadow-[0_8px_15px_rgba(198,122,60,0.4)] border border-white/20 text-center min-w-[60px] transform group-hover:-translate-y-1.5 transition-transform duration-500 z-30">
                        <span className="block text-white/80 text-[8px] uppercase font-bold tracking-[0.15em] mb-0.5">Departs</span>
                        <span className="block text-white font-[family-name:var(--font-heading)] text-xl font-bold leading-none drop-shadow-sm">
                          {validDate.getDate() || "--"}
                        </span>
                        <span className="block text-white/90 text-[10px] font-semibold mt-1 uppercase tracking-wider">
                          {!isNaN(validDate.getTime()) ? validDate.toLocaleDateString("en-IN", { month: "short" }) : "TBD"}
                        </span>
                      </div>

                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream mb-2 group-hover:text-burnt-orange transition-colors duration-300 pr-16 leading-snug line-clamp-1">
                        {trip.title || "Upcoming Expedition"}
                      </h3>

                      <div className="flex items-center flex-wrap gap-3 text-cream/50 text-xs mb-4 font-medium w-full overflow-hidden">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={13} className="text-burnt-orange flex-shrink-0" /> {trip.duration || "Flexible"}
                        </span>
                        <span className="opacity-50 flex-shrink-0">•</span>
                        <span className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                          <MapPin size={13} className="text-burnt-orange flex-shrink-0" /> <span className="truncate">{trip.destination || "Himalayas"}</span>
                        </span>
                      </div>

                      {/* Seat progress */}
                      <div className="mb-5 flex-1 mt-auto">
                        <div className="flex items-center justify-between text-[11px] mb-2 font-bold">
                          <span className="text-cream/60 flex items-center gap-1.5 uppercase tracking-wide">
                            <Users size={12} className="text-cream/40" /> {bookedSeats}/{totalSeats} Booked
                          </span>
                          <span className={`${availableSeats <= 5 ? "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" : "text-teal drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]"}`}>
                            {availableSeats} seats left
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/5 transform-gpu">
                          <div
                            className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                            style={{
                              width: `${progress}%`,
                              background: availableSeats <= 5
                                  ? "linear-gradient(90deg, #b91c1c, #ef4444)"
                                  : "linear-gradient(90deg, #C67A3C, #FDE68A)",
                            }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-cream/40 text-[8px] uppercase tracking-[0.1em] font-bold mb-0.5">Starting from</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-cream font-[family-name:var(--font-heading)] font-bold text-2xl tracking-tight drop-shadow-md">
                              ₹{safePrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-cream/30 text-[10px] font-semibold">/person</span>
                          </div>
                        </div>
                        
                        {canBook ? (
                          <button
                            onClick={() => window.location.href = `/dashboard/book-trip?trip=${trip._id || trip.id}`}
                            className="group/btn relative overflow-hidden rounded-[14px] bg-gradient-to-b from-white to-gray-200 text-[#0d141e] font-bold text-xs py-2.5 px-5 shadow-[0_4px_10px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <span className="relative z-10 flex items-center gap-1.5">
                              {statusLabel} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        ) : (
                          <div className="py-2.5 px-5 rounded-[14px] bg-white/5 text-cream/40 font-bold text-xs border border-white/5 cursor-not-allowed">
                            {statusLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
            
            {trips.length > 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-16"
              >
                <Link href="/trips">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary px-10 py-4 inline-flex items-center gap-3 text-sm"
                  >
                    View All Upcoming Trips
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
