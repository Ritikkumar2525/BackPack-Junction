"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const team = [
  {
    name: "Piyush Raj",
    image: "/team/piyush.png",
    bio: "The one who always says 'bhai ek trip plan karte hain' — and actually makes it happen.",
    instagram: "https://www.instagram.com/piyushraj825",
  },
  {
    name: "Pritam",
    image: "/team/pritam.png",
    bio: "The calm force behind chaos. Handles everything from logistics to late-night campfire conversations.",
    instagram: "https://www.instagram.com/_pritam_366",
  },
  {
    name: "Ritik Keshri",
    image: "/team/ritik.png",
    bio: "The builder. Turned late-night ideas into this entire platform. Code, design, and caffeine.",
    instagram: "https://www.instagram.com/_ritik.keshri.25/",
  },
  {
    name: "Shreyansh Keshri",
    image: "/team/shreyansh.png",
    bio: "The storyteller. If a reel gave you chills or a photo made you pack your bags — that's him.",
    instagram: "https://www.instagram.com/shreyansh_keshriii",
  },
];

const values = [
  {
    icon: "🏔️",
    title: "Authentic Adventures",
    desc: "No tourist traps. We take you to the real Himalayas — hidden trails, local homes, untouched beauty.",
  },
  {
    icon: "🌱",
    title: "Eco-Conscious Travel",
    desc: "Leave no trace. We offset carbon, reduce waste, and support local conservation efforts.",
  },
  {
    icon: "🤝",
    title: "Community First",
    desc: "Every trip supports local communities — from homestays to guides, your money stays in the mountains.",
  },
  {
    icon: "🎬",
    title: "Cinematic Storytelling",
    desc: "We don't just plan trips — we craft stories. Every journey is documented and shared beautifully.",
  },
  {
    icon: "🛡️",
    title: "Safety Always",
    desc: "Certified guides, medical kits, satellite phones, and comprehensive travel insurance on every trip.",
  },
  {
    icon: "💫",
    title: "Transformative Experiences",
    desc: "Travel that changes you. We focus on inner journeys as much as outer adventures.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "The Spark",
    desc: "Four friends, one spontaneous Kedarnath trip, and a realization that changed everything.",
  },
  {
    year: "2025",
    title: "The Idea Takes Shape",
    desc: "From midnight chai conversations to spreadsheets — we planned our first group trip for strangers.",
  },
  {
    year: "2026",
    title: "BackPack Junction Is Born",
    desc: "We officially launched. First trip, first travelers, first 5-star reviews. The journey begins.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-28 md:pt-36 md:pb-36 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background — semi-transparent to let StarryBackground show through */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url('/team/about-hero.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 mb-10 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cream/50" />
              <span className="text-xs uppercase tracking-[4px] text-cream/50 font-medium">
                Established 2026
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cream/50" />
            </motion.div>

            {/* Heading */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-8xl font-black text-cream tracking-tight"
              >
                4 Friends
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-cream/70"
              >
                1 Dream
              </motion.h1>
            </div>

            {/* Thin separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-16 h-px bg-cream/20 mx-auto mb-8"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-cream/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-14"
            >
              We&apos;re not a travel agency. We&apos;re four friends who
              turned their love for mountains into something meaningful.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap justify-center gap-12 md:gap-20"
            >
              {[
                { number: "4", label: "Friends" },
                { number: "2026", label: "Founded" },
                { number: "100+", label: "Travelers" },
                { number: "10+", label: "Destinations" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.08 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold text-cream/80">
                    {stat.number}
                  </div>
                  <div className="text-cream/25 text-[10px] uppercase tracking-[3px] mt-1.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-cream/15 flex items-start justify-center pt-1.5"
            >
              <div className="w-0.5 h-1.5 rounded-full bg-cream/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream mb-6">
              The BackPack Story
            </h2>
            <div className="space-y-4 text-cream/50 leading-relaxed">
              <p>
                It started with a spontaneous Kedarnath trip. Four friends, zero
                planning, and a memory that refused to fade. The raw beauty of
                the Himalayas, the warmth of mountain villagers, the silence
                that speaks louder than any city — it changed us forever.
              </p>
              <p>
                We came back and realized something: most people never
                experience the real Himalayas. They get tourist buses, crowded
                viewpoints, and cookie-cutter itineraries. The magic gets lost
                in the noise.
              </p>
              <p>
                So in 2026, four friends decided to do something about it. No
                investors, no corporate backing — just passion, savings, and a
                shared belief that travel should be raw, real, and
                transformative. We built BackPack Junction from scratch — every
                line of code, every route, every partnership with local
                communities.
              </p>
              <p className="text-cream/70 font-medium">
                We&apos;re not a company. We&apos;re a group of friends who
                turned their love for the mountains into something meaningful.
                And this is just the beginning.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-navy-light/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-cream">
              What We <span className="gradient-text-cool">Stand For</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 text-center group"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {v.icon}
                </span>
                <h3 className="text-cream font-semibold text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-cream/40 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-cream">
              Our <span className="gradient-text-warm">Journey</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-burnt-orange/30 via-navy-light/20 to-transparent" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div
                  className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} pl-16 md:pl-0`}
                >
                  <div
                    className={`glass-card p-6 inline-block ${i % 2 === 0 ? "md:ml-auto" : ""}`}
                  >
                    <span className="text-burnt-orange text-xs font-bold">
                      {m.year}
                    </span>
                    <h3 className="text-cream font-semibold mt-1 mb-1">
                      {m.title}
                    </h3>
                    <p className="text-cream/40 text-sm">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-xs font-bold text-burnt-orange z-10 bg-midnight/50">
                  {m.year.slice(2)}
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding relative">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-burnt-orange/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs uppercase tracking-[4px] text-cream/40 mb-4"
            >
              The Gang Behind It All
            </motion.span>
            <h2 className="section-title text-cream">
              Meet the <span className="gradient-text">Friends</span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-cream/40 max-w-xl mx-auto mb-16 leading-relaxed"
          >
            No founders, no managers, no hierarchy — just four friends
            who pooled their savings, quit making excuses, and built something
            they truly believe in.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", damping: 20 }}
                className="glass-card p-8 text-center group relative overflow-hidden hover:border-white/15 transition-all duration-500"
              >
                {/* Avatar Image */}
                <div className="relative w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-24 h-24 rounded-full object-cover border border-white/10 group-hover:border-white/25 transition-colors duration-300"
                  />
                </div>

                <h3 className="text-cream font-[family-name:var(--font-heading)] font-bold text-lg mb-1">
                  {t.name}
                </h3>
                <p className="text-cream/40 text-sm leading-relaxed mb-5 min-h-[3.5rem]">
                  {t.bio}
                </p>

                {/* Instagram Link */}
                <a
                  href={t.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-cream/50 hover:text-cream hover:border-white/25 transition-all duration-300 text-xs font-medium"
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
