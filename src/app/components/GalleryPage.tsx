import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Utensils, Flame, Sparkles, Building, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GALLERY_IMAGES, GalleryImageItem } from "./data";

const categories = [
  { id: "all", label: "All Photos", icon: Utensils },
  { id: "tandoor", label: "Tandoor & Starters", icon: Flame },
  { id: "curries", label: "Main Course & Curries", icon: Sparkles },
  { id: "biryani", label: "Biryani & Rice", icon: Utensils },
  { id: "desserts", label: "Desserts & Lassi", icon: Coffee },
  { id: "ambiance", label: "Restaurant Ambience", icon: Building },
];

export function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeFilter === "all"
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeFilter);

  const prev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };
  const next = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-foreground text-background py-20 pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Visual Journey</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Our Gallery</h1>
          <p className="text-background/70 max-w-xl leading-relaxed">
            A glimpse into the culinary art of Sardaar Ji Dhaba — authentic charcoal tandoor, rich Punjabi curries, dum biryanis, and our warm family dining space in Civil Lines, Prayagraj.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b border-border bg-card sticky top-[72px] z-20 shadow-xs">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry / Grid */}
      <div className="container mx-auto px-4 md:px-8 py-12 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`relative group cursor-pointer overflow-hidden rounded-lg bg-muted border border-border shadow-xs ${
                  i === 0 && filtered.length > 4 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"
                }`}
                onClick={() => setLightboxIdx(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to high quality image if network glitch
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-bold tracking-wide">{img.caption}</p>
                      <p className="text-white/70 text-xs mt-0.5 capitalize">{img.category}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <ZoomIn size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close image"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>

            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center max-w-5xl w-full px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIdx].src}
                alt={filtered[lightboxIdx].alt}
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <div className="mt-5 text-center">
                <p className="text-white font-serif text-xl font-bold">{filtered[lightboxIdx].caption}</p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">
                  Photo {lightboxIdx + 1} of {filtered.length} · Sardaar Ji Dhaba Prayagraj
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
