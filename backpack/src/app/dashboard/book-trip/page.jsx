"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Users, CreditCard, ArrowRight, Check, Clock, ChevronDown, HeartPulse, Shield, AlertTriangle, MessageCircle, Phone, Mail, X, Mountain, Info } from "lucide-react";
import Script from "next/script";
import TermsConsent from "@/components/payment/TermsConsent";

const BOOKING_CHARGE = 1500;

function AnimatedStoryText({ text, delay = 0, highlight = false, italic = false }) {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
      }}
      className={`text-[13px] sm:text-sm leading-relaxed mb-3 ${highlight ? 'text-burnt-orange/90 font-medium' : 'text-cream/70'} ${italic ? 'italic' : ''}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: "blur(4px)", y: 5 },
            visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

function BookTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("trip");
  const destinationParam = searchParams.get("destination");

  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [travelerCount, setTravelerCount] = useState(1);
  const emptyTraveller = { fullName: "", age: "", gender: "Male", contactNumber: "", emailAddress: "", city: "", emergencyContact: "", foodPreference: "Veg", medicalConditions: "", specialRequests: "" };
  const [travellersData, setTravellersData] = useState([{ ...emptyTraveller }]);

  const [paymentMode, setPaymentMode] = useState("Full Payment");
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    fetch("/api/trips?filter=upcoming", { cache: "no-store" }).then(r => r.json()).then(d => {
      const allTrips = d.trips || [];
      
      let filteredTrips = allTrips;
      
      if (destinationParam) {
        const target = destinationParam.toLowerCase().trim();
        const normalizedTarget = target.replace(/[^a-z0-9]/g, '');
        const targetWords = target.split(/[\s,-]+/).filter(w => w.length > 2);

        filteredTrips = allTrips.filter(t => {
          if (t.isPublished === false) return false;
          
          const destName = (t.destination || "").toLowerCase().trim();
          const tripTitle = (t.title || "").toLowerCase().trim();
          
          // 1. Direct or Substring match
          if (destName === target || destName.includes(target) || target.includes(destName)) return true;
          if (tripTitle.includes(target) || target.includes(tripTitle)) return true;
          
          // 2. Normalized alphanumeric match (ignores spaces/hyphens)
          const normalizedDest = destName.replace(/[^a-z0-9]/g, '');
          const normalizedTitle = tripTitle.replace(/[^a-z0-9]/g, '');
          
          if (normalizedDest && (normalizedDest.includes(normalizedTarget) || normalizedTarget.includes(normalizedDest))) return true;
          if (normalizedTitle && (normalizedTitle.includes(normalizedTarget) || normalizedTarget.includes(normalizedTitle))) return true;
          
          // 3. Keyword matching (e.g. "Spiti Valley" matches "Spiti Circuit")
          if (targetWords.length > 0) {
            const hasKeywordMatch = targetWords.some(word => 
              destName.includes(word) || tripTitle.includes(word)
            );
            if (hasKeywordMatch) return true;
          }
          
          return false;
        });
        
        if (filteredTrips.length === 0) {
          setShowModal(true);
          filteredTrips = allTrips; // Show all alternative trips so the page is never empty
        } else {
          // If there are matches, sort them to put the most relevant ones first
          // (Exact matches > Keyword matches)
          filteredTrips.sort((a, b) => {
            const aName = (a.destination || "").toLowerCase();
            const bName = (b.destination || "").toLowerCase();
            if (aName === target) return -1;
            if (bName === target) return 1;
            return 0;
          });
        }
      }

      setTrips(filteredTrips);

      if (tripIdParam) {
        const found = allTrips.find(t => (t._id || t.id) === tripIdParam);
        if (found) { setSelected(found); setStep(2); }
      }
      setLoading(false);
    });
  }, [tripIdParam, destinationParam]);

  const handleTravelerCountChange = (n) => {
    setTravelerCount(n);
    setTravellersData(prev => {
      const d = [...prev];
      if (n > prev.length) { for (let i = prev.length; i < n; i++) d.push({ ...emptyTraveller }); }
      else if (n < prev.length) return d.slice(0, n);
      return d;
    });
  };

  const updateTraveler = (i, f, v) => {
    setTravellersData(prev => { const d = [...prev]; d[i] = { ...d[i], [f]: v }; return d; });
  };

  const totalAmount = selected ? selected.price * travelerCount : 0;
  const payableAmount = paymentMode === "Pay Later" ? BOOKING_CHARGE * travelerCount : totalAmount;

  const verifyPayment = async (response, bId) => {
    try {
      const res = await fetch("/api/razorpay/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, bookingId: bId }),
      });
      if (res.ok) {
        // Redirect to processing page which shows animated states then success
        router.push(`/payment/processing?bookingId=${bId}&status=success`);
      } else {
        router.push(`/payment/processing?bookingId=${bId}&status=failed`);
      }
    } catch (err) {
      console.error(err);
      router.push(`/payment/processing?bookingId=${bId}&status=failed`);
    }
    setBooking(false);
  };

  const handleBook = async () => {
    if (!selected || !consentAccepted) { alert("Please accept the terms and conditions."); return; }
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: selected._id || selected.id, travellers: travellersData, paymentMethod: "Razorpay", paymentMode, consentAccepted }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Booking failed"); setBooking(false); return; }

      if (!data.orderId) { alert("Could not generate order."); setBooking(false); return; }
      const options = {
        key: data.razorpayKeyId, amount: data.payableAmount * 100, currency: "INR",
        name: "BackPack Junction", description: `${selected.title}${paymentMode === "Pay Later" ? " (Booking Charge)" : ""}`,
        order_id: data.orderId,
        handler: (response) => verifyPayment(response, data.booking.bookingId),
        prefill: { name: travellersData[0].fullName, email: travellersData[0].emailAddress, contact: travellersData[0].contactNumber },
        theme: { color: "#C67A3C" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (r) => { 
        console.error("Payment failed:", r.error);
        router.push(`/payment/processing?bookingId=${data.booking.bookingId}&status=failed`);
        setBooking(false); 
      });
    } catch (e) { console.error(e); setBooking(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-6"><Check size={36} /></div>
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream mb-3">
        {paymentMethod === "Razorpay" ? "Booking Confirmed! 🎉" : "Payment Submitted! ⏳"}
      </h2>
      <p className="text-cream/50 text-sm mb-1">
        {paymentMethod === "Razorpay" 
          ? <span>Your trip to <span className="text-burnt-orange font-medium">{selected.destination}</span> is booked.</span>
          : <span>Your payment details for <span className="text-burnt-orange font-medium">{selected.destination}</span> are being verified.</span>}
      </p>
      <p className="text-cream/30 text-xs mb-2">Booking ID: <span className="font-mono text-cream/50">{bookingResult?.bookingId}</span></p>
      <div className="glass-card p-4 text-sm space-y-2 mb-6 text-left max-w-xs mx-auto">
        <div className="flex justify-between"><span className="text-cream/40">Total</span><span className="text-cream">₹{totalAmount.toLocaleString("en-IN")}</span></div>
        <div className="flex justify-between"><span className="text-cream/40">Paid</span><span className="text-emerald-400">₹{payableAmount.toLocaleString("en-IN")}</span></div>
        {paymentMode === "Pay Later" && <div className="flex justify-between"><span className="text-cream/40">Balance Due</span><span className="text-amber-400">₹{(totalAmount - payableAmount).toLocaleString("en-IN")}</span></div>}
        <div className="flex justify-between"><span className="text-cream/40">Method</span><span className="text-cream/70">{paymentMethod}</span></div>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={() => router.push("/dashboard/bookings")} className="btn-primary text-sm py-3 px-6"><span className="relative z-10">View Bookings</span></button>
        <button onClick={() => { setDone(false); setSelected(null); setStep(1); setTravelerCount(1); setTravellersData([{ ...emptyTraveller }]); setConsentAccepted(false); }} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Book Another</button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div><h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Book a Trip</h1><p className="text-cream/35 text-sm mt-1">Smart Traveller Form</p></div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-2">
        {["Select Trip", "Traveller Details", "Payment"].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? "bg-emerald-500/20 text-emerald-400" : step === i + 1 ? "bg-burnt-orange/20 text-burnt-orange" : "bg-cream/5 text-cream/20"}`}>
              {step > i + 1 ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs ${step === i + 1 ? "text-cream" : "text-cream/20"}`}>{s}</span>
            {i < 2 && <div className={`w-8 h-[2px] ${step > i + 1 ? "bg-emerald-500/30" : "bg-cream/5"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-4">
            {trips.length > 0 ? trips.map(t => (
              <button key={t._id || t.id} onClick={() => { setSelected(t); setStep(2); }}
                className={`glass-card p-0 overflow-hidden text-left hover:border-burnt-orange/20 transition-all group ${selected?.id === t.id ? "border-burnt-orange/30" : ""}`}>
                <div className="relative h-40 overflow-hidden">
                  <img src={t.image || t.images?.[0] || "/destinations/delhi.jpg"} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4"><h3 className="text-cream font-semibold text-base">{t.title}</h3></div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-cream/30">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t.startDate ? new Date(t.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Flexible"}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.duration}</span>
                  </div>
                  <p className="text-burnt-orange font-bold">₹{(t.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </button>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-burnt-orange/10 text-burnt-orange flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} />
                </div>
                <p className="text-cream/50 text-lg font-medium">No upcoming trips at the moment</p>
                <p className="text-cream/25 text-sm mt-2">Check back soon — new adventures are being planned!</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 2 - Traveller Details */}
        {step === 2 && selected && (
          <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="bg-[#0a1017]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-burnt-orange/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-white/5 relative z-10">
                <img src={selected.image || selected.images?.[0] || "/destinations/delhi.jpg"} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-white/5" />
                <div className="flex-1">
                  <h3 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-cream mb-1">{selected.title}</h3>
                  <div className="flex items-center gap-4 text-cream/50 text-sm">
                    <span className="flex items-center gap-1"><Clock size={14} className="text-burnt-orange" /> {selected.duration}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-burnt-orange" /> {selected.destination}</span>
                  </div>
                </div>
                <div className="md:border-l md:border-white/5 md:pl-6">
                  <label className="text-cream/40 text-[11px] uppercase tracking-widest font-semibold mb-3 block">Travelers</label>
                  <div className="flex items-center gap-4 bg-black/30 p-2 rounded-2xl border border-white/5">
                    <button onClick={() => handleTravelerCountChange(Math.max(1, travelerCount - 1))} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-burnt-orange/20 text-cream/70 hover:text-burnt-orange transition-colors flex items-center justify-center text-lg">−</button>
                    <span className="text-cream text-xl font-bold w-6 text-center">{travelerCount}</span>
                    <button onClick={() => handleTravelerCountChange(travelerCount + 1)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-burnt-orange/20 text-cream/70 hover:text-burnt-orange transition-colors flex items-center justify-center text-lg">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {travellersData.map((t, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#0a1017]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-burnt-orange/20 transition-colors duration-500">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-burnt-orange to-amber-500 opacity-80" />
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold text-cream flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-burnt-orange/10 border border-burnt-orange/20 text-burnt-orange flex items-center justify-center text-sm shadow-[inset_0_0_10px_rgba(198,122,60,0.2)]">{i + 1}</div>
                    Traveller {i + 1}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">FULL NAME *</label>
                      <input value={t.fullName} onChange={(e) => updateTraveler(i, "fullName", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="e.g. Rahul Sharma" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">AGE *</label>
                        <input type="number" value={t.age} onChange={(e) => updateTraveler(i, "age", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="25" />
                      </div>
                      <div>
                        <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">GENDER *</label>
                        <select value={t.gender} onChange={(e) => updateTraveler(i, "gender", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none appearance-none">
                          <option value="Male" className="bg-[#0a1017] text-cream">Male</option>
                          <option value="Female" className="bg-[#0a1017] text-cream">Female</option>
                          <option value="Other" className="bg-[#0a1017] text-cream">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">CONTACT NUMBER *</label>
                      <input type="tel" value={t.contactNumber} onChange={(e) => updateTraveler(i, "contactNumber", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="+91" />
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">EMAIL ADDRESS</label>
                      <input type="email" value={t.emailAddress} onChange={(e) => updateTraveler(i, "emailAddress", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="email@example.com" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">CITY OF RESIDENCE</label>
                      <input value={t.city} onChange={(e) => updateTraveler(i, "city", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="Delhi, Mumbai..." />
                    </div>
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 flex items-center gap-1.5"><HeartPulse size={12} className="text-red-400" /> EMERGENCY CONTACT *</label>
                      <input value={t.emergencyContact} onChange={(e) => updateTraveler(i, "emergencyContact", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all outline-none placeholder-cream/20" placeholder="Name & Phone" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">FOOD PREFERENCE</label>
                      <select value={t.foodPreference} onChange={(e) => updateTraveler(i, "foodPreference", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none appearance-none">
                        <option value="Veg" className="bg-[#0a1017]">Veg</option>
                        <option value="Non-Veg" className="bg-[#0a1017]">Non-Veg</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-cream/60 text-xs font-semibold tracking-wider mb-2 block">MEDICAL NOTES / SPECIAL REQUESTS</label>
                      <input value={t.medicalConditions} onChange={(e) => updateTraveler(i, "medicalConditions", e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:bg-black/40 focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all outline-none placeholder-cream/20" placeholder="Any allergies, asthma, or specific needs?" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button onClick={() => setStep(1)} className="bg-[#0a1017] hover:bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-sm text-cream transition-colors font-semibold tracking-wide">Back</button>
              <button onClick={() => {
                const valid = travellersData.every(t => t.fullName && t.age && t.gender && t.contactNumber && t.emergencyContact);
                if (!valid) { alert("Please fill all required (*) fields."); return; }
                setStep(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} className="flex-1 bg-burnt-orange hover:bg-[#d98542] text-white py-4 rounded-xl font-semibold tracking-wide shadow-[0_0_20px_rgba(198,122,60,0.3)] hover:shadow-[0_0_30px_rgba(198,122,60,0.5)] transition-all flex items-center justify-center gap-2">
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 - Payment */}
        {step === 3 && selected && (
          <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 max-w-3xl mx-auto">
            {/* Summary */}
            <div className="bg-[#0a1017]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burnt-orange to-amber-500" />
              <h2 className="text-xl font-[family-name:var(--font-heading)] font-bold text-cream mb-6">Payment Summary</h2>
              
              <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-4 mb-8">
                <div className="flex justify-between items-center"><span className="text-cream/60 font-medium">{selected.title}</span><span className="text-cream font-medium">₹{(selected.price || 0).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between items-center"><span className="text-cream/60 font-medium">Travelers</span><span className="text-cream font-medium">×{travelerCount}</span></div>
                <div className="h-px w-full bg-white/5 my-2" />
                <div className="flex justify-between items-center text-lg"><span className="text-cream font-bold">Total Amount</span><span className="text-burnt-orange font-bold drop-shadow-[0_0_8px_rgba(198,122,60,0.3)]">₹{totalAmount.toLocaleString("en-IN")}</span></div>
              </div>

              {/* Payment Mode */}
              <div className="mb-8">
                <label className="text-cream/60 text-xs font-semibold tracking-widest uppercase mb-4 block">Select Payment Mode</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["Full Payment", "Pay Later"].map(m => (
                    <button key={m} onClick={() => setPaymentMode(m)}
                      className={`relative p-5 rounded-2xl text-left transition-all duration-300 border group ${paymentMode === m ? "bg-burnt-orange/10 border-burnt-orange/50 shadow-[0_0_20px_rgba(198,122,60,0.15)]" : "bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/40"}`}>
                      {paymentMode === m && <div className="absolute top-4 right-4 text-burnt-orange"><Check size={18} /></div>}
                      <h4 className={`font-semibold mb-1 flex items-center gap-2 ${paymentMode === m ? "text-burnt-orange" : "text-cream"}`}>
                        {m}
                        {m === "Pay Later" && (
                          <div className="relative flex items-center justify-center">
                            <Info size={14} className="text-cream/40 group-hover:text-burnt-orange transition-colors" />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] p-4 bg-[#0a1017]/95 backdrop-blur-xl border border-burnt-orange/30 rounded-2xl shadow-[0_15px_40px_rgba(198,122,60,0.2)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0 text-center pointer-events-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-burnt-orange/30">
                              <p className="text-[12px] text-cream leading-relaxed mb-2 font-medium">
                                Reserve your Himalayan adventure with just ₹1,500 now ✨
                              </p>
                              <p className="text-[11px] text-cream/60 leading-relaxed font-light">
                                Pay the remaining amount comfortably at the time of departure and secure your spot before seats fill up.
                              </p>
                            </div>
                          </div>
                        )}
                      </h4>
                      <p className="text-cream/40 text-xs">
                        {m === "Full Payment" ? "Pay the entire amount now and relax." : `Secure your spot with just ₹${BOOKING_CHARGE.toLocaleString("en-IN")}/head`}
                      </p>
                    </button>
                  ))}
                </div>
                
                {/* Pay Later Warning */}
                <AnimatePresence>
                  {paymentMode === "Pay Later" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                        <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-cream/70 text-sm leading-relaxed">Booking charge of <span className="text-amber-400 font-semibold">₹{(BOOKING_CHARGE * travelerCount).toLocaleString("en-IN")}</span> is non-refundable. The balance of <span className="text-amber-400 font-semibold">₹{(totalAmount - BOOKING_CHARGE * travelerCount).toLocaleString("en-IN")}</span> must be paid before departure.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Payment Method — Razorpay Only */}
              <div className="p-5 bg-gradient-to-r from-[#0C1420] to-[#1E2D4A] border border-white/10 rounded-2xl flex items-center gap-4 mb-8 relative overflow-hidden group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={20} className="text-burnt-orange" />
                </div>
                <div>
                  <p className="text-cream font-semibold">Razorpay Secure Checkout</p>
                  <p className="text-cream/50 text-xs mt-0.5">Cards, UPI, Net Banking, Wallets supported</p>
                </div>
              </div>

              {/* Payable */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-emerald-400/80 text-sm font-semibold tracking-wide uppercase">Amount to Pay Now</span>
                  <p className="text-cream/50 text-xs mt-1">Includes all taxes and fees</p>
                </div>
                <span className="text-emerald-400 text-3xl font-bold tracking-tight">₹{payableAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-[#0a1017]/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
              <TermsConsent accepted={consentAccepted} onChange={setConsentAccepted} bookingChargePerHead={BOOKING_CHARGE} travelerCount={travelerCount} />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-[#0a1017] hover:bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-sm text-cream transition-colors font-semibold tracking-wide">Back</button>
              <button onClick={handleBook} disabled={booking || !consentAccepted} className="flex-1 bg-burnt-orange hover:bg-[#d98542] text-white py-4 rounded-xl font-semibold tracking-wide shadow-[0_0_20px_rgba(198,122,60,0.3)] hover:shadow-[0_0_30px_rgba(198,122,60,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {booking ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing Securely...</span>
                ) : (
                  <span className="flex items-center gap-2"><Shield size={16} /> Pay ₹{payableAmount.toLocaleString("en-IN")} Securely</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Unavailable Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Darker Glassmorphism Background */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md p-px rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(198,122,60,0.15)]"
            >
              {/* Animated Glowing Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-burnt-orange/50 via-[#0a1017] to-amber-500/20 blur-[2px]" />
              
              {/* Inner Container */}
              <div className="relative bg-[#0a1017]/95 backdrop-blur-3xl p-6 sm:p-8 rounded-[2rem] overflow-hidden">
                {/* Ambient Corner Glows */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-burnt-orange/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-teal/10 rounded-full blur-[80px] pointer-events-none" />
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-5 right-5 text-cream/40 hover:text-cream transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2 z-20 group"
                >
                  <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative z-10 mb-6 pt-1">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burnt-orange/20 to-amber-500/5 text-burnt-orange border border-burnt-orange/20 flex items-center justify-center mb-4 shadow-[inset_0_2px_10px_rgba(198,122,60,0.2)]"
                  >
                    <Mountain size={24} className="drop-shadow-[0_0_8px_rgba(198,122,60,0.8)]" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-bold text-cream mb-4 font-[family-name:var(--font-heading)] leading-tight drop-shadow-md"
                  >
                    Trip Not Available Yet
                  </motion.h3>

                  {/* Cinematic Text Reveal */}
                  <div className="space-y-2">
                    <AnimatedStoryText 
                      text="This journey is currently not available for instant booking, but that doesn't mean the adventure has to wait." 
                      delay={0.3} 
                    />
                    <AnimatedStoryText 
                      text="Many of our Himalayan experiences are organized in upcoming batches or can be arranged on special request for future dates. Connect with the Backpack Junction team and we'll personally guide you with availability, upcoming departures, custom planning, and everything you need to make this journey happen." 
                      delay={0.8} 
                    />
                    <AnimatedStoryText 
                      text="Your next Himalayan story might be closer than you think." 
                      delay={2.2} 
                      highlight={true}
                      italic={true}
                    />
                  </div>
                </div>

                {/* 3D Premium Interactive Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.6 }}
                  className="space-y-3 relative z-10"
                >
                  <a 
                    href={`https://wa.me/919999999999?text=Hi!%20I'm%20interested%20in%20booking%20the%20trip%20to%20${encodeURIComponent(destinationParam || 'the Himalayas')}.`}
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-cream transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(37,211,102,0.15) 0%, rgba(37,211,102,0.05) 100%)",
                      border: "1px solid rgba(37,211,102,0.3)",
                      boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.05), 0px 8px 20px rgba(37,211,102,0.1)"
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#25D366]/10" />
                    <MessageCircle size={18} className="relative z-10 text-[#25D366] group-hover:drop-shadow-[0_0_8px_rgba(37,211,102,0.8)] transition-all duration-300 group-hover:scale-110" />
                    <span className="relative z-10 tracking-wide text-sm text-[#25D366] group-hover:text-white transition-colors duration-300">Chat on WhatsApp</span>
                  </a>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="tel:+919999999999" 
                      className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-cream transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.02), 0px 8px 20px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
                      <Phone size={16} className="relative z-10 text-cream/70 group-hover:text-cream transition-colors duration-300 group-hover:scale-110" />
                      <span className="relative z-10 tracking-wide text-sm text-cream/80 group-hover:text-cream transition-colors duration-300">Call Us</span>
                    </a>

                    <Link 
                      href="/contact" 
                      className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-cream transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:shadow-inner"
                      style={{
                        background: "linear-gradient(180deg, #D4842A 0%, #C67A3C 100%)",
                        boxShadow: "inset 0px 2px 4px rgba(255,255,255,0.3), inset 0px -4px 8px rgba(0,0,0,0.2), 0px 8px 20px rgba(198,122,60,0.4)"
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-transparent to-white/10" />
                      <Mail size={16} className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10 tracking-wide text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Contact Us</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function BookTripPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>}>
      <BookTripForm />
    </Suspense>
  );
}
