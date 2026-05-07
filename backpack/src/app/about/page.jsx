"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const team = [
  {
    name: "Arjun Nair",
    role: "Founder & Lead Explorer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Ex-software engineer turned mountain lover. Summited 15+ Himalayan peaks.",
  },
  {
    name: "Riya Sharma",
    role: "Head of Experiences",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Curates every itinerary with obsessive attention to authentic local experiences.",
  },
  {
    name: "Karan Mehta",
    role: "Lead Trek Guide",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "10+ years guiding treks across Uttarakhand, Himachal & Ladakh.",
  },
  {
    name: "Priya Desai",
    role: "Community Manager",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    bio: "Connects travelers, builds bonds, and ensures every trip feels like family.",
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
    year: "2021",
    title: "The First Trek",
    desc: "Started with 5 friends and a dream at Kedarnath.",
  },
  {
    year: "2022",
    title: "First 100 Travelers",
    desc: "Word of mouth grew. 100 strangers became a community.",
  },
  {
    year: "2023",
    title: "500+ Travelers",
    desc: "Expanded to 15+ destinations across the Himalayas.",
  },
  {
    year: "2024",
    title: "Community Platform",
    desc: "Launched travel buddy matching and group trip features.",
  },
  {
    year: "2025",
    title: "10,000+ Stories",
    desc: "Became India's most loved Himalayan experience platform.",
  },
  {
    year: "2026",
    title: "AI-Powered Journeys",
    desc: "Introduced AI trip planning and virtual trek previews.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[4px] text-teal mb-4 block">
              Our Story
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-6">
              Born in the <span className="gradient-text">Mountains</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;re not a travel agency. We&apos;re a tribe of mountain
              lovers who believe that the Himalayas can change your life — if
              you experience them the right way.
            </p>
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
                It started with a spontaneous Kedarnath trek in 2021. Five
                friends, zero planning, and an experience that none of us could
                forget. The raw beauty of the Himalayas, the warmth of mountain
                villagers, the silence that speaks louder than any city — it
                changed us.
              </p>
              <p>
                We came back and realized: most people never experience the real
                Himalayas. They get tourist buses, crowded viewpoints, and
                cookie-cutter itineraries. The magic gets lost.
              </p>
              <p>
                So we built BackPack — not as a travel company, but as a
                movement. Every trip is designed to be cinematic, authentic, and
                transformative. We handpick routes, partner with local
                communities, and keep groups small enough to feel like family.
              </p>
              <p className="text-cream/70 font-medium">
                Today, over 10,000 travelers have lived their Himalayan stories
                with us. And we&apos;re just getting started.
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title text-cream">
              Meet the <span className="gradient-text">Tribe</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white/10 group-hover:border-navy-light/40 transition-colors"
                />
                <h3 className="text-cream font-semibold">{t.name}</h3>
                <p className="text-burnt-orange text-xs uppercase tracking-wider mb-3">
                  {t.role}
                </p>
                <p className="text-cream/40 text-sm">{t.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
