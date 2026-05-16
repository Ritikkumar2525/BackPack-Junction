"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Mountain,
  Star,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Leaf,
} from "lucide-react";

const stats = [
  { value: 5000, label: "Happy Travelers", suffix: "+", icon: Users },
  { value: 250, label: "Destinations", suffix: "+", icon: MapPin },
  {
    value: 4.9,
    label: "Average Rating",
    suffix: "",
    icon: Star,
    isDecimal: true,
  },
  { value: 100, label: "Trips Completed", suffix: "+", icon: Mountain },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Guides" },
  { icon: HeartHandshake, label: "Insured Trips" },
  { icon: Clock, label: "24/7 Support" },
  { icon: Leaf, label: "Eco-Friendly" },
];

function AnimatedCounter({ value, suffix, isDecimal, className }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2500; // Smoother 2.5s duration
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[#080d14]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-burnt-orange/20 to-transparent" />
        <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-burnt-orange/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-teal/10 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-burnt-orange/10 rounded-[100%] blur-[80px] pointer-events-none" />
          
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs uppercase tracking-[6px] text-cream/40 mb-6 font-semibold"
          >
            Our Journey So Far
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-cream leading-tight drop-shadow-lg"
          >
            Why Travelers <span className="bg-clip-text text-transparent bg-gradient-to-r from-burnt-orange to-amber-400">Choose Us</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.7, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10 }}
                className="relative group rounded-[2.5rem] p-[1px] overflow-hidden"
              >
                {/* Hover Glow Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-burnt-orange/50 via-transparent to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-[#0a1017]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] group-hover:bg-[#0d141e]/95 transition-all duration-500 overflow-hidden">
                  
                  {/* Background Icon Watermark */}
                  <Icon size={140} className="absolute -bottom-8 -right-8 text-white/[0.02] rotate-12 group-hover:scale-110 group-hover:rotate-6 group-hover:text-burnt-orange/5 transition-all duration-700 pointer-events-none" />

                  <div className="relative z-10 w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-burnt-orange/20 to-transparent border border-burnt-orange/20 text-burnt-orange group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(198,122,60,0.4)] transition-all duration-500">
                    <Icon size={28} className="drop-shadow-[0_0_8px_rgba(198,122,60,0.8)]" />
                  </div>

                  <div className="relative z-10 font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-cream/70 tracking-tight group-hover:from-white group-hover:to-burnt-orange transition-colors duration-500 mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isDecimal={stat.isDecimal}
                    />
                  </div>
                  
                  <p className="relative z-10 text-cream/50 text-sm font-semibold uppercase tracking-[3px] group-hover:text-cream/90 transition-colors duration-500 mt-4">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 lg:gap-6"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                key={badge.label}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-md cursor-default group shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(45,212,191,0.15)]"
              >
                <Icon size={18} className="text-teal/80 group-hover:text-teal drop-shadow-[0_0_5px_rgba(45,212,191,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] transition-all duration-300" />
                <span className="text-cream/60 text-sm font-medium tracking-wide group-hover:text-cream transition-colors duration-300">{badge.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
