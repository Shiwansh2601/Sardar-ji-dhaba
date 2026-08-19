import React from "react";
import { MapPin, Phone, Clock, Star, ArrowRight, MessageCircle, Check, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { BRAND, MENU_CATEGORIES, REVIEWS, GALLERY_IMAGES } from "./data";

type Page = "home" | "menu" | "about" | "gallery" | "reviews" | "contact" | "order";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-stone-300 fill-stone-300"}
      />
    ))}
  </div>
);

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredItems = MENU_CATEGORIES.flatMap((c) => c.items.filter((i) => i.popular)).slice(0, 6);
  const featuredReviews = REVIEWS.slice(0, 3);

  return (
    <div>
      {/* ── HERO ── */}
      <section id="home" className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&h=1080&fit=crop&auto=format"
            alt="Sardaar Ji Dhaba signature dishes"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white pt-24 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-10 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/80 font-bold">Authentic Punjabi Flavours · Since 2008</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.08] mb-6 max-w-3xl"
          >
            A Culinary Haven<br />
            in the Heart of{" "}
            <em className="text-primary not-italic">Prayagraj</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 max-w-xl leading-relaxed mb-10"
          >
            Bold Punjabi recipes passed down through generations — served with warmth,
            care, and the finest ingredients in every plate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => onNavigate("menu")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              Explore Full Menu <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("order")}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} /> Order on WhatsApp
            </button>
          </motion.div>

          {/* Stats bar */}
          <div className="mt-16 flex flex-wrap gap-8 border-t border-white/20 pt-10">
            {[
              { label: "Google Rating", value: "4.3 / 5" },
              { label: "Happy Reviews", value: BRAND.reviewsCount },
              { label: "Years of Heritage", value: "16+" },
              { label: "Open Daily", value: "8 AM – 11 PM" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-serif font-bold text-white">{value}</p>
                <p className="text-xs uppercase tracking-widest text-white/55 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick-info ribbon */}
        <div className="absolute bottom-0 left-0 w-full bg-background/95 backdrop-blur-sm border-t border-border hidden lg:block">
          <div className="container mx-auto px-8">
            <div className="flex items-center justify-between divide-x divide-border py-0">
              {[
                { icon: <Clock size={18} className="text-primary" />, label: "Hours", value: BRAND.hoursDisplay },
                { icon: <Phone size={18} className="text-primary" />, label: "Call", value: BRAND.phone, href: `tel:${BRAND.phoneRaw}` },
                { icon: <MapPin size={18} className="text-primary" />, label: "Location", value: "Civil Lines, Prayagraj", href: BRAND.mapUrl },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3 px-10 py-5 first:pl-0 last:pr-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="font-medium hover:text-primary transition-colors text-sm">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="px-10 py-5 last:pr-0 flex items-center gap-3">
                <StarRating rating={BRAND.rating} size={14} />
                <span className="text-sm font-bold">{BRAND.reviewsCount} Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR DISHES ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Chef's Picks</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Most Loved Dishes</h2>
            </div>
            <button
              onClick={() => onNavigate("menu")}
              className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all group text-sm uppercase tracking-wider"
            >
              Full Menu <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="group border-b border-border pb-8 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 mt-1 ${
                        item.type === "veg" ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"
                      }`}
                    />
                    <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                  </div>
                  <span className="font-bold text-primary whitespace-nowrap">{item.price}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-5">{item.desc}</p>
                {item.popular && (
                  <span className="mt-3 pl-5 inline-block text-[10px] uppercase tracking-widest font-bold text-primary">
                    ★ Popular Choice
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-24 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] overflow-hidden bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=1000&fit=crop&auto=format"
                  alt="Authentic Punjabi food preparation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 bg-primary text-white p-6 md:p-8 text-center">
                <p className="font-serif text-4xl font-bold">16+</p>
                <p className="text-xs uppercase tracking-widest text-white/80 mt-1">Years of Heritage</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Where Tradition Meets <em className="text-primary not-italic">Taste</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{BRAND.story}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{BRAND.story2}</p>

              <ul className="space-y-3 mb-10">
                {[
                  "Recipes crafted from generations of Punjabi culinary wisdom",
                  "Fresh, quality ingredients sourced daily",
                  "Warm, family-friendly atmosphere in Civil Lines",
                  "Over 1,000 five-star Google reviews",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate("about")}
                className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all text-sm uppercase tracking-wider group"
              >
                Read Our Full Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Visual Experience</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">From Our Kitchen</h2>
            </div>
            <button
              onClick={() => onNavigate("gallery")}
              className="inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all text-sm uppercase tracking-wider group"
            >
              Full Gallery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {GALLERY_IMAGES.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden bg-stone-200 cursor-pointer group ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
                }`}
                onClick={() => onNavigate("gallery")}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS PREVIEW ── */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">What People Say</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-background">
                Loved by Prayagraj
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-4xl font-serif font-bold text-background">{BRAND.rating}</p>
                <StarRating rating={BRAND.rating} size={14} />
                <p className="text-xs text-background/50 mt-1">{BRAND.reviewsCount} reviews on Google</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featuredReviews.map((review) => (
              <div key={review.id} className="border border-background/10 p-8">
                <StarRating rating={review.rating} size={14} />
                <p className="text-background/75 leading-relaxed mt-4 mb-6 text-sm">"{review.text}"</p>
                <div className="flex items-center gap-3 border-t border-background/10 pt-5">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-background text-sm">{review.name}</p>
                    <p className="text-background/40 text-xs">{review.date} · {review.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate("reviews")}
              className="border border-background/30 text-background px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-background hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              Read All Reviews <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Ready to dine with us?</h2>
              <p className="text-white/75">Visit us at Civil Lines, Prayagraj or order on WhatsApp.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate("order")}
                className="bg-white text-primary px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </button>
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-white/40 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <MapPin size={18} /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
