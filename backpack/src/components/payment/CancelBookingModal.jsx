import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, IndianRupee } from "lucide-react";

export default function CancelBookingModal({ isOpen, onClose, booking, onCancelSuccess }) {
  const [reason, setReason] = useState("");
  const [upiId, setUpiId] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!reason || !upiId) {
      setError("Please fill in the cancellation reason and UPI ID.");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${booking._id || booking.bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, upiId, comments })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit cancellation");
      
      onCancelSuccess(data.booking);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refundPolicy = booking.cancellationPolicy?.nonRefundablePerHead || 1500;
  const travellers = booking.travellers?.length || 1;
  const totalDeduction = refundPolicy * travellers;
  const expectedRefund = Math.max(0, (booking.amountPaid || 0) - totalDeduction);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onClose()} className="absolute inset-0 bg-[#0a0f18]/80 backdrop-blur-sm" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#0C1420] border border-cream/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <div className="p-6 border-b border-cream/5 flex justify-between items-center bg-[#0a0f18]">
            <h2 className="text-xl font-bold text-cream">Cancel Booking</h2>
            <button onClick={() => onClose()} className="p-2 text-cream/40 hover:text-red-400 transition-colors"><X size={20} /></button>
          </div>

          {!showConfirm ? (
            <form onSubmit={handleInitialSubmit} className="p-6 space-y-5">
              {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              
              <div>
                <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Reason for Cancellation *</label>
                <select value={reason} onChange={e => setReason(e.target.value)} required className="w-full bg-[#0a0f18] border border-cream/10 rounded-xl px-4 py-3 text-cream text-sm outline-none focus:border-burnt-orange/50 appearance-none">
                  <option value="" disabled>Select a reason...</option>
                  <option value="Health/Medical Issues">Health/Medical Issues</option>
                  <option value="Change of Plans">Change of Plans</option>
                  <option value="Financial Constraints">Financial Constraints</option>
                  <option value="Unforeseen Emergency">Unforeseen Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-2 block flex items-center gap-2"><IndianRupee size={12} /> UPI ID for Refund *</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} required placeholder="yourname@upi" className="w-full bg-[#0a0f18] border border-cream/10 rounded-xl px-4 py-3 text-cream text-sm outline-none focus:border-burnt-orange/50" />
                <p className="text-cream/30 text-[10px] mt-1.5">Ensure the UPI ID is correct to avoid refund delays.</p>
              </div>

              <div>
                <label className="text-cream/60 text-xs font-semibold uppercase tracking-wider mb-2 block">Additional Comments (Optional)</label>
                <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Any specific details..." rows={3} className="w-full bg-[#0a0f18] border border-cream/10 rounded-xl px-4 py-3 text-cream text-sm outline-none focus:border-burnt-orange/50 resize-none" />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => onClose()} className="px-5 py-2.5 rounded-xl text-cream/60 hover:text-cream text-sm font-medium transition-colors">Go Back</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/20 font-medium text-sm transition-colors border border-red-500/20">Proceed</button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Are you sure you want to cancel?</p>
                  <p className="text-red-400/80 leading-relaxed">This action cannot be undone. Once cancelled, your seats will be released.</p>
                </div>
              </div>

              <div className="p-4 bg-[#0a0f18] border border-cream/10 rounded-xl space-y-3">
                <h3 className="text-cream font-semibold text-sm border-b border-cream/10 pb-2">Refund Estimate</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/50">Total Paid</span>
                  <span className="text-cream">₹{(booking.amountPaid || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-400">
                  <span>Cancellation Deduction (₹{refundPolicy} x {travellers})</span>
                  <span>- ₹{totalDeduction.toLocaleString()}</span>
                </div>
                <div className="h-px w-full bg-cream/10 my-1" />
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Expected Refund</span>
                  <span>₹{expectedRefund.toLocaleString()}</span>
                </div>
                <p className="text-cream/30 text-[10px] mt-2 italic">* Refunds are typically processed within 7-10 working days to your provided UPI ID ({upiId}).</p>
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} disabled={isSubmitting} className="flex-1 px-5 py-3 rounded-xl bg-[#0a0f18] border border-cream/10 text-cream/60 hover:text-cream text-sm font-medium transition-colors">Wait, Go Back</button>
                <button onClick={handleFinalSubmit} disabled={isSubmitting} className="flex-1 px-5 py-3 rounded-xl bg-red-500 text-white font-medium text-sm transition-colors hover:bg-red-600 flex justify-center items-center">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
