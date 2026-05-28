"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";
import Image from "next/image";

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Moderate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Challenging: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Extreme: "bg-red-500/20 text-red-400 border-red-500/30",
  default: "bg-cream/10 text-cream/90 border-cream/20"
};

function DestinationCard({ dest, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="h-full"
    >
      <Link href={`/destinations/${dest.id}`} className="block group h-full">
        <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] cursor-pointer bg-[#0C1420] shadow-xl hover:shadow-2xl hover:shadow-burnt-orange/10 transition-shadow duration-500 h-full border border-cream/5">
          {/* Image */}
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />

          {/* Premium Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-[#0C1420]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Hover glow */}
          <div className="absolute inset-0 bg-burnt-orange/0 group-hover:bg-burnt-orange/5 transition-colors duration-700" />

          {/* Top Info Bar */}
          <div className="absolute top-5 left-5 right-5 z-10 flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-[2px] px-3.5 py-1.5 rounded-full backdrop-blur-md border ${difficultyColors[dest.difficulty] || difficultyColors.default}`}>
              {dest.difficulty}
            </span>
            <div className="flex items-center gap-1.5 text-cream/90 text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-cream/10">
              <Clock size={12} className="text-burnt-orange" />
              <span>{dest.duration}</span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">
            <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              
              {/* Name & tagline */}
              <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream mb-2 group-hover:text-burnt-orange transition-colors duration-500 drop-shadow-lg">
                {dest.name}
              </h3>
              
              <div className="flex items-center gap-1.5 text-cream/70 text-sm mb-4 drop-shadow-md">
                <MapPin size={14} className="text-burnt-orange flex-shrink-0" />
                <span className="truncate">{dest.tagline}</span>
              </div>

              {/* Price & CTA Row */}
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-cream/10">
                <div>
                  <span className="text-cream/50 text-[10px] uppercase tracking-wider block mb-0.5">Starting From</span>
                  <span className="text-cream font-bold text-xl drop-shadow-md">
                    ₹{(dest.price || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                
                {/* CTA — fades in on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-burnt-orange text-cream shadow-lg hover:bg-[#D4842A] hover:scale-110 transition-all">
                    <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TrendingDestinations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [allDestinations, setAllDestinations] = useState(destinations);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAllDestinations(data);
          } else {
            console.error("Destinations API did not return an array:", data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    }
    fetchDestinations();
  }, []);

  return (
    <section id="destinations" className="py-32 relative overflow-hidden">
      {/* BG accents */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,122,60,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(30,45,74,0.15) 0%, transparent 70%)" }}
      />

      <div id="tour-step-destinations" ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 relative rounded-3xl py-10">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] uppercase tracking-[5px] text-burnt-orange mb-5 font-medium"
          >
            Trending Now
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight"
          >
            Discover the <span className="gradient-text">Himalayas</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream/35 text-base md:text-lg leading-relaxed"
          >
            From sacred peaks to hidden valleys — handpicked destinations that
            will take your breath away.
          </motion.p>
        </div>

        {/* Card Grid — 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {allDestinations.slice(0, 6).map((dest, i) => (
            <DestinationCard key={dest.id} dest={dest} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/destinations">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary px-10 py-4 inline-flex items-center gap-3 text-sm"
            >
              View All Destinations
              <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
