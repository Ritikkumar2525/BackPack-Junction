"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { upcomingTrips } from "@/data/destinations";

function Countdown({ date }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [date]);

  return (
    <div className="flex gap-2">
      {[
        { v: time.d, l: "D" },
        { v: time.h, l: "H" },
        { v: time.m, l: "M" },
        { v: time.s, l: "S" },
      ].map((t) => (
        <div key={t.l} className="text-center">
          <div className="w-12 h-12 rounded-xl bg-cream/5 backdrop-blur-sm flex items-center justify-center text-cream font-bold text-lg border border-cream/5">
            {t.v}
          </div>
          <span className="text-[9px] text-cream/30 uppercase mt-1 block">
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function UpcomingTrips() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[180px] -translate-y-1/2 pointer-events-none"
        style={{ background: "rgba(198,122,60,0.04)" }}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {upcomingTrips.map((trip, i) => {
            const seatsLeft = trip.totalSeats - trip.bookedSeats;
            const progress = (trip.bookedSeats / trip.totalSeats) * 100;
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />

                  {/* Countdown overlay */}
                  <div className="absolute bottom-5 left-5">
                    <Countdown date={trip.departureDate} />
                  </div>

                  {/* Difficulty badge */}
                  <div className="absolute top-5 right-5">
                    <span className="text-[10px] font-semibold uppercase tracking-[2px] px-3 py-1.5 rounded-full backdrop-blur-md bg-cream/10 text-cream/90 border border-cream/10">
                      {trip.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream mb-2">
                    {trip.title}
                  </h3>

                  <div className="flex items-center gap-4 text-cream/40 text-sm mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {trip.duration}
                    </span>
                    <span>·</span>
                    <span>
                      Departs{" "}
                      {new Date(trip.departureDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" },
                      )}
                    </span>
                  </div>

                  {/* Seat progress */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-cream/40 flex items-center gap-1">
                        <Users size={12} /> {trip.bookedSeats}/{trip.totalSeats}{" "}
                        booked
                      </span>
                      <span
                        className={`font-medium ${seatsLeft <= 5 ? "text-red-400" : "text-teal"}`}
                      >
                        {seatsLeft} seats left
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-cream/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            seatsLeft <= 5
                              ? "linear-gradient(90deg, #ef4444, #f87171)"
                              : "linear-gradient(90deg, #C67A3C, #D4A843)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-burnt-orange font-bold text-xl">
                        ₹{trip.price.toLocaleString()}
                      </span>
                      <span className="text-cream/30 text-sm">/person</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Book Now <ArrowRight size={14} />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
