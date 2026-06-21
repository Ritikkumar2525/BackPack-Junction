"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import TripGallery from "@/components/trips/TripGallery";
import TripCountdown from "@/components/trips/TripCountdown";
import {
  MapPin, Calendar, Clock, Users, Mountain,
  CheckCircle2, XCircle, ChevronDown, Share2,
  ArrowLeft, Phone, Hotel, Bus, FileText,
  HelpCircle, ShieldAlert, ImageIcon, Download
} from "lucide-react";

/* ─── Section wrapper ─── */
function Section({ icon: Icon, title, children, iconColor = "text-burnt-orange" }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold text-cream mb-6 flex items-center gap-3">
        {Icon && <Icon size={24} className={iconColor} />} {title}
      </h2>
      {children}
    </div>
  );
}

export default function TripDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [activeFaq, setActiveFaq] = useState(-1);

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setTrip(d.trip))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* Loading */
  if (loading) return (
    <main className="min-h-screen bg-[#0a1017] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin" />
    </main>
  );

  /* Not found */
  if (!trip) return (
    <main className="min-h-screen bg-[#0a1017] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl text-cream font-bold mb-4">Trip Not Found</h1>
      <p className="text-cream/50 mb-8">The expedition you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/trips" className="px-6 py-3 bg-burnt-orange text-white rounded-full font-bold">View All Trips</Link>
    </main>
  );

  /* Derived values */
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
  const startStr = fmt(trip.startDate);
  const endStr = fmt(trip.endDate);
  const mainImage = trip.images?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80";
  const booked = trip.bookedSeats ?? 0;
  const total = trip.totalSeats || 20;
  const available = Math.max(0, total - booked);
  const price = trip.price ? `₹${trip.price.toLocaleString("en-IN")}` : "₹0";
  const allGallery = [...(trip.gallery || []), ...(trip.images?.slice(1) || [])].filter(Boolean);
  const hasPickup = trip.pickupLocations?.filter(Boolean).length > 0;
  const hasDrop = trip.dropLocations?.filter(Boolean).length > 0;

  const now = Date.now();
  const startDateTime = trip.startDate ? new Date(trip.startDate).getTime() : now + 86400000;
  const endDateTime = trip.endDate ? new Date(trip.endDate).getTime() : startDateTime + (86400000 * 5);

  const isCompleted = endDateTime <= now;
  const isStarted = startDateTime <= now && endDateTime > now;
  const isSoldOut = available <= 0;

  let canBook = true;
  let statusBadge = null;

  if (isCompleted) {
    canBook = false;
    statusBadge = "Trip Completed";
  } else if (isStarted) {
    canBook = false;
    statusBadge = "Trip Started";
  } else if (isSoldOut) {
    canBook = false;
    statusBadge = "Sold Out";
  }

  const shareTrip = () => {
    if (navigator.share) navigator.share({ title: trip.title, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
  };

  return (
    <main className="relative bg-[#0a1017] min-h-screen overflow-x-hidden selection:bg-burnt-orange/30 selection:text-cream">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="relative h-[75vh] min-h-[550px] w-full flex items-end pb-16 pt-32 z-10">
        <div className="absolute inset-0 z-0 bg-black">
          <Image src={mainImage} alt={trip.title} fill priority className="object-cover opacity-50" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-[#0a1017]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1017]/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-cream/50 hover:text-burnt-orange transition-colors mb-5 text-sm font-medium">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-wrap gap-2 mb-4">
            {trip.difficulty && (
              <span className="px-3 py-1 rounded-full bg-burnt-orange/20 border border-burnt-orange/30 text-burnt-orange text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">{trip.difficulty}</span>
            )}
            {trip.destination && (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-cream text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5"><MapPin size={11} /> {trip.destination}</span>
            )}
          </div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold text-cream mb-3 leading-tight">
            {trip.title}
          </motion.h1>

          {/* Quick info chips */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-cream/60 text-sm mt-4">
            {trip.duration && <span className="flex items-center gap-1.5"><Calendar size={14} className="text-burnt-orange" /> {trip.duration}</span>}
            {startStr && <span className="flex items-center gap-1.5"><Clock size={14} className="text-burnt-orange" /> {startStr}{endStr ? ` — ${endStr}` : ""}</span>}
            <span className="flex items-center gap-1.5"><Users size={14} className="text-burnt-orange" /> {total} max group</span>
          </motion.div>
        </div>
      </section>

      {/* ════════ MAIN CONTENT ════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 relative z-20">

        {/* ── LEFT COLUMN ── */}
        <div className="w-full lg:w-2/3 space-y-14">

          {/* Description */}
          {trip.description && (
            <div className="text-cream/70 text-base leading-relaxed">{trip.description}</div>
          )}

          {/* Gallery */}
          {allGallery.length > 0 && (
            <Section icon={ImageIcon} title="Gallery" iconColor="text-purple-400">
              <TripGallery images={allGallery} />
            </Section>
          )}

          {/* Itinerary */}
          {trip.itinerary?.length > 0 && (
            <Section title="Day-wise Itinerary">
              <div className="space-y-3">
                {trip.itinerary.map((day, idx) => (
                  <div key={idx} className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${activeDay === idx ? "bg-white/5 border-burnt-orange/30" : "bg-[#0d141e] border-white/5 hover:border-white/10"}`}>
                    <button onClick={() => setActiveDay(activeDay === idx ? -1 : idx)} className="w-full px-5 py-4 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${activeDay === idx ? "bg-burnt-orange text-white" : "bg-[#141F33] text-cream/50"}`}>D{day.day}</div>
                        <h4 className={`font-semibold text-sm transition-colors ${activeDay === idx ? "text-burnt-orange" : "text-cream"}`}>{day.title}</h4>
                      </div>
                      <ChevronDown size={18} className={`text-cream/40 transition-transform duration-300 shrink-0 ${activeDay === idx ? "rotate-180 text-burnt-orange" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {activeDay === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-5 pb-5 pt-1 border-t border-white/5 ml-[52px]">
                            {day.description && <p className="text-cream/60 text-sm mb-2">{day.description}</p>}
                            {day.activities?.filter(Boolean).length > 0 && (
                              <ul className="space-y-1.5">{day.activities.filter(Boolean).map((a, i) => (
                                <li key={i} className="text-cream/60 text-sm flex items-start gap-2"><span className="text-burnt-orange mt-1">•</span>{a}</li>
                              ))}</ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Itinerary PDF download */}
          {trip.itineraryPdf && (
            <div className="flex items-center gap-4 bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
              <FileText size={24} className="text-blue-400 shrink-0" />
              <div className="flex-1">
                <p className="text-cream font-semibold text-sm">Detailed Itinerary PDF</p>
                <p className="text-cream/40 text-xs">Download the complete day-wise plan</p>
              </div>
              <a href={`/api/trips/${trip._id}/itinerary`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500/15 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/25 transition-colors flex items-center gap-1.5">
                <Download size={14} /> Preview PDF
              </a>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          {(trip.inclusions?.filter(Boolean).length > 0 || trip.exclusions?.filter(Boolean).length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trip.inclusions?.filter(Boolean).length > 0 && (
                <div className="bg-[#0d141e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-cream mb-5 flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-500" /> Included</h3>
                  <ul className="space-y-2.5">{trip.inclusions.filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-cream/70 text-sm"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />{item}</li>
                  ))}</ul>
                </div>
              )}
              {trip.exclusions?.filter(Boolean).length > 0 && (
                <div className="bg-[#0d141e] rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-cream mb-5 flex items-center gap-2"><XCircle size={20} className="text-red-400" /> Excluded</h3>
                  <ul className="space-y-2.5">{trip.exclusions.filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-cream/70 text-sm"><XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />{item}</li>
                  ))}</ul>
                </div>
              )}
            </div>
          )}

          {/* Logistics: Pickup, Drop, Hotel */}
          {(hasPickup || hasDrop || trip.hotelDetails) && (
            <Section icon={Bus} title="Logistics & Stay" iconColor="text-blue-400">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hasPickup && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] text-cream/40 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5"><MapPin size={12} className="text-emerald-400" /> Pickup Points</p>
                    <ul className="space-y-2">{trip.pickupLocations.filter(Boolean).map((l, i) => (
                      <li key={i} className="text-cream/80 text-sm">{l}</li>
                    ))}</ul>
                  </div>
                )}
                {hasDrop && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] text-cream/40 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5"><MapPin size={12} className="text-red-400" /> Drop Points</p>
                    <ul className="space-y-2">{trip.dropLocations.filter(Boolean).map((l, i) => (
                      <li key={i} className="text-cream/80 text-sm">{l}</li>
                    ))}</ul>
                  </div>
                )}
                {trip.hotelDetails && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[10px] text-cream/40 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5"><Hotel size={12} className="text-purple-400" /> Accommodation</p>
                    <p className="text-cream/80 text-sm leading-relaxed">{trip.hotelDetails}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* FAQs */}
          {trip.faqs?.filter(f => f.question && f.answer).length > 0 && (
            <Section icon={HelpCircle} title="Frequently Asked Questions" iconColor="text-amber-400">
              <div className="space-y-3">
                {trip.faqs.filter(f => f.question && f.answer).map((faq, idx) => (
                  <div key={idx} className={`border rounded-2xl overflow-hidden transition-colors ${activeFaq === idx ? "bg-white/5 border-burnt-orange/20" : "bg-[#0d141e] border-white/5"}`}>
                    <button onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)} className="w-full px-5 py-4 flex items-center justify-between text-left">
                      <span className={`font-semibold text-sm ${activeFaq === idx ? "text-burnt-orange" : "text-cream"}`}>{faq.question}</span>
                      <ChevronDown size={16} className={`text-cream/40 shrink-0 transition-transform ${activeFaq === idx ? "rotate-180 text-burnt-orange" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="px-5 pb-4 text-cream/60 text-sm leading-relaxed border-t border-white/5 pt-3">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Policies */}
          {trip.policies && (
            <Section icon={ShieldAlert} title="Cancellation & Policies" iconColor="text-red-400">
              <div className="bg-[#0d141e] rounded-2xl p-6 border border-white/5">
                <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-line">{trip.policies}</p>
              </div>
            </Section>
          )}

        </div>

        {/* ── RIGHT COLUMN: Booking Widget ── */}
        <div className="w-full lg:w-1/3 relative">
          <div className="lg:sticky lg:top-28 bg-[#0f1724]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center text-center border border-white/5">
                <Calendar size={18} className="text-burnt-orange mb-1.5" />
                <span className="text-[9px] text-cream/40 uppercase tracking-wider font-bold mb-1">Duration</span>
                <span className="text-sm font-bold text-cream">{trip.duration || "TBD"}</span>
              </div>
              <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center text-center border border-white/5">
                <Users size={18} className="text-burnt-orange mb-1.5" />
                <span className="text-[9px] text-cream/40 uppercase tracking-wider font-bold mb-1">Group Size</span>
                <span className="text-sm font-bold text-cream">{total} max</span>
              </div>
              {startStr && (
                <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center text-center border border-white/5">
                  <Clock size={18} className="text-burnt-orange mb-1.5" />
                  <span className="text-[9px] text-cream/40 uppercase tracking-wider font-bold mb-1">Starts</span>
                  <span className="text-xs font-bold text-cream">{startStr}</span>
                </div>
              )}
              {trip.destination && (
                <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center text-center border border-white/5">
                  <MapPin size={18} className="text-burnt-orange mb-1.5" />
                  <span className="text-[9px] text-cream/40 uppercase tracking-wider font-bold mb-1">Destination</span>
                  <span className="text-xs font-bold text-cream truncate w-full">{trip.destination}</span>
                </div>
              )}
            </div>

            {/* Availability bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-cream/40">{booked} booked</span>
                <span className="text-emerald-400 font-semibold">{available} available</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-burnt-orange to-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (booked / total) * 100)}%` }} />
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-5">
              <p className="text-cream/40 text-xs mb-1">Starting from</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-3xl font-[family-name:var(--font-heading)] font-bold text-cream">{price}</span>
                <span className="text-cream/30 text-sm mb-0.5">/person</span>
              </div>
            </div>

            {/* CTA */}
            {canBook ? (
              <Link href={`/dashboard/book-trip?tripId=${trip._id}`} className="w-full py-4 bg-gradient-to-r from-[#C67A3C] to-[#D4842A] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(198,122,60,0.35)] hover:shadow-[0_8px_25px_rgba(198,122,60,0.55)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-3">
                Confirm Your Seat →
              </Link>
            ) : (
              <div className="w-full py-3 px-4 bg-white/5 text-red-400 font-bold rounded-xl border border-white/5 text-center mb-3 cursor-not-allowed text-sm">
                {statusBadge === "Trip Started" ? "This trip has already started. New bookings are no longer available." : statusBadge}
              </div>
            )}

            <div className="flex gap-3">
              <a href={`tel:+918287054501`} className="flex-1 py-3 bg-white/5 text-cream font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                <Phone size={14} className="text-burnt-orange" /> Call
              </a>
              <button onClick={shareTrip} className="flex-1 py-3 bg-white/5 text-cream font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                <Share2 size={14} className="text-burnt-orange" /> Share
              </button>
            </div>

            {/* Countdown */}
            <TripCountdown startDate={trip.startDate} />
          </div>
        </div>

      </section>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0d141e]/95 backdrop-blur-2xl border-t border-white/10 p-4 z-40 flex items-center justify-between safe-pb">
        <div>
          <p className="text-[9px] text-cream/50 uppercase tracking-wider font-bold mb-0.5">Total Price</p>
          <span className="text-lg font-bold text-burnt-orange">{price}</span>
        </div>
        {canBook ? (
          <Link href={`/dashboard/book-trip?tripId=${trip._id}`} className="px-6 py-3 bg-gradient-to-r from-[#C67A3C] to-[#D4842A] text-white font-bold rounded-xl shadow-lg text-sm">
            Book Now
          </Link>
        ) : (
          <div className="px-6 py-3 bg-white/5 text-cream/40 font-bold rounded-xl border border-white/5 text-sm cursor-not-allowed">
            {statusBadge}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
