"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, MapPin, Clock, Wallet, Loader2 } from "lucide-react";

const suggestions = [
  "3-day trek under ₹5000",
  "Spiritual journey to Kedarnath",
  "Family trip to Kashmir in summer",
  "Solo bike trip to Ladakh",
  "Weekend getaway from Delhi",
];

const mockItinerary = [
  {
    day: 1,
    title: "Arrival & Acclimatization",
    desc: "Reach destination, check into accommodation, light exploration of nearby areas.",
  },
  {
    day: 2,
    title: "Trek & Exploration",
    desc: "Full day trek/sightseeing with local guide. Packed lunch, sunset viewpoint.",
  },
  {
    day: 3,
    title: "Cultural Immersion",
    desc: "Visit temples, interact with locals, try authentic cuisine. Evening bonfire.",
  },
  {
    day: 4,
    title: "Adventure Day",
    desc: "Paragliding/rafting/camping activity. Photography at scenic spots.",
  },
  {
    day: 5,
    title: "Departure",
    desc: "Morning leisure, souvenir shopping. Transfer to station/airport.",
  },
];

export default function AiTripPlanner() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 2500);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: "rgba(198,122,60,0.04)" }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
          >
            <Sparkles size={14} className="text-burnt-orange" />
            <span className="text-[11px] uppercase tracking-[3px] text-cream/50 font-medium">
              AI-Powered
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-cream leading-tight mb-5"
          >
            Smart Trip <span className="gradient-text">Planner</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream/35 text-base md:text-lg leading-relaxed"
          >
            Describe your dream trip and our AI will craft a personalized
            itinerary in seconds.
          </motion.p>
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {!result ? (
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass rounded-2xl p-2 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Sparkles
                      size={18}
                      className="text-burnt-orange/50 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 5-day spiritual trip to Kedarnath under ₹10,000..."
                      className="w-full bg-transparent border-none outline-none text-cream/90 placeholder-cream/20 text-sm py-3"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="text-cream px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #C67A3C, #D4842A)",
                    }}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    {loading ? "Planning..." : "Plan"}
                  </motion.button>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPrompt(s)}
                      className="text-xs text-cream/30 px-3 py-1.5 rounded-full border border-cream/8 hover:border-burnt-orange/30 hover:text-cream/60 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </form>

              {loading && (
                <div className="mt-8">
                  <div className="h-1 rounded-full bg-cream/5 overflow-hidden">
                    <motion.div
                      animate={{ width: ["0%", "70%", "90%"] }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #C67A3C, #D4A843)",
                      }}
                    />
                  </div>
                  <p className="text-cream/20 text-xs mt-3 text-center">
                    Crafting your personalized itinerary...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="glass-card p-6 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MapPin size={18} className="text-burnt-orange" />
                    <span className="text-cream text-sm font-medium">
                      Kedarnath
                    </span>
                    <span className="text-cream/30 text-xs">Destination</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Clock size={18} className="text-burnt-orange" />
                    <span className="text-cream text-sm font-medium">
                      5 Days
                    </span>
                    <span className="text-cream/30 text-xs">Duration</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Wallet size={18} className="text-burnt-orange" />
                    <span className="text-cream text-sm font-medium">
                      ₹8,500
                    </span>
                    <span className="text-cream/30 text-xs">Est. Budget</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="glass-card p-8">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream mb-6">
                    Your Itinerary
                  </h3>
                  <div className="space-y-6">
                    {mockItinerary.map((day, i) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-burnt-orange/15 text-burnt-orange text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {day.day}
                          </div>
                          {i < mockItinerary.length - 1 && (
                            <div className="w-px h-full bg-cream/5 mt-1" />
                          )}
                        </div>
                        <div className="pb-6">
                          <h4 className="text-cream font-semibold text-sm mb-1">
                            {day.title}
                          </h4>
                          <p className="text-cream/35 text-sm leading-relaxed">
                            {day.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary py-3 px-8 flex-1"
                  >
                    <span className="relative z-10">Book This Trip</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setResult(false);
                      setPrompt("");
                    }}
                    className="btn-secondary py-3 px-8 flex-1"
                  >
                    Try Another
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
