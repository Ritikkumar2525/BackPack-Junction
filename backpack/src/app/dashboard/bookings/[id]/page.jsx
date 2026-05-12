"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Clock, User, Phone, Mail, Heart, Utensils, AlertTriangle, Download, Navigation } from "lucide-react";
import PaymentModal from "@/components/payment/PaymentModal";
import CancelBookingModal from "@/components/payment/CancelBookingModal";
import dynamic from "next/dynamic";

const TripRouteMap = dynamic(() => import("@/components/map/TripRouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#0a0f18] rounded-2xl flex items-center justify-center border border-cream/5">
      <div className="w-8 h-8 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

export default function BookingDetailPage({ params }) {
  const { id } = use(params);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("travellers");
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${id}?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        setBooking(data.booking || null);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadBooking();
  }, [id]);

  useEffect(() => {
    if (!booking) return;
    const hasSubmittedUtr = !!booking.manualUtr;
    if (booking.bookingStatus === 'Pending' && booking.paymentStatus === 'Pending' && !hasSubmittedUtr) {
      const createdAt = new Date(booking.createdAt).getTime();
      const expiryTime = createdAt + 60 * 60 * 1000; // 1 hour

      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = expiryTime - now;

        if (diff <= 0) {
          setTimeLeft("00:00");
          if (booking.bookingStatus !== "Cancelled") {
            fetch(`/api/bookings/${booking._id || booking.bookingId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "cancel", reason: "Payment timeout after 1 hour" })
            }).then(() => {
              setBooking(prev => ({ ...prev, bookingStatus: "Cancelled", paymentStatus: "Failed" }));
            });
          }
        } else {
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      };

      updateTimer();
      const int = setInterval(updateTimer, 1000);
      return () => clearInterval(int);
    }
  }, [booking]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  if (!booking) return (
    <div className="text-center py-20">
      <p className="text-cream/30 text-lg mb-4">Booking not found</p>
      <Link href="/dashboard/bookings" className="text-burnt-orange text-sm hover:underline">← Back to Bookings</Link>
    </div>
  );

  const trip = booking.tripId || {};
  const travellers = booking.travellers || [];
  const statusColor = booking.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : booking.bookingStatus === "Cancelled" ? "bg-red-500/10 text-red-400" : booking.bookingStatus === "Cancellation Requested" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400";
  const paymentColor = booking.paymentStatus === "Completed" ? "text-emerald-400" : booking.paymentStatus === "Failed" ? "text-red-400" : "text-amber-400";

  const tabs = [
    { id: "travellers", label: "Traveller Details", icon: Users },
    { id: "payment", label: "Payment Info", icon: CreditCard },
    { id: "itinerary", label: "Trip Info", icon: MapPin },
    { id: "route", label: "Route Map", icon: Navigation },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      <Link href="/dashboard/bookings" className="flex items-center gap-2 text-cream/30 text-xs sm:text-sm hover:text-cream transition-colors"><ArrowLeft size={14} /> Back to Bookings</Link>

      {/* Header Card */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Trip Image */}
          <div className="w-full md:w-56 h-32 sm:h-40 rounded-xl overflow-hidden bg-cream/5 flex-shrink-0">
            {trip.images?.[0] ? (
              <img src={trip.images[0]} alt={trip.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin size={32} className="text-cream/10" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl font-bold text-cream">{trip.title || "Trip"}</h1>
                <p className="text-cream/40 text-xs sm:text-sm mt-1 flex items-center gap-2">
                  <MapPin size={12} /> {trip.destination || "N/A"} · {trip.duration || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Cancel Button */}
                {(booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'Pending') && (!booking.travelDates?.startDate || new Date(booking.travelDates.startDate) > new Date()) && (
                  <button onClick={() => setShowCancelModal(true)} className="text-xs px-3 py-1.5 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                    Cancel Booking
                  </button>
                )}
                <span className={`text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${statusColor}`}>{booking.bookingStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5">
              <div className="text-center p-2 sm:p-3 rounded-xl bg-cream/[0.03]">
                <p className="text-cream/30 text-[8px] sm:text-[10px] uppercase tracking-wider">Booking ID</p>
                <p className="text-cream text-[10px] sm:text-sm font-mono font-medium mt-0.5 sm:mt-1 truncate">{booking.bookingId}</p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-xl bg-cream/[0.03]">
                <p className="text-cream/30 text-[8px] sm:text-[10px] uppercase tracking-wider">Booked On</p>
                <p className="text-cream text-[10px] sm:text-sm font-medium mt-0.5 sm:mt-1">{new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-xl bg-cream/[0.03]">
                <p className="text-cream/30 text-[8px] sm:text-[10px] uppercase tracking-wider">Travelers</p>
                <p className="text-cream text-[10px] sm:text-sm font-medium mt-0.5 sm:mt-1">{travellers.length}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
                <p className="text-cream/30 text-[10px] uppercase tracking-wider">Total Amount</p>
                <p className="text-burnt-orange text-sm font-bold mt-1">₹{booking.totalAmount?.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      {timeLeft && booking.bookingStatus === "Pending" && !booking.manualUtr && (
        <div className="glass-card p-4 bg-amber-500/10 border-amber-500/20 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-400 animate-pulse" size={20} />
            <div>
              <p className="text-amber-400 font-semibold text-sm">Payment Pending!</p>
              <p className="text-amber-400/70 text-xs">Complete your payment within {timeLeft} or this booking will be cancelled automatically.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-midnight text-xs font-bold rounded-lg transition-colors"
          >
            Submit Payment UTR
          </button>
        </div>
      )}

      {booking.bookingStatus === "Pending" && booking.manualUtr && (
        <div className="glass-card p-4 bg-emerald-500/10 border-emerald-500/20 mb-4 flex items-center gap-3">
          <Clock className="text-emerald-400 animate-pulse" size={20} />
          <div>
            <p className="text-emerald-400 font-semibold text-sm">Verification in Progress</p>
            <p className="text-emerald-400/70 text-xs">You have submitted your payment details. Our team will verify them shortly.</p>
          </div>
        </div>
      )}

      {/* Cancellation Requested Banner */}
      {booking.bookingStatus === "Cancellation Requested" && (
        <div className="glass-card p-4 bg-orange-500/10 border-orange-500/20 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-orange-400" size={20} />
            <div>
              <p className="text-orange-400 font-semibold text-sm">Cancellation Request Submitted</p>
              <p className="text-orange-400/70 text-xs">Your cancellation request is being reviewed by our team.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-xs">
            <div className="bg-[#0a0f18]/50 p-3 rounded-lg">
              <p className="text-cream/30 text-[10px] uppercase mb-1">Reason</p>
              <p className="text-cream/70">{booking.cancellationRequest?.reason || 'N/A'}</p>
            </div>
            <div className="bg-[#0a0f18]/50 p-3 rounded-lg">
              <p className="text-cream/30 text-[10px] uppercase mb-1">Requested On</p>
              <p className="text-cream/70">{booking.cancellationRequest?.requestedAt ? new Date(booking.cancellationRequest.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
            </div>
            <div className="bg-[#0a0f18]/50 p-3 rounded-lg">
              <p className="text-cream/30 text-[10px] uppercase mb-1">Refund Status</p>
              <p className={`font-medium ${booking.refundStatus === 'Refunded' ? 'text-emerald-400' : booking.refundStatus === 'Processing' ? 'text-blue-400' : 'text-amber-400'}`}>{booking.refundStatus || 'Pending'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-cream/30 text-[10px] uppercase tracking-wider">Booking Status</p>
            <span className={`text-sm font-semibold ${statusColor.includes("emerald") ? "text-emerald-400" : statusColor.includes("red") ? "text-red-400" : statusColor.includes("orange") ? "text-orange-400" : "text-amber-400"}`}>
              {booking.bookingStatus}
            </span>
          </div>
          <div className="w-px h-8 bg-cream/10" />
          <div>
            <p className="text-cream/30 text-[10px] uppercase tracking-wider">Payment Status</p>
            <span className={`text-sm font-semibold ${paymentColor}`}>
              {booking.paymentStatus}
            </span>
          </div>
          <div className="w-px h-8 bg-cream/10" />
          <div>
            <p className="text-cream/30 text-[10px] uppercase tracking-wider">Amount Paid</p>
            <span className="text-sm font-semibold text-cream">
              ₹{(booking.amountPaid || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 ${tab === t.id ? "bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/20" : "text-cream/30 hover:text-cream/60 border border-transparent"}`}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 sm:p-6">
        
        {tab === "travellers" && (
          <div className="space-y-4">
            <h2 className="text-cream font-semibold flex items-center gap-2 mb-2"><Users size={16} /> {travellers.length} Traveller{travellers.length !== 1 ? "s" : ""}</h2>
            {travellers.length === 0 ? (
              <p className="text-cream/30 text-sm">No traveller details available.</p>
            ) : (
              travellers.map((t, i) => (
                <div key={i} className="p-5 rounded-xl bg-cream/[0.02] border border-cream/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-burnt-orange/50" />
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-burnt-orange/10 text-burnt-orange flex items-center justify-center text-sm font-bold">
                        {t.fullName ? t.fullName.charAt(0).toUpperCase() : (i + 1)}
                      </div>
                      <div>
                        <p className="text-cream font-semibold">{t.fullName}</p>
                        <p className="text-cream/30 text-xs">{t.age} years · {t.gender}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream/5 text-cream/30">Traveller {i + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-cream/40">
                      <Phone size={12} /> <span className="text-cream/70">{t.contactNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/40">
                      <Mail size={12} /> <span className="text-cream/70">{t.emailAddress || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/40">
                      <MapPin size={12} /> <span className="text-cream/70">{t.city || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/40">
                      <Utensils size={12} /> <span className="text-cream/70">{t.foodPreference || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/40">
                      <AlertTriangle size={12} /> <span className="text-cream/70">{t.emergencyContact || "N/A"}</span>
                    </div>
                    {t.medicalConditions && (
                      <div className="flex items-center gap-2 text-red-400/70">
                        <Heart size={12} /> <span>{t.medicalConditions}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "payment" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-cream font-semibold flex items-center gap-2"><CreditCard size={16} /> Payment Details</h2>
              {(booking.bookingStatus === "Confirmed" || booking.paymentStatus === "Completed") && (
                <button onClick={() => window.open(`/api/bookings/${booking._id}/invoice`, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-burnt-orange/15 text-burnt-orange border border-burnt-orange/20 hover:bg-burnt-orange/25 transition-all">
                  <Download size={13} /> Download Invoice
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cream/[0.03] border border-cream/5 space-y-3">
                <p className="flex justify-between text-sm"><span className="text-cream/30">Total Amount</span><span className="text-cream font-semibold">₹{booking.totalAmount?.toLocaleString("en-IN")}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Amount Paid</span><span className="text-emerald-400 font-semibold">₹{(booking.amountPaid || 0).toLocaleString("en-IN")}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Balance Due</span><span className="text-amber-400 font-semibold">₹{((booking.totalAmount || 0) - (booking.amountPaid || 0)).toLocaleString("en-IN")}</span></p>
                <div className="w-full h-px bg-cream/5" />
                <p className="flex justify-between text-sm"><span className="text-cream/30">Payment Status</span><span className={`font-semibold ${paymentColor}`}>{booking.paymentStatus}</span></p>
              </div>
              <div className="p-4 rounded-xl bg-cream/[0.03] border border-cream/5 space-y-3">
                <p className="flex justify-between text-sm"><span className="text-cream/30">Booking ID</span><span className="text-cream font-mono text-xs">{booking.bookingId}</span></p>
                {booking.razorpayPaymentId && (
                  <p className="flex justify-between text-sm"><span className="text-cream/30">Razorpay ID</span><span className="text-cream/50 font-mono text-xs">{booking.razorpayPaymentId}</span></p>
                )}
                <p className="flex justify-between text-sm"><span className="text-cream/30">Booked On</span><span className="text-cream/70">{new Date(booking.createdAt).toLocaleString("en-IN")}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Per Person</span><span className="text-cream/70">₹{travellers.length > 0 ? Math.round(booking.totalAmount / travellers.length).toLocaleString("en-IN") : booking.totalAmount?.toLocaleString("en-IN")}</span></p>
              </div>
            </div>
          </div>
        )}

        {tab === "itinerary" && (
          <div className="space-y-5">
            <h2 className="text-cream font-semibold flex items-center gap-2 mb-2"><MapPin size={16} /> Trip Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cream/[0.03] border border-cream/5 space-y-3">
                <p className="flex justify-between text-sm"><span className="text-cream/30">Trip Name</span><span className="text-cream font-semibold">{trip.title || "N/A"}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Destination</span><span className="text-cream/70">{trip.destination || "N/A"}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Duration</span><span className="text-cream/70">{trip.duration || "N/A"}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Price / Person</span><span className="text-burnt-orange font-semibold">₹{trip.price?.toLocaleString("en-IN") || "N/A"}</span></p>
              </div>
              <div className="p-4 rounded-xl bg-cream/[0.03] border border-cream/5 space-y-3">
                <p className="flex justify-between text-sm"><span className="text-cream/30">Total Seats</span><span className="text-cream/70">{trip.totalSeats || "N/A"}</span></p>
                <p className="flex justify-between text-sm"><span className="text-cream/30">Available Seats</span><span className="text-cream/70">{trip.availableSeats ?? "N/A"}</span></p>
                {trip.pickupLocations?.length > 0 && (
                  <p className="flex justify-between text-sm"><span className="text-cream/30">Pickup</span><span className="text-cream/70">{trip.pickupLocations.join(", ")}</span></p>
                )}
              </div>
            </div>

            {/* Itinerary Timeline */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <div className="mt-6">
                <h3 className="text-cream/60 text-sm font-medium mb-4">Day-by-Day Itinerary</h3>
                <div className="space-y-0">
                  {trip.itinerary.map((day, i) => (
                    <div key={i} className="flex gap-4 pb-5 relative">
                      {i < trip.itinerary.length - 1 && <div className="absolute left-[17px] top-10 bottom-0 w-[2px] bg-cream/5" />}
                      <div className="w-9 h-9 rounded-full bg-burnt-orange/15 text-burnt-orange flex items-center justify-center text-xs font-bold flex-shrink-0 relative z-10">{day.day}</div>
                      <div className="flex-1 pt-1">
                        <h4 className="text-cream font-semibold text-sm">{day.title}</h4>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="text-cream/35 text-xs mt-1 space-y-1">
                            {day.activities.map((a, j) => <li key={j} className="flex items-start gap-2">· {a}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            {(trip.inclusions?.length > 0 || trip.exclusions?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {trip.inclusions?.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">✓ Inclusions</h4>
                    <ul className="space-y-1.5">{trip.inclusions.map((item, i) => <li key={i} className="text-cream/50 text-xs flex items-start gap-2">• {item}</li>)}</ul>
                  </div>
                )}
                {trip.exclusions?.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <h4 className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">✗ Exclusions</h4>
                    <ul className="space-y-1.5">{trip.exclusions.map((item, i) => <li key={i} className="text-cream/50 text-xs flex items-start gap-2">• {item}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "route" && (() => {
          // Use routeLocations from trip, or build from itinerary as fallback
          const routeData = trip.routeLocations?.length > 0 ? trip.routeLocations : null;
          const itineraryStops = trip.itinerary?.map(d => d.title) || [];
          return (
            <div className="space-y-4">
              <h2 className="text-cream font-semibold flex items-center gap-2 mb-2"><Navigation size={16} /> Trip Route</h2>
              <p className="text-cream/30 text-xs">Your journey route from start to finish.</p>
              <TripRouteMap routeLocations={routeData} itineraryStops={itineraryStops} pickupLocations={trip.pickupLocations} dropLocations={trip.dropLocations} />
              {routeData?.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-cream/50 text-xs font-medium uppercase tracking-wider">Route Stops</h3>
                  <div className="flex flex-wrap gap-2">
                    {routeData.map((loc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-cream/[0.03] border border-cream/5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${i === 0 ? 'bg-emerald-500' : i === routeData.length - 1 ? 'bg-red-500' : 'bg-burnt-orange'}`}>{i + 1}</span>
                        <span className="text-cream/70">{loc.name}</span>
                        {i < routeData.length - 1 && <span className="text-cream/20 ml-1">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!routeData && itineraryStops.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-cream/50 text-xs font-medium uppercase tracking-wider">Journey Stops (from Itinerary)</h3>
                  <div className="space-y-0">
                    {itineraryStops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 relative">
                        {i < itineraryStops.length - 1 && <div className="absolute left-[9px] top-8 bottom-0 w-[2px] bg-cream/5" />}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 z-10 ${i === 0 ? 'bg-emerald-500' : i === itineraryStops.length - 1 ? 'bg-red-500' : 'bg-burnt-orange/70'}`}>{i + 1}</div>
                        <span className="text-cream/60 text-xs">{stop}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-cream/20 text-[10px] mt-2 italic">Map view will be available once the admin adds route coordinates.</p>
                </div>
              )}
            </div>
          );
        })()}
      </motion.div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={(success) => {
          setShowPaymentModal(false);
          if (success) {
            setBooking(prev => ({ ...prev, paymentStatus: "Pending" })); // Technically already pending, but triggers re-render if needed
            window.location.reload(); // Reload to hide the button or update notes
          }
        }}
        method={booking.paymentMethod === 'Razorpay' ? 'Bank Transfer' : (booking.paymentMethod || 'Bank Transfer')}
        amount={booking.paymentMode === 'Pay Later' ? (booking.bookingCharge || 1000 * travellers.length) : booking.totalAmount}
        totalAmount={booking.totalAmount}
        paymentMode={booking.paymentMode}
        bookingId={booking._id || booking.bookingId}
      />

      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onCancelSuccess={(updatedBooking) => setBooking(updatedBooking)}
      />
    </div>
  );
}
