"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Image as ImageIcon, Video, Upload, Check, X, 
  Eye, EyeOff, Star, Trash2, Loader2, BarChart2, Plus
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminGallery() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    destination: "",
    tripBatch: "",
    tags: "",
    mediaType: "image",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/gallery?stats=true");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Auto-detect media type based on mime
    if (file.type.startsWith('video/')) {
      setUploadForm(prev => ({ ...prev, mediaType: 'video' }));
    } else {
      setUploadForm(prev => ({ ...prev, mediaType: 'image' }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", uploadForm.title);
    formData.append("destination", uploadForm.destination);
    formData.append("tripBatch", uploadForm.tripBatch);
    formData.append("tags", uploadForm.tags);
    formData.append("mediaType", uploadForm.mediaType);
    formData.append("featured", uploadForm.featured);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      toast.success("Media uploaded successfully!");
      setUploadForm({
        title: "", destination: "", tripBatch: "", tags: "", mediaType: "image", featured: false
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchItems();
      fetchStats();
      setActiveTab("manage");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateItemStatus = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");
      
      setItems(items.map(item => item._id === id ? { ...item, ...updates } : item));
      toast.success("Item updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this media? This will permanently remove it from Cloudinary as well.")) return;
    
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      setItems(items.filter(item => item._id !== id));
      toast.success("Item deleted");
      fetchStats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">Gallery Management</h1>
          <p className="text-cream/60 text-sm mt-1">Manage all visual memories, approve user uploads, and build the homepage gallery.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
        {['overview', 'upload', 'manage'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab ? "bg-burnt-orange text-white" : "text-cream/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && stats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#141F33] p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
              <ImageIcon className="text-burnt-orange mb-3" size={28} />
              <div className="text-3xl font-bold text-white">{stats.totalPhotos}</div>
              <div className="text-sm text-cream/50 uppercase tracking-widest mt-1">Photos</div>
            </div>
            <div className="bg-[#141F33] p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
              <Video className="text-burnt-orange mb-3" size={28} />
              <div className="text-3xl font-bold text-white">{stats.totalVideos}</div>
              <div className="text-sm text-cream/50 uppercase tracking-widest mt-1">Videos</div>
            </div>
            <div className="bg-[#141F33] p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
              <BarChart2 className="text-burnt-orange mb-3" size={28} />
              <div className="text-2xl font-bold text-white truncate w-full">{stats.mostViewedDestination || 'None'}</div>
              <div className="text-sm text-cream/50 uppercase tracking-widest mt-1">Top Destination</div>
            </div>
            <div className="bg-[#141F33] p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
              <Star className="text-burnt-orange mb-3" size={28} />
              <div className="text-3xl font-bold text-white">{stats.topContributors?.length || 0}</div>
              <div className="text-sm text-cream/50 uppercase tracking-widest mt-1">Contributors</div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "upload" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <form onSubmit={handleUploadSubmit} className="bg-[#141F33] p-6 rounded-xl border border-white/5 space-y-6">
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-burnt-orange/50 transition-colors relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {!previewUrl ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <Upload size={32} className="text-cream/40 mb-4" />
                  <p className="text-cream font-medium">Drag & drop or click to upload</p>
                  <p className="text-cream/40 text-xs mt-2">Supports JPG, PNG, MP4. Media is compressed via Cloudinary automatically.</p>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                  {uploadForm.mediaType === 'video' ? (
                    <video src={previewUrl} className="w-full h-full object-contain" controls />
                  ) : (
                    <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Title / Alt Text</label>
                <input 
                  type="text" 
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-burnt-orange outline-none text-sm" 
                  placeholder="e.g. Sunset at Kedarnath"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Destination</label>
                <input 
                  type="text" 
                  required
                  value={uploadForm.destination}
                  onChange={(e) => setUploadForm({...uploadForm, destination: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-burnt-orange outline-none text-sm" 
                  placeholder="e.g. Kedarnath"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Trip Category/Batch</label>
                <input 
                  type="text" 
                  value={uploadForm.tripBatch}
                  onChange={(e) => setUploadForm({...uploadForm, tripBatch: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-burnt-orange outline-none text-sm" 
                  placeholder="e.g. Kedarnath Batch 3"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-burnt-orange outline-none text-sm" 
                  placeholder="mountain, group, sunrise"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
              <input 
                type="checkbox" 
                id="featured" 
                checked={uploadForm.featured}
                onChange={(e) => setUploadForm({...uploadForm, featured: e.target.checked})}
                className="w-4 h-4 rounded border-white/20 text-burnt-orange focus:ring-burnt-orange bg-transparent"
              />
              <label htmlFor="featured" className="text-sm text-cream cursor-pointer">Feature this in Home Page Slider</label>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {uploading ? "Uploading to Cloudinary..." : "Upload Memory"}
              </span>
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === "manage" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-burnt-orange" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-[#141F33] rounded-xl overflow-hidden border border-white/5 group flex flex-col">
                  <div className="relative aspect-square w-full bg-black flex-shrink-0 overflow-hidden">
                    {item.mediaType === 'video' ? (
                      <video src={item.url} className="absolute inset-0 w-full h-full object-cover" loop muted autoPlay playsInline />
                    ) : (
                      <img src={item.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-burnt-orange/20 text-burnt-orange flex items-center gap-1">
                          <Star size={10} /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 truncate">{item.title}</h3>
                    <p className="text-xs text-cream/50 mb-3">{item.destination}</p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2 justify-between">
                      <div className="flex gap-2">
                        {item.status !== 'approved' && (
                          <button onClick={() => updateItemStatus(item._id, { status: 'approved' })} className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Approve">
                            <Check size={14} />
                          </button>
                        )}
                        {item.status !== 'rejected' && (
                          <button onClick={() => updateItemStatus(item._id, { status: 'rejected' })} className="p-1.5 rounded bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors" title="Hide/Reject">
                            <EyeOff size={14} />
                          </button>
                        )}
                        <button onClick={() => updateItemStatus(item._id, { featured: !item.featured })} className={`p-1.5 rounded transition-colors ${item.featured ? 'bg-burnt-orange text-white' : 'bg-white/5 text-cream/60 hover:bg-white/10'}`} title="Toggle Feature">
                          <Star size={14} />
                        </button>
                      </div>
                      <button onClick={() => deleteItem(item._id)} className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Permanent">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-12 text-center text-cream/40">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No gallery items found.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
