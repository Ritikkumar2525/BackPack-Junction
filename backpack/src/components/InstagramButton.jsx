"use client";
import { motion } from "framer-motion";

export default function InstagramButton() {
  return (
    <motion.a
      href="https://www.instagram.com/backpack_junction?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      target="_blank"
      rel="noopener noreferrer"
      initial={{ y: 0 }}
      animate={{ y: [-3, 3, -3] }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      whileHover={{ scale: 1.1, y: 0, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      title="Follow us on Instagram"
      className="fixed bottom-[108px] right-[40px] z-[90] w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[#0a1017]/80 backdrop-blur-md border border-white/10 hover:border-burnt-orange/60 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(198,122,60,0.4)] transition-colors duration-300 group"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-cream/80 group-hover:text-burnt-orange transition-colors duration-300"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
      </svg>
    </motion.a>
  );
}
