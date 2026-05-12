"use client";
import { useState } from "react";
import { X, Building2, QrCode, Smartphone, Copy, Check, Shield } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, method, amount, totalAmount, paymentMode, bookingId }) {
  const [copied, setCopied] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const copyText = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const submitUtr = async () => {
    if (!utr.trim() || !screenshot) { alert("Please enter the transaction ID/UTR and upload a screenshot."); return; }
    setSubmitting(true);

    let base64String = null;
    if (screenshot) {
      const reader = new FileReader();
      reader.readAsDataURL(screenshot);
      await new Promise((resolve) => {
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let w = img.width;
            let h = img.height;
            const MAX_DIM = 800;
            if (w > MAX_DIM || h > MAX_DIM) {
              if (w > h) { h = Math.round(h * (MAX_DIM / w)); w = MAX_DIM; }
              else { w = Math.round(w * (MAX_DIM / h)); h = MAX_DIM; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            base64String = canvas.toDataURL("image/jpeg", 0.6); // Compress to 60% quality JPEG
            resolve();
          };
          img.src = e.target.result;
        };
      });
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit_utr", utr: utr.trim(), screenshot: base64String })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(true), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to submit transaction ID.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting transaction ID.");
    }
    setSubmitting(false);
  };

  const bankDetails = {
    name: "Backpack Junction",
    account: "XXXXXXXXXXXX",
    ifsc: "XXXX0XXXXXX",
    bank: "XXXX Bank",
    upi: "ritikrajkeshari0-1@oksbi",
  };

  const CopyBtn = ({ text, field }) => (
    <button onClick={() => copyText(text, field)} className="ml-2 text-burnt-orange hover:text-copper-light">
      {copied === field ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-md" onClick={() => onClose(false)} />
      <div className="relative w-full max-w-3xl bg-[#0f172a] p-0 overflow-hidden shadow-2xl shadow-black/80 border border-cream/5 rounded-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-cream/5 flex items-center justify-between flex-shrink-0">
          <h3 className="text-cream font-semibold flex items-center gap-2">
            {method === "Bank Transfer" && <><Building2 size={18} className="text-burnt-orange" /> Bank Transfer</>}
            {method === "QR Code" && <><QrCode size={18} className="text-burnt-orange" /> QR Code Payment</>}
            {method === "UPI" && <><Smartphone size={18} className="text-burnt-orange" /> UPI Payment</>}
          </h3>
          <button onClick={() => onClose(false)} className="w-8 h-8 rounded-full glass flex items-center justify-center text-cream/50 hover:text-cream"><X size={16} /></button>
        </div>

        <div className="p-5 overflow-y-auto grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
          <div className="text-center py-4 bg-burnt-orange/10 rounded-xl border border-burnt-orange/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burnt-orange/20 via-burnt-orange/50 to-burnt-orange/20" />
            <p className="text-cream/50 text-xs mb-1">Amount to Pay</p>
            <p className="text-burnt-orange text-3xl font-bold tracking-tight">₹{amount?.toLocaleString("en-IN")}</p>
            <p className="text-cream/40 text-[10px] mt-1">*(All taxes included)*</p>
            {bookingId && (
              <div className="mt-3 pt-3 border-t border-burnt-orange/10 mx-6">
                <p className="text-cream/40 text-xs font-mono">Ref: {bookingId}</p>
              </div>
            )}
            
            {(totalAmount && paymentMode) && (
              <div className="mt-2 text-left px-4">
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full text-xs text-cream/50 hover:text-cream flex justify-between items-center py-1 border-t border-burnt-orange/20 mt-2 pt-2"
                >
                  <span>View Price Breakdown</span>
                  <span>{showBreakdown ? "-" : "+"}</span>
                </button>
                {showBreakdown && (
                  <div className="mt-2 space-y-1 text-xs bg-midnight/50 p-2 rounded border border-cream/5">
                    <div className="flex justify-between text-cream/60">
                      <span>Total Trip Price</span>
                      <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    {paymentMode === "Pay Later" && (
                      <>
                        <div className="flex justify-between text-emerald-400">
                          <span>Booking Charge (Paying Now)</span>
                          <span>₹{amount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-amber-400 border-t border-cream/5 mt-1 pt-1">
                          <span>Balance Due Later</span>
                          <span>₹{(totalAmount - amount).toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {method === "Bank Transfer" && (
            <div className="space-y-3">
              {[
                ["Account Holder", bankDetails.name, "name"],
                ["Account Number", bankDetails.account, "acc"],
                ["IFSC Code", bankDetails.ifsc, "ifsc"],
                ["Bank Name", bankDetails.bank, "bank"],
              ].map(([label, val, key]) => (
                <div key={key} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-cream/5">
                  <div><p className="text-cream/40 text-[10px] uppercase tracking-wider">{label}</p><p className="text-cream text-sm font-medium">{val}</p></div>
                  <CopyBtn text={val} field={key} />
                </div>
              ))}
            </div>
          )}

          {method === "QR Code" && (
            <div className="text-center space-y-3">
              <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center p-2">
                <img src="/qr.png" alt="Scan to Pay" className="w-full h-full object-contain rounded-xl" />
              </div>
              <p className="text-cream/50 text-xs">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
              <div className="bg-white/5 p-3 rounded-xl border border-cream/5 flex items-center justify-between">
                <div><p className="text-cream/40 text-[10px]">UPI ID</p><p className="text-cream text-sm">{bankDetails.upi}</p></div>
                <CopyBtn text={bankDetails.upi} field="upi" />
              </div>
            </div>
          )}

          {method === "UPI" && (
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-xl border border-cream/5 text-center">
                <p className="text-cream/40 text-[10px] uppercase tracking-wider mb-1">UPI ID</p>
                <p className="text-burnt-orange text-lg font-bold">{bankDetails.upi}</p>
                <button onClick={() => copyText(bankDetails.upi, "upiMain")} className="mt-2 text-xs text-cream/50 hover:text-cream flex items-center gap-1 mx-auto">
                  {copied === "upiMain" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy UPI ID</>}
                </button>
              </div>
              <p className="text-cream/40 text-xs text-center">Pay using GPay, PhonePe, Paytm or any UPI app</p>
            </div>
          )}
          </div>

          <div className="flex flex-col gap-3 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 h-max">
            <div className="flex items-start gap-2">
              <Shield size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-400/90 text-[11px] leading-relaxed">
                After payment, share screenshot/transaction ID. Our team will confirm within 24 hours.
              </p>
            </div>
            
            {!submitted ? (
              <div className="mt-2 space-y-3">
                <div>
                  <label className="text-[10px] text-cream/50 uppercase tracking-wider mb-1 block">Transaction ID / UTR *</label>
                  <input 
                    type="text" 
                    value={utr} 
                    onChange={(e) => setUtr(e.target.value)} 
                    placeholder="Enter 12-digit UTR" 
                    className="w-full bg-midnight/50 rounded-lg px-3 py-2 text-sm text-cream outline-none focus:border-emerald-500/50 border border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-cream/50 uppercase tracking-wider mb-1 block">Payment Screenshot *</label>
                  <div className="w-full bg-midnight/50 rounded-lg px-3 py-2 text-sm text-cream/50 border border-transparent hover:border-cream/10 transition-colors flex items-center justify-center cursor-pointer overflow-hidden relative">
                    <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <span className="truncate">{screenshot ? screenshot.name : "Upload Screenshot"}</span>
                  </div>
                </div>
                <button 
                  onClick={submitUtr}
                  disabled={submitting || !utr.trim() || !screenshot}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-2 shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? "Submitting..." : "Submit Payment Details"}
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-emerald-400 text-sm font-medium animate-pulse">
                Transaction ID submitted successfully! We'll verify it shortly.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
