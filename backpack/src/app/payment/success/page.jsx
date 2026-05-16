"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Download, MessageCircle, ArrowRight, Copy, Loader2, AlertTriangle, CreditCard, Calendar, Users } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        const found = data.bookings?.find(b => b.bookingId === bookingId);
        if (found) {
          setBooking(found);
        } else {
          setError("Booking not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadInvoice = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/invoice`);
      if (!res.ok) throw new Error("Failed to download invoice");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice. Please try again from your dashboard.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
        <Loader2 size={32} className="animate-spin text-burnt-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-cream mb-3">{error}</h2>
          <button onClick={() => router.push("/dashboard")} className="btn-primary text-sm py-3 px-8 mt-4">
            <span className="relative z-10">Go to Dashboard</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const trip = booking?.tripId;
  const isPayLater = booking?.paymentMode === "Pay Later";
  const balanceDue = Math.max(0, (booking?.totalAmount || 0) - (booking?.amountPaid || 0));
  const isFullyPaid = booking?.paymentStatus === "Completed";

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full"
      >
        {/* Success header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
            <Check size={44} className="text-emerald-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-cream mb-2"
          >
            Booking <span className="text-emerald-400">Confirmed!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cream/40 text-sm"
          >
            Your adventure to <span className="text-burnt-orange font-medium">{trip?.destination || "the mountains"}</span> is confirmed!
          </motion.p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#111827]/80 border border-cream/10 rounded-2xl overflow-hidden backdrop-blur-sm"
        >
          {/* Trip banner */}
          {trip?.images?.[0] || trip?.image ? (
            <div className="relative h-32 overflow-hidden">
              <img
                src={trip?.images?.[0] || trip?.image}
                alt={trip?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h3 className="text-cream font-bold text-lg">{trip?.title}</h3>
                <div className="flex items-center gap-3 text-cream/50 text-xs mt-1">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {trip?.duration}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {booking?.travellers?.length} travelers</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Details */}
          <div className="p-5 space-y-4">
            {/* Booking ID */}
            <div className="flex items-center justify-between bg-cream/3 rounded-xl px-4 py-3 border border-cream/5">
              <div>
                <p className="text-cream/40 text-[10px] uppercase tracking-wider">Booking ID</p>
                <p className="text-cream font-mono font-semibold text-sm">{booking?.bookingId}</p>
              </div>
              <button onClick={copyBookingId} className="text-burnt-orange hover:text-copper-light transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Payment status badge */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${
                isFullyPaid
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              }`}>
                <CreditCard size={13} />
                {isFullyPaid ? "Full Payment Received" : "Partially Paid — Balance Due"}
              </span>
            </div>

            {/* Financial summary */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream/40">Total Amount</span>
                <span className="text-cream font-medium">₹{(booking?.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/40">Amount Paid</span>
                <span className="text-emerald-400 font-semibold">₹{(booking?.amountPaid || 0).toLocaleString("en-IN")}</span>
              </div>
              {balanceDue > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-cream/5">
                  <span className="text-amber-400/80">Remaining Due</span>
                  <span className="text-amber-400 font-bold text-base">₹{balanceDue.toLocaleString("en-IN")}</span>
                </div>
              )}
              {booking?.razorpayPaymentId && (
                <div className="flex justify-between text-sm pt-2 border-t border-cream/5">
                  <span className="text-cream/40">Transaction ID</span>
                  <span className="text-cream/60 font-mono text-xs">{booking.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-cream/40">Payment Method</span>
                <span className="text-cream/60">{booking?.paymentMethod || "Razorpay"}</span>
              </div>
            </div>

            {/* Pay Later notice */}
            {isPayLater && balanceDue > 0 && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-cream/50 text-[11px] leading-relaxed">
                  Your advance booking of <span className="text-amber-400 font-semibold">₹{(booking?.amountPaid || 0).toLocaleString("en-IN")}</span> is confirmed.
                  Please pay the remaining <span className="text-amber-400 font-semibold">₹{balanceDue.toLocaleString("en-IN")}</span> before the departure date.
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="p-5 pt-0 space-y-3">
            <button
              onClick={downloadInvoice}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 bg-burnt-orange hover:bg-burnt-orange/90 text-white py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? "Generating Invoice..." : "Download Invoice"}
            </button>

            <a
              href={`https://wa.me/918287054501?text=Hi! I just booked ${trip?.title || "a trip"} (Booking ID: ${booking?.bookingId}). Looking forward to it!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp Support
            </a>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.push("/dashboard/bookings")}
                className="flex-1 glass py-3 rounded-xl text-sm text-cream/60 hover:text-cream border border-cream/10 transition-colors text-center"
              >
                View Bookings
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 glass py-3 rounded-xl text-sm text-cream/60 hover:text-cream border border-cream/10 transition-colors flex items-center justify-center gap-1"
              >
                Home <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-cream/20 text-[11px] mt-6"
        >
          A confirmation email with your invoice has been sent to your registered email.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f18" }}>
        <Loader2 size={32} className="animate-spin text-burnt-orange" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
