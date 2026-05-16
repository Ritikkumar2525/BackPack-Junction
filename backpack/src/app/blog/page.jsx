"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Calendar, ChevronRight } from "lucide-react";

const categories = [
  "All",
  "Trek Guide",
  "Hidden Destinations",
  "Travel Tips",
  "Spiritual Journeys",
  "Packing Lists",
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filtered = activeCategory === "All"
    ? blogs
    : blogs.filter((p) => p.category === activeCategory);
    
  // If "All" is selected and there's a featured post, use the first featured post as the hero
  const featured = activeCategory === "All" ? filtered.find((p) => p.isFeatured) : null;
  const rest = filtered.filter((p) => !featured || p._id !== featured._id);

  return (
    <main className="relative overflow-x-hidden min-h-screen bg-transparent">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1017]/40 to-transparent pointer-events-none z-0" />
        
        {/* Cinematic light rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-burnt-orange/10 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-[6px] text-burnt-orange mb-4 block">
              Stories & Guides
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-6 drop-shadow-lg">
              Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-burnt-orange to-amber-500">Blog</span>
            </h1>
            <p className="text-cream/50 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Immersive trek guides, travel tips, hidden destinations, and authentic stories from the heart of the Himalayas.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 backdrop-blur-md border ${
                  activeCategory === c 
                    ? "bg-burnt-orange border-burnt-orange text-white shadow-[0_4px_20px_rgba(198,122,60,0.4)] scale-105" 
                    : "bg-white/5 border-white/10 text-cream/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32 text-cream/50 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
              <p className="text-xl font-[family-name:var(--font-heading)]">Stories are being written.</p>
              <p className="text-sm mt-2">Check back soon for new adventures.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              <AnimatePresence mode="wait">
                {featured && (
                  <motion.div
                    key="featured"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                  >
                    <Link href={`/blog/${featured.slug}`}>
                      <article className="group relative bg-[#0a1017]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(198,122,60,0.1)] transition-all duration-500 transform-gpu hover:-translate-y-2">
                        <div className="grid lg:grid-cols-2 min-h-[450px]">
                          <div className="relative h-72 lg:h-full overflow-hidden bg-gray-900">
                            <Image
                              src={featured.coverImage || "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b"}
                              alt={featured.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1017]/90 hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1017] to-transparent lg:hidden" />
                            <div className="absolute top-6 left-6 z-10">
                              <span className="bg-burnt-orange text-white text-[10px] font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(198,122,60,0.5)]">
                                Featured Story
                              </span>
                            </div>
                          </div>
                          <div className="p-8 lg:p-14 flex flex-col justify-center relative z-10">
                            <span className="text-teal-400 text-xs uppercase tracking-[3px] font-bold mb-4 drop-shadow-sm">
                              {featured.category}
                            </span>
                            <h2 className="font-[family-name:var(--font-heading)] text-3xl lg:text-5xl font-bold text-white mb-6 leading-[1.1] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-burnt-orange transition-all duration-300">
                              {featured.title}
                            </h2>
                            <p className="text-cream/60 text-base lg:text-lg leading-relaxed mb-8 line-clamp-3">
                              {featured.excerpt}
                            </p>
                            
                            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burnt-orange to-[#8a5020] flex items-center justify-center text-white font-bold shadow-lg">
                                  {featured.author?.charAt(0) || "B"}
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">{featured.author}</p>
                                  <div className="flex items-center gap-3 text-cream/40 text-xs mt-0.5">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime} min read</span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-burnt-orange group-hover:border-burnt-orange/50 transition-colors">
                                <ChevronRight size={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Blog grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {rest.map((post, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      key={post._id}
                    >
                      <Link href={`/blog/${post.slug}`} className="block h-full">
                        <article className="group h-full flex flex-col bg-[#0d1624] border border-white/5 rounded-[24px] overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 transform-gpu hover:-translate-y-2">
                          <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                            <Image
                              src={post.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1624] via-transparent to-transparent opacity-80" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-8 flex flex-col flex-1 relative z-10 -mt-8">
                            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-3 leading-[1.3] group-hover:text-burnt-orange transition-colors duration-300 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-cream/50 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>
                            
                            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-cream/40 text-xs">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-cream/70">{post.author}</span>
                                <div className="flex items-center gap-2">
                                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime} min</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-cream/30 group-hover:text-burnt-orange transition-colors">
                                <span className="font-medium">Read</span>
                                <ChevronRight size={14} />
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {rest.length === 0 && activeCategory !== "All" && (
                  <div className="col-span-full py-20 text-center text-cream/40 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                    No posts found in this category yet.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
