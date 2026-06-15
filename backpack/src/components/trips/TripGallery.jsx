"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function TripGallery({ images = [] }) {
  const [lightbox, setLightbox] = useState(-1);
  if (!images.length) return null;

  const next = () => setLightbox((p) => (p + 1) % images.length);
  const prev = () => setLightbox((p) => (p - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group border border-white/5"
          >
            <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox >= 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightbox(-1)}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightbox(-1); }} className="absolute top-6 right-6 text-white/60 hover:text-white z-10 p-2"><X size={28} /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 text-white/60 hover:text-white z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 text-white/60 hover:text-white z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronRight size={24} /></button>
            <div className="relative w-full max-w-6xl h-[70vh] md:h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Image src={images[lightbox]} alt="" fill className="object-contain" />
            </div>
            <p className="absolute bottom-6 text-white/40 text-sm">{lightbox + 1} / {images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
