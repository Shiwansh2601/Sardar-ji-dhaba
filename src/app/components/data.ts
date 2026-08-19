export const BRAND = {
  name: "Sardaar Ji Dhaba",
  subtitle: "Prayagraj",
  phone: "+91 9838075251",
  phoneRaw: "919838075251",
  whatsappUrl: "https://wa.me/919838075251?text=Hi!%20I%20would%20like%20to%20place%20an%20order%20from%20Sardaar%20Ji%20Dhaba.",
  address: "138C, Mahatma Gandhi Marg, near El Chico, Civil Lines, Prayagraj, Uttar Pradesh 211001",
  mapUrl: "https://maps.app.goo.gl/xFz7G1eWcrS8HijP9",
  mapEmbedUrl: "https://maps.google.com/maps?q=Sardaar+Ji+Dhaba+Prayagraj&output=embed",
  rating: 4.3,
  reviewsCount: "1,093+",
  logo: "https://lh6.googleusercontent.com/-CqmjF3DfMTg/AAAAAAAAAAI/AAAAAAAAAAA/hFKDwtry74Y/s44-p-k-no-ns-nd/photo.jpg",
  email: "shiwanshtiwari12@gmail.com",
  instagram: "https://www.instagram.com/sardaarjidhaba/",
  facebook: "https://www.facebook.com/sardaarjidhaba/",
  youtube: "https://www.youtube.com/@sardaarjidhaba",
  hours: [
    { day: "Monday – Sunday", time: "8:00 AM – 11:00 PM" },
  ],
  hoursDisplay: "8:00 AM – 11:00 PM, All Days",
  story: "Welcome to Sardaar Ji Dhaba, a culinary haven nestled in the heart of Civil Lines, Prayagraj. We bring you an authentic dining experience that captures the true essence of Punjabi flavors — bold, hearty, and crafted with love. Every dish on our menu reflects generations of culinary wisdom, prepared using the finest ingredients sourced fresh daily.",
  story2: "Our restaurant is renowned for its delectable menu, inviting ambiance, and warm hospitality. Whether you're joining us for a family feast, a business lunch, or a quick bite, we promise every meal at Sardaar Ji Dhaba will be an unforgettable experience.",
  since: "Est. 2008",
};

export type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  type: "veg" | "non-veg";
  popular?: boolean;
  spicy?: boolean;
  image?: string;
  image_url?: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  icon: string;
  image?: string;
  items: MenuItem[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    label: "Starters",
    icon: "🔥",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 101, name: "Paneer Tikka", desc: "Cottage cheese cubes marinated in spiced yogurt & grilled to perfection in a tandoor.", price: "₹220", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80" },
      { id: 102, name: "Hara Bhara Kebab", desc: "Crispy patties of fresh spinach, green peas & potato seasoned with aromatic spices.", price: "₹180", type: "veg", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80" },
      { id: 103, name: "Tandoori Mushroom", desc: "Button mushrooms marinated in tandoori masala & slow-roasted in clay oven.", price: "₹200", type: "veg", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80" },
      { id: 104, name: "Dahi ke Sholay", desc: "Golden bread rolls stuffed with spiced hung curd, capsicum & onion.", price: "₹190", type: "veg", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80" },
      { id: 105, name: "Chicken Tikka", desc: "Succulent chicken pieces marinated in yogurt & aromatic Punjabi spices, chargrilled.", price: "₹280", type: "non-veg", popular: true, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80" },
      { id: 106, name: "Seekh Kebab", desc: "Minced mutton blended with herbs & spices, skewered & cooked in tandoor.", price: "₹300", type: "non-veg", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80" },
      { id: 107, name: "Tandoori Chicken (Half)", desc: "Classic half chicken marinated overnight in yogurt & spices, roasted on charcoal.", price: "₹340", type: "non-veg", spicy: true, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80" },
      { id: 108, name: "Crispy Veg Platter", desc: "Assorted vegetarian appetisers: baby corn, paneer & vegetable fingers served with dips.", price: "₹210", type: "veg", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "main-veg",
    label: "Main Course – Veg",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 201, name: "Dal Makhani", desc: "Black lentils slow-cooked overnight with butter, cream & a secret blend of spices.", price: "₹180", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80" },
      { id: 202, name: "Paneer Butter Masala", desc: "Soft cottage cheese cubes simmered in a rich tomato-cashew-cream gravy.", price: "₹240", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&auto=format&fit=crop&q=80" },
      { id: 203, name: "Shahi Paneer", desc: "Royal Mughal-style cottage cheese in a luscious saffron, cashew & cream sauce.", price: "₹260", type: "veg", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80" },
      { id: 204, name: "Palak Paneer", desc: "Fresh baby spinach purée with cottage cheese, tempered with garlic & dried fenugreek.", price: "₹230", type: "veg", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80" },
      { id: 205, name: "Kadai Paneer", desc: "Paneer & bell peppers tossed in a rustic, freshly ground Kadai masala.", price: "₹240", type: "veg", spicy: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80" },
      { id: 206, name: "Chana Masala", desc: "Heritage recipe — chickpeas braised in tangy Punjabi masala with pomegranate.", price: "₹160", type: "veg", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80" },
      { id: 207, name: "Mix Vegetable", desc: "Seasonal farm vegetables cooked in a warming North Indian curry base.", price: "₹170", type: "veg", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80" },
      { id: 208, name: "Aloo Gobi Masala", desc: "Potatoes & cauliflower dry-tossed with cumin, turmeric & coriander.", price: "₹150", type: "veg", image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "main-nonveg",
    label: "Main Course – Non-Veg",
    icon: "🍗",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 301, name: "Butter Chicken", desc: "The classic Punjabi favourite — tender chicken in a velvety tomato-cream sauce.", price: "₹300", type: "non-veg", popular: true, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80" },
      { id: 302, name: "Chicken Curry", desc: "Traditional home-style Punjabi chicken curry with whole spices & onion masala.", price: "₹270", type: "non-veg", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80" },
      { id: 303, name: "Kadai Chicken", desc: "Chicken pieces with capsicum & onion in a bold, freshly ground Kadai spice blend.", price: "₹290", type: "non-veg", spicy: true, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80" },
      { id: 304, name: "Mutton Rogan Josh", desc: "Slow-cooked mutton shoulder in a Kashmiri-inspired deep red gravy.", price: "₹380", type: "non-veg", popular: true, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&auto=format&fit=crop&q=80" },
      { id: 305, name: "Keema Matar", desc: "Minced mutton braised with green peas, tomatoes & aromatic spices.", price: "₹320", type: "non-veg", image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80" },
      { id: 306, name: "Fish Curry", desc: "Fresh river fish cooked in a tangy Punjabi mustard & tomato gravy.", price: "₹280", type: "non-veg", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "breads",
    label: "Breads",
    icon: "🫓",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 401, name: "Tandoori Roti", desc: "Whole wheat flatbread baked fresh in the clay oven.", price: "₹30", type: "veg", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80" },
      { id: 402, name: "Butter Naan", desc: "Soft leavened bread brushed with generous butter, straight from the tandoor.", price: "₹45", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80" },
      { id: 403, name: "Garlic Naan", desc: "Naan bread topped with minced garlic, coriander & butter.", price: "₹55", type: "veg", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80" },
      { id: 404, name: "Lachha Paratha", desc: "Multi-layered flaky whole wheat flatbread, crispy on the outside, soft within.", price: "₹60", type: "veg", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80" },
      { id: 405, name: "Puri (2 pcs)", desc: "Deep-fried puffed whole wheat bread — best paired with Aloo or Chana.", price: "₹40", type: "veg", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80" },
      { id: 406, name: "Missi Roti", desc: "Rustic Punjabi flatbread made with gram & wheat flour, seasoned with ajwain.", price: "₹35", type: "veg", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "rice",
    label: "Rice & Biryani",
    icon: "🍚",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 501, name: "Veg Biryani", desc: "Aromatic long-grain basmati rice layered with seasonal vegetables & whole spices.", price: "₹200", type: "veg", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80" },
      { id: 502, name: "Chicken Biryani", desc: "Fragrant Lucknawi-style dum biryani with tender chicken pieces.", price: "₹300", type: "non-veg", popular: true, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80" },
      { id: 503, name: "Mutton Biryani", desc: "Royal slow-cooked mutton dum biryani with caramelised onions & saffron.", price: "₹380", type: "non-veg", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80" },
      { id: 504, name: "Steamed Rice", desc: "Fluffy long-grain basmati rice, the perfect accompaniment.", price: "₹100", type: "veg", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80" },
      { id: 505, name: "Jeera Rice", desc: "Basmati rice tempered with cumin, bay leaf & whole spices.", price: "₹130", type: "veg", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80" },
      { id: 506, name: "Dal Khichdi", desc: "Comforting slow-cooked rice & lentil preparation with a tadka of ghee & spices.", price: "₹160", type: "veg", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    icon: "🍮",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 601, name: "Gulab Jamun (2 pcs)", desc: "Soft khoya balls soaked in rose-cardamom sugar syrup, served warm.", price: "₹80", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=500&auto=format&fit=crop&q=80" },
      { id: 602, name: "Phirni", desc: "Creamy chilled rice pudding flavoured with cardamom, saffron & rose water.", price: "₹90", type: "veg", image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=500&auto=format&fit=crop&q=80" },
      { id: 603, name: "Rasmalai", desc: "Delicate cottage cheese dumplings soaked in chilled saffron-flavoured milk.", price: "₹110", type: "veg", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80" },
      { id: 604, name: "Gajar Halwa", desc: "Slow-cooked grated carrot pudding with khoya, ghee & dry fruits. (Seasonal)", price: "₹110", type: "veg", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=500&auto=format&fit=crop&q=80" },
      { id: 605, name: "Kulfi (Malai)", desc: "Traditional creamy Indian ice cream set in a cone, flavoured with cardamom.", price: "₹90", type: "veg", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    icon: "🥛",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80",
    items: [
      { id: 701, name: "Sweet Lassi", desc: "Chilled, whipped yogurt drink sweetened with sugar & topped with malai.", price: "₹80", type: "veg", popular: true, image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80" },
      { id: 702, name: "Salted Lassi", desc: "Refreshing yogurt drink seasoned with roasted cumin & fresh mint.", price: "₹80", type: "veg", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80" },
      { id: 703, name: "Mango Lassi", desc: "Thick yogurt blended with Alphonso mango pulp — a summer favourite.", price: "₹110", type: "veg", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80" },
      { id: 704, name: "Masala Chai", desc: "Fragrant spiced Indian tea brewed with ginger, cardamom & milk.", price: "₹30", type: "veg", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80" },
      { id: 705, name: "Fresh Lime Soda", desc: "Freshly squeezed lime with soda — sweet, salted, or masala.", price: "₹55", type: "veg", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80" },
      { id: 706, name: "Soft Drinks", desc: "Pepsi, 7Up, Sprite, Miranda — chilled bottle.", price: "₹40", type: "veg", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80" },
    ],
  },
];

export type Review = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  source: string;
  category: "all" | "food" | "ambiance" | "service" | "delivery";
  dishesMentioned?: string[];
};

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ankit Sharma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "February 2026",
    text: "One of the best dhabas in Prayagraj! The Dal Makhani and Butter Naan combo is absolutely divine. The atmosphere feels warm and authentic — just like a proper Punjabi dhaba. Highly recommended!",
    source: "Google Reviews",
    category: "food",
    dishesMentioned: ["Dal Makhani", "Butter Naan"],
  },
  {
    id: 2,
    name: "Priya Verma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "January 2026",
    text: "Visited with family for dinner in Civil Lines. The Butter Chicken was rich, creamy, and perfectly spiced. The service was fast and the staff was very courteous. Will definitely return!",
    source: "Google Reviews",
    category: "service",
    dishesMentioned: ["Butter Chicken"],
  },
  {
    id: 3,
    name: "Rahul Gupta",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    rating: 4,
    date: "December 2025",
    text: "Sardaar Ji Dhaba is a gem in Civil Lines, Prayagraj. The Mutton Biryani is outstanding — fragrant, long grain rice, and perfectly tender meat. Fast takeaway packaging too.",
    source: "Google Reviews",
    category: "delivery",
    dishesMentioned: ["Mutton Biryani"],
  },
  {
    id: 4,
    name: "Neha Singh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "November 2025",
    text: "Took my parents here on Sunday and they absolutely loved it! The Paneer Butter Masala and Lachha Paratha were phenomenal. Such a lovely, homely ambiance.",
    source: "Google Reviews",
    category: "ambiance",
    dishesMentioned: ["Paneer Butter Masala", "Lachha Paratha"],
  },
  {
    id: 5,
    name: "Mohit Agarwal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "October 2025",
    text: "The sweet lassi here is the best I've had in Prayagraj — thick, chilled, topped with malai. Paneer Tikka was fresh and smoky from the tandoor.",
    source: "Google Reviews",
    category: "food",
    dishesMentioned: ["Sweet Lassi", "Paneer Tikka"],
  },
  {
    id: 6,
    name: "Kavita Pandey",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "September 2025",
    text: "We celebrated a family birthday here and the staff made it very special. The food quality is consistently excellent. The Shahi Paneer deserves a special mention — royal taste!",
    source: "Google Reviews",
    category: "service",
    dishesMentioned: ["Shahi Paneer"],
  },
  {
    id: 7,
    name: "Saurabh Mishra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rating: 4,
    date: "August 2025",
    text: "Solid Punjabi food in Prayagraj. The Chicken Tikka and Tandoori Roti straight from the clay oven were spot on. Quick delivery when ordered online.",
    source: "Google Reviews",
    category: "delivery",
    dishesMentioned: ["Chicken Tikka", "Tandoori Roti"],
  },
  {
    id: 8,
    name: "Deepika Tripathi",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "July 2025",
    text: "Authentic slow-cooked Dal Makhani and hot Gulab Jamun. Outstanding family atmosphere and hygienic kitchen. A must-visit place in Civil Lines!",
    source: "Google Reviews",
    category: "ambiance",
    dishesMentioned: ["Dal Makhani", "Gulab Jamun"],
  },
];

export type GalleryImageItem = {
  src: string;
  alt: string;
  caption: string;
  category: "all" | "tandoor" | "curries" | "biryani" | "ambiance" | "desserts";
};

export const GALLERY_IMAGES: GalleryImageItem[] = [
  {
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&auto=format&fit=crop&q=80",
    alt: "Signature Punjabi Curries & Gravies",
    caption: "Signature Punjabi Dal Makhani & Curries",
    category: "curries",
  },
  {
    src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&auto=format&fit=crop&q=80",
    alt: "Paneer Tikka sizzling from Tandoor",
    caption: "Paneer Tikka Fresh from Clay Oven",
    category: "tandoor",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80",
    alt: "Restaurant interior dining area in Civil Lines",
    caption: "Our Warm & Welcoming Dining Ambience",
    category: "ambiance",
  },
  {
    src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80",
    alt: "Lucknawi Dum Biryani with Fragrant Rice",
    caption: "Authentic Dum Biryani with Spices",
    category: "biryani",
  },
  {
    src: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=900&auto=format&fit=crop&q=80",
    alt: "Paneer Butter Masala with Cream & Coriander",
    caption: "Rich Paneer Butter Masala",
    category: "curries",
  },
  {
    src: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=900&auto=format&fit=crop&q=80",
    alt: "Smoky Chicken Tikka & Kebabs",
    caption: "Chargrilled Chicken Tikka & Kebabs",
    category: "tandoor",
  },
  {
    src: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&auto=format&fit=crop&q=80",
    alt: "Fresh Butter Naan & Breads from Clay Oven",
    caption: "Butter Naan & Tandoori Roti",
    category: "tandoor",
  },
  {
    src: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=900&auto=format&fit=crop&q=80",
    alt: "Warm Gulab Jamun & Phirni Desserts",
    caption: "Warm Gulab Jamun & Traditional Sweets",
    category: "desserts",
  },
  {
    src: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=900&auto=format&fit=crop&q=80",
    alt: "Chilled Punjabi Sweet Lassi in Kulhad",
    caption: "Thick Chilled Punjabi Lassi",
    category: "desserts",
  },
  {
    src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80",
    alt: "Slow simmered North Indian thali",
    caption: "Traditional Punjabi Thali Spread",
    category: "curries",
  },
  {
    src: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=900&auto=format&fit=crop&q=80",
    alt: "Royal Chicken Dum Biryani",
    caption: "Spiced Chicken Biryani with Raita",
    category: "biryani",
  },
  {
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&auto=format&fit=crop&q=80",
    alt: "Evening lights and family seating",
    caption: "Family Table Setting & Evening Ambience",
    category: "ambiance",
  },
];
