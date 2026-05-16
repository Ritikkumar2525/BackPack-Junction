"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Check, Sparkles, Loader2, AlertCircle, Compass } from "lucide-react";
import toast from "react-hot-toast";

const paragraphText = "Be the very first to know about upcoming Himalayan journeys before they are announced to the public. Limited seats disappear fast.";
const words = paragraphText.split(" ");

const bulletPoints = [
  "Early trip announcements",
  "Exclusive member pricing",
  "Secret expeditions"
];

// Stagger variants for word-by-word animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.3 }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const bulletContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 1.5 } // Starts after paragraph
  }
};

const bulletVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      toast.success(data.message || "Welcome to the club!");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
      toast.error(err.message);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#0C1420]">
      {/* Immersive Mountain Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transform-gpu"
          style={{ backgroundImage: "url('/destinations/badrinath.jpg')", backgroundAttachment: "fixed" }}
        />
        {/* Deep gradient overlays to blend the image into the dark UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-[#0C1420]/80 to-[#0C1420]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1420] via-transparent to-transparent opacity-80" />
      </div>

      {/* Hardware-accelerated ambient light beams (Optimized with radial gradients instead of heavy CSS blur) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-[10%] w-[400px] h-[400px] rounded-full will-change-opacity transform-gpu" 
          style={{ background: "radial-gradient(circle, rgba(198,122,60,0.15) 0%, transparent 70%)" }}
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full will-change-opacity transform-gpu" 
          style={{ background: "radial-gradient(circle, rgba(26,46,77,0.4) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2rem] p-[1px] overflow-hidden group">
          {/* Performance-friendly Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-burnt-orange/0 via-burnt-orange/30 to-burnt-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="bg-[#0f1724]/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden transform-gpu">
            
            {/* Inner ambient glow */}
            <div 
              className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-1/2 h-20 rounded-full pointer-events-none transform-gpu" 
              style={{ background: "radial-gradient(ellipse, rgba(198,122,60,0.2) 0%, transparent 70%)" }}
            />

            <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Cinematic Content */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-burnt-orange/20 to-transparent border-l-2 border-burnt-orange px-3 py-1.5 mb-6 shadow-[0_0_20px_rgba(198,122,60,0.1)]">
                    <Compass size={12} className="text-burnt-orange animate-spin-slow" />
                    <span className="text-[9px] uppercase tracking-[3px] text-burnt-orange font-bold">Elite Explorer</span>
                  </div>
                  
                  <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cream to-cream/40 mb-6 leading-[1.1]">
                    Enter the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C67A3C] via-[#D4842A] to-[#ffb86c] drop-shadow-[0_0_20px_rgba(198,122,60,0.4)]">
                      Inner Circle
                    </span>
                  </h2>
                </motion.div>

                {/* Word-by-Word Paragraph Animation */}
                <motion.p
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="text-cream/70 text-sm md:text-base leading-relaxed mb-6 font-light flex flex-wrap gap-x-1.5"
                >
                  {words.map((word, i) => (
                    <motion.span key={i} variants={wordVariants} className="inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
                
                {/* Staggered Bullet Points */}
                <motion.ul
                  variants={bulletContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="space-y-3"
                >
                  {bulletPoints.map((item, i) => (
                    <motion.li key={i} variants={bulletVariants} className="flex items-center gap-3 text-sm md:text-base text-cream/90 font-medium group cursor-default">
                      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#141F33] border border-white/10 group-hover:border-burnt-orange/50 group-hover:shadow-[0_0_15px_rgba(198,122,60,0.3)] transition-all duration-500">
                        <Sparkles size={10} className="text-burnt-orange/70 group-hover:text-burnt-orange transition-colors" />
                      </div>
                      <span className="tracking-wide bg-gradient-to-r from-cream to-cream/60 bg-clip-text text-transparent group-hover:from-white group-hover:to-cream/80 transition-all duration-500">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Right Column: Futuristic Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="relative transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e4d]/30 to-[#0C1420]/80 rounded-[2rem] transform -rotate-2 scale-[1.01] border border-white/5 pointer-events-none transform-gpu" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a2e4d]/20 to-[#0C1420]/60 rounded-[2rem] transform rotate-1 scale-[1.01] border border-white/5 pointer-events-none transform-gpu" />
                
                <div className="bg-[#141F33]/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden hover:border-white/20 transition-colors duration-700 transform-gpu">
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none transform-gpu" 
                    style={{ background: "radial-gradient(circle, rgba(198,122,60,0.15) 0%, transparent 70%)" }}
                  />
                  
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burnt-orange/30 to-transparent border border-burnt-orange/30 flex items-center justify-center text-burnt-orange mb-6 shadow-[0_0_30px_rgba(198,122,60,0.2)]">
                    <Mail size={20} />
                  </div>

                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cream/60 mb-2">
                    Unlock the Unknown
                  </h3>
                  <p className="text-cream/50 text-xs md:text-sm mb-8 font-light">
                    Enter your email to receive priority invitations to our most exclusive expeditions.
                  </p>

                  <AnimatePresence mode="wait">
                    {status !== "success" ? (
                      <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} 
                        className="space-y-5 relative z-10"
                      >
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-burnt-orange/0 via-burnt-orange/20 to-burnt-orange/0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            disabled={status === "loading"}
                            className="relative w-full bg-[#0a101a]/90 border border-white/10 rounded-xl py-4 pl-6 pr-4 text-cream font-medium tracking-wide focus:outline-none focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all text-sm placeholder:text-cream/20 placeholder:font-light shadow-inner disabled:opacity-50"
                          />
                        </div>

                        {status === "error" && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-xs px-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                            <AlertCircle size={14} />
                            <span>{errorMessage}</span>
                          </motion.div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={status === "loading" || !email}
                          className="relative w-full text-white py-4 rounded-xl text-[15px] font-bold tracking-wide transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-[0_10px_30px_rgba(198,122,60,0.3)] hover:shadow-[0_10px_40px_rgba(198,122,60,0.5)] border border-burnt-orange/50 overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#C67A3C] to-[#D4842A] transition-transform duration-500 group-hover/btn:scale-[1.05]" />
                          <div className="relative flex items-center justify-center gap-2 z-10">
                            {status === "loading" ? (
                              <Loader2 size={20} className="animate-spin" />
                            ) : (
                              <>Request Invitation <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>
                            )}
                          </div>
                        </motion.button>
                        
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-cream/30 text-[11px] uppercase tracking-[2px] font-bold">
                            Secure & Encrypted • Zero Spam
                          </p>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center py-10 text-center relative z-10 transform-gpu"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                        >
                          <Check size={34} />
                        </motion.div>
                        <h4 className="text-cream font-bold text-2xl mb-2 tracking-wide">You&apos;re on the list.</h4>
                        <p className="text-cream/50 text-base max-w-xs mx-auto font-light leading-relaxed">
                          Welcome to the inner circle. Keep an eye on your inbox for our next secret expedition.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
