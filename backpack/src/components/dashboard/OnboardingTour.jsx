"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Map, Check } from "lucide-react";
import { useSession } from "next-auth/react";

const STEPS = [
  {
    targetId: "tour-step-hero",
    title: "Hero Section",
    content: "Discover cinematic Himalayan journeys and unforgettable adventures.",
  },
  {
    targetId: "tour-step-destinations",
    title: "Destinations Section",
    content: "Explore curated mountain destinations and hidden Himalayan gems.",
  },
  {
    targetId: "tour-step-trips",
    title: "Upcoming Trips",
    content: "Check upcoming group trips and reserve your adventure.",
  },
  {
    targetId: "tour-step-blogs",
    title: "Blogs & Stories",
    content: "Read immersive travel stories, guides, and experiences.",
  },
  {
    targetId: "tour-step-contact", // Target the footer or contact section
    title: "Contact/Support",
    content: "Need help planning your trip? Connect with Backpack Junction anytime.",
  }
];

export default function OnboardingTour() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    
    // Check if user has seen the tour
    const storageKey = `hasSeenOnboarding_${session.user.email}`;
    const hasSeen = localStorage.getItem(storageKey);
    
    if (!hasSeen) {
      // Small delay to let the dashboard render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const updateTargetRect = () => {
    if (!isVisible) return;
    const currentTargetId = STEPS[currentStep].targetId;
    if (currentTargetId) {
      const el = document.getElementById(currentTargetId);
      if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  };

  // Setup highlight and scroll into view only when the step changes
  useEffect(() => {
    if (!isVisible) return;
    const currentTargetId = STEPS[currentStep].targetId;
    if (!currentTargetId) return;
    
    const el = document.getElementById(currentTargetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-burnt-orange', 'ring-offset-2', 'ring-offset-[#0a0f18]', 'z-[60]', 'relative');
      
      // Allow scroll animation to start before calculating rect
      setTimeout(updateTargetRect, 50);

      return () => {
        el.classList.remove('ring-2', 'ring-burnt-orange', 'ring-offset-2', 'ring-offset-[#0a0f18]', 'z-[60]', 'relative');
      };
    }
  }, [currentStep, isVisible]);

  // Handle high-performance tracking on scroll and resize
  useEffect(() => {
    if (!isVisible) return;
    
    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTargetRect();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateTargetRect();
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize);
    };
  }, [currentStep, isVisible]);

  const handleComplete = () => {
    setIsVisible(false);
    if (session?.user?.email) {
      localStorage.setItem(`hasSeenOnboarding_${session.user.email}`, "true");
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Dark Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0a0f18]/30 backdrop-blur-[2px] z-[55]"
        onClick={handleComplete}
      />

      {/* Spotlight cutout effect (using box-shadow hack or just an outline) */}
      {targetRect && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-[56] pointer-events-none rounded-xl border border-burnt-orange/30 shadow-[0_0_0_9999px_rgba(10,15,24,0.3)]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 40px rgba(198,122,60,0.15), 0 0 0 9999px rgba(10,15,24,0.3)',
          }}
        />
      )}

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed z-[60] w-[340px] max-w-[90vw] bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="bg-[#0a1017]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden relative">
            
            {/* Ambient Glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-burnt-orange/20 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="p-5 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-burnt-orange">
                  <Map size={18} />
                  <span className="text-xs font-bold tracking-widest uppercase">Quick Tour</span>
                </div>
                <button onClick={handleComplete} className="text-cream/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold text-cream mb-2">
                {STEPS[currentStep].title}
              </h3>
              
              <p className="text-sm text-cream/70 leading-relaxed font-light mb-6">
                {STEPS[currentStep].content}
              </p>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {STEPS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? "w-6 bg-burnt-orange" : "w-1.5 bg-white/10"}`} 
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-2">
                <button 
                  onClick={handleComplete}
                  className="text-xs text-cream/50 hover:text-cream transition-colors font-medium px-2 py-2"
                >
                  Skip Tour
                </button>
                
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button 
                      onClick={prevStep}
                      className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-cream flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  
                  <button 
                    onClick={nextStep}
                    className="h-9 px-4 rounded-full bg-burnt-orange hover:bg-[#d98542] text-white flex items-center justify-center gap-1.5 font-semibold text-xs shadow-[0_0_15px_rgba(198,122,60,0.3)] transition-all"
                  >
                    {currentStep === STEPS.length - 1 ? (
                      <>Finish <Check size={14} /></>
                    ) : (
                      <>Next <ChevronRight size={14} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
