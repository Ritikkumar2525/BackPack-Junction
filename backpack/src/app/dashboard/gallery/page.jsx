"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Upload, X, Heart, MessageCircle } from "lucide-react";

const samplePhotos = [
  { id: 1, url: "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=400&q=80", caption: "Kedarnath Temple at dawn", likes: 42, location: "Kedarnath" },
  { id: 2, url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80", caption: "Spiti Valley vibes", likes: 67, location: "Spiti Valley" },
  { id: 3, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", caption: "Mountain morning", likes: 38, location: "Himalayas" },
  { id: 4, url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", caption: "Summit views", likes: 55, location: "Manali" },
];

import { useSession } from "next-auth/react";

export default function GalleryPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          const res = await fetch("/api/stories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: caption || "My Travel Memory",
              author: session?.user?.name || "Explorer",
              image: base64Image
            })
          });
          if (res.ok) {
            const newStory = await res.json();
            setPhotos(prev => [newStory, ...prev]);
            setShowUpload(false);
            setCaption("");
          }
        } catch (err) {
          console.error("Failed to upload:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">My Photos</h1>
          <p className="text-cream/35 text-sm mt-1">{photos.length} travel memories</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowUpload(!showUpload)} className="btn-primary text-sm py-2.5 px-5">
            <span className="relative z-10 flex items-center gap-2"><Upload size={14} /> Upload Photo</span>
          </button>
          <a href="https://instagram.com/backpack_junction" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-pink-500/20 text-pink-400 hover:bg-pink-500/10 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/></svg> Share Reels
          </a>
        </div>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-cream font-semibold">Upload a Photo</h3>
            <button onClick={() => setShowUpload(false)} className="text-cream/30 hover:text-cream"><X size={18} /></button>
          </div>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." className="glass rounded-xl px-4 py-3 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full mb-4" />
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-cream/10 rounded-xl cursor-pointer hover:border-burnt-orange/30 transition-colors">
            <ImagePlus size={32} className="text-cream/20 mb-3" />
            <p className="text-cream/40 text-sm">Click to upload or drag & drop</p>
            <p className="text-cream/20 text-xs mt-1">PNG, JPG up to 10MB</p>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          <div className="mt-4 p-3 rounded-xl bg-pink-500/5 border border-pink-500/10">
            <p className="text-pink-400/70 text-xs flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/></svg> Want to share reels? Post on Instagram and tag <a href="https://instagram.com/backpack_junction" target="_blank" rel="noopener noreferrer" className="text-pink-400 font-medium hover:underline">@backpack_junction</a> — we&apos;ll feature the best ones!
            </p>
          </div>
        </motion.div>
      )}

      {/* Photo Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <motion.div key={photo._id || photo.id || i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={photo.image || photo.url} alt={photo.title || photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium truncate">{photo.title || photo.caption}</p>
                  <div className="flex items-center gap-3 mt-1 text-white/60 text-[10px]">
                    <span className="flex items-center gap-1"><Heart size={10} /> {photo.likes || 0}</span>
                    <span className="truncate max-w-[80px]">by {photo.author || "Anonymous"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
