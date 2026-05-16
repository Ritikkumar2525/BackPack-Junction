"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, AlertTriangle, ShieldCheck, FileText, Receipt } from "lucide-react";

const processingMessages = [
  { icon: ShieldCheck, text: "Verifying Payment...", color: "text-blue-400" },
  { icon: Receipt, text: "Confirming Your Booking...", color: "text-burnt-orange" },
  { icon: FileText, text: "Generating Invoice...", color: "text-emerald-400" },
];

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const status = searchParams.get("status"); // "success" or "failed"

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "failed") {
      setError("Payment was not completed. Please try again.");
      return;
    }

    if (!bookingId) {
      setError("Missing booking information.");
      return;
    }

    // Animated step progression
    const timers = processingMessages.map((_, index) =>
      setTimeout(() => {
        setCurrentStep(index);
        if (index === processingMessages.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            // Redirect to success page after brief completion animation
            setTimeout(() => {
              router.push(`/payment/success?bookingId=${bookingId}`);
            }, 800);
          }, 1200);
        }
      }, index * 1500)
    );

    return () => timers.forEach(clearTimeout);
  }, [bookingId, status, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream mb-3">
            Payment Failed
          </h2>
          <p className="text-cream/50 text-sm mb-8">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard/book-trip")}
              className="btn-primary text-sm py-3 px-8"
            >
              <span className="relative z-10">Try Again</span>
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="glass px-6 py-3 rounded-full text-sm text-cream/50 hover:text-cream border border-cream/10"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated Circle */}
        <div className="relative w-28 h-28 mx-auto mb-10">
          {/* Spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cream/5"
            style={{ borderTopColor: isComplete ? "#10B981" : "#C67A3C" }}
            animate={isComplete ? { rotate: 0 } : { rotate: 360 }}
            transition={isComplete ? {} : { duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-burnt-orange/10 to-transparent" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Check size={40} className="text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const StepIcon = processingMessages[currentStep]?.icon || Loader2;
                    return <StepIcon size={32} className={processingMessages[currentStep]?.color || "text-cream"} />;
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-emerald-400 mb-2">
                Payment Verified! ✓
              </h2>
              <p className="text-cream/40 text-sm">Redirecting to your booking...</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream mb-2">
                {processingMessages[currentStep]?.text}
              </h2>
              <p className="text-cream/30 text-sm">Please don't close this window</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {processingMessages.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-burnt-orange w-8" : "bg-cream/10 w-4"
              }`}
              animate={{ width: i <= currentStep ? 32 : 16 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentProcessing() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f18" }}>
        <Loader2 size={32} className="animate-spin text-burnt-orange" />
      </div>
    }>
      <PaymentProcessingContent />
    </Suspense>
  );
}
