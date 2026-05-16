"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Play } from "lucide-react";

export default function TravelMemories() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/gallery?featured=true&limit=6");
        if (res.ok) {
          const data = await res.json();
          setMemories(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured memories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading || memories.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0F18] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-burnt-orange/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mb-12 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-burnt-orange tracking-[4px] uppercase text-xs md:text-sm font-semibold mb-3"
        >
          Real People, Real Experiences
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)]"
        >
          Travel <span className="text-cream/40 italic">Memories</span>
        </motion.h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-12 px-4 sm:px-6 md:px-12 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {memories.map((memory, i) => (
          <motion.div
            key={memory._id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative min-w-[280px] sm:min-w-[350px] md:min-w-[450px] h-[400px] md:h-[550px] rounded-2xl overflow-hidden shrink-0 snap-center group cursor-grab active:cursor-grabbing"
          >
            {memory.mediaType === 'video' ? (
              <>
                <video 
                  src={memory.url} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  loop muted playsInline
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                    <Play fill="white" size={20} className="ml-1" />
                  </div>
                </div>
              </>
            ) : (
              <img 
                src={memory.url} 
                alt={memory.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            )}
            
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F18] via-[#0A0F18]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-2 text-burnt-orange mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <MapPin size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">{memory.destination}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-[family-name:var(--font-heading)] drop-shadow-lg">
                {memory.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
