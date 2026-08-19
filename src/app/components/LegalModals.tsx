import React from "react";
import { X, ShieldCheck, FileText, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRAND } from "./data";

interface LegalModalProps {
  isOpen: boolean;
  type: "privacy" | "terms" | null;
  onClose: () => void;
}

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-card text-card-foreground border border-border w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {type === "privacy" ? <ShieldCheck size={22} /> : <FileText size={22} />}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">
                  {type === "privacy" ? "Privacy Policy" : "Terms & Conditions of Service"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {BRAND.name} ({BRAND.subtitle}) · Effective Date: January 1, 2026
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-muted-foreground leading-relaxed">
            {type === "privacy" ? (
              <>
                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">1. Overview & Commitment</h3>
                  <p>
                    At {BRAND.name}, we value the trust you place in us when sharing your personal information. This Privacy Policy describes how we collect, use, and protect your information when you visit our website, order online, or communicate with us via WhatsApp.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">2. Information We Collect</h3>
                  <p>When you place an order or contact us, we collect:</p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li><strong>Contact details:</strong> Full name, phone number, and optional email address.</li>
                    <li><strong>Delivery details:</strong> Complete delivery address, landmark, and special cooking instructions.</li>
                    <li><strong>Order records:</strong> Dishes ordered, subtotal, taxes, delivery fees, and order timestamps.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">3. How We Use Your Information</h3>
                  <p>Your information is used strictly for:</p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li>Fulfilling, preparing, and delivering your food orders accurately.</li>
                    <li>Sending instant order receipts, delivery status updates, and tracking details via WhatsApp and SMS.</li>
                    <li>Responding to customer enquiries and table reservation requests.</li>
                    <li>Internal operations and accounting. We <strong>never</strong> sell, rent, or trade your personal information to third parties.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">4. Data Security</h3>
                  <p>
                    We employ industry-standard database encryption and secure servers to safeguard your personal details. Only authorized restaurant staff handle order delivery information.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">5. Contacting Us</h3>
                  <p>If you have any questions regarding your data privacy, you can reach out to us at:</p>
                  <div className="mt-2 p-3 bg-muted/40 rounded-lg space-y-1 text-xs">
                    <p className="flex items-center gap-2"><Phone size={13} className="text-primary" /> {BRAND.phone}</p>
                    <p className="flex items-center gap-2"><Mail size={13} className="text-primary" /> {BRAND.email}</p>
                    <p className="flex items-center gap-2"><MapPin size={13} className="text-primary" /> {BRAND.address}</p>
                  </div>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">1. Acceptance of Terms</h3>
                  <p>
                    By accessing our website, placing an order, or booking a table at {BRAND.name}, you agree to abide by these Terms and Conditions. Please review them carefully before placing an order.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">2. Menu Pricing & GST Charges</h3>
                  <p>
                    All prices displayed on the website are in Indian Rupees (INR). Orders are subject to a mandatory 5% Goods and Services Tax (GST) as applicable by law. Packaging and delivery charges apply based on order type and minimum order threshold (Free delivery on orders above ₹500 in Prayagraj).
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">3. Ordering, Preparation & Delivery</h3>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li>Once an order is confirmed, preparation begins immediately to ensure fresh, piping hot food.</li>
                    <li>Delivery times typically range between 30 to 45 minutes depending on traffic and weather conditions in Prayagraj.</li>
                    <li>Please provide accurate landmark and phone details so our delivery riders can reach you smoothly.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">4. Cancellations & Refunds</h3>
                  <p>
                    Due to the perishable nature of freshly prepared food, cancellations must be requested within 5 minutes of placing the order via phone or WhatsApp. In case of verified quality issues or wrong items, our manager will issue a full replacement or refund.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">5. Food Safety & Allergies</h3>
                  <p>
                    Our kitchen uses dairy (paneer, butter, ghee), nuts (cashews), and gluten (wheat flour). If you have specific dietary allergies, please inform us in the Special Cooking Instructions field prior to placing the order.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-foreground text-base mb-2">6. Governing Law</h3>
                  <p>
                    These terms are governed by the laws of India and the jurisdiction of courts in Prayagraj, Uttar Pradesh.
                  </p>
                </section>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-end">
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
