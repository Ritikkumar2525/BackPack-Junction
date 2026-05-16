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
import toast from "react-hot-toast";

export default function GalleryPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/gallery?view=my-uploads");
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
        toast.error("Failed to load your memories.");
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 3) {
      toast.error("You can only upload up to 3 images at a time.");
      return;
    }
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 3));
    // Clear input value so same file can be selected again if removed
    e.target.value = null;
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    let successCount = 0;
    
    try {
      const uploadPromises = selectedFiles.map(async (item) => {
        const { file } = item;
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (Max 10MB)`);
          return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", caption || "My Travel Memory");
        formData.append("mediaType", file.type.startsWith('video/') ? "video" : "image");

        const res = await fetch("/api/gallery", { method: "POST", body: formData });
        if (res.ok) {
          successCount++;
          return await res.json();
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const newStories = results.filter(Boolean);
      
      if (newStories.length > 0) {
        setPhotos(prev => [...newStories, ...prev]);
        toast.success(`Successfully uploaded ${successCount} memor${successCount > 1 ? 'ies' : 'y'}!`);
        setShowUpload(false);
        setCaption("");
        setSelectedFiles([]);
      } else {
        toast.error("Failed to upload files.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseUpload = () => {
    setShowUpload(false);
    setSelectedFiles([]);
    setCaption("");
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
            <span className="relative z-10 flex items-center gap-2">
              <Upload size={14} /> Upload Images
            </span>
          </button>
          <a href="https://instagram.com/backpack_junction" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-pink-500/20 text-pink-400 hover:bg-pink-500/10 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/></svg> Share Reels
          </a>
        </div>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative">
          {uploading && (
            <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
              <div className="w-8 h-8 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-cream font-medium text-sm">Uploading to Cloudinary...</p>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-cream font-semibold">Upload Images (Max 3)</h3>
            <button onClick={handleCloseUpload} className="text-cream/30 hover:text-cream"><X size={18} /></button>
          </div>
          
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption for all images..." className="glass rounded-xl px-4 py-3 text-cream/90 placeholder-cream/20 text-sm outline-none border border-transparent focus:border-burnt-orange/30 w-full mb-4" />
          
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {selectedFiles.map((item, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-black/20 border border-white/5">
                  {item.file.type.startsWith('video/') ? (
                    <video src={item.preview} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <img src={item.preview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                  )}
                  <button 
                    onClick={() => removeSelectedFile(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length < 3 && (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cream/10 rounded-xl cursor-pointer hover:border-burnt-orange/30 transition-colors mb-4">
              <ImagePlus size={28} className="text-cream/20 mb-2" />
              <p className="text-cream/40 text-sm">Click to select {3 - selectedFiles.length} more image(s)</p>
              <input type="file" accept="image/*,video/mp4,video/webm" multiple onChange={handleFileSelect} className="hidden" disabled={uploading} />
            </label>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={handleCloseUpload} className="px-4 py-2 rounded-lg text-cream/50 hover:text-cream hover:bg-white/5 transition-all text-sm font-medium">Cancel</button>
            <button 
              onClick={handleUploadSubmit} 
              disabled={selectedFiles.length === 0 || uploading}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFiles.length > 0 
                ? "bg-burnt-orange text-white hover:bg-burnt-orange/90 shadow-lg shadow-burnt-orange/20" 
                : "bg-white/5 text-cream/30 cursor-not-allowed"
              }`}
            >
              Start Upload
            </button>
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
          {photos.length === 0 && (
            <div className="col-span-full py-10 text-center text-cream/40">You haven't uploaded any memories yet.</div>
          )}
          {photos.map((photo, i) => (
            <motion.div key={photo._id || photo.id || i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className={`relative group rounded-xl overflow-hidden aspect-square border shadow-lg ${photo.status === 'pending' ? 'border-yellow-500/30' : photo.status === 'rejected' ? 'border-red-500/30' : 'border-transparent'}`}>
              
              {photo.status === 'pending' && (
                <div className="absolute top-2 right-2 z-10 bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-md px-2 py-1 rounded-md text-yellow-400 text-[10px] font-bold">
                  Pending Approval
                </div>
              )}
              {photo.status === 'rejected' && (
                <div className="absolute top-2 right-2 z-10 bg-red-500/20 border border-red-500/50 backdrop-blur-md px-2 py-1 rounded-md text-red-400 text-[10px] font-bold">
                  Hidden
                </div>
              )}

              {photo.mediaType === 'video' ? (
                <video src={photo.url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <img src={photo.url} alt={photo.title || photo.caption} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
