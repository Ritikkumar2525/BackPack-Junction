"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mountain, MapPin, Mail, Phone } from "lucide-react";

const footerLinks = [
  {
    title: "Destinations",
    links: [
      { label: "Spiti Valley", href: "/destinations/spiti-valley" },
      { label: "Kedarnath", href: "/destinations/kedarnath" },
      { label: "Tungnath", href: "/destinations/tungnath" },
      { label: "Kashmir", href: "/destinations/kashmir" },
      { label: "Manali", href: "/destinations/manali" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { label: "Upcoming Trips", href: "/trips" },
      { label: "Spiritual Journeys", href: "/trips" },
      { label: "Trek Expeditions", href: "/trips" },
      { label: "Custom Tours", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Travel Blog", href: "/blog" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help & FAQ", href: "/faq" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

const socials = [
  {
    icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    label: "LinkedIn",
    href: "https://linkedin.com"
  },
  {
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    label: "Instagram",
    href: "https://instagram.com"
  },
  {
    icon: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
    label: "YouTube",
    href: "https://youtube.com"
  },
  {
    icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
    label: "Twitter",
    href: "https://twitter.com"
  }
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a101a] overflow-hidden pt-24 pb-10 border-t border-white/5">
      
      {/* Cinematic Background Glows (Optimized with radial gradients) */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[300px] pointer-events-none transform-gpu" 
        style={{ background: "radial-gradient(ellipse, rgba(198,122,60,0.15) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[600px] h-[400px] pointer-events-none transform-gpu" 
        style={{ background: "radial-gradient(ellipse, rgba(26,46,77,0.4) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Story Section (Takes up 2 cols on large screens) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="group flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-burnt-orange/20 group-hover:border-burnt-orange transition-colors duration-500 shadow-[0_0_20px_rgba(198,122,60,0.2)]">
                <img
                  src="/logo.jpg"
                  alt="Backpack Junction Logo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cream/80 font-[family-name:var(--font-heading)] tracking-wide">
                  BACKPACK <span className="text-burnt-orange">JUNCTION</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[3px] text-burnt-orange/80 mt-0.5 font-semibold">
                  Yatra · Adventure · Memories
                </span>
              </div>
            </Link>
            
            <p className="text-cream/50 text-sm leading-relaxed mb-8 max-w-sm font-light">
              We don&apos;t just plan trips; we craft Himalayan stories. From the sacred peaks of Kedarnath to the cold deserts of Spiti, your next great adventure begins here.
            </p>
            
            <div className="flex gap-4">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cream/40 hover:text-burnt-orange hover:border-burnt-orange/30 hover:bg-burnt-orange/10 hover:shadow-[0_10px_20px_rgba(198,122,60,0.15)] transition-all duration-300"
                  aria-label={s.label}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={s.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, idx) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-cream font-bold text-sm mb-6 uppercase tracking-[2px]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-cream/40 text-sm hover:text-cream transition-colors duration-300 font-light"
                    >
                      <span className="w-0 h-[1px] bg-burnt-orange mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-white/10">
          <p className="text-cream/30 text-xs font-light">
            &copy; {new Date().getFullYear()} Backpack Junction. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-cream/30 text-xs font-light">
            <span>Crafted with</span>
            <Mountain size={12} className="text-burnt-orange" />
            <span>for the Himalayas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
