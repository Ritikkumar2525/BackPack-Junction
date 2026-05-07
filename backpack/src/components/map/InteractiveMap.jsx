"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Map as MapIcon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the MapCore component with SSR disabled
// This is strictly required because leaflet uses the `window` object
const MapCore = dynamic(() => import("./MapCore"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[650px] bg-[#0a0f18] rounded-2xl flex items-center justify-center border border-cream/5">
      <div className="flex flex-col items-center gap-4 text-cream/40">
        <div className="w-10 h-10 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase font-medium">Loading Satellite Map...</p>
      </div>
    </div>
  )
});

export default function InteractiveMap() {
  const [showRoute, setShowRoute] = useState(true);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[11px] uppercase tracking-[5px] text-burnt-orange mb-3 font-medium"
            >
              Explore the Region
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-cream leading-tight"
            >
              Interactive <span className="gradient-text-cool">Map</span>
            </motion.h2>
          </div>
          
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onClick={() => setShowRoute(!showRoute)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
              showRoute 
              ? "bg-burnt-orange border-burnt-orange text-white shadow-[0_0_15px_rgba(198,122,60,0.3)]" 
              : "bg-transparent border-cream/20 text-cream/60 hover:text-white"
            }`}
          >
            {showRoute ? <MapIcon size={16} /> : <Route size={16} />}
            {showRoute ? "Hide Route" : "Show Route"}
          </motion.button>
        </div>

        {/* Map container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-2 sm:p-4 relative rounded-3xl overflow-hidden shadow-2xl border border-cream/10 bg-[#0C1420]/80 backdrop-blur-md"
        >
          {/* Render the dynamically imported Leaflet Map */}
          <MapCore showRoute={showRoute} />
        </motion.div>
      </div>
    </section>
  );
}
