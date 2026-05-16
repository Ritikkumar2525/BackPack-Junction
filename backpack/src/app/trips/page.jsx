"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UpcomingTrips from "@/components/trips/UpcomingTrips";
import Image from "next/image";

export default function TripsPage() {
  const [pastTrips, setPastTrips] = useState([]);

  useEffect(() => {
    async function fetchPastExpeditions() {
      try {
        const res = await fetch("/api/admin/past-expeditions");
        if (res.ok) {
          const data = await res.json();
          setPastTrips(data);
        }
      } catch (err) {
        console.error("Failed to fetch past expeditions:", err);
      }
    }
    fetchPastExpeditions();
  }, []);

  const allPastTrips = pastTrips;

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Removed Hero section */}

      {/* Upcoming Trips */}
      <UpcomingTrips />

      {/* Past Trips */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs uppercase tracking-[4px] text-cream/40 mb-4"
            >
              Successfully Completed
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-cream"
            >
              Past <span className="gradient-text-cool">Expeditions</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPastTrips.map((trip, i) => (
              <div
                key={trip._id || trip.title || `past-${i}`}
                className="glass-card overflow-hidden group transform-gpu"
              >
                <div className="relative h-48 overflow-hidden bg-[#0C1420]">
                  <Image
                    src={trip.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}
                    alt={trip.title || "Trip Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] text-cream/60 font-medium">
                    ✅ Completed
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-cream text-sm font-semibold ml-1">
                      {trip.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-cream mb-1">
                    {trip.title}
                  </h3>
                  <p className="text-cream/40 text-sm mb-3">
                    {trip.destination} · {trip.date}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-teal text-xs font-medium">
                      {trip.travelers} travelers joined
                    </span>
                    <button className="text-xs text-cream/40 hover:text-cream/70 transition-colors">
                      View Photos →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
