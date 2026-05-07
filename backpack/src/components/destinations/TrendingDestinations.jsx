"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";

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
    >
      <Link href={`/destinations/${dest.id}`} className="block group">
        <div className="relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer">
          {/* Image */}
          <img
            src={dest.image}
            alt={dest.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hover glow */}
          <div className="absolute inset-0 bg-burnt-orange/0 group-hover:bg-burnt-orange/5 transition-colors duration-700" />

          {/* Top badge */}
          <div className="absolute top-5 left-5 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-[2px] px-3 py-1.5 rounded-full backdrop-blur-md bg-cream/10 text-cream/90 border border-cream/10">
              {dest.difficulty}
            </span>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {/* Price */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-cream/50 text-xs">
                <Clock size={12} />
                <span>{dest.duration}</span>
              </div>
              <span className="text-cream font-bold text-lg">
                ₹{dest.price.toLocaleString()}
              </span>
            </div>

            {/* Name & tagline */}
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream mb-1 group-hover:text-burnt-orange transition-colors duration-500">
              {dest.name}
            </h3>
            <div className="flex items-center gap-1.5 text-cream/40 text-sm mb-4">
              <MapPin size={13} />
              <span>{dest.tagline}</span>
            </div>

            {/* CTA — slides up on hover */}
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              <span className="inline-flex items-center gap-2 text-burnt-orange text-sm font-medium">
                Explore
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
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

  return (
    <section id="destinations" className="py-32 relative overflow-hidden">
      {/* BG accents */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: "rgba(198,122,60,0.04)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "rgba(30,45,74,0.08)" }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
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
          {destinations.slice(0, 6).map((dest, i) => (
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
