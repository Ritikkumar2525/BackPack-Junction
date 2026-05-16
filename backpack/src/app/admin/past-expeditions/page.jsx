"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader2, Edit, X, Star, Users, MapPin, Calendar, Save, Upload, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

export default function PastExpeditionsAdmin() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const getInitialForm = () => ({
    title: "", destination: "", date: "", travelers: "", rating: "", image: "", gallery: [],
  });
  const [formData, setFormData] = useState(getInitialForm());

  const fetchExpeditions = async () => {
    try {
      const res = await fetch("/api/admin/past-expeditions");
      if (res.ok) setExpeditions(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpeditions(); }, []);

  const handleEdit = (exp) => {
    setFormData({
      title: exp.title || "",
      destination: exp.destination || "",
      date: exp.date || "",
      travelers: exp.travelers || "",
      rating: exp.rating || "",
      image: exp.image || "",
      gallery: exp.gallery || [],
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large! Maximum size is 10MB.");
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageUploading(true);
    let uploadedUrls = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large! Maximum size is 10MB.`);
        continue;
      }
      
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        } else {
          toast.error(`Failed to upload ${file.name}.`);
        }
      } catch (err) {
        console.error(err);
        toast.error(`Upload failed for ${file.name}.`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} images uploaded to gallery!`);
    }
    
    setImageUploading(false);
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        travelers: parseInt(formData.travelers, 10),
        rating: parseFloat(formData.rating),
      };

      const url = editingId
        ? `/api/admin/past-expeditions/${editingId}`
        : "/api/admin/past-expeditions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData(getInitialForm());
        fetchExpeditions();
        toast.success(editingId ? "Expedition updated!" : "Expedition added!");
      } else {
        toast.error("Failed to save expedition.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving expedition.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Archive this expedition? It will be removed from the website.")) return;
    try {
      const res = await fetch(`/api/admin/past-expeditions/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExpeditions();
        toast.success("Expedition archived.");
      } else toast.error("Failed to delete.");
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Past Expeditions</h1>
                <p className="text-cream/35 text-sm mt-1">{expeditions.length} completed trips</p>
              </div>
              <button onClick={() => { setEditingId(null); setFormData(getInitialForm()); setShowForm(true); }}
                className="btn-primary text-sm py-2.5 px-5"><span className="relative z-10 flex items-center gap-2"><Plus size={14} /> Add Expedition</span></button>
            </div>

            {expeditions.length === 0 ? (
              <div className="glass-card p-12 text-center text-cream/30">No past expeditions yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expeditions.map((exp, i) => (
                  <motion.div key={exp._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => handleEdit(exp)}
                    className="glass-card overflow-hidden group hover:border-burnt-orange/20 transition-all cursor-pointer">
                    <div className="relative h-40">
                      <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                        ✓ Completed
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-cream text-sm font-bold">{exp.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-cream font-semibold text-sm">{exp.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-cream/30 text-xs">
                        <span className="flex items-center gap-1"><MapPin size={10} />{exp.destination}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} />{exp.date}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream/5">
                        <span className="text-burnt-orange text-xs flex items-center gap-1"><Users size={10} />{exp.travelers} travelers</span>
                        <div className="flex gap-1.5">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}
                            className="p-2 rounded-lg glass text-cream/30 hover:text-cream hover:border-cream/15 transition-all border border-cream/5">
                            <Edit size={12} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(exp._id); }}
                            className="p-2 rounded-lg glass text-red-400/30 hover:text-red-400 hover:border-red-500/20 transition-all border border-cream/5">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-cream/5 pb-4">
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 glass rounded-full text-cream/50 hover:text-cream">
                <X size={18} />
              </button>
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream">
                  {editingId ? "Edit Expedition" : "Add New Expedition"}
                </h1>
                <p className="text-cream/35 text-xs mt-1">Fill in the expedition details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-cream/40 text-xs mb-1 block">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="glass rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="Valley of Flowers Trek" />
                </div>
                <div>
                  <label className="text-cream/40 text-xs mb-1 block">Destination</label>
                  <input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})}
                    className="glass rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="Uttarakhand" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-cream/40 text-xs mb-1 block">Date</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="glass rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="Sep 2025" />
                </div>
                <div>
                  <label className="text-cream/40 text-xs mb-1 block">Travelers</label>
                  <input required type="number" value={formData.travelers} onChange={e => setFormData({...formData, travelers: e.target.value})}
                    className="glass rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="18" />
                </div>
                <div>
                  <label className="text-cream/40 text-xs mb-1 block">Rating</label>
                  <input required type="number" step="0.1" max="5" min="1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})}
                    className="glass rounded-xl px-4 py-2.5 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="4.9" />
                </div>
              </div>
              <div>
                <label className="text-cream/40 text-xs mb-2 block">Expedition Image</label>
                {formData.image ? (
                  <div className="relative h-48 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-black/50 hover:bg-burnt-orange text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                        {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {imageUploading ? "Uploading..." : "Change Image"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-burnt-orange/30 transition-colors bg-white/5">
                    {imageUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={28} className="text-burnt-orange animate-spin mb-2" />
                        <p className="text-cream/60 text-sm">Uploading to Cloudinary...</p>
                      </div>
                    ) : (
                      <>
                        <ImagePlus size={32} className="text-cream/20 mb-3" />
                        <p className="text-cream/40 text-sm">Click to upload image</p>
                        <p className="text-cream/20 text-xs mt-1">Recommended: 1920x1080 (Max 10MB)</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                  </label>
                )}
              </div>

              {/* Gallery Images */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2">
                  <ImagePlus size={16} className="text-purple-400"/> Gallery Images
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.gallery && formData.gallery.map((img, idx) => (
                    <div key={idx} className="relative h-32 rounded-xl overflow-hidden border border-cream/10 group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-burnt-orange/30 transition-colors bg-white/5 relative">
                    {imageUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={24} className="text-burnt-orange animate-spin mb-2" />
                        <span className="text-cream/40 text-xs">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center p-4">
                        <ImagePlus size={24} className="text-cream/40 mb-2" />
                        <span className="text-cream/40 text-xs">Add Images</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={imageUploading} />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-cream/40 hover:text-cream text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm py-3 px-10">
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {submitting ? "Saving..." : editingId ? "Update Expedition" : "Add Expedition"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
