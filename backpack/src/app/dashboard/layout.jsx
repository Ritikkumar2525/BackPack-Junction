"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, MapPin, CalendarCheck, ImagePlus, LogOut,
  Menu, X, ChevronRight, User
} from "lucide-react";
import ReviewPopup from "@/components/reviews/ReviewPopup";

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
    for (let i = 0; i < 40; i++) {
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
        p.opacity = 0.03 + Math.sin(p.life * 0.006) * 0.15;
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
  return <canvas ref={canvasRef} className="absolute inset-0 z-[3] pointer-events-none" />;
}

const userLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/dashboard/book-trip", label: "Book a Trip", icon: MapPin },
  { href: "/dashboard/gallery", label: "My Photos", icon: ImagePlus },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f18]">
        <div className="w-10 h-10 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const links = session?.user?.role === "admin" 
    ? [
        { href: "/admin", label: "Admin Panel", icon: LayoutDashboard },
        ...userLinks
      ]
    : userLinks;

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center relative bg-[#0a0f18] lg:p-8">
      {/* Background Image Overlay matching landing page vibe */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(12,20,32,0.85) 0%, rgba(12,20,32,0.95) 100%)' }} />
        <div className="absolute inset-0 film-grain z-[2] opacity-30" />
        <ParticleField />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[1400px] h-full lg:max-h-[900px] flex lg:rounded-3xl overflow-hidden shadow-2xl lg:border border-cream/10 bg-[#0a0f18]/60 backdrop-blur-2xl relative z-10"
      >
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-cream/5 p-6 relative z-10 bg-transparent h-full">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-burnt-orange/30" />
            <div>
              <span className="text-base font-bold text-cream font-[family-name:var(--font-heading)]">
                BACKPACK <span className="text-burnt-orange">JUNCTION</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[2px] text-cream/25">Dashboard</span>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/50 hover:text-cream hover:bg-cream/5 transition-all group">
                <link.icon size={18} className="text-cream/30 group-hover:text-burnt-orange transition-colors" />
                {link.label}
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
              </Link>
            ))}
          </nav>

          {/* Instagram link */}
          <a href="https://instagram.com/backpack_junction" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-pink-400 hover:text-white hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 transition-all border border-transparent hover:border-pink-500/20 mb-4 group shadow-lg shadow-black/20 mt-auto">
            <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/></svg>
            </div>
            Follow on Instagram
          </a>

          {/* User info + logout */}
          <div className="border-t border-cream/10 pt-5 mt-2">
            <div className="glass p-3 rounded-2xl flex items-center gap-3 mb-4 border border-cream/5 hover:border-burnt-orange/30 transition-colors cursor-pointer group">
              {session?.user?.image && !imageError ? (
                <img src={session.user.image} alt="" className="w-11 h-11 rounded-xl object-cover shadow-lg" onError={() => setImageError(true)} />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-burnt-orange to-copper text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-burnt-orange/20">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-cream text-[15px] font-bold truncate group-hover:text-burnt-orange transition-colors">{session?.user?.name}</p>
                <p className="text-cream/40 text-[11px] uppercase tracking-wider truncate font-medium mt-0.5">{session?.user?.email?.split('@')[0]}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Link href="/" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-cream/50 hover:text-cream hover:bg-cream/10 transition-all border border-cream/5">
                 Back to Home
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400/80 hover:text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all border border-red-500/10">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0a0f18]/90 backdrop-blur-xl border-b border-cream/5">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-bold text-cream font-[family-name:var(--font-heading)]">BACKPACK <span className="text-burnt-orange">J.</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cream p-2">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="fixed inset-0 z-40 lg:hidden bg-[#0a0f18]/95 backdrop-blur-xl pt-16 p-6">
              <nav className="space-y-1 mt-4">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base text-cream/60 hover:text-cream hover:bg-cream/5 transition-all">
                    <link.icon size={20} /> {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto lg:p-8 p-4 pt-16 lg:pt-8 pb-24 relative z-10" data-lenis-prevent>
          {children}
        </main>
        <ReviewPopup />
      </motion.div>
    </div>
  );
}
