'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId;
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15, vy: -Math.random() * 0.2 - 0.05,
        size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.2 + 0.05, life: Math.random() * 1000,
        color: Math.random() > 0.7 ? '198,122,60' : '245,240,232',
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life += 1;
        p.opacity = 0.03 + Math.sin(p.life * 0.006) * 0.1;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.max(0, p.opacity)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />;
}

export default function HeroSection() {
  return (
    <>
      {/* HERO — Full viewport, minimal content */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
        {/* BG with Ken Burns */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(12,20,32,0.7) 0%, rgba(12,20,32,0.3) 40%, rgba(12,20,32,0.9) 100%)' }} />
        </div>

        <div className="absolute inset-0 film-grain z-[2] pointer-events-none opacity-30" />
        <ParticleField />

        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none">
          <svg viewBox="0 0 1440 200" className="absolute bottom-[40px] w-full opacity-30" preserveAspectRatio="none">
            <path d="M0,160L60,144C120,128,240,96,360,96C480,96,600,128,720,144C840,160,960,160,1080,144C1200,128,1320,96,1380,80L1440,64L1440,200L0,200Z" fill="#1E2D4A" fillOpacity="0.6"/>
          </svg>
          <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,160L48,165C96,171,192,181,288,181C384,181,480,171,576,155C672,139,768,117,864,117C960,117,1056,139,1152,149C1248,160,1344,160,1392,160L1440,160L1440,200L0,200Z" fill="#0C1420"/>
          </svg>
        </div>

        {/* Content — centered, spacious */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2.5 backdrop-blur-md bg-cream/5 border border-cream/10 rounded-full px-5 py-2.5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-burnt-orange animate-pulse" />
            <span className="text-[11px] uppercase tracking-[4px] text-cream/50 font-medium">Yatra · Adventure · Memories</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1] tracking-tight mb-8 text-cream"
          >
            Not Just Trips.
            <br />
            <span className="gradient-text">Himalayan Stories.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-cream/35 max-w-xl mx-auto mb-12 leading-relaxed font-light"
          >
            Curated spiritual journeys, cinematic adventures, and
            group experiences across the majestic Himalayas.
          </motion.p>

          {/* CTAs — clean, spacious */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/destinations">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-base px-10 py-4"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Explore Trips <ArrowRight size={18} />
                </span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-base px-10 py-4"
            >
              <span className="flex items-center gap-2.5">
                <Play size={16} fill="currentColor" /> Watch Reel
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[4px] text-cream/20 font-medium">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={18} className="text-cream/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Search Section — overlapping hero, perfectly centered */}
      <section className="relative z-20 -mt-14 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="glass-card p-3 flex flex-col sm:flex-row items-center gap-4 shadow-2xl mx-auto w-full border-cream/10 bg-[#0c1420]/80 backdrop-blur-3xl"
          >
            <div className="flex-1 flex items-center gap-4 px-5 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-burnt-orange flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Search for destinations, yatras, or experiences..."
                className="w-full bg-transparent border-none outline-none text-cream placeholder-cream/30 text-base py-4 font-medium"
              />
            </div>
            <button className="w-full sm:w-auto text-cream px-10 py-4 rounded-[14px] text-sm font-bold transition-all hover:shadow-glow-orange hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #C67A3C, #D4842A)' }}>
              Explore
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
