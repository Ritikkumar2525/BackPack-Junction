"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    title: "Dawn at the Peaks",
    location: "Himachal Pradesh",
    category: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1597074866923-dc0589150a53?w=800&q=80",
    title: "Shikara on Dal Lake",
    location: "Kashmir",
    category: "Lakes",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    title: "Into the Valley",
    location: "Spiti Valley",
    category: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    title: "Mountain Monastery",
    location: "Ladakh",
    category: "Culture",
  },
  {
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    title: "Road to Ladakh",
    location: "Leh Highway",
    category: "Roads",
  },
  {
    src: "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=800&q=80",
    title: "Pine Forest Trail",
    location: "Manali",
    category: "Forests",
  },
  {
    src: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
    title: "Ganga Aarti",
    location: "Banaras",
    category: "Culture",
  },
  {
    src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    title: "Snow Summit",
    location: "Rohtang Pass",
    category: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    title: "River Crossing",
    location: "Rishikesh",
    category: "Rivers",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    title: "Golden Hour Trek",
    location: "Uttarakhand",
    category: "Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    title: "Misty Morning",
    location: "Himachal",
    category: "Forests",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    title: "Starry Night Camp",
    location: "Spiti Valley",
    category: "Night",
  },
];

const cats = [
  "All",
  "Mountains",
  "Lakes",
  "Culture",
  "Roads",
  "Forests",
  "Rivers",
  "Night",
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    active === "All" ? images : images.filter((img) => img.category === active);

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
            <span className="text-xs uppercase tracking-[4px] text-navy-light mb-4 block">
              Visual Stories
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-4">
              Photo <span className="gradient-text-cool">Gallery</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-xl mx-auto">
              Cinematic captures from the trails, temples, and peaks of the
              Himalayas.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 ${active === c ? "bg-gradient-to-r from-navy-light to-teal text-cream shadow-lg" : "glass text-cream/50 hover:text-cream/80"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src + active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightbox(i)}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-cream font-semibold text-sm">
                      {img.title}
                    </p>
                    <p className="text-cream/50 text-xs">{img.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-midnight/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight to-transparent">
                <p className="text-cream font-[family-name:var(--font-heading)] text-xl font-bold">
                  {filtered[lightbox].title}
                </p>
                <p className="text-cream/50 text-sm">
                  {filtered[lightbox].location}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center text-cream"
              >
                ✕
              </button>
              {lightbox > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(lightbox - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-cream"
                >
                  ←
                </button>
              )}
              {lightbox < filtered.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(lightbox + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-cream"
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
