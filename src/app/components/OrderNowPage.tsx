import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  Phone,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  Search,
  Receipt,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRAND, MENU_CATEGORIES, MenuItem, MenuCategory } from "./data";
import { api, OrderResponse, CreateOrderPayload, BusinessConfig } from "../services/api";

type CartItem = MenuItem & { qty: number };

const VegDot = ({ type }: { type: "veg" | "non-veg" }) => (
  <span
    className={`inline-flex w-3.5 h-3.5 border-[1.5px] rounded-sm items-center justify-center flex-shrink-0 ${
      type === "veg" ? "border-green-600" : "border-red-600"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${type === "veg" ? "bg-green-600" : "bg-red-600"}`} />
  </span>
);

export function OrderNowPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [activeCat, setActiveCat] = useState("starters");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Business config state
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

  // Tracking state
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackResults, setTrackResults] = useState<OrderResponse[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Customer checkout form
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    orderType: "delivery" as "delivery" | "takeaway" | "dine_in",
    address: "",
    tableNumber: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "upi_on_delivery" | "cash",
  });

  // Load menu dynamically on mount
  useEffect(() => {
    let isMounted = true;
    api.getConfig().then((cfg) => {
      if (isMounted && cfg) setConfig(cfg);
    });
    api.getCategories().then((data) => {
      if (isMounted && data && data.length > 0) {
        // Merge with static dish images if not provided by backend
        const enhanced = data.map((cat) => {
          const staticCat = MENU_CATEGORIES.find((sc) => sc.id === cat.id);
          return {
            ...cat,
            items: (cat.items || []).map((item) => {
              const staticItem = staticCat?.items.find((si) => si.id === item.id || si.name === item.name);
              return {
                ...item,
                image: item.image || item.image_url || staticItem?.image,
              };
            }),
          };
        });
        setCategories(enhanced);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const safeCategories = categories && categories.length > 0 ? categories : MENU_CATEGORIES;
  const activeCategory = safeCategories.find((c) => c.id === activeCat) || safeCategories[0] || MENU_CATEGORIES[0];

  const getQty = (id: number) => cart.find((i) => i.id === id)?.qty ?? 0;

  const addItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i));
    });
  };

  const deleteItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  // Pricing calculations
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => {
    const priceNum = parseInt(i.price.replace("₹", "").replace(",", ""), 10);
    return s + (isNaN(priceNum) ? 0 : priceNum) * i.qty;
  }, 0);

  const taxAmount = Math.round(subtotal * 0.05);
  const deliveryFee = customer.orderType === "delivery" ? (subtotal >= 500 ? 0 : 30) : 0;
  const packagingFee = customer.orderType === "delivery" || customer.orderType === "takeaway" ? 15 : 0;
  const grandTotal = subtotal + taxAmount + deliveryFee + packagingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customer.name.trim() || !customer.phone.trim()) {
      setErrorMsg("Please enter your name and contact phone number.");
      return;
    }

    if (customer.orderType === "delivery" && !customer.address.trim()) {
      setErrorMsg("Please enter your complete delivery address.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload: CreateOrderPayload = {
      customer_name: customer.name.trim(),
      customer_phone: customer.phone.trim(),
      customer_email: customer.email.trim() || undefined,
      order_type: customer.orderType,
      delivery_address: customer.orderType === "delivery" ? customer.address.trim() : undefined,
      table_number: customer.orderType === "dine_in" ? customer.tableNumber.trim() : undefined,
      special_instructions: customer.notes.trim() || undefined,
      payment_method: customer.paymentMethod,
      items: cart.map((i) => ({
        menu_item_id: i.id,
        item_name: i.name,
        item_type: i.type,
        price: parseInt(i.price.replace("₹", "").replace(",", ""), 10),
        quantity: i.qty,
      })),
    };

    try {
      const order = await api.createOrder(payload);
      setConfirmedOrder(order);
      setCart([]);
      setShowCheckoutModal(false);
      setShowCartDrawer(false);

      // Auto-open WhatsApp if configured
      if (order.whatsapp_link) {
        window.open(order.whatsapp_link, "_blank");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order. Please try again or call us.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackingLoading(true);
    setTrackError(null);
    setTrackResults([]);

    try {
      const results = await api.trackOrders(trackQuery.trim());
      if (results.length === 0) {
        setTrackError("No orders found matching your search. Please check the Order ID or phone number.");
      } else {
        setTrackResults(results);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not track orders at this moment.";
      setTrackError(message);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-foreground text-background py-20 pt-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Order Online</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Order Now</h1>
              <p className="text-background/60 max-w-xl leading-relaxed">
                Select your dishes, customize your order, and submit it directly.
                Live tracking and instant WhatsApp confirmation included.
              </p>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowTrackModal(true);
                  setTrackError(null);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                <Clock size={16} /> Track Existing Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">How it works:</span>
            {[
              { step: "1", text: "Browse our menu" },
              { step: "2", text: "Add items to your cart" },
              { step: "3", text: "Enter delivery details" },
              { step: "4", text: "Confirm via WhatsApp & Track Live" },
            ].map(({ step, text }, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </span>
                <span className="text-sm font-medium">{text}</span>
                {i < 3 && <ArrowRight size={14} className="text-muted-foreground ml-2 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Menu panel */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all flex-shrink-0 ${
                    activeCat === cat.id
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-3"
              >
                {activeCategory.items.map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all ${
                        qty > 0 ? "border-primary/40 bg-primary/5 shadow-xs" : "border-border bg-card hover:border-primary/20"
                      }`}
                    >
                      {/* Dish Thumbnail */}
                      {item.image && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>
                      )}

                      <VegDot type={item.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm sm:text-base leading-tight">
                            {item.name}
                            {item.popular && (
                              <Star size={12} className="inline ml-1 text-amber-500 fill-amber-500" />
                            )}
                          </h4>
                          <span className="font-bold text-primary text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-0.5 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {qty === 0 ? (
                          <button
                            onClick={() => addItem(item)}
                            className="px-3.5 sm:px-4 py-2 border border-primary bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 border border-primary rounded-lg bg-card overflow-hidden">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-5 text-center font-bold text-xs sm:text-sm">{qty}</span>
                            <button
                              onClick={() => addItem(item)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop Cart Sidebar */}
          <div className="hidden lg:block w-84 flex-shrink-0">
            <div className="sticky top-28 border border-border bg-background">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">Your Order</h3>
                {totalItems > 0 && (
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1">Add dishes from the menu to get started</p>
                </div>
              ) : (
                <>
                  <div className="max-h-72 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 border-b border-border last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.qty} × {item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 border border-border flex items-center justify-center hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="w-6 h-6 border border-border flex items-center justify-center hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="w-6 h-6 ml-1 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 border-t border-border space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>GST (5%)</span>
                      <span>₹{taxAmount}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Packaging Fee</span>
                      <span>₹{packagingFee}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border text-base font-bold">
                      <span>Grand Total</span>
                      <span className="text-primary font-serif text-lg">₹{grandTotal}</span>
                    </div>

                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full mt-3 bg-primary text-white py-3.5 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02]"
                    >
                      <Receipt size={16} /> Proceed to Checkout
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      Live sync with kitchen & WhatsApp confirmation.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating cart */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full p-4 bg-background border-t border-border shadow-lg lg:hidden z-40"
          >
            <button
              onClick={() => setShowCartDrawer(true)}
              className="w-full bg-primary text-white py-4 font-bold uppercase tracking-wider text-sm flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </span>
              </div>
              <span>₹{grandTotal} · View Order</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Cart Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setShowCartDrawer(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute bottom-0 left-0 w-full bg-background max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                <h3 className="font-serif text-xl font-bold">Your Order ({totalItems})</h3>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="text-muted-foreground font-bold text-sm"
                >
                  Close
                </button>
              </div>

              <div className="p-4 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.qty} × {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 border border-primary">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors ml-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-5 sticky bottom-0 bg-background border-t border-border">
                <div className="space-y-1 mb-4 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal: ₹{subtotal}</span>
                    <span>GST: ₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1">
                    <span>Grand Total:</span>
                    <span className="text-primary font-serif">₹{grandTotal}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full bg-primary text-white py-4 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                >
                  <Receipt size={18} /> Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowCheckoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background max-w-lg w-full border border-border max-h-[90vh] overflow-y-auto p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold">Complete Your Order</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter your details for swift delivery & kitchen confirmation</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                    Order Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "delivery", label: "🛵 Delivery" },
                      { id: "takeaway", label: "🛍️ Takeaway" },
                      { id: "dine_in", label: "🍽️ Dine-in" },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setCustomer({ ...customer, orderType: t.id as any })}
                        className={`py-2 text-xs font-bold border transition-colors ${
                          customer.orderType === t.id
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {customer.orderType === "delivery" && (
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat No, Street, Landmark, Civil Lines, Prayagraj"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                )}

                {customer.orderType === "dine_in" && (
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                      Table Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4"
                      value={customer.tableNumber}
                      onChange={(e) => setCustomer({ ...customer, tableNumber: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                    Special Cooking / Delivery Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Less spicy, extra green chutney, ring bell twice"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={customer.paymentMethod}
                    onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value as any })}
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="cod">Cash on Delivery / Counter</option>
                    <option value="upi_on_delivery">UPI on Delivery (Google Pay / PhonePe / Paytm)</option>
                    <option value="cash">Cash Payment</option>
                  </select>
                </div>

                <div className="bg-muted/40 p-4 border border-border rounded-sm text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Items ({totalItems}):</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging:</span>
                    <span>₹{packagingFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
                    <span>Total Amount:</span>
                    <span className="text-primary font-serif">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Confirm & Submit Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ORDER CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {confirmedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background max-w-lg w-full border-2 border-primary p-6 md:p-8 relative text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-primary">Order Received!</span>
              <h2 className="font-serif text-3xl font-bold mt-1 mb-2">Thank You, {confirmedOrder.customer_name}!</h2>
              <p className="text-xs text-muted-foreground mb-6">
                Your order has been recorded in our system. Order reference:
              </p>

              <div className="bg-muted p-4 border border-border mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Order Number</p>
                <p className="font-mono text-xl font-bold text-primary mt-1">{confirmedOrder.order_number}</p>
                <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
                  <span>Status: <strong className="text-foreground">{confirmedOrder.status}</strong></span>
                  <span>·</span>
                  <span>Total: <strong className="text-foreground">₹{confirmedOrder.total_amount}</strong></span>
                </div>
              </div>

              <div className="space-y-3">
                {confirmedOrder.whatsapp_link && (
                  <a
                    href={confirmedOrder.whatsapp_link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={18} /> Open in WhatsApp & Confirm
                  </a>
                )}

                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setShowTrackModal(true);
                    setTrackQuery(confirmedOrder.order_number);
                    api.trackOrders(confirmedOrder.order_number).then(setTrackResults);
                  }}
                  className="w-full border border-border hover:border-primary hover:text-primary py-3 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Clock size={16} /> Track Live Status
                </button>

                <button
                  onClick={() => setConfirmedOrder(null)}
                  className="text-xs text-muted-foreground hover:underline pt-2 block mx-auto"
                >
                  Close and Return to Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TRACK ORDER MODAL ── */}
      <AnimatePresence>
        {showTrackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowTrackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background max-w-xl w-full border border-border max-h-[90vh] overflow-y-auto p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold">Track Your Order</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter your Order ID or phone number</p>
                </div>
                <button
                  onClick={() => setShowTrackModal(false)}
                  className="w-8 h-8 flex items-center justify-center border border-border hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  placeholder="e.g. SJD-20260819-XXXX or 9876543210"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="flex-1 border border-border bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="bg-primary text-white px-6 py-2.5 font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {trackingLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Search
                </button>
              </form>

              {trackError && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-6">
                  {trackError}
                </div>
              )}

              {trackResults.length > 0 && (
                <div className="space-y-6">
                  {trackResults.map((order) => (
                    <div key={order.id} className="border border-border p-5 bg-muted/20">
                      <div className="flex items-start justify-between gap-4 border-b border-border pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-0.5 font-bold">
                            {order.order_number}
                          </span>
                          <h4 className="font-serif text-lg font-bold mt-1">{order.customer_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()} · {order.order_type.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase">
                            {order.status}
                          </span>
                          <p className="font-serif font-bold text-primary text-lg mt-1">₹{order.total_amount}</p>
                        </div>
                      </div>

                      {/* Status Progress Bar */}
                      <div className="py-2 mb-4">
                        <div className="grid grid-cols-4 gap-1 text-center text-[10px] uppercase font-bold text-muted-foreground mb-2">
                          <span className={order.status ? "text-primary" : ""}>1. Placed</span>
                          <span className={["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED"].includes(order.status) ? "text-primary" : ""}>2. Confirmed</span>
                          <span className={["PREPARING", "OUT_FOR_DELIVERY", "COMPLETED"].includes(order.status) ? "text-primary" : ""}>3. Kitchen</span>
                          <span className={["OUT_FOR_DELIVERY", "COMPLETED"].includes(order.status) ? "text-primary" : ""}>4. Ready / Dispatched</span>
                        </div>
                        <div className="w-full bg-border h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-500"
                            style={{
                              width:
                                order.status === "PENDING"
                                  ? "25%"
                                  : order.status === "CONFIRMED"
                                  ? "50%"
                                  : order.status === "PREPARING"
                                  ? "75%"
                                  : "100%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Line items list */}
                      <div className="text-xs space-y-1 mb-4 text-muted-foreground border-t border-border pt-3">
                        <p className="font-bold text-foreground mb-1">Items:</p>
                        {order.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span>{i.item_name} × {i.quantity}</span>
                            <span>₹{i.subtotal}</span>
                          </div>
                        ))}
                      </div>

                      {/* Support & Enquiry Buttons */}
                      <div className="border-t border-border pt-4 mt-2 flex flex-col sm:flex-row gap-2">
                        <a
                          href={`https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(
                            `Namaste Sardaar Ji Dhaba! 🙏\n\nI need an update on my order delivery:\n📋 *Order ID:* \`${order.order_number}\`\n👤 *Customer:* ${order.customer_name}\n📞 *Phone:* ${order.customer_phone}\n🏷️ *Type:* ${order.order_type.toUpperCase()}\n📊 *Current Status:* ${order.status}\n\nCould you please let me know the current status and estimated delivery time? Thank you!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageCircle size={15} /> WhatsApp for Delivery Update
                        </a>
                        <a
                          href={`tel:${config.phone_raw}`}
                          className="flex-1 border border-border hover:border-primary text-foreground hover:text-primary py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone size={15} /> Call Restaurant Support
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternative order methods */}
      <div className="border-t border-border py-12 mt-16 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="font-serif text-2xl font-bold mb-8 text-center">Other Ways to Order</h3>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href={config.whatsapp_url}
              target="_blank"
              rel="noreferrer"
              className="border border-border p-6 rounded-xl bg-card flex items-center gap-4 hover:border-primary transition-colors group"
            >
              <MessageCircle size={28} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold group-hover:text-primary transition-colors">WhatsApp Direct</p>
                <p className="text-xs text-muted-foreground mt-0.5">Chat with us to place your custom order</p>
              </div>
            </a>
            <a
              href={`tel:${config.phone_raw}`}
              className="border border-border p-6 rounded-xl bg-card flex items-center gap-4 hover:border-primary transition-colors group"
            >
              <Phone size={28} className="text-primary flex-shrink-0" />
              <div>
                <p className="font-bold group-hover:text-primary transition-colors">Call to Order</p>
                <p className="text-xs text-muted-foreground mt-0.5">{config.phone}</p>
              </div>
            </a>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Online ordering available Mon–Sun, 8 AM – 11 PM. For late orders, please call {config.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}
