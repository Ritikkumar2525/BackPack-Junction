"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const contactInfo = [
  {
    icon: "📍",
    label: "Office",
    value: "Rishikesh, Uttarakhand, India",
    detail: "Near Laxman Jhula, 249302",
  },
  {
    icon: "📧",
    label: "Email",
    value: "hello@backpack.travel",
    detail: "We reply within 24 hours",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91 98765 43210",
    detail: "Mon-Sat, 9AM-8PM IST",
  },
  {
    icon: "💬",
    label: "WhatsApp",
    value: "+91 98765 43210",
    detail: "Quick responses, trip queries",
  },
];

const faqs = [
  {
    q: "How do I book a group trip?",
    a: 'Browse our upcoming trips, select one that excites you, and click "Book Now". You can pay a deposit to secure your seat and pay the rest later.',
  },
  {
    q: "Are trips suitable for beginners?",
    a: "Absolutely! We have trips rated from Easy to Extreme. Our Easy trips require no prior trekking experience. We'll always mention the difficulty level clearly.",
  },
  {
    q: "What's included in the trip price?",
    a: "All trips include accommodation, meals, transport from the meeting point, guide fees, permits, and basic first aid. Flights/trains to the meeting point are not included.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes. Full refund if cancelled 15+ days before departure, 50% refund for 7-14 days, and no refund for less than 7 days. We recommend trip insurance.",
  },
  {
    q: "Do you organize custom/private trips?",
    a: "Yes! Contact us with your group size, preferred dates, and budget. We'll craft a custom itinerary just for you.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 to-midnight pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs uppercase tracking-[4px] text-teal mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-4">
              Contact <span className="gradient-text-cool">Us</span>
            </h1>
            <p className="text-cream/40 text-lg max-w-xl mx-auto">
              Have a question, want a custom trip, or just want to say hi?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                  {c.icon}
                </span>
                <p className="text-cream font-semibold text-sm mb-1">
                  {c.value}
                </p>
                <p className="text-cream/30 text-xs">{c.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + FAQs */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream mb-2">
                Send a Message
              </h2>
              <p className="text-cream/40 text-sm mb-8">
                We usually respond within 24 hours.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="glass rounded-xl px-5 py-4 text-cream/90 placeholder-white/25 text-sm outline-none border border-transparent focus:border-teal/30 transition-colors w-full"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="glass rounded-xl px-5 py-4 text-cream/90 placeholder-white/25 text-sm outline-none border border-transparent focus:border-teal/30 transition-colors w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="glass rounded-xl px-5 py-4 text-cream/90 placeholder-white/25 text-sm outline-none border border-transparent focus:border-teal/30 transition-colors w-full"
                  />
                  <textarea
                    placeholder="Your Message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="glass rounded-xl px-5 py-4 text-cream/90 placeholder-white/25 text-sm outline-none border border-transparent focus:border-teal/30 transition-colors w-full resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary w-full py-4"
                  >
                    <span className="relative z-10">Send Message ✨</span>
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-10 text-center"
                >
                  <span className="text-5xl mb-4 block">🏔️</span>
                  <h3 className="text-cream text-xl font-semibold mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-cream/40 text-sm">
                    We&apos;ll get back to you within 24 hours. Keep the
                    adventure spirit alive!
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream mb-2">
                FAQs
              </h2>
              <p className="text-cream/40 text-sm mb-8">
                Quick answers to common questions.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="text-cream text-sm font-medium pr-4">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        className="text-cream/40 text-lg flex-shrink-0"
                      >
                        ↓
                      </motion.span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: openFaq === i ? "auto" : 0,
                        opacity: openFaq === i ? 1 : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-cream/40 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
