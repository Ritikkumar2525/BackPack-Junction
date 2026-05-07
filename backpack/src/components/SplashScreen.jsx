"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Deterministic star generator to avoid hydration mismatch
const generateStars = () => {
  const stars = [];
  let seed = 12345;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 400; i++) {
    stars.push({
      id: i,
      left: random() * 100,
      top: random() * 100,
      size: random() * 2.5 + 1.0, // 1.0px to 3.5px
      dur: random() * 3 + 2, // 2s to 5s
      delay: random() * 5,
      opacity: random() * 0.8 + 0.4, // 0.4 to 1.2
    });
  }
  return stars;
};

const STARS = generateStars();

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 3000);
    const t3 = setTimeout(() => onComplete(), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            // Deep starry night sky gradient
            background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
          }}
        >
          {/* Ambient center glow to highlight the logo */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(198,122,60,0.1) 0%, transparent 60%)",
            }}
          />

          {/* Twinkling Stars Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {STARS.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                }}
                animate={{
                  opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: s.dur,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: "blur(15px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10"
          >
            <motion.img
              src="/logo.jpg"
              alt="Backpack Junction"
              className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover"
              style={{
                boxShadow:
                  "0 0 60px rgba(198,122,60,0.4), 0 0 120px rgba(198,122,60,0.2)",
                border: "2px solid rgba(198,122,60,0.5)",
              }}
              animate={{
                boxShadow: [
                  "0 0 60px rgba(198,122,60,0.4)",
                  "0 0 90px rgba(198,122,60,0.7)",
                  "0 0 60px rgba(198,122,60,0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-10 mt-8 text-center"
          >
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream tracking-widest drop-shadow-lg">
              BACKPACK <span style={{ color: "#C67A3C" }}>JUNCTION</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <AnimatePresence>
            {phase === "tagline" && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mt-3 text-sm md:text-base tracking-[6px] uppercase"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                Yatra · Adventure · Memories
              </motion.p>
            )}
          </AnimatePresence>

          {/* Loading bar - styled like a shooting star or subtle glow line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="relative z-10 mt-12 h-[1px] rounded-full"
            style={{ 
              background: "linear-gradient(90deg, transparent, #C67A3C, transparent)",
              boxShadow: "0 0 10px #C67A3C"
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
