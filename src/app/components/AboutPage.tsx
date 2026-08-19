import React from "react";
import { Check, ArrowRight, Phone, MessageCircle, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { BRAND } from "./data";

type Page = "home" | "menu" | "about" | "gallery" | "reviews" | "contact" | "order";

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

const milestones = [
  { year: "2008", title: "The Beginning", desc: "Sardaar Ji Dhaba opened its doors in Civil Lines, Prayagraj, with a simple mission — serve authentic Punjabi food with heart." },
  { year: "2012", title: "Growing Family", desc: "Word spread quickly. We expanded our dining space to accommodate the growing number of families and food lovers who made us their regular spot." },
  { year: "2016", title: "1,000 Reviews", desc: "Crossed 1,000 Google reviews with a 4+ star rating — a testament to the love and trust of our community." },
  { year: "2020", title: "Through Challenges", desc: "Navigated through difficult times and strengthened our bond with the community. Introduced home delivery via WhatsApp for the first time." },
  { year: "2024", title: "Award Recognition", desc: "Recognised as one of the top Punjabi restaurants in Prayagraj by local food critics and travel platforms." },
  { year: "2026", title: "Still Going Strong", desc: "Over 1,093 reviews and counting. We remain committed to the same recipe of quality, warmth, and authentic flavours." },
];

const values = [
  {
    icon: "🌾",
    title: "Authentic Recipes",
    desc: "Every dish follows time-tested Punjabi recipes, passed down through generations — never compromised for convenience.",
  },
  {
    icon: "✅",
    title: "Fresh Ingredients",
    desc: "We source vegetables, meats, and dairy fresh every single morning. No shortcuts, ever.",
  },
  {
    icon: "👨‍🍳",
    title: "Expert Craftsmanship",
    desc: "Our chefs bring decades of experience from traditional Punjabi kitchens, ensuring every plate is a masterpiece.",
  },
  {
    icon: "🏡",
    title: "Family First",
    desc: "We built this place to feel like home. Every guest is treated like a member of our extended Dhaba family.",
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative py-32 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=700&fit=crop&auto=format"
            alt="Sardaar Ji Dhaba interior"
            className="w-full h-full object-cover object-center opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Our Heritage</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 max-w-2xl">
            The Story Behind Every Plate
          </h1>
          <p className="text-background/60 max-w-xl leading-relaxed">
            A family-run Punjabi Dhaba in the heart of Civil Lines, Prayagraj — built on
            tradition, trust, and the timeless power of good food.
          </p>
        </div>
      </div>

      {/* Main Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Who We Are</span>
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6">
                Authentic Punjabi Cooking,<br />
                <em className="text-primary not-italic">Served with Pride</em>
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Sardaar Ji Dhaba was founded in 2008 with a single, heartfelt purpose: to bring
                  the rich, bold flavours of Punjab to the dining tables of Prayagraj. What began as
                  a modest establishment in Civil Lines quickly grew into one of the city's most
                  beloved culinary destinations.
                </p>
                <p>
                  Our kitchen is run by chefs who grew up surrounded by the aromas of slow-cooked
                  dals, crackling tandoors, and simmering masalas. Every recipe we serve has been
                  refined over decades, balancing tradition with the highest standards of hygiene
                  and quality.
                </p>
                <p>
                  Today, with over 1,093 Google reviews and a loyal community of guests who return
                  week after week, Sardaar Ji Dhaba stands as a proud symbol of Punjabi culinary
                  heritage in Prayagraj.
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Family-run since 2008",
                  "Recipes from traditional Punjabi kitchens",
                  "Fresh ingredients sourced daily",
                  "Warm, welcoming atmosphere for all occasions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=800&fit=crop&auto=format"
                  alt="Authentic Punjabi food being prepared"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-8 hidden md:block">
                <p className="text-5xl font-serif font-bold">4.3</p>
                <div className="flex gap-0.5 my-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-${s <= 4 ? 'white' : 'white/30'}`}>★</span>
                  ))}
                </div>
                <p className="text-xs text-white/70 uppercase tracking-wider">Google Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">What We Stand For</span>
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl mb-5">{v.icon}</div>
                <h3 className="font-serif text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-primary" />
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Our Journey</span>
              <span className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">16 Years of Flavour</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 md:gap-12 mb-12 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-border mt-3" />}
                </div>
                <div className="pb-12 last:pb-0">
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">{m.year}</p>
                  <h3 className="font-serif text-xl font-bold mb-2">{m.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location + Contact section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Find Us</span>
              </div>
              <h2 className="text-4xl font-serif font-bold mb-8 text-background">Come Visit Us</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold mb-1 text-background">Address</p>
                    <p className="text-background/60 text-sm leading-relaxed">{BRAND.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold mb-1 text-background">Phone</p>
                    <a href={`tel:${BRAND.phoneRaw}`} className="text-background/60 text-sm hover:text-primary transition-colors">
                      {BRAND.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => onNavigate("contact")}
                  className="bg-primary text-white px-6 py-3 font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  Contact Us <ArrowRight size={16} />
                </button>
                <a
                  href={BRAND.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-background/20 text-background px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-background/10 transition-colors"
                >
                  Directions
                </a>
              </div>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="font-serif text-2xl font-bold text-background mb-2">Civil Lines, Prayagraj</h3>
                <p className="text-background/50 text-sm mb-6">Near El Chico, Mahatma Gandhi Marg</p>
                <a
                  href={BRAND.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-white px-6 py-2.5 font-bold text-sm inline-block hover:bg-primary/90 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
