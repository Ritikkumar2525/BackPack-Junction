"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BeforeBookingGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery?limit=12");
        if (res.ok) {
          const data = await res.json();
          // We need 4 distinct images for this specific grid layout
          setImages(data.filter(item => item.mediaType === 'image').slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading || images.length < 4) return null;

  return (
    <section className="py-24 bg-[#0a0f18] relative overflow-hidden border-t border-cream/5">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-burnt-orange/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-heading)] leading-tight">
              Don't just travel. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-burnt-orange to-copper italic">
                Experience.
              </span>
            </h2>
            <p className="text-cream/60 text-lg md:text-xl max-w-lg leading-relaxed">
              Join thousands of travelers who have found their calling in the mountains. Disconnect from the noise, bond with like-minded souls, and create memories that last a lifetime.
            </p>
            <div className="pt-4">
              <Link 
                href="/dashboard/book-trip"
                className="btn-primary px-8 py-4 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(198,122,60,0.3)] hover:shadow-[0_0_50px_rgba(198,122,60,0.5)] transition-shadow inline-block text-center"
              >
                <span className="relative z-10">Find Your Next Adventure</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Emotional Grid */}
          <div className="grid grid-cols-2 gap-4 h-[500px] md:h-[600px]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-span-1 row-span-2 rounded-2xl overflow-hidden relative group"
            >
              <Image src={images[0].url} alt="Travelers bonding" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group"
            >
              <Image src={images[1].url} alt="Mountain sunrise" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
            
            <div className="col-span-1 row-span-1 grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl overflow-hidden relative group"
              >
                <Image src={images[2].url} alt="Group shot" fill sizes="(max-width: 1024px) 25vw, 15vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl overflow-hidden relative group"
              >
                <Image src={images[3].url} alt="Smiling traveler" fill sizes="(max-width: 1024px) 25vw, 15vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
