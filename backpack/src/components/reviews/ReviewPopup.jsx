"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Camera, Send, MapPin, Calendar, Loader2 } from "lucide-react";

export default function ReviewPopup() {
  const [pendingReview, setPendingReview] = useState(null);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    checkForPendingReviews();
  }, []);

  const checkForPendingReviews = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) return;
      const data = await res.json();
      const bookings = data.bookings || [];

      // Find completed trips that haven't been reviewed
      const now = new Date();
      for (const booking of bookings) {
        if (booking.bookingStatus !== "Confirmed" && booking.bookingStatus !== "Completed") continue;

        const trip = booking.tripId;
        if (!trip) continue;

        // Check if trip has ended using endDate or startDate + duration estimate
        const tripEndDate = trip.endDate ? new Date(trip.endDate) : (trip.startDate ? new Date(new Date(trip.startDate).getTime() + 7 * 24 * 60 * 60 * 1000) : null);
        if (!tripEndDate || tripEndDate > now) continue;

        // Check if already reviewed
        const reviewCheck = await fetch(`/api/reviews?bookingId=${booking._id}`);
        const reviewData = await reviewCheck.json();
        if (reviewData.exists) continue;

        // Found one that needs a review!
        setPendingReview(booking);
        setTimeout(() => setShow(true), 1500); // Slight delay for smooth UX
        break;
      }
    } catch (err) {
      console.error("Review check error:", err);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => setPhotos(prev => [...prev.slice(0, 2), reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!rating || !review.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: pendingReview._id,
          rating,
          review: review.trim(),
          photos,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setShow(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setSubmitting(false);
  };

  if (!pendingReview) return null;
  const trip = pendingReview.tripId;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="absolute inset-0 bg-midnight/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-[#0a1017] border border-white/10 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(198,122,60,0.15)]"
          >
            {/* Header */}
            <div className="relative">
              {trip?.images?.[0] && (
                <div className="h-24 overflow-hidden rounded-t-2xl">
                  <img src={trip.images[0]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-[#0a1017]/60 to-transparent" />
                </div>
              )}
              <button
                onClick={() => setShow(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-midnight/60 backdrop-blur-sm flex items-center justify-center text-cream/60 hover:text-cream"
              >
                <X size={16} />
              </button>
              <div className={`px-5 ${trip?.images?.[0] ? '-mt-8 relative z-10' : 'pt-5'}`}>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream">
                  How was your trip? ✨
                </h2>
                <div className="flex items-center gap-3 mt-1 text-cream/40 text-xs">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {trip?.title || "Your Trip"}</span>
                  {trip?.destination && <span>· {trip.destination}</span>}
                </div>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                  <Star size={28} className="text-emerald-400 fill-emerald-400" />
                </div>
                <h3 className="text-cream font-bold text-lg mb-1">Thank You! 🙏</h3>
                <p className="text-cream/40 text-sm">Your review has been submitted and will be visible after approval.</p>
              </motion.div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-cream/50 text-xs mb-3">Tap to rate your experience</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-cream/15"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-amber-400 text-xs mt-2 font-medium"
                    >
                      {["", "Disappointing", "Could be better", "Good trip!", "Great experience!", "Absolutely amazing!"][rating]}
                    </motion.p>
                  )}
                </div>

                {/* Review text */}
                <div>
                  <label className="text-cream/40 text-xs mb-2 block">Share your experience</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value.substring(0, 1000))}
                    rows={3}
                    className="glass rounded-xl px-4 py-3 text-sm w-full outline-none text-cream placeholder-cream/20 resize-none border border-cream/5 focus:border-burnt-orange/30"
                    placeholder="Tell us about the highlights, the views..."
                  />
                  <p className="text-cream/20 text-[10px] text-right mt-1">{review.length}/1000</p>
                </div>

                {/* Photo upload */}
                <div>
                  <label className="text-cream/40 text-xs mb-2 block">Add photos (optional, max 3)</label>
                  <div className="flex gap-2">
                    {photos.map((p, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream/10">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    {photos.length < 3 && (
                      <label className="w-16 h-16 rounded-xl border-2 border-dashed border-cream/10 flex flex-col items-center justify-center cursor-pointer hover:border-cream/20 transition-colors">
                        <Camera size={14} className="text-cream/20" />
                        <span className="text-cream/20 text-[8px] mt-1">Add</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !review.trim() || submitting}
                  className="w-full btn-primary text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? "Submitting..." : "Submit Review"}
                  </span>
                </button>

                <button
                  onClick={() => setShow(false)}
                  className="w-full text-center text-cream/30 text-xs hover:text-cream/50 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
