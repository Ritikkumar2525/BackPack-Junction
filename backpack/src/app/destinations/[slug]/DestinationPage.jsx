"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, X, Loader2, Mail } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const itineraryData = {
  kashmir: [
    {
      day: 1,
      title: "Arrival in Srinagar",
      desc: "Airport pickup, check into luxury houseboat on Dal Lake. Evening shikara ride at sunset.",
      icon: "✈️",
    },
    {
      day: 2,
      title: "Mughal Gardens & Old City",
      desc: "Visit Shalimar Bagh, Nishat Bagh, and explore the historic old city bazaars.",
      icon: "🌷",
    },
    {
      day: 3,
      title: "Gulmarg Day Trip",
      desc: "Drive to Gulmarg. Gondola ride to Apharwat Peak at 4,200m. Snow activities.",
      icon: "🚡",
    },
    {
      day: 4,
      title: "Pahalgam & Betaab Valley",
      desc: "Drive through pine forests to Pahalgam. Visit Betaab Valley and Aru Valley.",
      icon: "🏔️",
    },
    {
      day: 5,
      title: "Sonmarg Glacier",
      desc: "Day trip to Sonmarg. Pony ride to Thajiwas Glacier. Return to Srinagar.",
      icon: "❄️",
    },
    {
      day: 6,
      title: "Local Experiences",
      desc: "Kashmiri cooking class, saffron fields visit, and handicraft shopping.",
      icon: "🎨",
    },
    {
      day: 7,
      title: "Departure",
      desc: "Morning Dal Lake photography, farewell breakfast. Airport transfer.",
      icon: "👋",
    },
  ],
  manali: [
    {
      day: 1,
      title: "Arrival in Manali",
      desc: "Reach Manali, check into camp/hotel. Evening walk through Old Manali.",
      icon: "🏕️",
    },
    {
      day: 2,
      title: "Solang Valley Adventure",
      desc: "Paragliding, zorbing, and rope activities at Solang Valley.",
      icon: "🪂",
    },
    {
      day: 3,
      title: "Rohtang Pass",
      desc: "Drive to Rohtang Pass (3,978m). Snow point activities and panoramic views.",
      icon: "🏔️",
    },
    {
      day: 4,
      title: "Sissu & Atal Tunnel",
      desc: "Cross through Atal Tunnel to Sissu waterfall. Explore Lahaul Valley.",
      icon: "🚗",
    },
    {
      day: 5,
      title: "Kasol & Manikaran",
      desc: "Day trip to Kasol village and Manikaran hot springs & Gurudwara.",
      icon: "♨️",
    },
    {
      day: 6,
      title: "Departure",
      desc: "Morning café visit, souvenir shopping. Depart Manali.",
      icon: "👋",
    },
  ],
  kedarnath: [
    {
      day: 1,
      title: "Arrive Haridwar",
      desc: "Reach Haridwar. Evening Ganga Aarti at Har Ki Pauri. Overnight stay.",
      icon: "🛕",
    },
    {
      day: 2,
      title: "Haridwar to Guptkashi",
      desc: "Scenic 7-hour drive through Devprayag and Rudraprayag.",
      icon: "🚌",
    },
    {
      day: 3,
      title: "Guptkashi to Gaurikund",
      desc: "Drive to Gaurikund. Acclimatize and prepare for the trek.",
      icon: "🥾",
    },
    {
      day: 4,
      title: "Trek to Kedarnath",
      desc: "16km uphill trek through stunning mountain landscapes to the temple.",
      icon: "⛰️",
    },
    {
      day: 5,
      title: "Temple Darshan",
      desc: "Early morning darshan at Kedarnath Temple. Explore Bhairav Temple.",
      icon: "🙏",
    },
    {
      day: 6,
      title: "Descent & Return",
      desc: "Trek back to Gaurikund. Drive to Guptkashi for overnight stay.",
      icon: "🏃",
    },
    {
      day: 7,
      title: "Return Journey",
      desc: "Drive back to Haridwar/Rishikesh. Departure.",
      icon: "🏠",
    },
  ],
};

const defaultItinerary = [
  {
    day: 1,
    title: "Arrival & Welcome",
    desc: "Airport/station pickup. Hotel check-in. Evening orientation and welcome dinner.",
    icon: "✈️",
  },
  {
    day: 2,
    title: "Explore Local Highlights",
    desc: "Guided tour of major attractions. Local cuisine experience.",
    icon: "🗺️",
  },
  {
    day: 3,
    title: "Adventure Day",
    desc: "Trekking, activities, or cultural immersion based on destination.",
    icon: "🏔️",
  },
  {
    day: 4,
    title: "Hidden Gems",
    desc: "Off-the-beaten-path exploration. Local interactions and stories.",
    icon: "💎",
  },
  {
    day: 5,
    title: "Farewell & Departure",
    desc: "Morning leisure. Last photo ops. Airport/station transfer.",
    icon: "👋",
  },
];

// The hardcoded galleryImages array has been removed in favor of dynamic dest.gallery from the database.

const essentials = [
  { icon: "🗓️", label: "Best Season", key: "bestSeason" },
  { icon: "⛰️", label: "Difficulty", key: "difficulty" },
  { icon: "📏", label: "Altitude", key: "altitude" },
  { icon: "🌡️", label: "Temperature", key: "temperature" },
  { icon: "⏱️", label: "Duration", key: "duration" },
  { icon: "⭐", label: "Rating", key: "rating" },
];

export default function DestinationPage({ destination: dest }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const itinerary = itineraryData[dest.id] || defaultItinerary;
  const diffColor = {
    Easy: "text-teal",
    Moderate: "text-navy-light",
    Challenging: "text-burnt-orange",
    Extreme: "text-red-400",
  };

  const handleBookClick = async () => {
    setIsChecking(true);
    router.push(`/dashboard/book-trip?destination=${encodeURIComponent(dest.name)}`);
  };

  const currentGallery = dest.gallery && dest.gallery.length > 0 ? dest.gallery : [];

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${dest?.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/30 z-[1]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cream/40 text-sm hover:text-cream/70 transition-colors mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span className="text-burnt-orange text-xs uppercase tracking-[4px] font-semibold mb-2 block">
                {dest?.tagline || "Explore"}
              </span>
              <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-3">
                {dest?.name || "Destination"}
              </h1>
              <p className="text-cream/50 text-lg max-w-xl leading-relaxed">
                {dest?.description || "Experience the breathtaking beauty of this amazing destination."}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookClick}
                disabled={isChecking}
                className="btn-primary py-3 px-8 min-w-[220px] flex justify-center items-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isChecking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    `Book Trip — ₹${dest?.price ? Number(dest.price).toLocaleString('en-IN') : 'N/A'}`
                  )}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary py-3 px-6"
              >
                ❤️ Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {essentials.map((e) => (
            <div key={e.label} className="text-center p-3">
              <span className="text-2xl mb-2 block">{e.icon}</span>
              <p className="text-[10px] uppercase tracking-wider text-cream/30 mb-1">
                {e.label}
              </p>
              <p
                className={`text-sm font-semibold ${e.key === "difficulty" ? diffColor[dest?.[e.key]] || "text-cream/80" : "text-cream/80"}`}
              >
                {dest?.[e.key] ? String(dest[e.key]) : "N/A"}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Itinerary Timeline */}
      <section className="section-padding relative">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[4px] text-teal mb-4 block">
              Day by Day
            </span>
            <h2 className="section-title text-cream">
              Your <span className="gradient-text-cool">Itinerary</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal/30 via-navy-light/20 to-transparent" />

            {itinerary.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} pl-16 md:pl-0`}
                >
                  <div
                    className={`glass-card p-6 inline-block ${i % 2 === 0 ? "md:ml-auto" : ""}`}
                  >
                    <span className="text-teal text-[10px] uppercase tracking-wider font-semibold">
                      Day {day.day}
                    </span>
                    <h3 className="text-cream font-semibold text-lg mt-1 mb-2 font-[family-name:var(--font-heading)]">
                      {day.title}
                    </h3>
                    <p className="text-cream/40 text-sm leading-relaxed">
                      {day.desc}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-xl z-10 bg-midnight/50">
                  {day.icon}
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {currentGallery.length > 0 && (
        <section className="section-padding relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[4px] text-burnt-orange mb-4 block">
                Visual Stories
              </span>
              <h2 className="section-title text-cream">
                Photo <span className="gradient-text-warm">Gallery</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentGallery.slice(0, 6).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "row-span-2" : ""}`}
                >
                  <img
                    src={img}
                    alt={`${dest?.name || 'Destination'} gallery ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover min-h-[200px] transition-transform duration-700 group-hover:scale-110 bg-[#0C1420]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=400";
                    }}
                  />

                  <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/30 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-12 h-12 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M11 8v6" />
                        <path d="M8 11h6" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-burnt-orange/10 rounded-full blur-[120px] pointer-events-none" />
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-cream mb-4 relative z-10">
              Ready for <span className="gradient-text-warm">{dest?.name || "this Adventure"}</span>?
            </h2>
            <p className="text-cream/40 text-lg mb-8 max-w-lg mx-auto relative z-10">
              Join our next group trip or plan a custom journey. Your Himalayan
              story awaits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4"
                onClick={() => window.location.href = `/dashboard/book-trip?destination=${encodeURIComponent(dest?.name || "")}`}
              >
                <span className="relative z-10">
                  Book Now — ₹{dest?.price ? Number(dest.price).toLocaleString('en-IN') : 'N/A'}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-10 py-4"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
