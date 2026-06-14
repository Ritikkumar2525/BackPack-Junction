"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    name: "Priya Sharma",
    avatar: "P",
    trip: "Spiti Valley",
    location: "Delhi",
    rating: 5,
    text: "The Spiti road trip was like entering another planet. The team handled everything — from permits to camping under stars at Chandratal. Absolutely magical.",
  },
  {
    name: "Rohit Singh",
    avatar: "R",
    trip: "Kashmir Expedition",
    location: "Bangalore",
    rating: 5,
    text: "Kashmir through BackPack's eyes is a completely different experience. The houseboat, the shikara ride at sunset, the local cuisine — pure paradise.",
  },
  {
    name: "Sneha Patel",
    avatar: "S",
    trip: "Kedarnath Trek",
    location: "Mumbai",
    rating: 5,
    text: "This wasn't just a trip — it was a spiritual awakening. The guides knew every trail, every story, every hidden waterfall. I came back a different person.",
  },
  {
    name: "Ankit Verma",
    avatar: "A",
    trip: "Valley of Flowers",
    location: "Jaipur",
    rating: 5,
    text: "Walking through endless meadows of wildflowers with snow-capped peaks in the background — no photograph can do it justice. Backpack Junction made it seamless.",
  },
  {
    name: "Kittu",
    avatar: "K",
    trip: "Tungnath Chopta Trek",
    location: "Ranchi",
    rating: 5,
    text: "The highest Shiva temple at Tungnath was breathtaking. The trek, the views from Chandrashila, and the bonfire nights — best weekend of my life.",
  },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const GoogleLogo = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function GoogleReviewsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (idx) => {
      setDirection(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active]
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const r = reviews[active];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs uppercase tracking-[4px] text-burnt-orange/80 mb-4"
          >
            Traveler Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title text-cream mb-6"
          >
            What They <span className="gradient-text">Say</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <GoogleLogo />
            <span className="text-cream/50 text-sm">
              Rated <span className="text-cream font-semibold">4.7★</span> on
              Google
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="text-cream/30 max-w-md mx-auto text-sm leading-relaxed"
          >
            Read authentic reviews from travelers who explored India with
            Backpack Junction.
          </motion.p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT CARD — Rating Summary (35%) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 glass-card p-8 md:p-10 flex flex-col items-center text-center"
          >
            {/* Google badge */}
            <div className="flex items-center gap-2 mb-6">
              <GoogleLogo size={20} />
              <span className="text-cream/50 text-sm font-medium">
                Google Reviews
              </span>
            </div>

            {/* Rating number */}
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-6xl font-[family-name:var(--font-heading)] font-black text-cream">
                4.7
              </span>
              <span className="text-cream/20 text-lg">/ 5</span>
            </div>

            {/* 5 Gold Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} />
              ))}
            </div>

            <p className="text-cream/30 text-xs mb-8">
              Based on{" "}
              <span className="text-cream/50 font-medium">20+</span> Google
              Reviews
            </p>

            {/* Rating Distribution */}
            <div className="w-full space-y-2.5 mb-8">
              {[
                { stars: 5, pct: 80 },
                { stars: 4, pct: 15 },
                { stars: 3, pct: 5 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="text-xs text-cream/30 w-5 text-right font-medium">
                    {row.stars}★
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="h-full rounded-full bg-amber-400/50"
                    />
                  </div>
                  <span className="text-xs text-cream/20 w-8 text-right">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <a
                href="https://share.google/Ryv7yOomkiGiCY9Vb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-burnt-orange text-white font-semibold text-sm hover:bg-burnt-orange/90 transition-all duration-300 hover:shadow-lg hover:shadow-burnt-orange/20 w-full"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View All Google Reviews
              </a>
              <a
                href="https://g.page/r/CVyPiEhx33rsEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-cream/50 font-medium text-sm hover:border-white/20 hover:text-cream transition-all duration-300 w-full"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write a Review
              </a>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 mt-5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
              <span className="text-[10px] uppercase tracking-[2px] text-cream/25 font-medium">
                Verified Google Business
              </span>
            </div>
          </motion.div>

          {/* RIGHT CARD — Review Carousel (65%) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 glass-card p-8 md:p-10 relative overflow-hidden flex flex-col"
          >
            {/* Quote icon top-right */}
            <div className="absolute top-6 right-8 text-burnt-orange/10 pointer-events-none">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
            </div>

            {/* Carousel Content */}
            <div className="flex-1 flex flex-col justify-center min-h-[280px] relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-cream/60 text-base md:text-lg leading-relaxed font-[family-name:var(--font-body)] italic mb-8 max-w-lg">
                    &ldquo;{r.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-burnt-orange/70">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="text-cream font-semibold text-sm">
                        {r.name}
                      </div>
                      <div className="text-cream/30 text-xs">
                        {r.trip} · {r.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 h-2 bg-burnt-orange"
                        : "w-2 h-2 bg-white/15 hover:bg-white/25"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-cream/40 hover:text-cream hover:border-white/25 transition-all duration-300"
                  aria-label="Previous review"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-cream/40 hover:text-cream hover:border-white/25 transition-all duration-300"
                  aria-label="Next review"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
