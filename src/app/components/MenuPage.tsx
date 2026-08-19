import React, { useState, useEffect } from "react";
import { Search, Leaf, Drumstick, Flame, Star, MessageCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRAND, MENU_CATEGORIES, MenuItem, MenuCategory } from "./data";
import { api, BusinessConfig } from "../services/api";

type Filter = "all" | "veg" | "non-veg" | "popular";

const VegBadge = ({ type }: { type: "veg" | "non-veg" }) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm flex-shrink-0 ${
      type === "veg" ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"
    }`}
    title={type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
  >
    <span className={`w-2 h-2 rounded-full ${type === "veg" ? "bg-green-600" : "bg-red-600"}`} />
  </span>
);

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group flex items-center gap-4 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 p-3 rounded-xl transition-colors">
      {item.image && (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80";
            }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <VegBadge type={item.type} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-serif text-base sm:text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                {item.name}
                {item.popular && (
                  <Star size={12} className="inline ml-1.5 mb-0.5 text-amber-500 fill-amber-500" />
                )}
                {item.spicy && (
                  <Flame size={12} className="inline ml-1 mb-0.5 text-red-500 fill-red-500" />
                )}
              </h4>
              <span className="font-bold text-primary whitespace-nowrap text-sm sm:text-base flex-shrink-0">{item.price}</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-1 line-clamp-2">{item.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [activeCat, setActiveCat] = useState("starters");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState<BusinessConfig>({
    name: BRAND.name,
    subtitle: BRAND.subtitle,
    phone: BRAND.phone,
    phone_raw: BRAND.phoneRaw,
    whatsapp_number: BRAND.phoneRaw,
    whatsapp_url: BRAND.whatsappUrl,
    email: BRAND.email,
    address: BRAND.address,
    map_url: BRAND.mapUrl,
    map_embed_url: BRAND.mapEmbedUrl,
    instagram: BRAND.instagram,
    facebook: BRAND.facebook,
    youtube: BRAND.youtube,
    hours_display: BRAND.hoursDisplay,
    rating: BRAND.rating,
    reviews_count: BRAND.reviewsCount,
    since: BRAND.since,
    tax_rate: 0.05,
    delivery_fee: 30.0,
    free_delivery_threshold: 500.0,
    packaging_fee: 15.0,
  });

  useEffect(() => {
    let isMounted = true;
    api.getConfig().then((cfg) => {
      if (isMounted && cfg) setConfig(cfg);
    });
    api.getCategories().then((data) => {
      if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCat) || categories[0] || MENU_CATEGORIES[0];

  const filteredItems = activeCategory.items.filter((item) => {
    const matchFilter =
      filter === "all" ||
      (filter === "veg" && item.type === "veg") ||
      (filter === "non-veg" && item.type === "non-veg") ||
      (filter === "popular" && item.popular);
    const matchQuery =
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const whatsappText = encodeURIComponent(
    "Namaste! I would like to place an order from Sardaar Ji Dhaba menu."
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-foreground text-background py-20 pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">What We Serve</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-background/70 max-w-xl leading-relaxed">
            Every dish is prepared fresh daily using authentic Punjabi recipes and the finest
            ingredients. Handcrafted tandoori breads, creamy gravies, and fragrant dum biryanis.
          </p>
        </div>
      </div>

      {/* Sticky category + filter bar */}
      <div className="sticky top-[72px] z-30 bg-card border-b border-border shadow-xs">
        <div className="container mx-auto px-4 md:px-8">
          {/* Category tabs */}
          <div className="flex overflow-x-auto hide-scrollbar gap-1 py-2 -mb-px">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCat === cat.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["all", "veg", "non-veg", "popular"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider font-bold border rounded-lg transition-all ${
                  filter === f
                    ? "bg-primary text-white border-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {f === "all" ? "All Dishes" : f === "veg" ? "🌿 Veg" : f === "non-veg" ? "🍗 Non-Veg" : "★ Popular"}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border text-xs bg-card focus:outline-none focus:border-primary transition-colors text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 md:px-8 pb-24">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-serif font-bold">{activeCategory.label}</h2>
            <span className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {filteredItems.length} dishes
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6">
            {activeCat === "starters" && "A perfect beginning — light bites and tandoor favourites to whet the appetite."}
            {activeCat === "main-veg" && "Rich curries and hearty vegetarian preparations crafted with slow-cooked masalas."}
            {activeCat === "main-nonveg" && "Tender meats in deeply spiced gravies — the soul of Punjabi cooking."}
            {activeCat === "breads" && "Freshly baked in our clay tandoor — the ideal companion to every curry."}
            {activeCat === "rice" && "Aromatic basmati preparations and fragrant biryanis cooked dum-style."}
            {activeCat === "desserts" && "A sweet finale — traditional Indian desserts made in-house daily."}
            {activeCat === "drinks" && "Refreshing drinks to complement your meal, from chilled lassi to masala chai."}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat + filter + query}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredItems.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card">
                  <Search size={32} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-sm">No dishes found matching "{query}".</p>
                  <p className="text-xs mt-1">Try another keyword or switch category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dietary legend */}
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-4 h-4 border-2 border-green-600 bg-green-50 rounded-sm items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-green-600" />
              </span>
              Pure Vegetarian
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex w-4 h-4 border-2 border-red-600 bg-red-50 rounded-sm items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-red-600" />
              </span>
              Non-Vegetarian
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-amber-500 fill-amber-500" /> Popular Choice
            </div>
            <div className="flex items-center gap-2">
              <Flame size={12} className="text-red-500 fill-red-500" /> Spicy
            </div>
            <span>· All prices inclusive of taxes · Free delivery on orders above ₹500.</span>
          </div>
        </div>
      </div>

      {/* Order CTA */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-1">Ready to order?</h3>
            <p className="text-white/80 text-sm">WhatsApp us your order or call directly — we'll take care of the rest.</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${config.whatsapp_number}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-primary px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 hover:bg-white/90 transition-colors shadow-sm"
            >
              <MessageCircle size={16} /> WhatsApp Order
            </a>
            <a
              href={`tel:${config.phone_raw}`}
              className="border border-white/40 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Phone size={16} /> Call {config.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
