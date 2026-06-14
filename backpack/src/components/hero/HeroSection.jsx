'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Search, MapPin, Loader2, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const backgrounds = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=85",
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=85"
];

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      if (!isDeleting && i <= text.length) {
        setDisplayText(text.substring(0, i));
        i++;
        timeout = setTimeout(type, 120);
      } else if (isDeleting && i >= 0) {
        setDisplayText(text.substring(0, i));
        i--;
        timeout = setTimeout(type, 50);
      } else if (i > text.length) {
        isDeleting = true;
        timeout = setTimeout(type, 4000); // Pause before deleting
      } else if (i < 0) {
        isDeleting = false;
        i = 0;
        timeout = setTimeout(type, 1000); // Pause before typing again
      }
    };

    timeout = setTimeout(type, 100);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <span className="inline-block relative">
      <span className="gradient-text">{displayText}</span>
      <span className="inline-block w-[5px] h-[0.9em] bg-burnt-orange ml-1 align-baseline animate-pulse" />
    </span>
  );
};

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId, lastFrame = 0, resizeTimer;
    const INTERVAL = 1000 / 24; // 24fps is plenty for slow-floating particles
    const particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const debouncedResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); };
    resize();
    window.addEventListener('resize', debouncedResize, { passive: true });
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15, vy: -Math.random() * 0.2 - 0.05,
        size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.2 + 0.05, life: Math.random() * 1000,
        color: Math.random() > 0.7 ? '198,122,60' : '245,240,232',
      });
    }
    const animate = (ts) => {
      animId = requestAnimationFrame(animate);
      if (ts - lastFrame < INTERVAL) return;
      lastFrame = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life += 1;
        p.opacity = 0.03 + Math.sin(p.life * 0.006) * 0.1;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.2832);
        ctx.fillStyle = `rgba(${p.color},${Math.max(0, p.opacity)})`;
        ctx.fill();
      }
    };
    animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); clearTimeout(resizeTimer); window.removeEventListener('resize', debouncedResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />;
}

export default function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000); // Change image every 4 seconds for cinematic feel
    return () => clearInterval(interval);
  }, []);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/destinations`);
    }
  };

  return (
    <>
      {/* HERO — Full viewport, minimal content */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
        {/* Cinematic Background Slider */}
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence>
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${backgrounds[bgIndex]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(12,20,32,0.8) 0%, rgba(12,20,32,0.6) 50%, rgba(12,20,32,0.95) 100%)' }} />
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
        <div id="tour-step-hero" className="relative z-10 max-w-4xl mx-auto px-6 text-center py-10 rounded-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2.5 backdrop-blur-md bg-black/20 border border-cream/20 shadow-lg rounded-full px-5 py-2.5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-burnt-orange animate-pulse" />
            <span className="text-[11px] uppercase tracking-[4px] text-cream/80 font-medium drop-shadow-md">Yatra · Adventure · Memories</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.1] tracking-tight mb-8 text-cream min-h-[140px] md:min-h-[160px] drop-shadow-2xl"
          >
            Not Just Trips.
            <br />
            <TypewriterText text="Himalayan Stories." />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-cream/90 max-w-xl mx-auto mb-12 leading-relaxed font-normal drop-shadow-lg"
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
                className="btn-primary text-base px-10 py-4 shadow-xl shadow-burnt-orange/20"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Explore Trips <ArrowRight size={18} />
                </span>
              </motion.button>
            </Link>
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
        <div className="max-w-4xl mx-auto px-6 relative" ref={searchContainerRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`glass-card p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shadow-2xl mx-auto w-full transition-all duration-300 bg-[#0c1420]/80 backdrop-blur-xl border ${isFocused ? 'border-burnt-orange/50 ring-4 ring-burnt-orange/10' : 'border-cream/10'}`}
          >
            <div className="flex-1 flex items-center gap-4 px-4 sm:px-5 w-full">
              <Search className={`flex-shrink-0 transition-colors ${isFocused ? 'text-burnt-orange' : 'text-cream/50'}`} size={20} />
              <input
                type="text"
                placeholder="Search destinations, yatras, or experiences..."
                className="w-full bg-transparent border-none outline-none text-cream placeholder-cream/40 text-base sm:text-lg py-3 sm:py-4 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              {isSearching && <Loader2 className="animate-spin text-burnt-orange" size={18} />}
            </div>
            <button 
              onClick={handleSearchSubmit}
              className="w-full sm:w-auto text-cream px-10 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex justify-center items-center gap-2 overflow-hidden relative group" 
              style={{ background: 'linear-gradient(135deg, #C67A3C, #D4842A)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">Explore</span>
              <Navigation size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isFocused && searchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-6 right-6 mt-3 bg-[#0f1724]/95 backdrop-blur-xl border border-cream/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {searchResults.map((result, idx) => (
                      <Link 
                        href={result.href} 
                        key={`${result.type}-${result.id}-${idx}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => setIsFocused(false)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 relative">
                          {result.image ? (
                            <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-burnt-orange">
                              <MapPin size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-cream font-medium text-base truncate group-hover:text-burnt-orange transition-colors">{result.title}</h4>
                          <p className="text-cream/40 text-xs truncate">{result.subtitle || (result.type === 'destination' ? 'Destination' : 'Trip')}</p>
                        </div>
                        <ArrowRight size={16} className="text-cream/20 group-hover:text-burnt-orange group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <Search className="text-cream/20 mb-3" size={32} />
                    <p className="text-cream/50 text-sm">No results found for &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
