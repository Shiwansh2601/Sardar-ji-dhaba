import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, MessageCircle, Instagram, Youtube, Phone, MapPin, Sun, Moon, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRAND } from "./components/data";
import { HomePage } from "./components/HomePage";
import { MenuPage } from "./components/MenuPage";
import { AboutPage } from "./components/AboutPage";
import { GalleryPage } from "./components/GalleryPage";
import { ReviewsPage } from "./components/ReviewsPage";
import { ContactPage } from "./components/ContactPage";
import { OrderNowPage } from "./components/OrderNowPage";
import { LegalModal } from "./components/LegalModals";
import { api, BusinessConfig } from "./services/api";

type Page = "home" | "menu" | "about" | "gallery" | "reviews" | "contact" | "order";

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "menu", label: "Menu" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | null>(null);

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

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("sardaar_theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("sardaar_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.getConfig().then((cfg) => {
      if (isMounted && cfg) {
        setConfig(cfg);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isHome = currentPage === "home";
  const isTransparent = isHome && !scrolled;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent py-5"
            : "bg-background/95 backdrop-blur-md border-b border-border py-4 shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors flex-shrink-0">
              <img src={BRAND.logo} alt="Sardaar Ji Dhaba logo" className="w-full h-full object-cover" />
            </div>
            <div className={`flex flex-col transition-colors ${isTransparent ? "text-white" : "text-foreground"}`}>
              <span className="font-serif text-xl font-bold leading-none tracking-tight">{config.name}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-70 mt-0.5">{config.subtitle}</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                  currentPage === id
                    ? "text-primary font-black"
                    : isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}

            {/* Calling button */}
            <a
              href={`tel:${config.phone_raw}`}
              title="Call Sardaar Ji Dhaba"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isTransparent
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <Phone size={13} className="text-primary" />
              <span>{config.phone}</span>
            </a>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                isTransparent
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:bg-muted"
              }`}
              aria-label="Toggle dark and light theme"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
            </button>

            {/* Order Now CTA */}
            <button
              onClick={() => navigate("order")}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              Order Now
            </button>
          </nav>

          {/* Mobile hamburger + theme toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isTransparent ? "text-white" : "text-foreground"}`}
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} className="text-amber-400" />}
            </button>
            <button
              className={`p-2 ${isTransparent ? "text-white" : "text-foreground"}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <span className="font-serif text-2xl font-bold text-primary">{config.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-foreground"
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-foreground"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex flex-col px-6 py-8 flex-1 overflow-y-auto">
              {NAV_LINKS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`text-left py-4 border-b border-border font-serif text-3xl font-bold transition-colors ${
                    currentPage === id ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-card">
              <button
                onClick={() => navigate("order")}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mb-3 shadow-md"
              >
                <MessageCircle size={18} /> Order Now / WhatsApp
              </button>
              <a
                href={`tel:${config.phone_raw}`}
                className="w-full border border-border bg-background py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-foreground hover:border-primary transition-colors"
              >
                <Phone size={16} className="text-primary" /> Call {config.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {currentPage === "home" && <HomePage onNavigate={navigate} />}
            {currentPage === "menu" && <MenuPage />}
            {currentPage === "about" && <AboutPage onNavigate={navigate} />}
            {currentPage === "gallery" && <GalleryPage />}
            {currentPage === "reviews" && <ReviewsPage />}
            {currentPage === "contact" && <ContactPage />}
            {currentPage === "order" && <OrderNowPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-950 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid md:grid-cols-12 gap-12 border-b border-white/10 pb-12 mb-10">
            {/* Brand col */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                  <img src={BRAND.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold leading-none">{config.name}</p>
                  <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">{config.subtitle} · {config.since}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-7">
                Bringing the rich authentic flavours of Punjab to Civil Lines, Prayagraj.
                Fresh tandoor delicacies, slow-cooked gravies, and warm family hospitality.
              </p>
              <div className="flex gap-3">
                <a href={config.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary text-white/60 transition-colors">
                  <Instagram size={16} />
                </a>
                <a href={config.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary text-white/60 transition-colors text-sm font-bold">
                  f
                </a>
                <a href={config.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary text-white/60 transition-colors">
                  <Youtube size={16} />
                </a>
                <a href={config.whatsapp_url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary text-white/60 transition-colors">
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-xs uppercase tracking-widest mb-5 text-white/50">Navigate</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(({ id, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => navigate(id)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate("order")} className="text-primary hover:text-primary/80 text-sm font-bold transition-colors">
                    Order Now
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-5">
              <h4 className="font-bold text-xs uppercase tracking-widest mb-5 text-white/50">Contact & Calling</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-white/60 leading-relaxed">{config.address}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <a href={`tel:${config.phone_raw}`} className="text-white hover:text-primary font-bold transition-colors">
                    {config.phone} <span className="text-xs text-white/40 font-normal">(Click to call)</span>
                  </a>
                </div>
                <div className="text-sm text-white/60 pl-7">
                  <p className="font-medium text-white/80 mb-0.5">Hours</p>
                  <p>{config.hours_display}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs">
            <p>© {new Date().getFullYear()} {config.name}, {config.subtitle}. All rights reserved.</p>
            <div className="flex gap-6">
              <button
                onClick={() => setLegalModalType("privacy")}
                className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1"
              >
                <ShieldCheck size={13} /> Privacy Policy
              </button>
              <button
                onClick={() => setLegalModalType("terms")}
                className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1"
              >
                <FileText size={13} /> Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── LEGAL MODAL (PRIVACY & TERMS) ── */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
