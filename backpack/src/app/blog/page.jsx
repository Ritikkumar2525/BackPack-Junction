"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const blogPosts = [
  {
    id: 1,
    title: "The Complete Kedarnath Trek Guide 2026",
    excerpt:
      "Everything you need to know before embarking on the sacred 16km trek — fitness prep, packing, route options, and hidden gems along the way.",
    image:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    category: "Trek Guide",
    author: "Arjun Nair",
    date: "Apr 28, 2026",
    readTime: "12 min",
    featured: true,
  },
  {
    id: 2,
    title: "10 Hidden Gems in Spiti Valley You Must Visit",
    excerpt:
      "Beyond Key Monastery and Chandratal — discover Spiti's secret villages, ancient caves, and trails that most tourists never find.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "Hidden Destinations",
    author: "Riya Sharma",
    date: "Apr 20, 2026",
    readTime: "8 min",
    featured: false,
  },
  {
    id: 3,
    title: "Solo Female Travel in the Himalayas: A Honest Guide",
    excerpt:
      "Real talk about safety, logistics, and the transformative experience of exploring the mountains alone as a woman.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    category: "Travel Tips",
    author: "Priya Desai",
    date: "Apr 15, 2026",
    readTime: "10 min",
    featured: false,
  },
  {
    id: 4,
    title: "Banaras: A Spiritual Journey Beyond the Ghats",
    excerpt:
      "The ancient city holds secrets in every lane. From hidden temples to midnight aarti — experience Kashi like a local.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
    category: "Spiritual Journeys",
    author: "Karan Mehta",
    date: "Apr 10, 2026",
    readTime: "9 min",
    featured: false,
  },
  {
    id: 5,
    title: "Ultimate Packing List for Himalayan Treks",
    excerpt:
      "Stop overpacking. Here's the exact gear list our trek leaders use — weight-optimized, weather-tested, budget-friendly.",
    image:
      "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=800&q=80",
    category: "Packing Lists",
    author: "Arjun Nair",
    date: "Apr 5, 2026",
    readTime: "7 min",
    featured: false,
  },
  {
    id: 6,
    title: "Ladakh by Bike: The Ultimate Road Trip Playlist",
    excerpt:
      "Routes, rest stops, altitude tips, and the songs that make every mountain pass feel like a movie scene.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    category: "Travel Tips",
    author: "Karan Mehta",
    date: "Mar 28, 2026",
    readTime: "6 min",
    featured: false,
  },
];

const categories = [
  "All",
  "Trek Guide",
  "Hidden Destinations",
  "Travel Tips",
  "Spiritual Journeys",
  "Packing Lists",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);
  const featured = blogPosts.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== "All");

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 to-midnight pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[4px] text-burnt-orange mb-4 block">
              Stories & Guides
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-4">
              Travel <span className="gradient-text-warm">Blog</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-xl mx-auto">
              Trek guides, travel tips, hidden destinations, and stories from
              the Himalayas.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 ${activeCategory === c ? "bg-gradient-to-r from-burnt-orange to-copper text-cream shadow-lg" : "glass text-cream/50 hover:text-cream/80"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured post */}
          {activeCategory === "All" && featured && (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden mb-12 group cursor-pointer"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-burnt-orange/90 text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className="text-teal text-xs uppercase tracking-wider font-semibold mb-3">
                    {featured.category}
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-cream mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-cream/40 text-sm leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-cream/30 text-xs">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{featured.date}</span>
                    <span>·</span>
                    <span>{featured.readTime} read</span>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="glass text-[10px] font-medium px-3 py-1 rounded-full text-cream/70">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-cream mb-2 leading-snug group-hover:text-navy-light transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-cream/40 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-cream/30 text-xs">
                    <span>
                      {post.author} · {post.date}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
