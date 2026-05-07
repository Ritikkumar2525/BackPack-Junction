"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle, Check, Mountain } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setDone(true);
      if (!signInResult?.error) {
         setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/" });
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-transparent p-4 text-cream font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="text-center p-12 glass-card border border-cream/10 rounded-[2rem] shadow-2xl backdrop-blur-2xl max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(198,122,60,0.3)]">
            <Check size={40} />
          </div>
          <h2 className="text-3xl font-[family-name:var(--font-heading)] font-bold mb-3 text-white">Welcome to the Tribe!</h2>
          <p className="text-cream/60 mb-8 font-light">Your account has been created successfully.</p>
          <button onClick={() => router.push("/dashboard")} className="px-8 py-4 bg-burnt-orange hover:bg-[#d98542] text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(198,122,60,0.3)] hover:shadow-[0_0_30px_rgba(198,122,60,0.5)]">
            Go to Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-transparent p-4 sm:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[850px] flex rounded-3xl overflow-hidden shadow-2xl border border-cream/10 bg-[#0a0f18]/80 backdrop-blur-2xl relative z-10 min-h-[500px] lg:h-[620px]"
      >
        {/* Left side - Visual & Branding */}
        <div className="hidden lg:flex w-[40%] relative flex-col justify-between p-8 overflow-hidden border-r border-cream/5">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85" 
              alt="Himalayas" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0C1420]/95 via-[#0C1420]/80 to-[#0C1420]/40"></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-burnt-orange/50" />
              <span className="font-[family-name:var(--font-heading)] font-bold tracking-widest text-white text-sm">BACKPACK <span className="text-burnt-orange">JUNCTION</span></span>
            </Link>
          </div>
          
          <div className="relative z-10 my-auto">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h1 className="text-3xl lg:text-4xl font-[family-name:var(--font-heading)] font-bold leading-tight mb-3 text-white">
                Start your<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-burnt-orange to-amber-500">journey.</span>
              </h1>
              <p className="text-cream/60 text-[13px] font-light leading-relaxed max-w-[240px]">
                Create an account to unlock exclusive itineraries and track your Himalayan adventures.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 text-cream/40 font-medium text-xs">
            Already a member? <Link href="/login" className="text-burnt-orange hover:text-white transition-colors ml-1 font-bold">Log in here</Link>
          </div>
        </div>

        {/* Right side - Typography Form in Dark Mode */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center px-6 sm:px-10 lg:px-12 bg-[#0a0f18] relative overflow-y-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-burnt-orange/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-[340px] mx-auto relative z-10 py-6">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <Link href="/">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-burnt-orange/50" />
              </Link>
              <span className="font-[family-name:var(--font-heading)] font-bold tracking-widest text-white text-sm">BACKPACK <span className="text-burnt-orange">JUNCTION</span></span>
            </div>

            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-white mb-1.5">Sign up</h2>
            <p className="text-cream/40 mb-6 text-[13px] font-light tracking-wide">Enter your details to create an account.</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 text-red-400 text-sm mb-6 border border-red-500/20"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="peer w-full bg-transparent border-b border-cream/10 py-2 text-white focus:outline-none focus:border-burnt-orange transition-colors placeholder-transparent font-light text-sm"
                  placeholder="FULL NAME"
                />
                <label htmlFor="name" className="absolute left-0 -top-2 text-[10px] text-cream/40 font-semibold tracking-widest uppercase transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-burnt-orange cursor-text">
                  Full name
                </label>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="peer w-full bg-transparent border-b border-cream/10 py-2 text-white focus:outline-none focus:border-burnt-orange transition-colors placeholder-transparent font-light text-sm"
                  placeholder="EMAIL ADDRESS"
                />
                <label htmlFor="email" className="absolute left-0 -top-2 text-[10px] text-cream/40 font-semibold tracking-widest uppercase transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-burnt-orange cursor-text">
                  Email address
                </label>
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="peer w-full bg-transparent border-b border-cream/10 py-2 text-white focus:outline-none focus:border-burnt-orange transition-colors placeholder-transparent font-light text-sm"
                  placeholder="PHONE NUMBER"
                />
                <label htmlFor="phone" className="absolute left-0 -top-2 text-[10px] text-cream/40 font-semibold tracking-widest uppercase transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-burnt-orange cursor-text">
                  Phone number
                </label>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  id="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="peer w-full bg-transparent border-b border-cream/10 py-2 text-white focus:outline-none focus:border-burnt-orange transition-colors placeholder-transparent font-light text-sm"
                  placeholder="PASSWORD"
                />
                <label htmlFor="password" className="absolute left-0 -top-2 text-[10px] text-cream/40 font-semibold tracking-widest uppercase transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-burnt-orange cursor-text">
                  Password
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input required type="checkbox" id="terms" className="w-3.5 h-3.5 rounded border-cream/20 bg-transparent text-burnt-orange focus:ring-burnt-orange/50 cursor-pointer" />
                <label htmlFor="terms" className="text-[11px] text-cream/60 cursor-pointer select-none">
                  I agree to the <a href="#" className="text-burnt-orange hover:text-white transition-colors">Terms & Conditions</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burnt-orange hover:bg-[#d98542] text-white rounded-lg py-3 font-semibold tracking-wide transition-all mt-2 disabled:opacity-70 shadow-[0_0_15px_rgba(198,122,60,0.2)] hover:shadow-[0_0_20px_rgba(198,122,60,0.4)] text-sm"
              >
                {loading ? "Creating account..." : "Register now"}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-[9px] tracking-widest uppercase text-cream/30 mb-4 font-semibold">Or sign up with</p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button onClick={handleGoogleSignUp} type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-cream/10 rounded-lg hover:border-cream/30 hover:bg-cream/5 transition-all text-[11px] font-medium text-cream/80">
                  <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-cream/10 rounded-lg hover:border-cream/30 hover:bg-cream/5 transition-all text-[11px] font-medium text-cream/80">
                  <Mountain size={14} className="text-burnt-orange" />
                  Phone OTP
                </button>
              </div>
            </div>
            
            <div className="lg:hidden mt-6 mb-2 text-center text-cream/40 font-medium text-xs">
              Already a member? <Link href="/login" className="text-burnt-orange underline underline-offset-4 decoration-2 font-bold hover:text-white">Log in here</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
