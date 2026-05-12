"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, CreditCard, ArrowRight, Check, Clock, ChevronDown, HeartPulse, Building2, QrCode, Smartphone, Shield, AlertTriangle } from "lucide-react";
import Script from "next/script";
import { Suspense } from "react";
import PaymentModal from "@/components/payment/PaymentModal";
import TermsConsent from "@/components/payment/TermsConsent";

const BOOKING_CHARGE = 1000;

function BookTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("trip");

  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const [travelerCount, setTravelerCount] = useState(1);
  const emptyTraveller = { fullName: "", age: "", gender: "Male", contactNumber: "", emailAddress: "", city: "", emergencyContact: "", foodPreference: "Veg", medicalConditions: "", specialRequests: "" };
  const [travellersData, setTravellersData] = useState([{ ...emptyTraveller }]);

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [paymentMode, setPaymentMode] = useState("Full Payment");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [manualMethod, setManualMethod] = useState("");

  useEffect(() => {
    fetch("/api/trips?filter=upcoming").then(r => r.json()).then(d => {
      const ft = d.trips || [];
      setTrips(ft);
      if (tripIdParam) {
        const found = ft.find(t => (t._id || t.id) === tripIdParam);
        if (found) { setSelected(found); setStep(2); }
      }
      setLoading(false);
    });
  }, [tripIdParam]);

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
      if (res.ok) { const data = await res.json(); setBookingResult(data.booking); setDone(true); }
      else alert("Payment Verification Failed!");
    } catch (err) { console.error(err); alert("Verification Error"); }
    setBooking(false);
  };

  const handleBook = async () => {
    if (!selected || !consentAccepted) { alert("Please accept the terms and conditions."); return; }
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: selected._id || selected.id, travellers: travellersData, paymentMethod, paymentMode, consentAccepted }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Booking failed"); setBooking(false); return; }

      if (paymentMethod === "Razorpay") {
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
        rzp.on("payment.failed", (r) => { alert("Payment Failed: " + r.error.description); setBooking(false); });
      } else {
        setBookingResult(data.booking);
        setManualMethod(paymentMethod);
        setShowPaymentModal(true);
        setBooking(false);
      }
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
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t.departureDate ? new Date(t.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Flexible"}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.duration}</span>
                  </div>
                  <p className="text-burnt-orange font-bold">₹{(t.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </button>
            )) : <div className="col-span-2 text-center text-cream/50 py-10">No upcoming trips available.</div>}
          </motion.div>
        )}

        {/* STEP 2 - Traveller Details */}
        {step === 2 && selected && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 pb-4 border-b border-cream/5">
                <img src={selected.image || selected.images?.[0] || "/destinations/delhi.jpg"} alt="" className="w-16 h-16 rounded-xl object-cover" />
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
            {travellersData.map((t, i) => (
              <div key={i} className="glass-card p-6 border border-cream/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-burnt-orange/50" />
                <h3 className="text-cream font-semibold flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  Traveller {i + 1}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Full Name *</label>
                    <input value={t.fullName} onChange={(e) => updateTraveler(i, "fullName", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="Full Name" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Age *</label>
                      <input type="number" value={t.age} onChange={(e) => updateTraveler(i, "age", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="25" /></div>
                    <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Gender *</label>
                      <select value={t.gender} onChange={(e) => updateTraveler(i, "gender", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full appearance-none">
                        <option value="Male" className="bg-midnight text-cream">Male</option><option value="Female" className="bg-midnight text-cream">Female</option><option value="Other" className="bg-midnight text-cream">Other</option>
                      </select></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Contact *</label>
                    <input type="tel" value={t.contactNumber} onChange={(e) => updateTraveler(i, "contactNumber", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="+91" /></div>
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Email</label>
                    <input type="email" value={t.emailAddress} onChange={(e) => updateTraveler(i, "emailAddress", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="email@example.com" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">City</label>
                    <input value={t.city} onChange={(e) => updateTraveler(i, "city", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="Delhi, Mumbai..." /></div>
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block flex items-center gap-1"><HeartPulse size={10} /> Emergency Contact *</label>
                    <input value={t.emergencyContact} onChange={(e) => updateTraveler(i, "emergencyContact", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-red-500/30 w-full" placeholder="Name & Phone" /></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Food Pref</label>
                    <select value={t.foodPreference} onChange={(e) => updateTraveler(i, "foodPreference", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full appearance-none">
                      <option value="Veg" className="bg-midnight">Veg</option><option value="Non-Veg" className="bg-midnight">Non-Veg</option>
                    </select></div>
                  <div className="col-span-2"><label className="text-cream/40 text-[10px] uppercase tracking-wider mb-1 block">Medical Notes</label>
                    <input value={t.medicalConditions} onChange={(e) => updateTraveler(i, "medicalConditions", e.target.value)} className="glass rounded-xl px-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full" placeholder="Asthma, etc." /></div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Back</button>
              <button onClick={() => {
                const valid = travellersData.every(t => t.fullName && t.age && t.gender && t.contactNumber && t.emergencyContact);
                if (!valid) { alert("Please fill all required (*) fields."); return; }
                setStep(3);
              }} className="btn-primary text-sm py-3 px-8 flex-1">
                <span className="relative z-10 flex items-center justify-center gap-2">Continue to Payment <ArrowRight size={14} /></span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 - Payment */}
        {step === 3 && selected && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Summary */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-cream font-semibold">Payment Summary</h2>
              <div className="space-y-3 pb-4 border-b border-cream/5 text-sm">
                <div className="flex justify-between"><span className="text-cream/40">{selected.title}</span><span className="text-cream">₹{(selected.price || 0).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-cream/40">Travelers</span><span className="text-cream">×{travelerCount}</span></div>
                <div className="flex justify-between text-base font-bold"><span className="text-cream">Total</span><span className="text-burnt-orange">₹{totalAmount.toLocaleString("en-IN")}</span></div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-cream/40 text-xs uppercase tracking-wider mb-3 block">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Full Payment", "Pay Later"].map(m => (
                    <button key={m} onClick={() => setPaymentMode(m)}
                      className={`p-3 rounded-xl text-sm text-center transition-all ${paymentMode === m ? "bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/30" : "glass text-cream/40 border border-cream/5 hover:border-cream/10"}`}>
                      {m}
                      {m === "Pay Later" && <span className="block text-[10px] text-cream/30 mt-0.5">₹{BOOKING_CHARGE.toLocaleString("en-IN")}/head</span>}
                    </button>
                  ))}
                </div>
                {paymentMode === "Pay Later" && (
                  <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-cream/50 text-[11px]">Booking charge of <span className="text-amber-400 font-semibold">₹{(BOOKING_CHARGE * travelerCount).toLocaleString("en-IN")}</span> (₹{BOOKING_CHARGE}/head × {travelerCount}) is non-refundable. Balance ₹{(totalAmount - BOOKING_CHARGE * travelerCount).toLocaleString("en-IN")} due before departure.</p>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-cream/40 text-xs uppercase tracking-wider mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "Razorpay", icon: <CreditCard size={16} />, label: "Razorpay", sub: "Cards, UPI, Wallets" },
                    { id: "Bank Transfer", icon: <Building2 size={16} />, label: "Bank Transfer", sub: "NEFT / IMPS" },
                    { id: "QR Code", icon: <QrCode size={16} />, label: "QR Code", sub: "Scan & Pay" },
                    { id: "UPI", icon: <Smartphone size={16} />, label: "UPI ID", sub: "Direct Transfer" },
                  ].map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl text-center transition-all ${paymentMethod === m.id ? "bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/30" : "glass text-cream/40 border border-cream/5 hover:border-cream/10"}`}>
                      <div className="flex justify-center mb-1">{m.icon}</div>
                      <p className="text-xs font-medium">{m.label}</p>
                      <p className="text-[9px] text-cream/30 mt-0.5">{m.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payable */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center justify-between">
                <span className="text-cream/70 text-sm font-medium">Amount to Pay Now</span>
                <span className="text-emerald-400 text-xl font-bold">₹{payableAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Terms */}
            <TermsConsent accepted={consentAccepted} onChange={setConsentAccepted} bookingChargePerHead={BOOKING_CHARGE} travelerCount={travelerCount} />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10">Back</button>
              <button onClick={handleBook} disabled={booking || !consentAccepted} className="btn-primary text-sm py-3 px-8 flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {paymentMethod === "Razorpay" ? <CreditCard size={14} /> : <Shield size={14} />}
                  {booking ? "Processing..." : `Pay ₹${payableAmount.toLocaleString("en-IN")}`}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal for manual methods */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={(submitted) => { 
          setShowPaymentModal(false); 
          if (submitted) {
            setDone(true); 
          } else {
            // User closed the modal without submitting UTR. Cancel the pending booking so they can try again.
            if (bookingResult && (bookingResult._id || bookingResult.id)) {
              fetch(`/api/bookings/${bookingResult._id || bookingResult.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel", reason: "User aborted manual payment process" })
              }).catch(e => console.error("Failed to cancel aborted booking:", e));
            }
            setBookingResult(null);
            alert("Payment cancelled. You can try again when you are ready.");
          }
        }} 
        method={manualMethod} 
        amount={payableAmount} 
        totalAmount={totalAmount} 
        paymentMode={paymentMode} 
        bookingId={bookingResult?.bookingId} 
      />
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
