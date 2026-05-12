"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0C1420 0%, #141F33 50%, #0C1420 100%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,122,60,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-burnt-orange/10 text-burnt-orange">
            <Mail size={24} />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-cream mb-5 leading-tight">
            Stay in the <span className="gradient-text">Loop</span>
          </h2>
          <p className="text-cream/35 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Get early access to new trips, exclusive deals, and Himalayan
            stories delivered to your inbox.
          </p>

          {!done ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="glass-card p-2 flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border-none outline-none text-cream/90 placeholder-cream/20 text-sm px-4 py-3"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="text-cream px-6 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #C67A3C, #D4842A)",
                  }}
                >
                  Subscribe <ArrowRight size={14} />
                </motion.button>
              </div>
              <p className="text-cream/15 text-xs mt-4">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 glass-card px-8 py-5"
            >
              <div className="w-10 h-10 rounded-full bg-teal/20 text-teal flex items-center justify-center">
                <Check size={20} />
              </div>
              <div className="text-left">
                <p className="text-cream font-semibold text-sm">
                  You&apos;re in!
                </p>
                <p className="text-cream/40 text-xs">
                  Welcome to the Himalayan tribe.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
