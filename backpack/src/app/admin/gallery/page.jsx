"use client";
import { useState, useEffect } from "react";
import { ImagePlus, Upload, Trash2, Video } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminGalleryPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/stories?view=admin");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load gallery", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          const res = await fetch("/api/stories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "Admin Upload",
              author: session?.user?.name || "Admin",
              image: base64Data
            })
          });
          if (res.ok) {
            const newItem = await res.json();
            setItems(prev => [newItem, ...prev]);
          }
        } catch (err) {
          console.error("Failed to upload:", err);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this memory?")) return;
    
    const prevItems = [...items];
    setItems(items.filter(item => item._id !== id));
    
    try {
      const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error("Failed to delete", err);
      setItems(prevItems); 
    }
  };

  const handleApprove = async (id) => {
    try {
      setItems(items.map(item => item._id === id ? { ...item, status: 'approved' } : item));
      const res = await fetch(`/api/stories/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'approved' })
      });
      if (!res.ok) throw new Error("Approve failed");
    } catch (err) {
      console.error("Failed to approve", err);
      fetchGallery(); // Revert on fail
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Gallery Management</h1>
          <p className="text-cream/35 text-sm mt-1">{items.length} total media items</p>
        </div>
        <label className={`btn-primary text-sm py-2.5 px-5 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <span className="relative z-10 flex items-center gap-2">
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />} 
            {uploading ? "Uploading..." : "Upload Media"}
          </span>
          <input type="file" accept="image/*,video/mp4,video/webm" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
           <div className="w-8 h-8 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const isVideo = item.image && item.image.startsWith('data:video');
            const isPending = item.status === 'pending';
            return (
              <div key={item._id} className={`relative group rounded-xl overflow-hidden aspect-square border shadow-xl ${isPending ? 'border-yellow-500/50' : 'border-cream/5'}`}>
                {isVideo ? (
                  <video src={item.image} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  {isPending && (
                    <button 
                      onClick={() => handleApprove(item._id)}
                      className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title={isPending ? "Reject & Delete" : "Delete Media"}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="absolute top-2 left-2 flex gap-1">
                  {isVideo && (
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white/80 flex items-center gap-1 text-[10px]">
                      <Video size={10} /> Video
                    </div>
                  )}
                  {isPending && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-md px-2 py-1 rounded-md text-yellow-400 flex items-center gap-1 text-[10px] font-bold">
                      PENDING
                    </div>
                  )}
                </div>
                
                {isPending && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/80 text-[10px] truncate">By: {item.uploaderEmail || item.author}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
