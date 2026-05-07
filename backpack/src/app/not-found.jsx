"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/95 to-midnight" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-navy-light/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <span className="text-[120px] md:text-[180px] font-[family-name:var(--font-heading)] font-bold leading-none gradient-text block">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream mb-4">
            Lost in the Mountains?
          </h1>
          <p className="text-cream/40 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            The trail you&apos;re looking for doesn&apos;t exist — but there are
            thousands of other paths waiting to be explored.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-10 py-4"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ← Back to Base Camp
                </span>
              </motion.button>
            </Link>
            <Link href="/destinations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-10 py-4"
              >
                Explore Destinations
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Floating mountains */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mt-16 opacity-30 select-none"
        >
          ⛰️
        </motion.div>
      </div>
    </main>
  );
}
