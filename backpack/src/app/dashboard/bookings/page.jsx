"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, MapPin, ArrowRight, CreditCard, Clock, Download, Users, AlertTriangle } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { setBookings(d.bookings || []); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.bookingStatus?.toLowerCase() === filter);

  const handleDownloadInvoice = async (e, bookingId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/bookings/${bookingId}/invoice`);
      if (!res.ok) throw new Error("Failed");
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
      alert("Failed to download invoice.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-cream">My Bookings</h1>
          <p className="text-cream/35 text-xs sm:text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <Link href="/dashboard/book-trip" className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 w-fit"><span className="relative z-10 flex items-center gap-2"><MapPin size={14} /> Book New Trip</span></Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {["all", "confirmed", "pending", "cancellation requested", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${filter === f ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30" : "text-cream/30 hover:text-cream/60 border border-cream/5"}`}>
            {f === "all" ? "All" : f.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CalendarCheck size={40} className="mx-auto text-cream/15 mb-4" />
          <p className="text-cream/30 text-sm">No {filter !== "all" ? filter : ""} bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => {
            const balanceDue = Math.max(0, (b.totalAmount || 0) - (b.amountPaid || 0));
            const isPayLater = b.paymentMode === "Pay Later";
            const isConfirmed = b.bookingStatus === "Confirmed";

            return (
              <motion.div key={b._id || b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/dashboard/bookings/${b._id || b.id}`}
                  className="glass-card p-4 sm:p-5 hover:border-cream/10 transition-all group block">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-burnt-orange/20 to-burnt-orange/5 text-burnt-orange flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="sm:hidden" />
                      <MapPin size={22} className="hidden sm:block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-cream font-medium truncate text-sm sm:text-base">{b.tripId?.title || "Custom Trip"}</p>
                        <ArrowRight size={14} className="text-cream/15 group-hover:text-cream/40 transition-colors flex-shrink-0 hidden sm:block" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-cream/30">
                        <span className="flex items-center gap-1"><CalendarCheck size={11} /> Booked {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {b.travellers?.length || 1} traveler{(b.travellers?.length || 1) > 1 ? "s" : ""}</span>
                        <span className="flex items-center gap-1"><CreditCard size={11} /> ₹{(b.totalAmount || 0).toLocaleString("en-IN")}</span>
                      </div>

                      {/* Payment summary row */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5 sm:mt-3">
                        <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${b.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : b.bookingStatus === "Pending" ? "bg-amber-500/10 text-amber-400" : b.bookingStatus === "Cancellation Requested" ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"}`}>
                          {b.bookingStatus}
                        </span>
                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${b.paymentStatus === "Completed" ? "bg-emerald-500/5 text-emerald-400/60" : b.paymentStatus === "Partial" ? "bg-amber-500/5 text-amber-400/60" : "bg-amber-500/5 text-amber-400/60"}`}>
                          {b.paymentStatus === "Partial" ? "Partially Paid" : b.paymentStatus}
                        </span>
                        {isPayLater && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400/70">
                            Pay Later
                          </span>
                        )}
                      </div>

                      {/* Financial details for confirmed/partial bookings */}
                      {(isConfirmed || b.paymentStatus === "Partial") && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 pt-2 border-t border-cream/5 text-[10px] sm:text-xs">
                          <span className="text-cream/40">Paid: <span className="text-emerald-400 font-medium">₹{(b.amountPaid || 0).toLocaleString("en-IN")}</span></span>
                          {balanceDue > 0 && (
                            <span className="text-cream/40 flex items-center gap-1">
                              <AlertTriangle size={10} className="text-amber-400" />
                              Due: <span className="text-amber-400 font-medium">₹{balanceDue.toLocaleString("en-IN")}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quick actions */}
                      {isConfirmed && (
                        <div className="mt-2.5">
                          <button
                            onClick={(e) => handleDownloadInvoice(e, b._id || b.id)}
                            className="text-[10px] sm:text-xs text-burnt-orange hover:text-burnt-orange/80 flex items-center gap-1 transition-colors"
                          >
                            <Download size={11} /> Download Invoice
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
