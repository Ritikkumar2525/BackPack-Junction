"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import OnboardingTour from "@/components/dashboard/OnboardingTour";

// Dynamically import below-the-fold components for ultra-fast initial load
const TrendingDestinations = dynamic(() => import("@/components/destinations/TrendingDestinations"), { ssr: true });
const StatsSection = dynamic(() => import("@/components/stats/StatsSection"), { ssr: true });
const UpcomingTrips = dynamic(() => import("@/components/trips/UpcomingTrips"), { ssr: true });
const PolaroidGrid = dynamic(() => import("@/components/gallery/PolaroidGrid"), { ssr: true });
const InteractiveMap = dynamic(() => import("@/components/map/InteractiveMap"), { ssr: false }); // Map relies on window
const TestimonialsSection = dynamic(() => import("@/components/testimonials/TestimonialsSection"), { ssr: true });
const NewsletterSection = dynamic(() => import("@/components/newsletter/NewsletterSection"), { ssr: true });
const Footer = dynamic(() => import("@/components/footer/Footer"), { ssr: true });

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <main className="relative w-full overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <TrendingDestinations />
        <StatsSection />
        <UpcomingTrips />
        <PolaroidGrid />
        <InteractiveMap />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
        <OnboardingTour />
      </main>
    </>
  );
}
