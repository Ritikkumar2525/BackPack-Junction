"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Destinations: [
    "Kashmir",
    "Manali",
    "Leh Ladakh",
    "Spiti Valley",
    "Kedarnath",
    "Banaras",
  ],
  Experiences: [
    "Group Trips",
    "Solo Adventures",
    "Spiritual Journeys",
    "Trek Expeditions",
    "Bike Tours",
    "Winter Escapes",
  ],
  Company: ["About Us", "Careers", "Blog", "Press", "Partners", "Contact"],
  Support: [
    "Help Center",
    "Safety",
    "Cancellation Policy",
    "Terms of Service",
    "Privacy Policy",
    "FAQ",
  ],
};

const socials = [
  {
    icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
    label: "Twitter",
  },
  {
    icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    label: "LinkedIn",
  },
  {
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    label: "Instagram",
  },
  {
    icon: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
    label: "YouTube",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0C1420, #1A2332)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main footer */}
        <div className="py-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.jpg"
                alt="Backpack Junction"
                className="w-10 h-10 rounded-full object-cover border border-burnt-orange/30"
              />
              <div>
                <span className="text-lg font-bold text-cream font-[family-name:var(--font-heading)]">
                  BACKPACK <span className="text-burnt-orange">JUNCTION</span>
                </span>
                <span className="block text-[9px] uppercase tracking-[2px] text-cream/30 -mt-0.5">
                  Yatra · Adventure · Memories
                </span>
              </div>
            </div>
            <p className="text-cream/30 text-sm leading-relaxed mb-6 max-w-xs">
              Curated Himalayan experiences that transform journeys into
              lifelong stories.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:border-burnt-orange/30 transition-colors"
                  aria-label={s.label}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-cream/50 hover:text-cream transition-colors"
                  >
                    <path d={s.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-cream font-semibold text-sm mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-cream/30 text-sm hover:text-cream/70 transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/20 text-sm">
            &copy; {new Date().getFullYear()} Backpack Junction. All rights
            reserved.
          </p>
          <p className="text-cream/20 text-xs">
            Made with ❤️ for the mountains
          </p>
        </div>
      </div>
    </footer>
  );
}
