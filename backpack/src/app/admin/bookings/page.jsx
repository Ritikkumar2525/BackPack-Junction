"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Download, Users, MapPin, CreditCard, Filter, Mountain } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`/api/bookings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setBookings(d.bookings || []); setLoading(false); });
  };

  const updateStatus = async (id, statusField, newStatus) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [statusField]: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        fetchBookings();
        if (selectedBooking) setSelectedBooking(data.booking);
      }
    } catch (e) { console.error(e); }
  };

  const handleDownloadInvoice = async (bookingId) => {
    window.open(`/api/bookings/${bookingId}/invoice`, "_blank");
  };

  // Extract unique trips for the filter pills
  const tripList = useMemo(() => {
    const tripMap = {};
    bookings.forEach(b => {
      const tripTitle = b.tripId?.title || "Unknown";
      const tripId = b.tripId?._id || "unknown";
      if (!tripMap[tripId]) {
        tripMap[tripId] = { id: tripId, title: tripTitle, count: 0, confirmed: 0, pending: 0, cancelled: 0, cancellationRequested: 0, revenue: 0 };
      }
      tripMap[tripId].count++;
      if (b.bookingStatus === "Confirmed") tripMap[tripId].confirmed++;
      else if (b.bookingStatus === "Pending") tripMap[tripId].pending++;
      else if (b.bookingStatus === "Cancelled") tripMap[tripId].cancelled++;
      else if (b.bookingStatus === "Cancellation Requested") tripMap[tripId].cancellationRequested++;
      tripMap[tripId].revenue += (b.amountPaid || 0);
    });
    return Object.values(tripMap).sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Apply all filters
  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchTrip = selectedTrip === "all" || (b.tripId?._id || "unknown") === selectedTrip;
      const matchStatus = statusFilter === "all" || b.bookingStatus?.toLowerCase() === statusFilter;
      const matchSearch = !search || 
        b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        (b.tripId?.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.travellers?.[0]?.fullName || "").toLowerCase().includes(search.toLowerCase());
      return matchTrip && matchStatus && matchSearch;
    });
  }, [bookings, selectedTrip, statusFilter, search]);

  const selectedTripData = selectedTrip !== "all" ? tripList.find(t => t.id === selectedTrip) : null;

  const exportCSV = () => {
    const csv = ["Booking ID,Trip,Total Amount,Paid Amount,Due Amount,Payment Mode,Booking Status,Payment Status,Primary Traveller,Phone"].concat(
      filtered.map(b => {
        const due = Math.max(0, (b.totalAmount || 0) - (b.amountPaid || 0));
        return `${b.bookingId},"${b.tripId?.title || 'Unknown'}",${b.totalAmount || 0},${b.amountPaid || 0},${due},${b.paymentMode || 'Full Payment'},${b.bookingStatus},${b.paymentStatus},"${b.travellers[0]?.fullName || ''}",${b.travellers[0]?.contactNumber || ''}`;
      })
    ).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `bookings${selectedTripData ? '_' + selectedTripData.title.replace(/\s+/g, '_') : ''}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-cream">Booking Management</h1>
          <p className="text-cream/35 text-xs sm:text-sm mt-1">{bookings.length} total bookings · {filtered.length} shown</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportCSV} className="glass px-3 py-2 rounded-xl text-xs text-cream/70 hover:text-cream flex items-center gap-2 border border-cream/10"><Download size={13}/> Export</button>
          <div className="relative flex-1 min-w-[140px] sm:min-w-0"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="glass rounded-xl pl-8 pr-3 py-2 text-cream/90 placeholder-cream/20 text-xs outline-none border border-cream/5 focus:border-burnt-orange/30 w-full sm:w-48" />
          </div>
        </div>
      </div>

      {/* Trip Filter Pills */}
      <div className="space-y-3">
        <p className="text-cream/30 text-[10px] uppercase tracking-wider flex items-center gap-1.5"><Mountain size={11}/> Filter by Trip</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button onClick={() => setSelectedTrip("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedTrip === "all" ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30" : "text-cream/40 hover:text-cream/70 border border-cream/5 hover:border-cream/15"}`}>
            All Trips <span className="text-[10px] opacity-60">({bookings.length})</span>
          </button>
          {tripList.map(trip => (
            <button key={trip.id} onClick={() => setSelectedTrip(trip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedTrip === trip.id ? "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30" : "text-cream/40 hover:text-cream/70 border border-cream/5 hover:border-cream/15"}`}>
              <MapPin size={10}/> {trip.title} <span className="text-[10px] opacity-60">({trip.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trip Summary Card (when a specific trip is selected) */}
      <AnimatePresence>
        {selectedTripData && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-xl bg-cream/[0.03]">
                <p className="text-cream/30 text-[9px] uppercase tracking-wider">Total</p>
                <p className="text-cream text-lg font-bold">{selectedTripData.count}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/5">
                <p className="text-emerald-400/50 text-[9px] uppercase tracking-wider">Confirmed</p>
                <p className="text-emerald-400 text-lg font-bold">{selectedTripData.confirmed}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-500/5">
                <p className="text-amber-400/50 text-[9px] uppercase tracking-wider">Pending</p>
                <p className="text-amber-400 text-lg font-bold">{selectedTripData.pending}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-burnt-orange/5">
                <p className="text-burnt-orange/50 text-[9px] uppercase tracking-wider">Revenue</p>
                <p className="text-burnt-orange text-lg font-bold">₹{selectedTripData.revenue.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "confirmed", "pending", "cancellation requested", "cancelled"].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all whitespace-nowrap ${statusFilter === f ? "bg-cream/10 text-cream border border-cream/15" : "text-cream/30 hover:text-cream/50 border border-cream/[0.03]"}`}>
            {f === "all" ? "All Status" : f.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-cream/30 text-xs text-left border-b border-cream/5 bg-cream/[0.02]">
              <th className="p-4 font-medium">Booking ID</th><th className="p-4 font-medium">Primary Traveller</th><th className="p-4 font-medium">Trip</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Paid</th><th className="p-4 font-medium">Due</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Payment</th><th className="p-4 font-medium">Action</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="p-12 text-center text-cream/25 text-sm">No bookings found for this filter.</td></tr>
              ) : (
                filtered.map(b => {
                  const due = Math.max(0, (b.totalAmount || 0) - (b.amountPaid || 0));
                  return (
                    <tr key={b._id} className="border-b border-cream/[0.03] hover:bg-cream/[0.02] transition-colors">
                      <td className="p-4 text-cream/50 font-mono text-xs">{b.bookingId}</td>
                      <td className="p-4"><p className="text-cream/70 font-medium">{b.travellers[0]?.fullName || 'N/A'}</p><p className="text-cream/30 text-xs">{b.travellers[0]?.contactNumber || ''}</p></td>
                      <td className="p-4 text-cream/40">{b.tripId?.title || 'Unknown'}</td>
                      <td className="p-4 text-burnt-orange font-medium">₹{(b.totalAmount || 0).toLocaleString("en-IN")}</td>
                      <td className="p-4 text-emerald-400 font-medium">₹{(b.amountPaid || 0).toLocaleString("en-IN")}</td>
                      <td className="p-4"><span className={`font-medium ${due > 0 ? 'text-amber-400' : 'text-emerald-400/60'}`}>{due > 0 ? `₹${due.toLocaleString("en-IN")}` : '—'}</span></td>
                      <td className="p-4"><span className={`text-[10px] px-2.5 py-1 rounded-full ${b.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : b.bookingStatus === "Cancelled" ? "bg-red-500/10 text-red-400" : b.bookingStatus === "Cancellation Requested" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400"}`}>{b.bookingStatus}</span></td>
                      <td className="p-4"><span className={`text-[10px] px-2.5 py-1 rounded-full ${b.paymentStatus === "Completed" ? "bg-emerald-500/10 text-emerald-400" : b.paymentStatus === "Partial" ? "bg-amber-500/10 text-amber-400" : b.paymentStatus === "Failed" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{b.paymentStatus === "Partial" ? "Partial" : b.paymentStatus}</span></td>
                      <td className="p-4"><button onClick={() => setSelectedBooking(b)} className="text-xs text-burnt-orange hover:text-burnt-orange/80 underline underline-offset-2">View Details</button></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-0 shadow-2xl mx-2">
              
              <div className="sticky top-0 z-10 bg-[#0A101A]/90 backdrop-blur-md border-b border-cream/5 p-4 sm:p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-xl font-bold text-cream flex items-center gap-2 sm:gap-3 flex-wrap">
                    Booking #{selectedBooking.bookingId}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedBooking.bookingStatus === "Confirmed" ? "bg-emerald-500/20 text-emerald-400" : selectedBooking.bookingStatus === "Cancelled" ? "bg-red-500/20 text-red-400" : selectedBooking.bookingStatus === "Cancellation Requested" ? "bg-orange-500/20 text-orange-400" : "bg-amber-500/20 text-amber-400"}`}>{selectedBooking.bookingStatus}</span>
                  </h2>
                  <p className="text-cream/40 text-xs mt-1">Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-full glass flex items-center justify-center text-cream/50 hover:text-cream"><X size={16} /></button>
              </div>

              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Status Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-cream/5 p-3 sm:p-4 rounded-xl border border-cream/5">
                  <div>
                    <label className="text-cream/30 text-xs block mb-1">Update Booking Status</label>
                    <select value={selectedBooking.bookingStatus} onChange={(e) => updateStatus(selectedBooking._id, 'bookingStatus', e.target.value)} className="glass rounded-lg px-3 py-2 text-sm text-cream w-full outline-none">
                      <option value="Pending" className="bg-midnight">Pending</option>
                      <option value="Processing" className="bg-midnight">Processing</option>
                      <option value="Confirmed" className="bg-midnight">Confirmed</option>
                      <option value="Cancellation Requested" className="bg-midnight">Cancellation Requested</option>
                      <option value="Cancelled" className="bg-midnight">Cancelled</option>
                      <option value="Completed" className="bg-midnight">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-cream/30 text-xs block mb-1">Update Payment Status</label>
                    <select value={selectedBooking.paymentStatus} onChange={(e) => updateStatus(selectedBooking._id, 'paymentStatus', e.target.value)} className="glass rounded-lg px-3 py-2 text-sm text-cream w-full outline-none">
                      <option value="Pending" className="bg-midnight">Pending</option>
                      <option value="Partial" className="bg-midnight">Partial</option>
                      <option value="Completed" className="bg-midnight">Completed</option>
                      <option value="Failed" className="bg-midnight">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Trip & Payment Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-cream/70 mb-3 flex items-center gap-2"><MapPin size={14}/> Trip Details</h3>
                    <div className="glass p-4 rounded-xl space-y-2 text-sm border border-cream/5">
                      <p className="flex justify-between"><span className="text-cream/30">Title:</span><span className="text-cream">{selectedBooking.tripId?.title || 'Unknown'}</span></p>
                      <p className="flex justify-between"><span className="text-cream/30">Destination:</span><span className="text-cream">{selectedBooking.tripId?.destination || 'N/A'}</span></p>
                      <p className="flex justify-between"><span className="text-cream/30">Duration:</span><span className="text-cream">{selectedBooking.tripId?.duration || 'N/A'}</span></p>
                      <p className="flex justify-between"><span className="text-cream/30">Travelers:</span><span className="text-cream">{selectedBooking.travellers?.length || 0}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-cream/70 mb-3 flex items-center gap-2"><CreditCard size={14}/> Payment Tracking</h3>
                    <div className="glass p-4 rounded-xl space-y-2.5 text-sm border border-cream/5">
                      <p className="flex justify-between"><span className="text-cream/30">Total Amount:</span><span className="text-burnt-orange font-bold text-base">₹{(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}</span></p>
                      <p className="flex justify-between"><span className="text-cream/30">Advance Paid:</span><span className="text-emerald-400 font-semibold">₹{(selectedBooking.amountPaid || 0).toLocaleString('en-IN')}</span></p>
                      <div className="flex justify-between pt-2 border-t border-cream/5">
                        <span className="text-amber-400/80 font-medium">Due Amount:</span>
                        <span className={`font-bold text-base ${Math.max(0, (selectedBooking.totalAmount || 0) - (selectedBooking.amountPaid || 0)) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          ₹{Math.max(0, (selectedBooking.totalAmount || 0) - (selectedBooking.amountPaid || 0)).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-cream/5 space-y-2">
                        <p className="flex justify-between"><span className="text-cream/30">Payment Mode:</span><span className={`text-xs px-2 py-0.5 rounded-full ${selectedBooking.paymentMode === 'Pay Later' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>{selectedBooking.paymentMode || 'Full Payment'}</span></p>
                        <p className="flex justify-between"><span className="text-cream/30">Payment Method:</span><span className="text-cream/60">{selectedBooking.paymentMethod || 'N/A'}</span></p>
                        <p className="flex justify-between"><span className="text-cream/30">Booking Charge:</span><span className="text-cream/50">₹{(selectedBooking.bookingCharge || 0).toLocaleString('en-IN')}</span></p>
                        {selectedBooking.razorpayPaymentId && <p className="flex justify-between"><span className="text-cream/30">Razorpay ID:</span><span className="text-cream/50 text-xs font-mono">{selectedBooking.razorpayPaymentId}</span></p>}
                        {selectedBooking.razorpayOrderId && <p className="flex justify-between"><span className="text-cream/30">Order ID:</span><span className="text-cream/50 text-xs font-mono">{selectedBooking.razorpayOrderId}</span></p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Section */}
                {selectedBooking.manualUtr && (
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">Manual Payment Verification</h3>
                    <div className="glass p-4 rounded-xl border border-amber-500/20 text-sm">
                      <p className="flex justify-between mb-3"><span className="text-cream/30">UTR / Transaction ID:</span><span className="text-cream font-mono bg-midnight/50 px-2 py-1 rounded">{selectedBooking.manualUtr}</span></p>
                      {selectedBooking.manualScreenshot && (
                        <div>
                          <p className="text-cream/30 mb-2">Uploaded Screenshot:</p>
                          <a href={selectedBooking.manualScreenshot} target="_blank" rel="noopener noreferrer">
                            <img src={selectedBooking.manualScreenshot} alt="Payment Screenshot" className="max-w-xs rounded-xl border border-cream/10 hover:border-cream/30 transition-colors cursor-pointer" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Travellers */}
                <div>
                  <h3 className="text-sm font-semibold text-cream/70 mb-3 flex items-center gap-2"><Users size={14}/> Traveller Details ({selectedBooking.travellers?.length})</h3>
                  <div className="space-y-3">
                    {selectedBooking.travellers?.map((t, i) => (
                      <div key={i} className="glass p-4 rounded-xl border border-cream/5 text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-cream">{t.fullName} <span className="text-cream/30 font-normal">({t.age} / {t.gender})</span></span>
                          <span className="text-cream/50 text-xs">{t.contactNumber}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-cream/40 mt-3 pt-3 border-t border-cream/5">
                          <p>Email: <span className="text-cream/70">{t.emailAddress || 'N/A'}</span></p>
                          <p>City: <span className="text-cream/70">{t.city || 'N/A'}</span></p>
                          <p>Emergency: <span className="text-cream/70">{t.emergencyContact || 'N/A'}</span></p>
                          <p>Food: <span className="text-cream/70">{t.foodPreference || 'N/A'}</span></p>
                          {t.medicalConditions && <p className="col-span-2 text-red-400/80">Medical: {t.medicalConditions}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 z-10 bg-[#0A101A]/90 backdrop-blur-md border-t border-cream/5 p-4 sm:p-6 flex items-center justify-end gap-3">
                <button onClick={() => setSelectedBooking(null)} className="glass px-5 py-2 rounded-full text-xs sm:text-sm text-cream/50 hover:text-cream border border-cream/10">Close</button>
                <button onClick={() => handleDownloadInvoice(selectedBooking._id)} className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-5 sm:px-6"><span className="relative z-10 flex items-center gap-2"><Download size={13}/> Invoice</span></button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
