import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Check, AlertCircle, Loader2, Instagram, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { BRAND } from "./data";
import { api, EnquiryResponse, BusinessConfig } from "../services/api";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", subject: "General Enquiry" });
  const [loading, setLoading] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<EnquiryResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [config, setConfig] = useState<BusinessConfig>({
    name: BRAND.name,
    subtitle: BRAND.subtitle,
    phone: "+91 9838075251",
    phone_raw: "919838075251",
    whatsapp_number: "919838075251",
    whatsapp_url: "https://wa.me/919838075251?text=Hi!%20I%20would%20like%20to%20connect%20with%20Sardaar%20Ji%20Dhaba.",
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
    api.getConfig().then((cfg) => {
      if (cfg) setConfig(cfg);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in your name and message.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      });

      setSubmittedResponse(response);

      // Automatically trigger WhatsApp link
      if (response.whatsapp_link) {
        window.open(response.whatsapp_link, "_blank");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send enquiry. Please try WhatsApp directly.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-border bg-card rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground";

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-foreground text-background py-20 pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-background/70 max-w-lg leading-relaxed">
            Table reservations, catering queries, wedding feasts, or customer feedback — our team in Civil Lines is here to assist you.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-xs">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Send us a Message</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Fill in the form below. Your message will be recorded in our system and opened directly in WhatsApp.
              </p>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submittedResponse ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-green-500/30 bg-green-500/10 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <Check size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2 text-foreground">Enquiry Received!</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Thank you, {submittedResponse.name}. Your enquiry #{submittedResponse.id} has been recorded.
                  </p>
                  {submittedResponse.whatsapp_link && (
                    <a
                      href={submittedResponse.whatsapp_link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle size={16} /> Open Chat on WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSubmittedResponse(null);
                      setForm({ name: "", phone: "", email: "", message: "", subject: "General Enquiry" });
                    }}
                    className="block mx-auto mt-4 text-xs text-primary font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98380 75251"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputClass + " cursor-pointer"}
                    >
                      <option>General Enquiry</option>
                      <option>Table Reservation</option>
                      <option>Bulk Order / Catering</option>
                      <option>Event & Birthday Booking</option>
                      <option>Feedback & Suggestions</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how we can help (e.g. date, number of guests, special menu needs)..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={16} /> Send via WhatsApp & Submit
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Contact Details</h2>

                <div className="space-y-6 mb-8">
                  {/* Phone Call Trigger */}
                  <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-0.5">Phone & Call Orders</h4>
                      <a href={`tel:${config.phone_raw}`} className="text-primary font-bold text-base hover:underline block">
                        {config.phone}
                      </a>
                      <span className="text-[11px] text-muted-foreground">Click to call directly from phone</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-0.5">Restaurant Address</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{config.address}</p>
                      <a
                        href={config.map_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-primary font-bold text-xs hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-0.5">Official Email</h4>
                      <a href={`mailto:${config.email}`} className="text-muted-foreground text-xs hover:text-primary transition-colors">
                        {config.email}
                      </a>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-0.5">Opening Hours</h4>
                      <p className="text-foreground font-semibold text-xs">{config.hours_display}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Serving lunch, dinner, takeaway & deliveries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="p-4 bg-card border border-border rounded-xl">
                <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-muted-foreground">Follow Sardaar Ji Dhaba</h4>
                <div className="flex gap-2.5">
                  <a
                    href={config.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                  <a
                    href={config.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors font-bold text-sm"
                  >
                    f
                  </a>
                  <a
                    href={config.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Youtube size={16} />
                  </a>
                  <a
                    href={config.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map embed area */}
      <div className="bg-muted/20 border-t border-border py-14">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <h3 className="font-serif text-2xl font-bold mb-4">Interactive Map</h3>
          <div className="w-full h-80 rounded-xl border border-border overflow-hidden relative shadow-xs">
            <iframe
              src="https://maps.google.com/maps?q=Sardaar+Ji+Dhaba,+Civil+Lines,+Prayagraj&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sardaar Ji Dhaba Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
