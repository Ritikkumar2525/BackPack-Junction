"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { MapPin, Mail, Phone, MessageCircle, ChevronDown, Send, CheckCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const contactCards = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "New Delhi, India",
    detail: "Available for meetings by appointment",
    action: "https://maps.google.com/?q=New+Delhi,India",
    actionLabel: "View on Maps",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "junctionbackpack@gmail.com",
    detail: "We reply within 24 hours",
    action: "mailto:junctionbackpack@gmail.com",
    actionLabel: "Send Email",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 85950 54501",
    detail: "Mon–Sat, 9AM–8PM IST",
    action: "tel:+918595054501",
    actionLabel: "Call Now",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 82870 54501",
    detail: "Quick responses, trip queries",
    action: "https://wa.me/918287054501",
    actionLabel: "Chat Now",
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

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-burnt-orange/60 focus:bg-white/8 transition-all duration-300";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast.success("Message sent successfully!");
      } else {
        toast.error(data.error || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-transparent">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-teal/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-bold uppercase tracking-[5px] text-teal mb-4 block">Get in Touch</span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold text-cream mb-5">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-teal/60">Us</span>
            </h1>
            <p className="text-cream/50 text-lg max-w-xl mx-auto leading-relaxed">
              Have a question, want a custom trip, or just want to say hi?
              We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.a
                  href={card.action}
                  target={card.action.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  key={card.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                  className="relative group bg-[#0a1017]/80 backdrop-blur-md border border-white/5 hover:border-burnt-orange/30 rounded-2xl p-8 text-center flex flex-col h-full cursor-pointer transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(198,122,60,0.15)]"
                >
                  {/* Subtle top gradient glow on hover */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-burnt-orange/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 group-hover:scale-110 group-hover:bg-burnt-orange/10 group-hover:border-burnt-orange/30 transition-all duration-500 text-cream/70 group-hover:text-burnt-orange relative z-10 shadow-lg">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  
                  <p className="text-[10px] uppercase tracking-[4px] font-bold text-cream/40 mb-3 relative z-10">{card.label}</p>
                  <p className="text-cream font-medium text-base mb-2 relative z-10">{card.value}</p>
                  <p className="text-cream/40 text-sm mb-6 flex-grow relative z-10 leading-relaxed">{card.detail}</p>
                  
                  <span className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-burnt-orange opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 relative z-10">
                    {card.actionLabel} <ExternalLink size={14} />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + FAQs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold uppercase tracking-[4px] text-burnt-orange mb-3 block">Drop a Line</span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream mb-3">
                Send a Message
              </h2>
              <p className="text-cream/40 text-sm mb-8 leading-relaxed">
                Fill in the form below and we&apos;ll get back to you within 24 hours. Whether it&apos;s a trip inquiry, collaboration, or just saying hello — we love it all.
              </p>

              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-cream/50 mb-1.5 font-medium">Your Name *</label>
                        <input
                          type="text" required placeholder="Arjun Sharma"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-cream/50 mb-1.5 font-medium">Email Address *</label>
                        <input
                          type="email" required placeholder="arjun@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-cream/50 mb-1.5 font-medium">Subject</label>
                      <input
                        type="text" placeholder="Trip inquiry / Custom journey / General question"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-cream/50 mb-1.5 font-medium">Your Message *</label>
                      <textarea
                        required placeholder="Tell us about your dream Himalayan experience..."
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={sending}
                      className="flex items-center justify-center gap-3 w-full bg-burnt-orange hover:bg-burnt-orange/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-burnt-orange/20 hover:shadow-burnt-orange/30"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center py-16 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 ring-2 ring-emerald-500/30">
                      <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-cream text-2xl font-bold font-[family-name:var(--font-heading)] mb-3">Message Sent!</h3>
                    <p className="text-cream/50 text-sm max-w-xs leading-relaxed">
                      We&apos;ll get back to you within 24 hours. Keep the adventure spirit alive! 🏔️
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-8 text-sm text-burnt-orange hover:text-burnt-orange/80 font-medium transition-colors"
                    >
                      Send another message →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="text-xs font-bold uppercase tracking-[4px] text-teal mb-3 block">Quick Answers</span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream mb-3">
                FAQs
              </h2>
              <p className="text-cream/40 text-sm mb-8 leading-relaxed">
                Answers to the most common questions we receive from fellow adventurers.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden ${openFaq === i ? "border-burnt-orange/30 bg-burnt-orange/5" : "border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15"}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left gap-4"
                    >
                      <span className="text-cream text-sm font-semibold leading-snug">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-burnt-orange" : "text-cream/30"}`}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-cream/55 text-sm leading-relaxed border-t border-white/8 pt-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Quick Connect Nudge */}
              <div className="mt-10 p-6 bg-gradient-to-br from-burnt-orange/10 to-burnt-orange/5 border border-burnt-orange/20 rounded-2xl">
                <p className="text-cream font-semibold text-sm mb-1">Still have questions?</p>
                <p className="text-cream/50 text-xs mb-4">Chat directly on WhatsApp for instant answers from our team.</p>
                <a
                  href="https://wa.me/918287054501"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
