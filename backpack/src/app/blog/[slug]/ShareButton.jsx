"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({ title }) {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
    >
      <Share2 size={16} /> Share Story
    </button>
  );
}
