"use client";

import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import TrendingDestinations from "@/components/destinations/TrendingDestinations";
import StatsSection from "@/components/stats/StatsSection";
import UpcomingTrips from "@/components/trips/UpcomingTrips";
import AiTripPlanner from "@/components/ai-planner/AiTripPlanner";
import InteractiveMap from "@/components/map/InteractiveMap";
import TravelStories from "@/components/stories/TravelStories";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import NewsletterSection from "@/components/newsletter/NewsletterSection";
import Footer from "@/components/footer/Footer";

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
        <AiTripPlanner />
        <InteractiveMap />
        <TravelStories />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </main>
    </>
  );
}
