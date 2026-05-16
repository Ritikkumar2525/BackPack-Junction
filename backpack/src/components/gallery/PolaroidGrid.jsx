"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PolaroidGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery?limit=8");
        if (res.ok) {
          const data = await res.json();
          // Safely check if data is an array before filtering
          if (Array.isArray(data)) {
            setImages(data.filter(item => item.mediaType === 'image').slice(0, 6));
          } else {
            console.error("Gallery API did not return an array", data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading || images.length === 0) return null;

  // Pre-calculated rotations and translations for the messy polaroid look
  const transforms = [
    { rotate: -6, y: 10 },
    { rotate: 4, y: -5 },
    { rotate: -3, y: 15 },
    { rotate: 5, y: -10 },
    { rotate: -8, y: 5 },
    { rotate: 7, y: 20 },
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-burnt-orange/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0C1420]/50 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4 text-white drop-shadow-md">
          Moments We Captured
        </h2>
        <p className="max-w-2xl mx-auto text-cream/60 text-sm md:text-base">
          Every journey tells a story. Here are a few unscripted moments from our recent yatras and expeditions across the Himalayas.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
          {images.map((item, i) => {
            const transform = transforms[i % transforms.length];
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: transform.y, rotate: transform.rotate }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 20, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#f8f5f0] p-3 pb-10 md:p-4 md:pb-14 rounded shadow-2xl relative cursor-pointer group origin-center border border-white/10"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Tape element */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 backdrop-blur-md shadow-sm rotate-2 z-10" />
                
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                  <Image 
                    src={item.url} 
                    alt={item.title || "Gallery image"}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover filter grayscale-[10%] contrast-110 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                
                <div className="absolute bottom-3 md:bottom-5 left-0 w-full text-center px-4">
                  <p className="font-['Caveat',cursive,var(--font-heading)] text-lg md:text-xl text-black/80 font-medium truncate">
                    {item.destination}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => window.location.href = '/gallery'}
            className="px-8 py-3 rounded-full border border-burnt-orange/50 text-burnt-orange font-semibold hover:bg-burnt-orange hover:text-white transition-colors duration-300 shadow-sm"
          >
            View More Moments
          </button>
        </div>
      </div>
    </section>
  );
}
