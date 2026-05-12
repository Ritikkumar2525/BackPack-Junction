"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Edit, Trash2, Plus, Mountain, DollarSign, ArrowLeft, Image as ImageIcon, Video, List, CheckCircle2, XCircle, Info, FileText, Route } from "lucide-react";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState(getInitialFormState());

  function getInitialFormState() {
    return {
      title: "", destination: "", duration: "", price: "", totalSeats: 20, departureDate: "",
      images: [""], videos: [""], 
      itinerary: [{ day: 1, title: "", activities: [""] }],
      inclusions: [""], exclusions: [""],
      pickupLocations: [""], dropLocations: [""],
      hotelDetails: "", policies: "",
      faqs: [{ question: "", answer: "" }],
      routeLocations: [{ name: "", lat: "", lng: "" }],
      isPublished: true
    };
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = () => {
    setLoading(true);
    fetch("/api/trips").then(r => r.json()).then(d => { setTrips(d.trips || []); setLoading(false); });
  };

  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field, defaultVal = "") => {
    setFormData({ ...formData, [field]: [...formData[field], defaultVal] });
  };
  const removeArrayItem = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const handleItineraryChange = (dayIndex, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };
  const handleActivityChange = (dayIndex, actIndex, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities[actIndex] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleEdit = (trip) => {
    setFormData({
      _id: trip._id,
      title: trip.title || "",
      destination: trip.destination || "",
      duration: trip.duration || "",
      price: trip.price || "",
      totalSeats: trip.totalSeats || 20,
      departureDate: trip.departureDate ? new Date(trip.departureDate).toISOString().split('T')[0] : "",
      images: trip.images?.length ? trip.images : [""],
      videos: trip.videos?.length ? trip.videos : [""],
      itinerary: trip.itinerary?.length ? trip.itinerary : [{ day: 1, title: "", activities: [""] }],
      inclusions: trip.inclusions?.length ? trip.inclusions : [""],
      exclusions: trip.exclusions?.length ? trip.exclusions : [""],
      pickupLocations: trip.pickupLocations?.length ? trip.pickupLocations : [""],
      dropLocations: trip.dropLocations?.length ? trip.dropLocations : [""],
      hotelDetails: trip.hotelDetails || "",
      policies: trip.policies || "",
      faqs: trip.faqs?.length ? trip.faqs : [{ question: "", answer: "" }],
      routeLocations: trip.routeLocations?.length ? trip.routeLocations : [{ name: "", lat: "", lng: "" }],
      isPublished: trip.isPublished ?? true
    });
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this trip? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/trips?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          fetchTrips();
        } else {
          alert(data.error || "Failed to delete trip.");
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Clean up empty array items before submission
      const cleanData = { ...formData };
      cleanData.images = cleanData.images.filter(i => i);
      cleanData.videos = cleanData.videos.filter(v => v);
      cleanData.inclusions = cleanData.inclusions.filter(i => i);
      cleanData.exclusions = cleanData.exclusions.filter(e => e);
      cleanData.pickupLocations = cleanData.pickupLocations.filter(p => p);
      cleanData.dropLocations = cleanData.dropLocations.filter(d => d);
      cleanData.itinerary = cleanData.itinerary.map(day => ({...day, activities: day.activities.filter(a => a)}));
      cleanData.faqs = cleanData.faqs.filter(f => f.question && f.answer);
      cleanData.routeLocations = (cleanData.routeLocations || []).filter(r => r.name && r.lat && r.lng);

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleanData, availableSeats: cleanData.totalSeats })
      });
      if (res.ok) {
        setShowForm(false);
        setFormData(getInitialFormState());
        fetchTrips();
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (loading && !showForm) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Manage Trips</h1>
                <p className="text-cream/35 text-sm mt-1">{trips.length} active trips</p>
              </div>
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5 px-5"><span className="relative z-10 flex items-center gap-2"><Plus size={14} /> Add New Trip</span></button>
            </div>

            <div className="space-y-3">
              {trips.length === 0 && <div className="text-center py-10 text-cream/40">No trips found. Click Add New Trip to create one.</div>}
              {trips.map((t, i) => (
                <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => handleEdit(t)}
                  className="glass-card p-5 flex flex-col md:flex-row items-start gap-5 cursor-pointer hover:border-burnt-orange/30 transition-all">
                  <img src={t.images?.[0] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'} alt={t.title} className="w-full md:w-36 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-cream font-semibold group-hover:text-burnt-orange transition-colors">{t.title}</h3>
                        <p className="text-cream/30 text-xs mt-0.5 flex items-center gap-2"><MapPin size={12} />{t.destination} · {t.duration}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full ${t.isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/5 text-cream/30"}`}>{t.isPublished ? "Published" : "Draft"}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-cream/30">
                      <span className="flex items-center gap-1"><Users size={12} /> {t.totalSeats - t.availableSeats}/{t.totalSeats} booked</span>
                      <span className="flex items-center gap-1 text-burnt-orange"><DollarSign size={12} /> ₹{t.price?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(t); }} className="p-2.5 rounded-xl glass border border-cream/5 text-cream/30 hover:text-cream hover:border-cream/15 transition-all"><Edit size={14} /></button>
                    <button onClick={(e) => handleDelete(t._id, e)} className="p-2.5 rounded-xl glass border border-cream/5 text-red-400/30 hover:text-red-400 hover:border-red-500/20 transition-all"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-cream/5 pb-4">
              <button onClick={() => setShowForm(false)} className="p-2 glass rounded-full text-cream/50 hover:text-cream"><ArrowLeft size={18} /></button>
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-cream">Create New Trip</h1>
                <p className="text-cream/35 text-xs mt-1">Configure itinerary, pricing, and media</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><Info size={16} className="text-burnt-orange"/> Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-cream/40 text-xs mb-1 block">Trip Title</label><input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="e.g. Kedarnath Yatra" /></div>
                  <div><label className="text-cream/40 text-xs mb-1 block">Destination</label><input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="e.g. Uttarakhand" /></div>
                  <div><label className="text-cream/40 text-xs mb-1 block">Duration</label><input required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="e.g. 5 Days / 4 Nights" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-cream/40 text-xs mb-1 block">Price (₹)</label><input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="Amount" /></div>
                    <div><label className="text-cream/40 text-xs mb-1 block">Total Seats</label><input required type="number" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" placeholder="Seats" /></div>
                  </div>
                  <div><label className="text-cream/40 text-xs mb-1 block">Departure Date</label><input type="date" value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} className="glass rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-burnt-orange/50 text-cream border border-transparent" /></div>
                </div>
              </div>

              {/* Day-wise Itinerary */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-cream/5 pb-2 mb-4">
                  <h3 className="text-cream font-semibold flex items-center gap-2"><List size={16} className="text-burnt-orange"/> Day-wise Itinerary</h3>
                  <button type="button" onClick={() => setFormData({...formData, itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", activities: [""] }]})} className="text-xs text-burnt-orange hover:text-cream flex items-center gap-1">+ Add Day</button>
                </div>
                {formData.itinerary.map((day, dIdx) => (
                  <div key={dIdx} className="bg-cream/5 p-4 rounded-xl border border-cream/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-burnt-orange/20 text-burnt-orange flex items-center justify-center font-bold text-sm">D{day.day}</div>
                      <input required value={day.title} onChange={(e) => handleItineraryChange(dIdx, "title", e.target.value)} className="glass rounded-lg px-3 py-1.5 text-sm w-full outline-none text-cream" placeholder="Day Title (e.g. Arrival at Manali)" />
                      {dIdx > 0 && <button type="button" onClick={() => setFormData({...formData, itinerary: formData.itinerary.filter((_, i) => i !== dIdx)})} className="text-red-400 hover:text-red-300"><XCircle size={16}/></button>}
                    </div>
                    <div className="space-y-2 pl-11">
                      {day.activities.map((act, aIdx) => (
                        <div key={aIdx} className="flex gap-2">
                          <input value={act} onChange={(e) => handleActivityChange(dIdx, aIdx, e.target.value)} className="glass rounded-lg px-3 py-1.5 text-xs w-full outline-none text-cream/70" placeholder={`Activity ${aIdx + 1} (e.g. Check-in and rest)`} />
                        </div>
                      ))}
                      <button type="button" onClick={() => { const newIt = [...formData.itinerary]; newIt[dIdx].activities.push(""); setFormData({...formData, itinerary: newIt}); }} className="text-[10px] text-cream/40 hover:text-cream">+ Add Activity</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Inclusions</h3>
                  {formData.inclusions.map((inc, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={inc} onChange={e => handleArrayChange("inclusions", i, e.target.value)} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream" placeholder="e.g. Volvo tickets" />
                      <button type="button" onClick={() => removeArrayItem("inclusions", i)} className="text-cream/30 hover:text-red-400"><XCircle size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem("inclusions")} className="text-xs text-burnt-orange">+ Add Inclusion</button>
                </div>
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><XCircle size={16} className="text-red-500"/> Exclusions</h3>
                  {formData.exclusions.map((exc, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={exc} onChange={e => handleArrayChange("exclusions", i, e.target.value)} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream" placeholder="e.g. Personal expenses" />
                      <button type="button" onClick={() => removeArrayItem("exclusions", i)} className="text-cream/30 hover:text-red-400"><XCircle size={16}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem("exclusions")} className="text-xs text-burnt-orange">+ Add Exclusion</button>
                </div>
              </div>

              {/* Logistics */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><MapPin size={16} className="text-blue-400"/> Logistics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-cream/40 text-xs mb-2 block">Pickup Locations</label>
                    {formData.pickupLocations.map((loc, i) => (
                      <input key={i} value={loc} onChange={e => handleArrayChange("pickupLocations", i, e.target.value)} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream mb-2" placeholder="e.g. Majnu Ka Tila, Delhi" />
                    ))}
                    <button type="button" onClick={() => addArrayItem("pickupLocations")} className="text-[10px] text-burnt-orange">+ Add Pickup</button>
                  </div>
                  <div>
                    <label className="text-cream/40 text-xs mb-2 block">Drop Locations</label>
                    {formData.dropLocations.map((loc, i) => (
                      <input key={i} value={loc} onChange={e => handleArrayChange("dropLocations", i, e.target.value)} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream mb-2" placeholder="e.g. Majnu Ka Tila, Delhi" />
                    ))}
                    <button type="button" onClick={() => addArrayItem("dropLocations")} className="text-[10px] text-burnt-orange">+ Add Drop</button>
                  </div>
                  <div>
                    <label className="text-cream/40 text-xs mb-2 block">Hotel Details</label>
                    <textarea value={formData.hotelDetails} onChange={e => setFormData({...formData, hotelDetails: e.target.value})} rows={3} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream resize-none" placeholder="3-Star accommodation on sharing basis..." />
                  </div>
                </div>
              </div>

              {/* Route Locations */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-cream/5 pb-2 mb-4 flex-wrap gap-2">
                  <h3 className="text-cream font-semibold flex items-center gap-2"><Route size={16} className="text-emerald-400"/> Route Waypoints</h3>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={async () => {
                      const locs = formData.routeLocations || [];
                      const updated = [...locs];
                      for (let idx = 0; idx < updated.length; idx++) {
                        if (updated[idx].name && (!updated[idx].lat || !updated[idx].lng)) {
                          try {
                            const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(updated[idx].name + ', India')}&limit=1`);
                            const d = await r.json();
                            if (d && d[0]) { updated[idx] = { ...updated[idx], lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) }; }
                            if (idx < updated.length - 1) await new Promise(resolve => setTimeout(resolve, 1000));
                          } catch (err) { console.error('Geocode failed for', updated[idx].name, err); }
                        }
                      }
                      setFormData({...formData, routeLocations: updated});
                    }} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 border border-emerald-500/20 px-2 py-1 rounded-lg">🌍 Auto-fill Coordinates</button>
                    <button type="button" onClick={() => setFormData({...formData, routeLocations: [...(formData.routeLocations || []), { name: "", lat: "", lng: "" }]})} className="text-xs text-burnt-orange hover:text-cream flex items-center gap-1">+ Add Waypoint</button>
                  </div>
                </div>
                <p className="text-cream/30 text-[10px]">Enter place names and click &quot;Auto-fill Coordinates&quot; to auto-populate lat/lng, or enter them manually.</p>
                {(formData.routeLocations || []).map((loc, i) => (
                  <div key={i} className="flex gap-2 items-center bg-cream/5 p-3 rounded-xl">
                    <span className="text-burnt-orange font-bold text-sm w-6 text-center">{i + 1}</span>
                    <input value={loc.name} onChange={e => { const r = [...formData.routeLocations]; r[i].name = e.target.value; setFormData({...formData, routeLocations: r}); }} className="glass rounded-lg px-3 py-1.5 text-sm flex-1 outline-none text-cream" placeholder="Place name (e.g. Haridwar)" />
                    <input value={loc.lat} onChange={e => { const r = [...formData.routeLocations]; r[i].lat = e.target.value; setFormData({...formData, routeLocations: r}); }} type="number" step="any" className="glass rounded-lg px-3 py-1.5 text-sm w-28 outline-none text-cream" placeholder="Lat" />
                    <input value={loc.lng} onChange={e => { const r = [...formData.routeLocations]; r[i].lng = e.target.value; setFormData({...formData, routeLocations: r}); }} type="number" step="any" className="glass rounded-lg px-3 py-1.5 text-sm w-28 outline-none text-cream" placeholder="Lng" />
                    <button type="button" onClick={async () => {
                      if (!loc.name) return;
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc.name + ', India')}&limit=1`);
                        const data = await res.json();
                        if (data && data[0]) { const r = [...formData.routeLocations]; r[i] = { ...r[i], lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }; setFormData({...formData, routeLocations: r}); }
                      } catch (err) { console.error(err); }
                    }} className="text-cream/30 hover:text-emerald-400 transition-colors" title="Fetch coordinates for this stop"><MapPin size={14}/></button>
                    <button type="button" onClick={() => setFormData({...formData, routeLocations: formData.routeLocations.filter((_, idx) => idx !== i)})} className="text-cream/30 hover:text-red-400"><XCircle size={16}/></button>
                  </div>
                ))}
              </div>

              {/* Media Uploads */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><ImageIcon size={16} className="text-pink-400"/> Media (URLs)</h3>
                <div>
                  <label className="text-cream/40 text-xs mb-2 block">Image URLs</label>
                  {formData.images.map((img, i) => (
                    <input key={i} value={img} onChange={e => handleArrayChange("images", i, e.target.value)} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream mb-2" placeholder="https://..." />
                  ))}
                  <button type="button" onClick={() => addArrayItem("images")} className="text-[10px] text-burnt-orange">+ Add Image</button>
                </div>
              </div>

              {/* Policies & FAQs */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-cream font-semibold border-b border-cream/5 pb-2 mb-4 flex items-center gap-2"><FileText size={16} className="text-purple-400"/> Travel Policies & FAQs</h3>
                <div>
                  <label className="text-cream/40 text-xs mb-2 block">Cancellation & Travel Policies</label>
                  <textarea value={formData.policies} onChange={e => setFormData({...formData, policies: e.target.value})} rows={3} className="glass rounded-xl px-3 py-2 text-sm w-full outline-none text-cream resize-none" placeholder="100% refund before 15 days..." />
                </div>
                <div className="mt-4">
                  <label className="text-cream/40 text-xs mb-2 block">FAQs</label>
                  {formData.faqs.map((faq, i) => (
                    <div key={i} className="bg-cream/5 p-3 rounded-xl mb-2 flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input value={faq.question} onChange={e => {const f=[...formData.faqs]; f[i].question=e.target.value; setFormData({...formData, faqs: f})}} className="glass rounded-lg px-3 py-1.5 text-xs w-full outline-none text-cream" placeholder="Question" />
                        <input value={faq.answer} onChange={e => {const f=[...formData.faqs]; f[i].answer=e.target.value; setFormData({...formData, faqs: f})}} className="glass rounded-lg px-3 py-1.5 text-xs w-full outline-none text-cream/70" placeholder="Answer" />
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, faqs: formData.faqs.filter((_, idx)=> idx !== i)})} className="text-cream/30 hover:text-red-400 p-1"><XCircle size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem("faqs", {question:"", answer:""})} className="text-[10px] text-burnt-orange">+ Add FAQ</button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-4">
                <label className="flex items-center gap-2 text-sm text-cream cursor-pointer">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded text-burnt-orange focus:ring-burnt-orange bg-midnight border-cream/20" />
                  Publish immediately
                </label>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-3 px-10"><span className="relative z-10">{saving ? "Saving..." : "Save Trip Details"}</span></button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
