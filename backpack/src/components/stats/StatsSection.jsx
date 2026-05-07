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
  { value: 10000, label: "Happy Travelers", suffix: "+", icon: Users },
  { value: 500, label: "Trips Completed", suffix: "+", icon: Mountain },
  {
    value: 4.9,
    label: "Average Rating",
    suffix: "",
    icon: Star,
    isDecimal: true,
  },
  { value: 100, label: "Destinations", suffix: "+", icon: MapPin },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Guides" },
  { icon: HeartHandshake, label: "Insured Trips" },
  { icon: Clock, label: "24/7 Support" },
  { icon: Leaf, label: "Eco-Friendly" },
];

function AnimatedCounter({ value, suffix, isDecimal }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
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
    <span ref={ref} className="counter-value">
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0C1420 0%, #141F33 50%, #0C1420 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] uppercase tracking-[5px] text-cream/40 mb-5 font-medium"
          >
            Our Journey So Far
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-cream leading-tight"
          >
            Why Travelers <span className="gradient-text">Choose Us</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 text-center group"
              >
                <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center bg-burnt-orange/10 text-burnt-orange group-hover:bg-burnt-orange/20 transition-colors">
                  <Icon size={20} />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isDecimal={stat.isDecimal}
                />
                <p className="text-cream/40 text-sm mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 lg:gap-10"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-cream/30 text-sm"
              >
                <Icon size={15} className="text-teal" />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
