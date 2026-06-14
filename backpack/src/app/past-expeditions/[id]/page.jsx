"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MapPin, Calendar, Users, Star, 
  Clock, Route, Mountain, X, ChevronLeft, ChevronRight, CheckCircle2 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";

export default function PastExpeditionDetails({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [expedition, setExpedition] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function fetchExpedition() {
      try {
        const res = await fetch(`/api/past-expeditions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setExpedition(data);
        }
      } catch (err) {
        console.error("Failed to fetch expedition:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpedition();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-burnt-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-cream">
        <h1 className="text-2xl font-bold mb-4">Expedition not found</h1>
        <button onClick={() => router.back()} className="text-burnt-orange hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (expedition.gallery && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % expedition.gallery.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (expedition.gallery && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + expedition.gallery.length) % expedition.gallery.length);
    }
  };

  return (
    <main className="min-h-screen bg-midnight text-cream font-[family-name:var(--font-body)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={expedition.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}
            alt={expedition.title}
            fill
            priority
            className="object-cover opacity-40 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/60 to-midnight" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cream/60 hover:text-burnt-orange transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Trips</span>
          </button>

          <div className="flex flex-col md:flex-row gap-12 items-end">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide mb-6"
              >
                <CheckCircle2 size={14} />
                SUCCESSFULLY COMPLETED
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-black tracking-tight mb-4"
              >
                {expedition.title}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-6 text-cream/70 text-sm md:text-base"
              >
                <span className="flex items-center gap-2"><MapPin size={18} className="text-burnt-orange" /> {expedition.destination}</span>
                <span className="flex items-center gap-2"><Calendar size={18} className="text-burnt-orange" /> {expedition.date}</span>
                <span className="flex items-center gap-2"><Users size={18} className="text-teal" /> {expedition.travelers} Travelers</span>
                <span className="flex items-center gap-2 text-yellow-400"><Star size={18} className="fill-current" /> {expedition.rating}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-10 z-20 px-6">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-6 border border-white/10 flex flex-wrap justify-between gap-6 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-cream/40 text-xs uppercase tracking-widest font-semibold mb-1">Duration</span>
            <span className="flex items-center gap-2 font-bold text-lg"><Clock size={18} className="text-burnt-orange" /> {expedition.duration || "N/A"}</span>
          </div>
          <div className="w-px bg-white/10 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-cream/40 text-xs uppercase tracking-widest font-semibold mb-1">Difficulty</span>
            <span className="flex items-center gap-2 font-bold text-lg"><Mountain size={18} className="text-burnt-orange" /> {expedition.difficulty || "Moderate"}</span>
          </div>
          <div className="w-px bg-white/10 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-cream/40 text-xs uppercase tracking-widest font-semibold mb-1">Distance</span>
            <span className="flex items-center gap-2 font-bold text-lg"><Route size={18} className="text-burnt-orange" /> {expedition.distance || "N/A"}</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Overview */}
            {expedition.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-burnt-orange"></span> Overview
                </h2>
                <p className="text-cream/70 text-lg leading-relaxed">{expedition.description}</p>
              </motion.div>
            )}

            {/* Highlights & Route */}
            <div className="grid sm:grid-cols-2 gap-8">
              {expedition.highlights && expedition.highlights.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-6 text-burnt-orange">Highlights</h3>
                  <ul className="space-y-3">
                    {expedition.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/70">
                        <CheckCircle2 size={18} className="text-teal shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {expedition.route && expedition.route.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-6 text-burnt-orange">Route</h3>
                  <div className="relative border-l-2 border-white/10 ml-3 space-y-6">
                    {expedition.route.map((r, i) => (
                      <div key={i} className="relative pl-6">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                        <span className="text-cream/80 font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Timeline */}
            {expedition.timeline && expedition.timeline.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-burnt-orange"></span> Journey Timeline
                </h2>
                <div className="space-y-6">
                  {expedition.timeline.map((item, i) => (
                    <div key={i} className="glass-card p-6 flex gap-6">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-12 h-12 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center font-bold text-lg mb-2">
                          D{item.day}
                        </div>
                        {i !== expedition.timeline.length - 1 && <div className="w-px h-full bg-white/10" />}
                      </div>
                      <div className="pb-4">
                        <h4 className="text-lg font-bold text-cream mb-2">{item.title}</h4>
                        <p className="text-cream/60 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {expedition.gallery && expedition.gallery.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-burnt-orange"></span> Memories Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {expedition.gallery.map((img, i) => (
                    <div 
                      key={i} 
                      className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2 h-64 md:h-80' : 'h-32 md:h-40'}`}
                      onClick={() => setLightboxIndex(i)}
                    >
                      <Image
                        src={img}
                        alt={`Memory ${i+1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Testimonials */}
            {expedition.testimonials && expedition.testimonials.length > 0 && (
              <div className="sticky top-24">
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-6 text-cream border-b border-white/10 pb-4">
                  Traveler Reviews
                </h3>
                <div className="space-y-4">
                  {expedition.testimonials.map((test, i) => (
                    <div key={i} className="glass p-5 rounded-2xl border border-white/5">
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={14} className={idx < test.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
                        ))}
                      </div>
                      <p className="text-cream/80 text-sm italic mb-4 leading-relaxed">"{test.review}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-white/10">
                          {test.image ? (
                            <Image src={test.image} alt={test.name} fill className="object-cover" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs">{test.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-sm text-cream">{test.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && expedition.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center touch-none"
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[101]"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors p-4 z-[101] hidden md:block"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={48} />
            </button>

            <motion.div 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[70vh] md:h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={expedition.gallery[lightboxIndex]}
                alt="Fullscreen memory"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <button 
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors p-4 z-[101] hidden md:block"
              onClick={handleNextImage}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-sm">
              {lightboxIndex + 1} / {expedition.gallery.length}
            </div>
            
            {/* Mobile swipe controls */}
            <div className="absolute inset-0 flex md:hidden">
              <div className="flex-1" onClick={handlePrevImage} />
              <div className="flex-1" onClick={handleNextImage} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
