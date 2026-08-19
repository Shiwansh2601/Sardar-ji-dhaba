import React, { useState, useMemo } from "react";
import { Star, ThumbsUp, ExternalLink, Search, CheckCircle2, MessageSquarePlus, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRAND, REVIEWS, Review } from "./data";

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted fill-muted"}
      />
    ))}
  </div>
);

const ratingBreakdown = [
  { stars: 5, count: 785, pct: 72 },
  { stars: 4, count: 215, pct: 20 },
  { stars: 3, count: 62, pct: 5 },
  { stars: 2, count: 21, pct: 2 },
  { stars: 1, count: 10, pct: 1 },
];

const categoryTabs = [
  { id: "all", label: "All Reviews" },
  { id: "food", label: "Food Quality" },
  { id: "service", label: "Service & Staff" },
  { id: "ambiance", label: "Family Ambience" },
  { id: "delivery", label: "Delivery & Packing" },
];

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 8) + 2);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl p-6 md:p-7 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border bg-muted"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-foreground text-base leading-tight">{review.name}</p>
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" title="Verified Customer" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{review.date} · via {review.source}</p>
            </div>
          </div>
          <StarRating rating={review.rating} size={15} />
        </div>

        <p className="text-muted-foreground leading-relaxed text-sm">"{review.text}"</p>

        {review.dishesMentioned && review.dishesMentioned.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {review.dishesMentioned.map((dish) => (
              <span
                key={dish}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                🍽️ {dish}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
        <button
          onClick={() => {
            setLikes(liked ? likes - 1 : likes + 1);
            setLiked(!liked);
          }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
            liked ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <ThumbsUp size={13} className={liked ? "fill-primary" : ""} />
          <span>Helpful ({likes})</span>
        </button>

        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
          Verified Visit
        </span>
      </div>
    </motion.div>
  );
}

export function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<"all" | 5 | 4 | 3>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "rating">("latest");

  // Functional filtering & search
  const filteredReviews = useMemo(() => {
    return REVIEWS.filter((r) => {
      // Rating filter
      if (selectedRating !== "all" && r.rating < selectedRating) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && r.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = r.text.toLowerCase().includes(q);
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesDishes = r.dishesMentioned?.some((d) => d.toLowerCase().includes(q));
        if (!matchesText && !matchesName && !matchesDishes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return b.id - a.id;
    });
  }, [selectedRating, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-foreground text-background py-20 pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">From Our Guests</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Customer Reviews</h1>
          <p className="text-background/70 max-w-xl leading-relaxed">
            Honest reviews from guests at Sardaar Ji Dhaba, Prayagraj. Over {BRAND.reviewsCount} 5-star ratings across Google & dining guides.
          </p>
        </div>
      </div>

      {/* Rating Overview */}
      <section className="py-14 border-b border-border bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-12 gap-8 max-w-5xl items-center">
            {/* Big rating */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
              <div className="flex items-baseline gap-2">
                <p className="text-7xl md:text-8xl font-serif font-bold text-foreground leading-none">{BRAND.rating}</p>
                <span className="text-xl text-muted-foreground font-serif">/ 5.0</span>
              </div>
              <div className="mt-3">
                <StarRating rating={BRAND.rating} size={22} />
              </div>
              <p className="text-muted-foreground mt-2 text-sm font-medium">Based on {BRAND.reviewsCount} Google reviews</p>
              <a
                href="https://www.google.com/search?q=Sardaar+Ji+Dhaba+Prayagraj+reviews"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                View on Google Maps <ExternalLink size={14} />
              </a>
            </div>

            {/* Breakdown bars */}
            <div className="md:col-span-7 space-y-2.5">
              {ratingBreakdown.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-12 flex-shrink-0 text-foreground">{stars} Stars</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right font-medium">{count} ({pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="py-8 border-b border-border bg-muted/20 sticky top-[72px] z-20 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search and Star filter controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Star selector */}
              <div className="flex items-center bg-card border border-border rounded-lg p-1 text-xs font-semibold">
                {(["all", 5, 4] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(r)}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      selectedRating === r ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "all" ? "All Stars" : `${r}★ & up`}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search dishes or reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-semibold focus:border-primary focus:outline-none"
              >
                <option value="latest">Latest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-semibold text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filteredReviews.length}</span> verified reviews
            </p>
            {(selectedCategory !== "all" || selectedRating !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRating("all");
                  setSearchQuery("");
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="font-serif text-xl font-bold mb-1">No Reviews Found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
                We couldn't find any reviews matching your search criteria. Try resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRating("all");
                  setSearchQuery("");
                }}
                className="bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 mb-16">
              {filteredReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}

          {/* Share Your Experience Callout */}
          <div className="border border-border rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto bg-card shadow-xs">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <MessageSquarePlus size={24} />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">Dined with us recently?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Your feedback helps our kitchen and service team maintain authentic Punjabi quality every day.
            </p>
            <a
              href="https://www.google.com/search?q=Sardaar+Ji+Dhaba+Prayagraj&hl=en#lrd=0x0:0xf012b98fb584e217,1,,,"
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-white px-7 py-3 rounded-lg font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 shadow-sm"
            >
              Write a Google Review <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-foreground text-background py-12 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "4.3 / 5", label: "Average Google Rating" },
              { value: BRAND.reviewsCount, label: "Verified Guest Reviews" },
              { value: "98%", label: "Recommend to Family & Friends" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-serif font-bold text-background mb-1">{value}</p>
                <p className="text-background/60 text-xs uppercase tracking-wider font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
