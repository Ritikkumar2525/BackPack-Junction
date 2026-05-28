"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { navLinks } from "@/data/destinations";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
  });

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showUserMenu]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          isScrolled
            ? "py-2 bg-midnight/80 backdrop-blur-xl border-b border-cream/5 shadow-2xl shadow-black/20"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.img
              src="/logo.jpg"
              alt="Backpack Junction"
              fetchPriority="high"
              className="w-10 h-10 rounded-full object-cover border border-burnt-orange/30 group-hover:border-burnt-orange/60 transition-colors"
              whileHover={{ scale: 1.08 }}
              style={{ boxShadow: "0 0 15px rgba(198,122,60,0.2)" }}
            />

            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-cream font-[family-name:var(--font-heading)]">
                BACKPACK <span className="text-burnt-orange">JUNCTION</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[3px] text-cream/30 -mt-0.5">
                Yatra · Adventure · Memories
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-burnt-orange to-copper group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA — Auth-aware */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "authenticated" && session?.user ? (
              /* Logged in state */
              <div 
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full glass border border-cream/10 hover:border-burnt-orange/30 transition-all"
                >
                  {session.user.image && !imageError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full object-cover border border-cream/20"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center text-sm font-bold">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-cream/80 text-sm font-medium max-w-[120px] truncate">
                    {session.user.name?.split(" ")[0] || "Traveler"}
                  </span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-14 w-64 bg-[#0C1420]/95 backdrop-blur-xl border border-cream/10 rounded-2xl p-2 shadow-2xl z-50 pt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-cream/5">
                        <p className="text-cream text-sm font-medium truncate">
                          {session.user.name}
                        </p>
                        <p className="text-cream/30 text-xs truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/60 hover:text-cream hover:bg-cream/5 rounded-xl transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Logged out state */
              <>
                <Link
                  href="/login"
                  className="text-sm text-cream/50 hover:text-cream transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/trips"
                    className="btn-primary text-sm py-2.5 px-6 inline-block"
                  >
                    <span className="relative z-10">Book a Trip</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={
                isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
              }
              className="w-6 h-[2px] bg-cream rounded-full block"
            />

            <motion.span
              animate={
                isMobileOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }
              }
              className="w-6 h-[2px] bg-cream rounded-full block"
            />

            <motion.span
              animate={
                isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="w-6 h-[2px] bg-cream rounded-full block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0C1420 0%, #1E2D4A 100%)",
            }}
          >
            {/* Logo in mobile menu */}
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src="/logo.jpg"
              alt="Backpack Junction"
              fetchPriority="high"
              className="w-20 h-20 rounded-full object-cover mb-10 border-2 border-burnt-orange/30"
              style={{ boxShadow: "0 0 30px rgba(198,122,60,0.2)" }}
            />

            <nav className="flex flex-col items-center gap-5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-2xl font-[family-name:var(--font-heading)] text-cream/80 hover:text-burnt-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                {status === "authenticated" ? (
                  <>
                    <p className="text-cream/40 text-sm">
                      Hello, {session?.user?.name?.split(" ")[0]}
                    </p>
                    <Link
                      href={session?.user?.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-lg text-cream/60 hover:text-cream transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileOpen(false);
                        handleSignOut();
                      }}
                      className="text-lg text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                      <button className="text-lg text-cream/60 hover:text-cream transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/trips" onClick={() => setIsMobileOpen(false)}>
                      <button className="btn-primary text-lg px-10 py-4">
                        <span className="relative z-10">Book a Trip</span>
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
