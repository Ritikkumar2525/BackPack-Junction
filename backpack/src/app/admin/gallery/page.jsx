"use client";
import { useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

const sampleGallery = [
  "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=400&q=80",
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400&q=80",
  "https://images.unsplash.com/photo-1626686007697-5f0c9100e449?w=400&q=80",
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState(sampleGallery);
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setImages(prev => [URL.createObjectURL(file), ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Gallery Management</h1>
          <p className="text-cream/35 text-sm mt-1">{images.length} images</p>
        </div>
        <label className="btn-primary text-sm py-2.5 px-5 cursor-pointer">
          <span className="relative z-10 flex items-center gap-2"><Upload size={14} /> Upload</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
