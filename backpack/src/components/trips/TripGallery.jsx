"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function TripGallery({ images = [] }) {
  const [lightbox, setLightbox] = useState(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lightbox >= 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightbox]);

  if (!images.length) return null;

  const next = () => setLightbox((p) => (p + 1) % images.length);
  const prev = () => setLightbox((p) => (p - 1 + images.length) % images.length);

  const modalContent = (
    <AnimatePresence>
      {lightbox >= 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(-1)}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[800px] h-[80vh] bg-[#0f0f0f] rounded-[20px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setLightbox(-1)} className="absolute top-4 right-4 text-white/70 hover:text-white z-20 bg-black/40 hover:bg-black/80 rounded-full p-2 backdrop-blur-md transition-all">
              <X size={20} />
            </button>
            
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-20 p-2 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md transition-all">
              <ChevronLeft size={24} />
            </button>
            
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-20 p-2 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md transition-all">
              <ChevronRight size={24} />
            </button>
            
            <div className="relative w-full h-full p-3 md:p-5">
              <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                <Image src={images[lightbox]} alt="" fill className="object-contain" />
              </div>
            </div>
            
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md z-20">
              {lightbox + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
