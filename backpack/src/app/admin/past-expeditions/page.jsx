"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function PastExpeditionsAdmin() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    date: "",
    travelers: "",
    rating: "",
    image: "",
  });

  const fetchExpeditions = async () => {
    try {
      const res = await fetch("/api/admin/past-expeditions");
      if (res.ok) {
        setExpeditions(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/past-expeditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          travelers: parseInt(formData.travelers, 10),
          rating: parseFloat(formData.rating),
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", destination: "", date: "", travelers: "", rating: "", image: "" });
        fetchExpeditions();
      } else {
        alert("Failed to add expedition.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding expedition.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expedition?")) return;
    try {
      const res = await fetch(`/api/admin/past-expeditions/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExpeditions();
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Past Expeditions</h1>
          <p className="text-sm text-cream/50 mt-1">Add or remove dynamically added past trips.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-burnt-orange hover:bg-burnt-orange/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Expedition
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-burnt-orange" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expeditions.map((exp) => (
            <div key={exp._id} className="bg-[#1a2332] border border-cream/10 rounded-xl overflow-hidden">
              <img src={exp.image} alt={exp.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-cream mb-1">{exp.title}</h3>
                <p className="text-sm text-cream/50">{exp.destination} · {exp.date}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-teal">{exp.travelers} Travelers | ★ {exp.rating}</span>
                  <button onClick={() => handleDelete(exp._id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {expeditions.length === 0 && (
            <div className="col-span-full text-center py-10 text-cream/40">
              No dynamically added expeditions yet. Hardcoded ones are still visible on the website.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a2332] rounded-2xl w-full max-w-md border border-cream/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-cream mb-4">Add Past Expedition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-cream/60 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Valley of Flowers Trek" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Destination</label>
                <input required type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Uttarakhand" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Date String</label>
                <input required type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Sep 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Travelers</label>
                  <input required type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="18" />
                </div>
                <div>
                  <label className="block text-xs text-cream/60 mb-1">Rating</label>
                  <input required type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="4.9" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Image URL</label>
                <input required type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="https://..." />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-cream/5 hover:bg-cream/10 text-cream py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-burnt-orange hover:bg-burnt-orange/90 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {submitting ? "Adding..." : "Add Expedition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
