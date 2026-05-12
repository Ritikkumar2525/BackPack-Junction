"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UpcomingTrips from "@/components/trips/UpcomingTrips";

const pastTrips = [
  {
    title: "Valley of Flowers Trek",
    destination: "Uttarakhand",
    date: "Sep 2025",
    travelers: 18,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    title: "Chadar Frozen River",
    destination: "Ladakh",
    date: "Jan 2026",
    travelers: 12,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  },
  {
    title: "Banaras Spiritual Walk",
    destination: "Banaras",
    date: "Dec 2025",
    travelers: 22,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80",
  },
  {
    title: "Hampta Pass Crossing",
    destination: "Himachal",
    date: "Oct 2025",
    travelers: 15,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  },
  {
    title: "Tungnath Winter Trek",
    destination: "Uttarakhand",
    date: "Nov 2025",
    travelers: 20,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80",
  },
  {
    title: "Kashmir Houseboat Experience",
    destination: "Kashmir",
    date: "Mar 2026",
    travelers: 16,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150a53?w=600&q=80",
  },
];

export default function TripsPage() {
  const [dynamicPastTrips, setDynamicPastTrips] = useState([]);

  useEffect(() => {
    async function fetchPastExpeditions() {
      try {
        const res = await fetch("/api/admin/past-expeditions");
        if (res.ok) {
          const data = await res.json();
          setDynamicPastTrips(data);
        }
      } catch (err) {
        console.error("Failed to fetch past expeditions:", err);
      }
    }
    fetchPastExpeditions();
  }, []);

  const allPastTrips = [...dynamicPastTrips, ...pastTrips];

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
              <motion.div
                key={trip._id || trip.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-[#0C1420]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=400";
                    }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
