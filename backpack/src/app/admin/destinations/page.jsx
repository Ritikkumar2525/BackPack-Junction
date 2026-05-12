"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function DestinationsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tagline: "",
    description: "",
    image: "",
    bestSeason: "",
    difficulty: "",
    altitude: "",
    duration: "",
    temperature: "",
    rating: "",
    price: "",
    category: "", // will split by comma
  });

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) {
        setDestinations(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: parseFloat(formData.rating),
          price: parseInt(formData.price, 10),
          category: formData.category.split(",").map(c => c.trim()),
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ id: "", name: "", tagline: "", description: "", image: "", bestSeason: "", difficulty: "", altitude: "", duration: "", temperature: "", rating: "", price: "", category: "" });
        fetchDestinations();
      } else {
        alert("Failed to add destination.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding destination.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination? Hardcoded destinations cannot be deleted from here.")) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDestinations();
      } else {
        alert("Failed to delete. It might be a hardcoded destination.");
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
          <h1 className="text-2xl font-bold text-cream">Destinations</h1>
          <p className="text-sm text-cream/50 mt-1">Manage dynamic destinations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-burnt-orange hover:bg-burnt-orange/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Destination
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-burnt-orange" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-[#1a2332] border border-cream/10 rounded-xl overflow-hidden">
              <img src={dest.image} alt={dest.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-cream mb-1">{dest.name}</h3>
                <p className="text-sm text-cream/50 mb-3">{dest.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-teal">₹{dest.price} | {dest.duration}</span>
                  <button onClick={() => handleDelete(dest.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-[#1a2332] rounded-2xl w-full max-w-2xl border border-cream/10 p-6 shadow-2xl mt-32">
            <h2 className="text-xl font-bold text-cream mb-4">Add Destination</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-cream/60 mb-1">ID / Slug</label>
                <input required type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="e.g., munnar" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Munnar" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-cream/60 mb-1">Tagline</label>
                <input required type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Kashmir of South India" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-cream/60 mb-1">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange h-20" placeholder="Beautiful tea gardens..." />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-cream/60 mb-1">Image URL</label>
                <input required type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Best Season</label>
                <input required type="text" value={formData.bestSeason} onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Sep - March" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Difficulty</label>
                <input required type="text" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Easy" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Altitude</label>
                <input required type="text" value={formData.altitude} onChange={(e) => setFormData({ ...formData, altitude: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="1,600m" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Duration</label>
                <input required type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="3-5 Days" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Temperature</label>
                <input required type="text" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="10°C - 25°C" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Rating</label>
                <input required type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="4.8" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Price (₹)</label>
                <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="12999" />
              </div>
              <div>
                <label className="block text-xs text-cream/60 mb-1">Categories (comma separated)</label>
                <input required type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#0a0f18] border border-cream/10 rounded-lg px-3 py-2 text-cream text-sm outline-none focus:border-burnt-orange" placeholder="Scenic, Nature" />
              </div>
              
              <div className="col-span-2 flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-cream/5 hover:bg-cream/10 text-cream py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-burnt-orange hover:bg-burnt-orange/90 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {submitting ? "Adding..." : "Add Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
