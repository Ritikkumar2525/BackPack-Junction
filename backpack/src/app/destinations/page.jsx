"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const categories = [
  "All",
  "Spiritual",
  "Adventure",
  "Trekking",
  "Scenic",
  "Cultural",
  "Remote",
  "Snow",
];

const difficultyColor = {
  Easy: "bg-teal/20 text-teal",
  Moderate: "bg-navy-light/20 text-navy-light",
  Challenging: "bg-burnt-orange/20 text-burnt-orange",
  Extreme: "bg-red-500/20 text-red-400",
};

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allDestinations, setAllDestinations] = useState(destinations);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
          const data = await res.json();
          setAllDestinations(data);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    }
    fetchDestinations();
  }, []);

  const filtered = allDestinations.filter((d) => {
    const matchesCategory =
      activeCategory === "All" || d.category.includes(activeCategory);
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-[4px] text-navy-light mb-4 block">
              Explore
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-4">
              All <span className="gradient-text">Destinations</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-xl mx-auto">
              From sacred temples to frozen passes — find your next Himalayan
              story.
            </p>
          </motion.div>

          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="glass rounded-2xl p-2 flex items-center gap-2 mb-6">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cream/40"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full bg-transparent border-none outline-none text-cream/90 placeholder-cream/20 text-sm py-3"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-burnt-orange to-copper text-cream shadow-lg shadow-burnt-orange/20"
                      : "glass text-cream/50 hover:text-cream/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                layout
              >
                <Link href={`/destinations/${dest.id}`} className="block group">
                  <div className="glass-card overflow-hidden h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-[#0C1420]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${difficultyColor[dest.difficulty]}`}
                        >
                          {dest.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-cream text-sm font-semibold">
                          {dest.rating}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 text-right">
                        <span className="text-cream/40 text-[10px] block">Starting From</span>
                        <span className="text-cream font-bold text-lg">
                          ₹{(dest.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream mb-1">
                        {dest.name}
                      </h3>
                      <p className="text-burnt-orange text-xs font-medium uppercase tracking-wider mb-3">
                        {dest.tagline}
                      </p>
                      <p className="text-cream/40 text-sm leading-relaxed mb-4 line-clamp-2">
                        {dest.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dest.category.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] uppercase tracking-wider text-cream/40 px-2 py-1 rounded-full border border-cream/10"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🏔️</span>
              <p className="text-cream/40 text-lg">
                No destinations found. Try a different search or filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
