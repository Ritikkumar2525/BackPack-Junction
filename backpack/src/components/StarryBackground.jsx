"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Deterministic star generator to avoid hydration mismatch
const generateStars = (count) => {
  const stars = [];
  let seed = 98765;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
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

export default function StarryBackground() {
  const stars = useMemo(() => generateStars(400), []);

  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        // Deep starry night sky gradient global background
        background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
      }}
    >
      {stars.map((s) => (
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
            opacity: [s.opacity * 0.1, s.opacity, s.opacity * 0.1],
            scale: [1, 1.4, 1],
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
  );
}
