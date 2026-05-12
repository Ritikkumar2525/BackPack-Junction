"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";

export default function TravelStories() {
  const [stories, setStories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stories on component mount
  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/api/stories");
        const data = await res.json();
        if (res.ok) {
          setStories(data);
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  const handleLike = async (e, storyId) => {
    e.stopPropagation(); // Prevent opening the modal
    
    // Optimistic UI update
    setStories(prevStories => 
      prevStories.map(story => 
        story._id === storyId 
          ? { ...story, likes: story.likes + 1, hasLiked: true } 
          : story
      )
    );

    try {
      const res = await fetch(`/api/stories/${storyId}/like`, { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        // Revert on error
        setStories(prevStories => 
          prevStories.map(story => 
            story._id === storyId 
              ? { ...story, likes: story.likes - 1, hasLiked: false } 
              : story
          )
        );
      }
    } catch (err) {
      console.error("Failed to like story:", err);
    }
  };

  const selectedStory = stories.find((s) => s._id === selected);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] uppercase tracking-[5px] text-burnt-orange mb-5 font-medium"
          >
            Community
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-cream leading-tight"
          >
            Travel <span className="gradient-text">Stories</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Stories Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4]"
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(story._id)}
              >
                {story.image && story.image.startsWith('data:video') ? (
                  <video
                    src={story.image}
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={story.image}
                    alt={story.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-[#0C1420]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=800";
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-cream font-semibold text-sm mb-1">
                    {story.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/40 text-xs">
                      by {story.author}
                    </span>
                    <button 
                      onClick={(e) => handleLike(e, story._id)}
                      disabled={story.hasLiked}
                      className={`text-sm font-medium flex items-center gap-2 transition-colors p-2 -m-2 rounded-md ${story.hasLiked ? 'text-red-500' : 'text-cream/70 hover:text-red-400'}`}
                    >
                      <Heart 
                        size={18} 
                        fill={story.hasLiked ? "currentColor" : "none"} 
                        strokeWidth={story.hasLiked ? 0 : 2}
                      /> 
                      <span className={story.hasLiked ? 'text-cream' : ''}>{story.likes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-midnight/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedStory.image && selectedStory.image.startsWith('data:video') ? (
                <video
                  src={selectedStory.image}
                  autoPlay loop playsInline controls
                  className="w-full h-full object-contain bg-black/50"
                />
              ) : (
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover bg-[#0C1420]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200&h=800";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream mb-1">
                    {selectedStory.title}
                  </h3>
                  <p className="text-cream/50 text-sm">
                    by {selectedStory.author}
                  </p>
                </div>
                <button 
                  onClick={(e) => handleLike(e, selectedStory._id)}
                  disabled={selectedStory.hasLiked}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full backdrop-blur-md border transition-all text-base font-medium shadow-lg ${
                    selectedStory.hasLiked 
                      ? 'bg-red-500/20 border-red-500/50 text-red-500' 
                      : 'bg-black/40 border-white/20 text-white hover:bg-black/60 hover:border-white/40'
                  }`}
                >
                  <Heart 
                    size={22} 
                    fill={selectedStory.hasLiked ? "currentColor" : "none"} 
                  />
                  <span>{selectedStory.likes} Likes</span>
                </button>
              </div>
            </motion.div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-cream/70 hover:text-cream"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
