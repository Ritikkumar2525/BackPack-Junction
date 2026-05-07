"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, CreditCard, ArrowRight, Check, Star, Clock, Mountain, ChevronDown, User, HeartPulse, FileText } from "lucide-react";

export default function BookTripPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  
  const [travelerCount, setTravelerCount] = useState(1);
  const [travellersData, setTravellersData] = useState([
    { fullName: "", age: "", gender: "Male", contactNumber: "", emailAddress: "", city: "", emergencyContact: "", foodPreference: "Veg", medicalConditions: "", specialRequests: "" }
  ]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    fetch("/api/trips?filter=upcoming").then(r => r.json()).then(d => { setTrips(d.trips || []); setLoading(false); });
  }, []);

  const handleTravelerCountChange = (newCount) => {
    setTravelerCount(newCount);
    setTravellersData(prev => {
      const newData = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          newData.push({ fullName: "", age: "", gender: "Male", contactNumber: "", emailAddress: "", city: "", emergencyContact: "", foodPreference: "Veg", medicalConditions: "", specialRequests: "" });
        }
      } else if (newCount < prev.length) {
        return newData.slice(0, newCount);
      }
      return newData;
    });
  };

  const updateTraveler = (index, field, value) => {
    setTravellersData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  const handleBook = async () => {
    if (!selected) return;
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: selected.id || selected._id,
          totalAmount: selected.price * travelerCount,
          travellers: travellersData,
          paymentMethod: paymentMethod,
        }),
      });
      if (res.ok) setDone(true);
    } catch (e) { console.error(e); }
    setBooking(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-6"><Check size={36} /></div>
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-cream mb-3">Booking Confirmed! 🎉</h2>
      <p className="text-cream/35 text-sm mb-2">Your trip to <span className="text-burnt-orange font-medium">{selected.destination}</span> is booked.</p>
      <p className="text-cream/25 text-xs mb-8">Amount: ₹{(selected.price * travelerCount).toLocaleString("en-IN")} · Payment: {paymentMethod}</p>
      <div className="flex justify-center gap-3">
        <button onClick={() => router.push("/dashboard/bookings")} className="btn-primary text-sm py-3 px-6"><span className="relative z-10">View Bookings</span></button>
        <button onClick={() => { setDone(false); setSelected(null); setStep(1); setTravelerCount(1); setTravellersData([{ fullName: "", age: "", gender: "Male", contactNumber: "", emailAddress: "", city: "", emergencyContact: "", foodPreference: "Veg", medicalConditions: "", specialRequests: "" }]); }} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Book Another</button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Book a Trip</h1>
        <p className="text-cream/35 text-sm mt-1">Smart Traveller Form</p>
      </div>

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
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-4">
            {trips.length > 0 ? trips.map(t => (
              <button key={t.id || t._id} onClick={() => { setSelected(t); setStep(2); }}
                className={`glass-card p-0 overflow-hidden text-left hover:border-burnt-orange/20 transition-all group ${selected?.id === t.id ? "border-burnt-orange/30" : ""}`}>
                <div className="relative h-40 overflow-hidden">
                  <img src={t.image || t.images?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                  <span className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-medium ${t.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" : t.difficulty === "Moderate" ? "bg-amber-500/20 text-amber-400" : t.difficulty === "Challenging" ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400"}`}>{t.difficulty || 'All Levels'}</span>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-cream font-semibold text-base">{t.title}</h3>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-cream/30">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t.departureDate ? new Date(t.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : 'Flexible'}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.duration}</span>
                  </div>
                  <p className="text-burnt-orange font-bold">₹{(t.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </button>
            )) : (
              <div className="col-span-2 text-center text-cream/50 py-10">No upcoming trips available. Admin needs to add trips first!</div>
            )}
          </motion.div>
        )}

        {step === 2 && selected && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 pb-4 border-b border-cream/5">
                <img src={selected.image || selected.images?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div><h3 className="text-cream font-semibold">{selected.title}</h3><p className="text-cream/30 text-xs">{selected.duration} · {selected.destination}</p></div>
              </div>
              <div className="mt-4">
                <label className="text-cream/40 text-xs uppercase tracking-wider mb-2 block">Number of Travelers</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleTravelerCountChange(Math.max(1, travelerCount - 1))} className="w-10 h-10 rounded-xl glass text-cream/50 hover:text-cream border border-cream/10 flex items-center justify-center text-lg">−</button>
                  <span className="text-cream text-xl font-bold w-8 text-center">{travelerCount}</span>
                  <button onClick={() => handleTravelerCountChange(travelerCount + 1)} className="w-10 h-10 rounded-xl glass text-cream/50 hover:text-cream border border-cream/10 flex items-center justify-center text-lg">+</button>
                </div>
              </div>
            </div>

            {/* Dynamic Traveller Forms */}
            {travellersData.map((traveller, index) => (
              <div key={index} className="glass-card p-6 border border-cream/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-burnt-orange/50" />
                <h3 className="text-cream font-semibold flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center text-xs font-bold">{index + 1}</div>
                  Traveller {index + 1} Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Full Name *</label>
                    <input value={traveller.fullName} onChange={(e) => updateTraveler(index, "fullName", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="John Doe" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Age *</label>
                      <input type="number" value={traveller.age} onChange={(e) => updateTraveler(index, "age", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="25" required />
                    </div>
                    <div>
                      <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Gender *</label>
                      <select value={traveller.gender} onChange={(e) => updateTraveler(index, "gender", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full appearance-none">
                        <option value="Male" className="bg-midnight text-cream">Male</option>
                        <option value="Female" className="bg-midnight text-cream">Female</option>
                        <option value="Other" className="bg-midnight text-cream">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Contact Number *</label>
                    <input type="tel" value={traveller.contactNumber} onChange={(e) => updateTraveler(index, "contactNumber", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="+91" required />
                  </div>
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Email Address</label>
                    <input type="email" value={traveller.emailAddress} onChange={(e) => updateTraveler(index, "emailAddress", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="email@example.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">City</label>
                    <input value={traveller.city} onChange={(e) => updateTraveler(index, "city", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="Delhi, Mumbai..." />
                  </div>
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block flex items-center gap-1"><HeartPulse size={10} /> Emergency Contact *</label>
                    <input value={traveller.emergencyContact} onChange={(e) => updateTraveler(index, "emergencyContact", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-red-500/30 w-full" placeholder="Name & Phone" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Food Preference</label>
                    <select value={traveller.foodPreference} onChange={(e) => updateTraveler(index, "foodPreference", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full appearance-none">
                      <option value="Veg" className="bg-midnight text-cream">Vegetarian</option>
                      <option value="Non-Veg" className="bg-midnight text-cream">Non-Vegetarian</option>
                      <option value="Jain" className="bg-midnight text-cream">Jain Food</option>
                      <option value="Vegan" className="bg-midnight text-cream">Vegan</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Medical Conditions / Notes</label>
                    <input value={traveller.medicalConditions} onChange={(e) => updateTraveler(index, "medicalConditions", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="Asthma, Motion Sickness, etc." />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Back</button>
              <button 
                onClick={() => {
                  // Basic validation
                  const isValid = travellersData.every(t => t.fullName && t.age && t.gender && t.contactNumber && t.emergencyContact);
                  if(!isValid) { alert("Please fill all required (*) fields for all travellers"); return; }
                  setStep(3);
                }} 
                className="btn-primary text-sm py-3 px-8 flex-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">Continue to Payment <ArrowRight size={14} /></span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && selected && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-6 space-y-5">
            <h2 className="text-cream font-semibold">Payment Summary</h2>
            <div className="space-y-3 pb-4 border-b border-cream/5 text-sm">
              <div className="flex justify-between"><span className="text-cream/40">{selected.title}</span><span className="text-cream">₹{(selected.price || 0).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-cream/40">Travelers</span><span className="text-cream">×{travelerCount}</span></div>
              <div className="flex justify-between text-base font-bold"><span className="text-cream">Total Amount</span><span className="text-burnt-orange">₹{((selected.price || 0) * travelerCount).toLocaleString("en-IN")}</span></div>
            </div>
            <div>
              <label className="text-cream/40 text-xs uppercase tracking-wider mb-3 block">Payment Options (Razorpay integration pending credentials)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["Razorpay (UPI)", "Razorpay (Card)", "Net Banking", "Wallet"].map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`p-3 rounded-xl text-sm text-center transition-all ${paymentMethod === m ? "bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/30" : "glass text-cream/40 border border-cream/5 hover:border-cream/10"}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Back</button>
              <button onClick={handleBook} disabled={booking} className="btn-primary text-sm py-3 px-8 flex-1 disabled:opacity-50">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <CreditCard size={14} /> {booking ? "Processing..." : `Pay ₹${((selected.price || 0) * travelerCount).toLocaleString("en-IN")}`}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
