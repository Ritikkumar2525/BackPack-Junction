"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setFormOpen(false);
          setOpen(false);
          setStatus("idle");
          setFormData({ name: "", phone: "" });
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div 
      className="fixed bottom-8 right-8 z-[90]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { if (!formOpen) setOpen(false); }}
    >
      <AnimatePresence>
        {open && (
          <div className="absolute bottom-[80px] right-0 z-50">
            {/* The X button */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { setOpen(false); setFormOpen(false); }}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg z-10 hover:bg-gray-100"
            >
              <X size={20} />
            </motion.button>

            {/* Main white popup */}
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-[320px] bg-white rounded-[24px] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.3)] origin-bottom-right"
            >
              {!formOpen ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setFormOpen(true)}
                    className="w-full flex items-center justify-center gap-4 p-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_25px_rgba(0,163,224,0.15)] transition-all border border-gray-50 group"
                  >
                    <div className="text-[#00a3e0] group-hover:scale-110 transition-transform">
                      {/* Phone icon with inward arrow */}
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><polyline points="14 2 18 6 14 10"/><line x1="22" y1="6" x2="18" y2="6"/></svg>
                    </div>
                    <span className="text-black font-bold text-base">Request A Call Back</span>
                  </button>

                  <a 
                    href="https://wa.me/918287054501?text=Hi%20BackPack%20Junction!" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-4 p-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.15)] transition-all border border-gray-50 group"
                  >
                    <div className="text-white bg-[#25D366] p-2 rounded-full group-hover:scale-110 transition-transform shadow-md">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span className="text-black font-bold text-base">Chat With Our Executive</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="text-black font-bold text-lg text-center mb-2">Request Callback</h3>
                  
                  {status === "success" ? (
                    <div className="text-emerald-600 text-center py-6 font-bold text-lg bg-emerald-50 rounded-xl">
                      Request Sent! <br/><span className="text-sm font-medium">We will call you soon.</span>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="text" 
                        required 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-xl focus:outline-none focus:border-[#00a3e0] transition-colors"
                      />
                      <input 
                        type="tel" 
                        required 
                        placeholder="Your Phone Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-xl focus:outline-none focus:border-[#00a3e0] transition-colors"
                      />
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => setFormOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black font-bold transition-colors">Back</button>
                        <button type="submit" disabled={status === "loading"} className="flex-1 py-3 rounded-xl bg-[#00a3e0] text-white hover:bg-[#008cc2] font-bold transition-colors disabled:opacity-70 shadow-md">
                          {status === "loading" ? "Sending..." : "Submit"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={() => { setOpen(!open); setFormOpen(false); }} 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="w-[60px] h-[60px] rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_10px_20px_rgba(37,211,102,0.4)] transition-shadow border-4 border-white/10 relative z-10"
        style={{ background: "#25D366" }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </motion.button>
    </div>
  );
}
