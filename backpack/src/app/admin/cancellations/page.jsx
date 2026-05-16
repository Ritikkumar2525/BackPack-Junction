"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Search, Clock, CreditCard, User, MapPin } from "lucide-react";

export default function AdminCancellations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cancellations?filter=${filter}`);
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action, extraData = {}) => {
    try {
      const res = await fetch(`/api/admin/cancellations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action, ...extraData })
      });
      if (res.ok) {
        fetchRequests();
        setSelectedReq(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process action.");
    }
  };

  const filtered = requests.filter(r => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return r.bookingId?.toLowerCase().includes(s) || 
           r.userId?.name?.toLowerCase().includes(s) || 
           r.tripId?.title?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Cancellation Requests</h1>
          <p className="text-cream/35 text-xs mt-1">Manage user trip cancellations and refunds</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" size={14} />
            <input 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="glass rounded-full pl-9 pr-4 py-2 text-xs w-48 sm:w-64 outline-none focus:border-burnt-orange/50 text-cream"
              placeholder="Search by ID, User, or Trip..."
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="glass rounded-full px-4 py-2 text-xs text-cream outline-none focus:border-burnt-orange/50 appearance-none bg-[#0a0f18]">
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved / Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card py-20 text-center"><p className="text-cream/30">No cancellation requests found.</p></div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((req, i) => (
            <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedReq(req)}
              className={`glass-card p-5 cursor-pointer transition-all border ${req.bookingStatus === 'Cancellation Requested' ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-cream/5 hover:border-cream/20'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-cream/50 bg-cream/5 px-2 py-1 rounded">{req.bookingId}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${req.bookingStatus === 'Cancellation Requested' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                      {req.bookingStatus}
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${req.refundStatus === 'Refunded' ? 'bg-emerald-500/10 text-emerald-400' : req.refundStatus === 'Processing' ? 'bg-blue-500/10 text-blue-400' : 'bg-cream/5 text-cream/30'}`}>
                      Refund: {req.refundStatus}
                    </span>
                  </div>
                  <h3 className="font-semibold text-cream text-lg">{req.tripId?.title || "Unknown Trip"}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-cream/40 mt-2">
                    <span className="flex items-center gap-1"><User size={12}/> {req.userId?.name}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> Req: {new Date(req.cancellationRequest?.requestedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-cream/30 mb-1">Reason</p>
                  <p className="text-cream/80 text-sm">{req.cancellationRequest?.reason}</p>
                  {req.bookingStatus === 'Cancellation Requested' && (
                    <button className="mt-3 px-4 py-1.5 rounded-full bg-burnt-orange/10 text-burnt-orange text-xs font-medium hover:bg-burnt-orange/20">Review Request →</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedReq(null)} className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-[#0C1420] border border-cream/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-cream/5 flex justify-between items-center bg-[#0a0f18]">
                <h2 className="text-lg font-bold text-cream flex items-center gap-2"><AlertTriangle className="text-amber-400" size={18} /> Review Cancellation</h2>
                <button onClick={() => setSelectedReq(null)} className="p-2 text-cream/40 hover:text-red-400"><XCircle size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] uppercase text-cream/30 mb-1">Trip Details</p>
                    <p className="font-semibold text-cream">{selectedReq.tripId?.title}</p>
                    <p className="text-xs text-cream/50 mt-1">{selectedReq.tripId?.destination}</p>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] uppercase text-cream/30 mb-1">User Details</p>
                    <p className="font-semibold text-cream">{selectedReq.userId?.name}</p>
                    <p className="text-xs text-cream/50 mt-1">{selectedReq.userId?.email} | {selectedReq.userId?.phone}</p>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl space-y-4">
                  <div>
                    <p className="text-[10px] uppercase text-red-400/50 mb-1">Cancellation Reason</p>
                    <p className="text-red-400 font-medium">{selectedReq.cancellationRequest?.reason}</p>
                  </div>
                  {selectedReq.cancellationRequest?.comments && (
                    <div>
                      <p className="text-[10px] uppercase text-cream/30 mb-1">User Comments</p>
                      <p className="text-cream/70 text-sm italic">"{selectedReq.cancellationRequest?.comments}"</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase text-emerald-400/50 mb-1">Refund UPI ID</p>
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg font-mono text-sm inline-flex border border-emerald-500/20">
                      <CreditCard size={14} /> {selectedReq.cancellationRequest?.upiId || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="glass p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-semibold text-cream border-b border-cream/5 pb-2">Financial Overview</h3>
                  <div className="flex justify-between text-sm"><span className="text-cream/50">Total Paid by User</span><span className="text-cream">₹{selectedReq.amountPaid?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-cream/50">Non-Refundable Policy</span><span className="text-red-400">₹{selectedReq.cancellationPolicy?.nonRefundablePerHead || 1500} / head</span></div>
                  <div className="flex justify-between text-sm"><span className="text-cream/50">Total Travellers</span><span className="text-cream">{selectedReq.travellers?.length || 1}</span></div>
                  <div className="h-px bg-cream/5 my-2" />
                  <div className="flex justify-between text-sm font-bold"><span className="text-emerald-400">Suggested Refund</span><span className="text-emerald-400">₹{Math.max(0, (selectedReq.amountPaid || 0) - ((selectedReq.cancellationPolicy?.nonRefundablePerHead || 1500) * (selectedReq.travellers?.length || 1))).toLocaleString()}</span></div>
                </div>

                {selectedReq.bookingStatus === 'Cancellation Requested' && (
                  <div className="flex gap-3 pt-4 border-t border-cream/5">
                    <button onClick={() => handleAction(selectedReq._id, 'reject')} className="flex-1 px-4 py-3 rounded-xl border border-cream/10 text-cream/60 hover:text-cream hover:bg-cream/5 text-sm font-medium transition-colors">
                      Reject Request
                    </button>
                    <button onClick={() => handleAction(selectedReq._id, 'accept', { refundStatus: 'Processing' })} className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 text-sm font-medium transition-colors flex justify-center items-center gap-2">
                      <CheckCircle2 size={16} /> Accept & Cancel Trip
                    </button>
                  </div>
                )}

                {selectedReq.bookingStatus === 'Cancelled' && (
                  <div className="pt-4 border-t border-cream/5">
                    <p className="text-xs text-cream/40 mb-3 uppercase tracking-wider">Update Refund Status</p>
                    <div className="flex gap-2">
                      {['Pending', 'Processing', 'Refunded'].map(status => (
                        <button 
                          key={status}
                          onClick={() => handleAction(selectedReq._id, 'updateRefund', { refundStatus: status })}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border ${selectedReq.refundStatus === status ? 'bg-burnt-orange border-burnt-orange text-white' : 'bg-transparent border-cream/10 text-cream/40 hover:border-cream/30'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
