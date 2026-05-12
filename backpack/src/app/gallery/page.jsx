"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  return (
    <main className="relative overflow-x-hidden bg-[#0a0f18] min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1420] to-[#0a0f18] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[4px] text-burnt-orange mb-4 block">
              Visual Stories
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-4">
              Photo & Video <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-xl mx-auto">
              Memories from the trails, temples, and peaks of the Himalayas, uploaded by our community.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((img, i) => {
                const isVideo = img.image?.startsWith('data:video');
                return (
                  <motion.div
                    key={img._id || i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid cursor-pointer group"
                    onClick={() => setLightbox(i)}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-cream/5">
                      {isVideo ? (
                        <video
                          src={img.image}
                          autoPlay loop muted playsInline
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={img.image}
                          alt={img.title}
                          loading="lazy"
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105 bg-[#0C1420]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=800";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-[#0a0f18]/0 group-hover:bg-[#0a0f18]/40 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-cream font-semibold text-sm">
                          {img.title}
                        </p>
                        <p className="text-cream/50 text-xs">by {img.author}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {images[lightbox].image?.startsWith('data:video') ? (
                <video
                  src={images[lightbox].image}
                  autoPlay loop playsInline controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={images[lightbox].image}
                  alt={images[lightbox].title}
                  className="w-full h-full object-contain bg-[#0C1420]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200&h=800";
                  }}
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                <p className="text-cream font-[family-name:var(--font-heading)] text-xl font-bold">
                  {images[lightbox].title}
                </p>
                <p className="text-cream/50 text-sm">
                  by {images[lightbox].author}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-cream transition-colors"
              >
                ✕
              </button>
              {lightbox > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(lightbox - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-cream transition-colors"
                >
                  ←
                </button>
              )}
              {lightbox < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(lightbox + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-cream transition-colors"
                >
                  →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
