/* ──────────────────────────────────────────────────────────────
   Site content — single source of truth.
   Swap any Unsplash URL for the restaurant's own photography.
   ────────────────────────────────────────────────────────────── */

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const SITE = {
  name: "Café de Bangkok",
  city: "Kochi",
  tagline: "Bangkok after dark, served in Kochi.",
  phone: "+91 80750 92609",
  phoneHref: "tel:+918075092609",
  instagram: "https://www.instagram.com/cafedebangkok.kochi/",
  address: "54/1285, MP Pylee Road, Kadavanthra, Kochi, Kerala 682020",
  addressShort: "MP Pylee Road · Kadavanthra, Kochi",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Cafe+De+Bangkok+MP+Pylee+Road+Kadavanthra+Kochi",
  hours: "Open daily · 11:30 AM — 11:00 PM",
  rating: "4.5",
  reviewCount: "2,900+",
  /* Thai SELECT — the Thai government's certification for restaurants
     serving genuine Thai cuisine outside Thailand. */
  certification: "Thai SELECT certified",
  cuisines: "Thai · Chinese · Japanese · Seafood",
  costForTwo: "₹800 for two",
  perPerson: "₹600 — ₹1,000 per person",
};

export const IMAGES = {
  heroMain: u("photo-1559314809-0d155014e29e", 1600), // pad thai overhead
  heroSide: u("photo-1552566626-52f8b828add9", 1000), // moody restaurant
  courses: [
    u("photo-1569718212165-3a8278d5f624", 1200), // broth / soup
    u("photo-1496116218417-1a781b1c416c", 1200), // dim sum baskets
    u("photo-1585032226651-759b368d7246", 1200), // wok noodles
    u("photo-1579871494447-9811cf80d66c", 1200), // salmon sushi
  ],
  signatures: [
    u("photo-1569718212165-3a8278d5f624", 900),
    u("photo-1563245372-f21724e3856d", 900),
    u("photo-1585032226651-759b368d7246", 900),
    u("photo-1541696490-8744a5dc0228", 900),
    u("photo-1579871494447-9811cf80d66c", 900),
    u("photo-1551024506-0bccd828d307", 900),
  ],
  gallery: [
    u("photo-1552566626-52f8b828add9", 1200),
    u("photo-1414235077428-338989a2e8c0", 1200),
    u("photo-1559339352-11d035aa65de", 1200),
    u("photo-1517248135467-4c7edcad34c4", 1200),
    u("photo-1540189549336-e6e99c3679fe", 1200),
    u("photo-1504674900247-0877df9cc836", 1200),
    u("photo-1424847651672-bf20a4b0982b", 1200),
  ],
  chef: u("photo-1577219491135-ce391730fb2c", 1100),
  visit: u("photo-1517248135467-4c7edcad34c4", 1400), // warm dining room
};

export const COURSES = [
  {
    no: "01",
    title: "Begin with broth",
    body:
      "Tom Yum and Tom Kha built the slow way — lemongrass, galangal and kaffir lime steeped until the steam itself tastes of Bangkok.",
    img: IMAGES.courses[0],
    alt: "Steaming bowl of Thai Tom Yum broth with herbs",
  },
  {
    no: "02",
    title: "Fold into dim sum",
    body:
      "Har Gao pleated nineteen times, wontons wrapped to order, baos proofed through the afternoon. The basket arrives breathing.",
    img: IMAGES.courses[1],
    alt: "Bamboo steamer baskets of handmade dim sum",
  },
  {
    no: "03",
    title: "Meet the wok fire",
    body:
      "Mountain Chilli Chicken, basil stir-fries and lotus stem glazed in chilli plum — seared over a flame that never sits still.",
    img: IMAGES.courses[2],
    alt: "Wok-fired noodles tossed over a high flame",
  },
  {
    no: "04",
    title: "End on a cool note",
    body:
      "Glassy Salmon Maki, amber Thai iced tea, and a mountain of strawberry bingsu — the quiet after the fire.",
    img: IMAGES.courses[3],
    alt: "Fresh salmon maki rolls plated on dark slate",
  },
];

export const SIGNATURES = [
  {
    name: "Tom Yum",
    note: "Hot · sour · iconic",
    price: "₹220",
    desc: "Thailand's defining broth — bird's-eye chilli, lemongrass and lime in perfect tension.",
    img: IMAGES.signatures[0],
  },
  {
    name: "Chicken Wonton Soup",
    note: "Smoky · hand-wrapped",
    price: "₹240",
    desc: "A slow, smoky broth guests call unforgettable, ladled over wontons wrapped to order.",
    img: IMAGES.signatures[1],
  },
  {
    name: "Mountain Chilli Chicken",
    note: "Wok-charred · fiery",
    price: "₹340",
    desc: "Dried mountain chillies, screaming heat, real wok hei. Our most-ordered plate.",
    img: IMAGES.signatures[2],
  },
  {
    name: "Thai Green Curry",
    note: "Fresh-pounded · creamy",
    price: "₹360",
    desc: "Green curry paste pounded in-house, coconut cream, holy basil, bamboo shoots.",
    img: IMAGES.signatures[3],
  },
  {
    name: "Salmon Maki",
    note: "Glassy · precise",
    price: "₹420",
    desc: "Praised by travelling guests as among the best they've had — anywhere.",
    img: IMAGES.signatures[4],
  },
  {
    name: "Strawberry Bingsu",
    note: "Shaved ice · sweet finish",
    price: "₹360",
    desc: "Feather-light shaved ice under ripe strawberries and cream. Built to share.",
    img: IMAGES.signatures[5],
  },
];

export const GALLERY = [
  { img: IMAGES.gallery[0], cap: "The lantern room", tag: "interiors" },
  { img: IMAGES.gallery[1], cap: "Table for two", tag: "evenings" },
  { img: IMAGES.gallery[2], cap: "Golden hour service", tag: "interiors" },
  { img: IMAGES.gallery[3], cap: "The long hall", tag: "interiors" },
  { img: IMAGES.gallery[4], cap: "From the pass", tag: "kitchen" },
  { img: IMAGES.gallery[5], cap: "Colour study", tag: "plates" },
  { img: IMAGES.gallery[6], cap: "Last orders", tag: "evenings" },
];

export const REVIEWS = [
  {
    q: "Best Asian cuisine in Kochi. Really nice ambience and friendly service.",
    who: "Dining guest",
    src: "Google Reviews",
  },
  {
    q: "The Salmon Maki was easily one of the best I have had globally — an acute combination of flavours.",
    who: "Travelling foodie",
    src: "Restaurant Guru",
  },
  {
    q: "The smoky flavours of the Chicken Wonton Soup proved the chef knows his game, spot on.",
    who: "Asian-cuisine devotee",
    src: "Guest review",
  },
  {
    q: "The dim sum, the bao and the crab are the reason we keep coming back. Portions are generous, too.",
    who: "Regular table",
    src: "Zomato",
  },
  {
    q: "Mountain Chilli Chicken was great, and the Lotus Stem Chilli Plum was something different — in the best way.",
    who: "First-time visitor",
    src: "Guest review",
  },
];

export const FAQ = [
  {
    q: "Do I need a reservation?",
    a: "Walk-ins are welcome through the day. For weekend evenings and groups of six or more, we recommend calling ahead on +91 80750 92609 — we'll hold the corner by the mural for you.",
  },
  {
    q: "Is the food very spicy?",
    a: "Only if you want it to be. Every wok dish and curry can be calibrated from gentle to full Bangkok street-heat — just tell your server how brave you're feeling.",
  },
  {
    q: "Are there vegetarian options?",
    a: "Yes — wild mushroom dumplings, veg Tom Yum and Tom Kha, cottage cheese baos, lotus stem chilli plum and a full set of vegetable wok dishes and fried rice.",
  },
  {
    q: "What does dinner for two cost?",
    a: "Around ₹800 for two, or roughly ₹600 to ₹1,000 a head if you order across courses. Dim sum starts near ₹230 and signature mains sit between ₹290 and ₹420.",
  },
  {
    q: "What should I order on a first visit?",
    a: "Start with chicken satay or the crab lollipop, take the steamer basket of dim sum and a bao, then a chicken pad thai or the Mountain Chilli Chicken. Finish with mango sticky rice and a Thai iced tea — that run covers everything the kitchen does best.",
  },
  {
    q: "What is Thai SELECT?",
    a: "It's the certification Thailand's Ministry of Commerce awards to restaurants abroad that serve genuine Thai cuisine — real pastes, real techniques, no shortcuts. We carry it, and we cook to it every service.",
  },
  {
    q: "Where exactly are you?",
    a: "54/1285, MP Pylee Road, Kadavanthra, Kochi — a short walk from the Shiva temple, with parking on the road. Open every day, 11:30 AM to 11 PM.",
  },
];

/* Single source of truth for every in-page nav surface — the navbar,
   the right-edge rail and the footer all read this list, so a section
   can never be linked to unless it is actually rendered on the page. */
export const NAV_LINKS = [
  ["Philosophy", "philosophy"],
  ["Signatures", "signatures"],
  ["Gallery", "gallery"],
  ["Chef", "chef"],
  ["Visit", "visit"],
] as const;

/* ─── Famous signature dishes (from guest reviews & menu) ──────────
   Photography uses curated Unsplash food shots that match each dish;
   swap any `img` for the restaurant's own plating photos.          */
export const FAMOUS_DISHES = [
  {
    n: "01",
    name: "Salmon Maki",
    th: "ซาลมอนมากิ",
    tag: "Sushi",
    spice: 0,
    note: "Guest-crowned “one of the best, globally.”",
    desc:
      "Glassy fresh salmon rolled over seasoned rice — wasabi, pickled ginger and a light soy dip elevating every bite. The plate that floored our regulars.",
    img: u("photo-1579871494447-9811cf80d66c", 1100),
    alt: "Fresh salmon maki sushi rolls plated on dark slate at Café de Bangkok",
  },
  {
    n: "02",
    name: "Chicken Wonton Soup",
    th: "เกี๊ยวน้ำ",
    tag: "Soup",
    spice: 1,
    note: "Authentic, smoky, slow-built broth.",
    desc:
      "Hand-wrapped wontons in a deeply smoky broth — the bowl that proves Chef Kuan Lai knows his game, spot on.",
    img: u("photo-1569718212165-3a8278d5f624", 1100),
    alt: "Steaming bowl of chicken wonton soup with herbs",
  },
  {
    n: "03",
    name: "Mountain Chilli Chicken",
    th: "ไก่พริกเขา",
    tag: "Wok",
    spice: 3,
    note: "Wok-charred, fiery, most-ordered.",
    desc:
      "Chicken seared with dried mountain chillies over a living flame — smoky, bold and unapologetically hot. Our signature wok plate.",
    img: u("photo-1585032226651-759b368d7246", 1100),
    alt: "Wok-fired mountain chilli chicken with dried red chillies",
  },
  {
    n: "04",
    name: "Lotus Stem Chilli Plum",
    th: "รากบัวพลัม",
    tag: "Wok · Veg",
    spice: 2,
    note: "Something different — sweet meets savoury.",
    desc:
      "Crisp lotus stem glazed in a glossy chilli-plum sauce. The sweet-savoury hit our guests call the most original thing on the menu.",
    img: u("photo-1541696490-8744a5dc0228", 1100),
    alt: "Glazed lotus stem stir fry in chilli plum sauce",
  },
  {
    n: "05",
    name: "Chicken Sui Mai",
    th: "ขนมจีบ",
    tag: "Dim Sum",
    spice: 0,
    note: "Folded by hand, steamed to order.",
    desc:
      "Open-topped dumplings pleated through the afternoon and steamed to order — the dim-sum basket that stands on par with the very best.",
    img: u("photo-1496116218417-1a781b1c416c", 1100),
    alt: "Hand-folded chicken sui mai dumplings in a bamboo steamer",
  },
  {
    n: "06",
    name: "Pad Thai (Prawns)",
    th: "ผัดไทยกุ้ง",
    tag: "Noodles",
    spice: 1,
    note: "The Bangkok street classic.",
    desc:
      "Wok-tossed rice noodles with plump prawns, tamarind, peanut and lime — bright, balanced and brought to life the traditional way.",
    img: u("photo-1559314809-0d155014e29e", 1100),
    alt: "Prawn pad thai noodles with lime and peanuts",
  },
] as const;

/* ─── Signature "story chapters" — narrative storytelling content ──
   Each chapter tells the story behind a signature: an origin line,
   the journey of the dish, its key elements, and a guest's words.
   Photography uses curated Unsplash shots; swap for real plating.  */
export const STORY_CHAPTERS = [
  {
    n: "I",
    eyebrow: "Where the menu begins",
    name: "Tom Yum",
    th: "ต้มยำ",
    origin: "Central Thailand · a riverside broth",
    story:
      "It starts, as every Thai table does, with a bowl of fire and citrus. Lemongrass bruised by hand, galangal sliced thin, kaffir lime torn at the last second — our Tom Yum is built in layers until the steam itself smells of Bangkok.",
    elements: ["Lemongrass", "Galangal", "Kaffir lime", "Bird's-eye chilli"],
    quote: "The broth that wakes the whole table up.",
    price: "₹220",
    img: IMAGES.signatures[0],
    alt: "Steaming Tom Yum broth with lemongrass and chilli at Café de Bangkok",
  },
  {
    n: "II",
    eyebrow: "The slow art",
    name: "Chicken Wonton Soup",
    th: "เกี๊ยวน้ำ",
    origin: "A bowl built over hours, not minutes",
    story:
      "Wontons folded to order drop into a broth we coax for hours until it turns smoky and deep. It was this bowl that made one travelling critic write that Chef Kuan Lai 'knew his game, spot on.'",
    elements: ["Hand-wrapped wontons", "Smoked broth", "Spring onion", "White pepper"],
    quote: "Authentic, smoky — proof the chef knows his game.",
    price: "₹240",
    img: IMAGES.signatures[1],
    alt: "Bowl of smoky chicken wonton soup with hand-wrapped dumplings",
  },
  {
    n: "III",
    eyebrow: "Meeting the flame",
    name: "Mountain Chilli Chicken",
    th: "ไก่พริกเขา",
    origin: "Born over a screaming wok",
    story:
      "Chicken hits a wok hot enough to char, tossed with dried mountain chillies until it carries real wok hei — that elusive breath of fire. It leaves the pass smoky, fierce, and our single most-ordered plate.",
    elements: ["Dried mountain chilli", "Wok hei", "Garlic", "Holy basil"],
    quote: "Smoky, fiery, unforgettable — order it once and you'll repeat it.",
    price: "₹340",
    img: IMAGES.signatures[2],
    alt: "Wok-charred mountain chilli chicken with dried red chillies",
  },
  {
    n: "IV",
    eyebrow: "Something different",
    name: "Lotus Stem Chilli Plum",
    th: "รากบัวพลัม",
    origin: "The dish guests never expect",
    story:
      "Crisp lotus stem glazed in a glossy chilli-plum sauce — sweet meeting savoury in a way our guests call the most original thing on the table. The plate that proves vegetables can steal the show.",
    elements: ["Lotus stem", "Chilli plum glaze", "Toasted sesame", "Scallion"],
    quote: "Something different on offer — the sweet-savoury hits the spot.",
    price: "₹320",
    img: IMAGES.signatures[3],
    alt: "Glazed crisp lotus stem in chilli plum sauce",
  },
  {
    n: "V",
    eyebrow: "Quiet precision",
    name: "Salmon Maki",
    th: "ซาลมอนมากิ",
    origin: "A roll judged against the world",
    story:
      "Glassy salmon laid over seasoned rice, finished with wasabi, pickled ginger and a whisper of soy. One well-travelled guest called it, simply, 'one of the best I've had — globally.' We've never stopped chasing that bar.",
    elements: ["Fresh salmon", "Seasoned rice", "Wasabi", "Pickled ginger"],
    quote: "Easily one of the best I've had, globally.",
    price: "₹420",
    img: IMAGES.signatures[4],
    alt: "Fresh salmon maki rolls plated on dark slate",
  },
  {
    n: "VI",
    eyebrow: "How it ends",
    name: "Strawberry Bingsu",
    th: "บิงซู",
    origin: "The sweet, shared full stop",
    story:
      "Every story needs an ending. Ours is a mountain of feather-light shaved ice under ripe strawberries and cream — built for two spoons, meant to be shared, the calm after all that fire.",
    elements: ["Shaved milk ice", "Strawberries", "Sweet cream", "Condensed milk"],
    quote: "So nice and sweet — the perfect way to finish.",
    price: "₹360",
    img: IMAGES.signatures[5],
    alt: "Strawberry bingsu shaved ice dessert with cream",
  },
] as const;

/* ─── Philosophy content (Manifesto section) ─────────────────────── */
export const PHILOSOPHY = {
  eyebrow: "Our Philosophy",
  signature: "ไม่มีการประนีประนอม", // "no compromise"
  signatureEn: "No compromise",
  manifesto:
    "We don't soften Thailand for anyone. The broth keeps its lemongrass, the wok keeps its fire, and every plate leaves the pass the way a street corner in Bangkok intended — loud, layered, and completely alive.",
  hotWords: ["lemongrass,", "fire,", "Bangkok", "alive."],
  /* the four-step ritual every dish passes through */
  ritual: [
    { t: "Pound", th: "ตำ", body: "Curry pastes crushed by stone and arm each morning — lemongrass, galangal, chilli, root by root.", img: u("photo-1596040033229-a9821ebd058d", 1100) },
    { t: "Fire", th: "ไฟ", body: "The wok meets a flame hot enough to char, chasing that elusive breath of smoke — wok hei.", img: u("photo-1585032226651-759b368d7246", 1100) },
    { t: "Fold", th: "พับ", body: "Dim sum pleated through the afternoon, each one closed by hand, steamed only when you ask.", img: u("photo-1496116218417-1a781b1c416c", 1100) },
    { t: "Serve", th: "เสิร์ฟ", body: "Plated the second it's ready and carried straight to you — never held, never dulled.", img: u("photo-1559314809-0d155014e29e", 1100) },
  ],
  /* editorial imagery for the redesign */
  heroImg: u("photo-1552566626-52f8b828add9", 1500),     // moody dining room
  proofImg: u("photo-1517248135467-4c7edcad34c4", 1100), // warm table scene
  pillarImg: u("photo-1455619452474-d2be8b1e70cd", 1100), // chef hands / craft
  /* decorative marquee — Thai + English craft words */
  marquee: [
    "เผ็ด · Spice", "ไฟ · Fire", "สด · Fresh", "ตำ · Pounded",
    "หอม · Aromatic", "Wok Hei", "Folded by hand", "Thai SELECT", "No compromise",
  ],
  pullQuote: {
    text: "Flavour first. Always.",
    by: "Chef Kuan Lai",
  },
  pillars: [
    {
      k: "01",
      title: "Pounded, not poured",
      body: "Curry pastes are stone-pounded in-house each morning — never spooned from a jar.",
    },
    {
      k: "02",
      title: "Wok hei or nothing",
      body: "Every stir-fry meets a flame hot enough to char, sealing in that breath of smoke.",
    },
    {
      k: "03",
      title: "Folded to order",
      body: "Dim sum is pleated through the afternoon and steamed only when you ask for it.",
    },
  ],
  stats: [
    { b: "Thai SELECT", s: "Certified by Thailand's Ministry of Commerce" },
    { b: "11:30—23:00", s: "Open every single day" },
    { b: "₹800", s: "Average dinner for two" },
    { b: "4.5★", s: "Across 2,900+ reviews" },
  ],
} as const;

/* ─── Gallery — enriched captions for the storytelling rail ──────── */
export const GALLERY_RICH = [
  { img: IMAGES.gallery[0], cap: "The lantern room", tag: "Interiors", note: "Woven shades throwing warm light across the long table." },
  { img: IMAGES.gallery[1], cap: "Table for two", tag: "Evenings", note: "The corner by the mural — our most-requested seat." },
  { img: IMAGES.gallery[2], cap: "Golden hour", tag: "Interiors", note: "When the room turns amber and the service finds its rhythm." },
  { img: IMAGES.gallery[3], cap: "The long hall", tag: "Interiors", note: "Room to gather, built for the big celebrations." },
  { img: IMAGES.gallery[4], cap: "From the pass", tag: "Kitchen", note: "Where Chef Kuan Lai sends every plate out, twice-checked." },
  { img: IMAGES.gallery[5], cap: "Colour study", tag: "Plates", note: "Chilli red, lime green, turmeric gold — Thailand on ceramic." },
  { img: IMAGES.gallery[6], cap: "Last orders", tag: "Evenings", note: "The slow, golden wind-down toward 11pm." },
] as const;

/* ─── Gallery — bento mosaic + lightbox dataset ───────────────────
   `span` drives the bento tile size: "f"=2x2 feature, "w"=2x1 wide,
   "t"=1x2 tall, ""=1x1. `tag` powers the filter chips.            */
export const GALLERY_GRID = [
  { img: u("photo-1552566626-52f8b828add9", 1400), cap: "The lantern room", tag: "Interiors", note: "Woven shades throwing warm light across the long table.", span: "f" },
  { img: u("photo-1585032226651-759b368d7246", 1300), cap: "Living flame", tag: "Kitchen", note: "Wok hei you can taste — charred, smoky, unmistakably Thai.", span: "w" },
  { img: u("photo-1579871494447-9811cf80d66c", 1100), cap: "Quiet precision", tag: "Plates", note: "Glassy salmon maki, judged against the best in the world.", span: "" },
  { img: u("photo-1496116218417-1a781b1c416c", 1100), cap: "Folded to order", tag: "Plates", note: "Dim sum pleated through the afternoon, steamed on request.", span: "" },
  { img: u("photo-1517248135467-4c7edcad34c4", 1200), cap: "Table for two", tag: "Evenings", note: "The corner by the mural — our most-requested seat.", span: "t" },
  { img: u("photo-1559314809-0d155014e29e", 1100), cap: "Bangkok street", tag: "Plates", note: "Pad thai brought to life the traditional way.", span: "" },
  { img: u("photo-1414235077428-338989a2e8c0", 1300), cap: "The long hall", tag: "Interiors", note: "Room to gather, built for the big celebrations.", span: "w" },
  { img: u("photo-1551024506-0bccd828d307", 1100), cap: "The sweet finish", tag: "Plates", note: "A mountain of strawberry bingsu, built to share.", span: "" },
  { img: u("photo-1559339352-11d035aa65de", 1100), cap: "Golden hour", tag: "Evenings", note: "When the room turns amber and service finds its rhythm.", span: "" },
] as const;