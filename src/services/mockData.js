import { getDemoUsers } from "./demoUsers";
import { hasPermission } from "./permissions";

export const DEMO_STORAGE_KEYS = {
  users: "demo_users",
  events: "demo_events",
  bookings: "demo_bookings",
  tickets: "demo_tickets",
  payments: "demo_payments",
  marketplaceOrders: "demo_marketplace_orders",
  marketplaceListings: "demo_marketplace_listings",
  memories: "demo_memories",
  posts: "demo_posts",
  comments: "demo_comments",
  likes: "demo_likes",
  pricingPlans: "demo_pricing_plans",
  quoteRequests: "demo_quote_requests",
  withdrawals: "demo_withdrawals",
  vendorWallets: "demo_vendor_wallets",
  vendorTransactions: "demo_vendor_transactions",
  vendorReviews: "demo_vendor_reviews",
  vendorPortfolio: "demo_vendor_portfolio",
  vendorAdminActions: "demo_vendor_admin_actions",
  vendorInsights: "demo_vendor_insights",
  vendorGenieHistory: "demo_vendor_genie_history",
  walletTransactions: "demo_wallet_transactions",
  linkedAccounts: "demo_linked_accounts",
};

const createdAt = "2026-05-01T12:00:00.000Z";
const eventImages = {
  concert: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200",
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
  corporate: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
  cultural: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
  fashion: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200",
  dining: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
};

function qrFor(path, size = 180) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://invitegenie.local";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(origin + path)}`;
}

function safeParse(value, fallback = []) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readKey(key, fallback = []) {
  if (typeof localStorage === "undefined") return fallback;
  return safeParse(localStorage.getItem(key), fallback);
}

function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: value } }));
  return value;
}

export const MOCK_EVENTS = [
  event("evt-douala-afro", "Douala Afro Beats Festival", "Concerts", "Canal Olympia, Douala", "2026-06-12", "20:00", 15000, 1000, 720, eventImages.concert, "vendor-brice", "Pulse Entertainment", "A full night of Afrobeats, makossa, amapiano, food vendors, and premium event memories."),
  event("evt-buea-wedding", "Buea Wedding Gala Night", "Weddings", "Mountain Club, Buea", "2026-05-20", "18:00", 25000, 240, 168, eventImages.wedding, "planner-sandra", "Sandra Signature Events", "A refined wedding gala with traditional elegance, live music, and a premium guest experience."),
  event("evt-yaounde-leadership", "Yaounde Corporate Leadership Summit", "Corporate", "Hilton Hotel, Yaounde", "2026-05-28", "09:00", 50000, 420, 300, eventImages.corporate, "planner-mbarga", "CEMAC Forum", "A leadership summit for founders, executives, and teams building the next wave of African business."),
  event("evt-limbe-beach", "Limbe Beach Festival", "Concerts", "Down Beach, Limbe", "2026-07-04", "10:00", 10000, 600, 380, eventImages.beach, "host-1", "Oceanic Vibe", "A beachfront festival with food, DJs, games, and a sunset concert."),
  event("evt-bamenda-cultural", "Bamenda Cultural Night", "Cultural", "Congress Hall, Bamenda", "2026-05-24", "19:00", 8000, 350, 300, eventImages.cultural, "host-2", "Grassfields Heritage", "An evening celebrating music, food, fashion, and cultural storytelling from the North West."),
  event("evt-kribi-white", "Kribi White Party", "Concerts", "Lobe Falls, Kribi", "2026-08-15", "16:00", 30000, 260, 145, eventImages.beach, "host-3", "Pulse Entertainment", "A premium all-white beach party with private cabanas, DJs, and curated food experiences."),
  event("evt-mtn-innovation", "MTN Enterprise Innovation Dinner", "Corporate", "Bonanjo Business Club, Douala", "2026-06-20", "19:00", 75000, 180, 120, eventImages.dining, "enterprise-mtn", "MTN Cameroon", "A private enterprise dinner for partners, product leaders, and innovation teams."),
  event("evt-orange-gala", "Orange Cameroon Partner Gala", "Corporate", "Palais des Congres, Yaounde", "2026-07-18", "18:30", 70000, 220, 151, eventImages.dining, "enterprise-orange", "Orange Cameroon", "A partner appreciation gala with awards, entertainment, and executive networking."),
  event("evt-lagos-fashion", "Lagos Creative Fashion Expo", "Fashion", "Victoria Island, Lagos", "2026-08-22", "14:00", 75000, 150, 134, eventImages.fashion, "host-4", "West Africa Style", "A fashion and creator expo connecting designers, stylists, buyers, and media teams."),
  event("evt-accra-fusion", "Accra Afro-Fusion Concert", "Concerts", "Black Star Square, Accra", "2026-10-12", "20:00", 20000, 2000, 1550, eventImages.concert, "host-5", "Gold Coast Vibes", "A high-energy concert blending traditional rhythms with modern African sound."),
];

function event(id, title, category, location, date, time, price, totalTickets, ticketsSold, image, hostId, vendorName, description) {
  const availableTickets = Math.max(totalTickets - ticketsSold, 0);
  return {
    id,
    title,
    category,
    location,
    date,
    time,
    price,
    currency: "FCFA",
    status: "ACTIVE",
    image,
    coverImage: image,
    hostId,
    vendorId: hostId,
    vendorName,
    organizerName: vendorName,
    totalTickets,
    ticketsSold,
    availableTickets,
    revenue: ticketsSold * price,
    description,
    ticketOptions: [
      { type: "Standard", price, available: Math.max(availableTickets - 30, 0) },
      { type: "VIP", price: Math.round(price * 2.2), available: Math.min(80, availableTickets) },
      { type: "Early Bird", price: Math.max(Math.round(price * 0.75), 0), available: Math.min(40, availableTickets) },
    ],
    qrCodeUrl: qrFor(`/events/${id}`),
    createdAt,
    timestamp: new Date(date).getTime(),
  };
}

function listing(id, ownerId, businessName, title, type, category, location, price, image, tags, description, pro = false) {
  return {
    id,
    ownerId,
    userId: ownerId,
    sellerId: ownerId,
    businessName,
    name: businessName,
    title,
    type,
    category,
    location,
    price,
    startingPrice: price,
    currency: "FCFA",
    description,
    shortBio: description,
    image,
    coverImage: image,
    tags,
    services: tags,
    included: tags,
    packages: [
      { name: "Starter", description: `Essential ${category.toLowerCase()} support.`, price },
      { name: "Standard", description: `Most booked ${category.toLowerCase()} package.`, price: Math.round(price * 1.8) },
      { name: "Premium", description: `Priority ${category.toLowerCase()} package with extended coverage.`, price: Math.round(price * 2.8) },
    ],
    rating: pro ? 4.9 : 4.7,
    reviews: pro ? 128 : 64,
    reviewsList: [
      { userName: "Marie Ngalle", rating: 5, comment: "Reliable, polished, and easy to coordinate with.", date: "2026-04-12" },
      { userName: "Patrick Fotso", rating: 4.8, comment: "Delivered exactly what our event needed.", date: "2026-04-21" },
    ],
    completedJobs: pro ? 220 : 95,
    responseTime: type === "tasker" ? "30 min" : "1 hour",
    qrCodeUrl: qrFor(`/marketplace/${id}`, 200),
    status: "approved",
    verified: true,
    pro,
    createdAt,
    timestamp: Date.now(),
  };
}

export const MARKETPLACE_CATEGORIES = {
  eventServices: [
    "DJ",
    "Caterer",
    "Drink Supplier",
    "Decorator",
    "Photographer",
    "Videographer",
    "Security",
    "Usher",
    "Makeup Artist",
    "Venue",
  ],
  taskerServices: [
    "Errand Runner",
    "Delivery Service",
    "Supermarket Shopper",
    "Tasker",
  ],
};

export const MOCK_PROVIDERS = [
  listing("list-dj-brice", "vendor-brice", "DJ Brice Mix", "Afrobeat and Makossa DJ Package", "service", "DJ", "Douala", 85000, "https://images.unsplash.com/photo-1571266028243-d220c9c7f819?auto=format&fit=crop&q=80&w=900", ["Afrobeats", "Wedding DJ", "Sound setup"], "High-energy DJ sets for weddings, concerts, and corporate activations.", true),
  listing("list-awa-catering", "vendor-awa", "Mama Awa Catering", "Cameroonian Buffet Catering", "service", "Caterer", "Yaounde", 150000, "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=900", ["Ndole", "Buffet", "Cocktail bites"], "Traditional and modern Cameroonian menus for weddings and galas.", true),
  listing("list-freshsip", "vendor-1", "FreshSip Drinks Supply", "Event Drinks and Ice Delivery", "product", "Drink Supplier", "Buea", 60000, "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=900", ["Drinks", "Ice", "Bar stock"], "Soft drinks, wine, water, ice, and emergency bar restock.", false),
  listing("list-prestige-decor", "vendor-2", "Prestige Decor CM", "Luxury Stage and Floral Decor", "service", "Decorator", "Douala", 200000, "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=900", ["Stage decor", "Flowers", "Table styling"], "Elegant event styling for weddings, summits, and private dinners.", true),
  listing("list-lensking", "vendor-3", "LensKing Studios", "Event Photography Coverage", "service", "Photographer", "Limbe", 120000, "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=900", ["Event photos", "Portrait booth", "Fast edits"], "Professional event photography with same-week online galleries.", false),
  listing("list-fako-motion", "vendor-4", "Fako Motion Films", "Cinematic Event Videography", "service", "Videographer", "Buea", 160000, "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=900", ["Highlight reel", "Livestream", "Full film"], "Cinematic videos, reels, and livestream support.", false),
  listing("list-market-run", "tasker-emmanuel", "MarketRun Cameroon", "Supermarket Shopping Support", "task", "Supermarket Shopper", "Yaounde", 10000, "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=900", ["Groceries", "Party supplies", "Receipts"], "Fast grocery and event supply shopping with receipt tracking.", false),
  listing("list-quickcourier", "tasker-clarisse", "QuickCourier CM", "Pickup and Delivery Service", "task", "Delivery Service", "Douala", 7000, "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=900", ["Pickup", "Delivery", "Errands"], "Same-day pickup, delivery, and errand support for events.", false),
  listing("list-elite-guard", "vendor-5", "Elite Guard Security", "Event Security Team", "service", "Security", "Yaounde", 90000, "https://images.unsplash.com/photo-1588611911583-617b905ffb18?auto=format&fit=crop&q=80&w=900", ["Gate control", "VIP escort", "Crowd safety"], "Trained security teams for entry, crowd management, and VIP movement.", false),
  listing("list-luxe-venues", "vendor-6", "Luxe Venues Douala", "Premium Venue Booking", "service", "Venue", "Douala", 300000, "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=900", ["Hall", "Garden", "Rooftop"], "Curated halls, gardens, rooftops, and private venues.", true),
  listing("list-glam-fanta", "vendor-awa", "Glam Fanta MUA", "Bridal and Guest Makeup", "service", "Makeup Artist", "Yaounde", 45000, "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=900", ["Soft glam", "Bridal", "Touchups"], "On-location makeup for brides, guests, and photoshoots.", true),
  listing("list-ushers-plus", "vendor-brice", "Ushers Plus CM", "Protocol Ushers and Guest Welcome", "service", "Usher", "Yaounde", 50000, "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=900", ["Registration", "Guest welcome", "Protocol"], "Trained ushers for reception, registration, and guest guidance.", false),
];

export const MOCK_BOOKINGS = [];
export const MOCK_PAYMENTS = [];
export const MOCK_MEMORIES = [];
export const MOCK_INVOICES = [
  { id: "INV-2026-001", amount: 250000, status: "Paid", date: "2026-04-15", event: "Buea Wedding Gala Night", dueDate: "2026-04-20" },
  { id: "INV-2026-002", amount: 180000, status: "Pending", date: "2026-04-22", event: "Douala Afro Beats Festival", dueDate: "2026-04-28" },
];
export const MOCK_GUESTS = [
  { id: 1, name: "Marie Ngalle", email: "marie.user@invitegenie.cm", phone: "+237 6 70 11 22 33", status: "Confirmed", rsvp: "Yes", event: "Douala Afro Beats Festival" },
  { id: 2, name: "Patrick Fotso", email: "patrick.pro@invitegenie.cm", phone: "+237 6 73 44 55 66", status: "Confirmed", rsvp: "Yes", event: "Buea Wedding Gala Night" },
];
export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Ticket confirmed", message: "Your InviteGenie demo ticket is ready.", time: "Today", read: false, type: "ticket" },
  { id: 2, title: "Marketplace order", message: "A vendor quote request is waiting.", time: "Yesterday", read: true, type: "marketplace" },
];
export const MOCK_INBOX = [
  { id: 1, from: "InviteGenie Support", subject: "Welcome", message: "Your demo account is ready.", time: "Today", read: false },
];
export const MOCK_CALENDAR = MOCK_EVENTS.map((item) => ({ id: item.id, date: item.date, title: item.title, time: item.time, location: item.location, type: "event" }));
export const MOCK_ANALYTICS = { totalInvites: 2145, rsvpRate: 78.5, guestAttendance: 1689, lastUpdated: createdAt };
export const MOCK_TEMPLATES = [
  { id: "t1", category: "Wedding", name: "Royal Gold", preview: eventImages.wedding },
  { id: "t2", category: "Corporate", name: "Executive Dinner", preview: eventImages.dining },
  { id: "t3", category: "Concert", name: "Afro Beats", preview: eventImages.concert },
  { id: "t4", category: "Cultural", name: "Grassfields Night", preview: eventImages.cultural },
];

function generateRoleOwnedEvents(users) {
  const existingOwnerIds = new Set(MOCK_EVENTS.map((item) => String(item.hostId)));
  return users
    .filter((user) => hasPermission(user, "create_event") && !existingOwnerIds.has(String(user.id)))
    .map((user, index) =>
      event(
        `evt-${user.id}`,
        `${user.full_name.split(" ")[0]} Signature Event`,
        index % 2 ? "Corporate" : "Weddings",
        `${user.city}, ${user.country}`,
        `2026-09-${String(10 + (index % 15)).padStart(2, "0")}`,
        "18:00",
        index % 2 ? 45000 : 20000,
        180,
        32 + index,
        index % 2 ? eventImages.corporate : eventImages.wedding,
        user.id,
        user.full_name,
        `A demo event owned by ${user.full_name} for role-based event management.`
      )
    );
}

function generateRoleOwnedListings(users) {
  const existingOwnerIds = new Set(MOCK_PROVIDERS.map((item) => String(item.ownerId)));
  return users
    .filter((user) => hasPermission(user, "create_marketplace_listing") && !existingOwnerIds.has(String(user.id)))
    .map((user, index) =>
      listing(
        `list-${user.id}`,
        user.id,
        `${user.full_name.split(" ")[0]} Services`,
        index % 2 ? "Event Errand Support" : "Event Vendor Package",
        user.role === "tasker" ? "task" : "service",
        user.role === "tasker" ? "Errand Runner" : "Decorator",
        user.city,
        user.role === "tasker" ? 12000 : 85000,
        user.role === "tasker"
          ? "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=900"
          : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=900",
        user.role === "tasker" ? ["Errands", "Delivery", "Setup"] : ["Decor", "Setup", "Event support"],
        `A demo marketplace listing owned by ${user.full_name}.`,
        user.accountType?.includes("Pro")
      )
    );
}

function generateAttendance(users, events) {
  return users.map((user, index) => {
    const eventItem = events[index % events.length];
    const ticketType = index % 3 === 0 ? "VIP" : index % 3 === 1 ? "Early Bird" : "Standard";
    const option = eventItem.ticketOptions.find((item) => item.type === ticketType) || eventItem.ticketOptions[0];
    const ticketId = `TKT-DEMO-${user.id}`;
    const bookingId = `BKG-DEMO-${user.id}`;
    const amount = option.price;
    return {
      eventItem,
      ticket: {
        id: ticketId,
        bookingId,
        userId: user.id,
        eventId: eventItem.id,
        buyerName: user.full_name,
        eventName: eventItem.title,
        ticketType,
        type: ticketType,
        quantity: 1,
        amount,
        price: amount,
        status: "valid",
        qrCodeUrl: qrFor(`/bookings/${bookingId}/voucher`),
        qrValue: `${ticketId}:${user.id}:${eventItem.id}`,
        createdAt,
        timestamp: Date.now() - index * 3600000,
      },
      booking: {
        id: bookingId,
        userId: user.id,
        eventId: eventItem.id,
        ticketId,
        amount,
        quantity: 1,
        status: "confirmed",
        paymentMethod: index % 2 ? "Orange Money" : "MTN Mobile Money",
        buyerName: user.full_name,
        eventName: eventItem.title,
        createdAt,
        timestamp: Date.now() - index * 3600000,
      },
      payment: {
        id: `PAY-DEMO-${user.id}`,
        userId: user.id,
        eventId: eventItem.id,
        bookingId,
        amount,
        currency: "FCFA",
        status: "completed",
        method: index % 2 ? "Orange Money" : "MTN Mobile Money",
        createdAt,
        timestamp: Date.now() - index * 3600000,
      },
    };
  });
}

function generateMemories(users, attendance) {
  const captions = [
    "The energy at this event was unforgettable.",
    "A beautiful InviteGenie moment with friends and family.",
    "Still thinking about the music, food, and the crowd.",
    "Premium event memories, exactly how it should feel.",
  ];
  return users.map((user, index) => {
    const { eventItem } = attendance[index];
    const likes = users.slice(0, (index % 5) + 1).map((likedBy) => likedBy.id);
    return {
      id: `mem-${user.id}`,
      userId: user.id,
      userName: user.full_name,
      userAvatar: user.avatar,
      eventId: eventItem.id,
      eventName: eventItem.title,
      image: `${eventItem.image}&sat=-10&crop=faces`,
      caption: captions[index % captions.length],
      likes,
      commentsCount: index % 4,
      shares: index % 3,
      status: "published",
      createdAt: new Date(Date.now() - index * 2700000).toISOString(),
      timestamp: Date.now() - index * 2700000,
    };
  });
}

function generatePosts(users, events) {
  return users.map((user, index) => {
    const eventItem = events[index % events.length];
    return {
      id: `post-${user.id}`,
      userId: user.id,
      userName: user.full_name,
      userAvatar: user.avatar,
      eventId: eventItem.id,
      postType: "user_post",
      content: `${user.full_name.split(" ")[0]} is exploring ${eventItem.title} on InviteGenie.`,
      media: eventItem.image,
      likes: [],
      commentsCount: 0,
      shares: 0,
      createdAt: new Date(Date.now() - index * 4200000).toISOString(),
      timestamp: Date.now() - index * 4200000,
    };
  });
}

function generateComments(users, memories) {
  return memories.slice(0, 18).map((memory, index) => {
    const user = users[(index + 2) % users.length];
    return {
      id: `comment-${memory.id}`,
      memoryId: memory.id,
      userId: user.id,
      userName: user.full_name,
      userAvatar: user.avatar,
      text: index % 2 ? "This moment belongs in the event highlights." : "Such a clean memory from that event.",
      createdAt: new Date(Date.now() - index * 1800000).toISOString(),
      timestamp: Date.now() - index * 1800000,
    };
  });
}

function generateLikes(memories) {
  return memories.flatMap((memory) =>
    (memory.likes || []).map((userId) => ({
      id: `like-${memory.id}-${userId}`,
      memoryId: memory.id,
      userId,
      createdAt,
    }))
  );
}

function syncLegacyKeys({ events, tickets, payments, memories, listings, posts, comments }) {
  const legacy = [
    ["ig_events", events],
    ["invitegenie_events", events],
    ["ig_tickets", tickets],
    ["invitegenie_bookings", tickets],
    ["ig_payments", payments],
    ["ig_memories", memories],
    ["invitegenie_memories", memories],
    ["ig_freelancers", listings],
    ["ig_posts", posts],
    ["ig_comments", comments],
  ];
  legacy.forEach(([key, value]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
  });
}

export function ensureDemoData() {
  if (typeof localStorage === "undefined") {
    return {
      users: getDemoUsers(),
      events: MOCK_EVENTS,
      listings: MOCK_PROVIDERS,
      bookings: [],
      tickets: [],
      payments: [],
      memories: [],
      posts: [],
      comments: [],
      likes: [],
    };
  }

  const users = getDemoUsers();
  const seededEvents = [...MOCK_EVENTS, ...generateRoleOwnedEvents(users)];
  const events = localStorage.getItem(DEMO_STORAGE_KEYS.events) ? readKey(DEMO_STORAGE_KEYS.events) : writeKey(DEMO_STORAGE_KEYS.events, seededEvents);
  const seededListings = [...MOCK_PROVIDERS, ...generateRoleOwnedListings(users)];
  const listings = localStorage.getItem(DEMO_STORAGE_KEYS.marketplaceListings)
    ? readKey(DEMO_STORAGE_KEYS.marketplaceListings)
    : writeKey(DEMO_STORAGE_KEYS.marketplaceListings, seededListings);

  let tickets = readKey(DEMO_STORAGE_KEYS.tickets);
  let bookings = readKey(DEMO_STORAGE_KEYS.bookings);
  let payments = readKey(DEMO_STORAGE_KEYS.payments);
  let memories = readKey(DEMO_STORAGE_KEYS.memories);
  let posts = readKey(DEMO_STORAGE_KEYS.posts);
  let comments = readKey(DEMO_STORAGE_KEYS.comments);
  let likes = readKey(DEMO_STORAGE_KEYS.likes);

  if (!tickets.length || !bookings.length || !payments.length) {
    const attendance = generateAttendance(users, events);
    tickets = attendance.map((item) => item.ticket);
    bookings = attendance.map((item) => item.booking);
    payments = attendance.map((item) => item.payment);
    writeKey(DEMO_STORAGE_KEYS.tickets, tickets);
    writeKey(DEMO_STORAGE_KEYS.bookings, bookings);
    writeKey(DEMO_STORAGE_KEYS.payments, payments);
  }

  if (!memories.length) {
    const attendance = generateAttendance(users, events);
    memories = generateMemories(users, attendance);
    writeKey(DEMO_STORAGE_KEYS.memories, memories);
  }

  if (!posts.length) {
    posts = generatePosts(users, events);
    writeKey(DEMO_STORAGE_KEYS.posts, posts);
  }

  if (!comments.length) {
    comments = generateComments(users, memories);
    writeKey(DEMO_STORAGE_KEYS.comments, comments);
  }

  if (!likes.length) {
    likes = generateLikes(memories);
    writeKey(DEMO_STORAGE_KEYS.likes, likes);
  }

  if (!localStorage.getItem(DEMO_STORAGE_KEYS.marketplaceOrders)) writeKey(DEMO_STORAGE_KEYS.marketplaceOrders, []);
  if (!localStorage.getItem(DEMO_STORAGE_KEYS.quoteRequests)) writeKey(DEMO_STORAGE_KEYS.quoteRequests, []);

  syncLegacyKeys({ events, tickets, payments, memories, listings, posts, comments });
  return { users, events, listings, bookings, tickets, payments, memories, posts, comments, likes };
}

export function getEvents() {
  return ensureDemoData().events;
}

export function getEventById(id) {
  return getEvents().find((item) => String(item.id) === String(id));
}

export function saveEvents(events) {
  writeKey(DEMO_STORAGE_KEYS.events, events);
  writeKey("ig_events", events);
  writeKey("invitegenie_events", events);
  return events;
}

export function updateEvent(updatedEvent) {
  const events = getEvents().map((item) => (String(item.id) === String(updatedEvent.id) ? updatedEvent : item));
  saveEvents(events);
  return updatedEvent;
}

export function saveEvent(eventData) {
  const nextEvent = {
    id: `evt-${Date.now()}`,
    status: "ACTIVE",
    currency: "FCFA",
    totalTickets: 100,
    ticketsSold: 0,
    availableTickets: 100,
    qrCodeUrl: qrFor(`/events/evt-${Date.now()}`),
    createdAt: new Date().toISOString(),
    ...eventData,
  };
  saveEvents([nextEvent, ...getEvents()]);
  return nextEvent;
}

export function getMarketplaceProviders() {
  return ensureDemoData().listings;
}

export function saveMarketplaceListings(listings) {
  writeKey(DEMO_STORAGE_KEYS.marketplaceListings, listings);
  writeKey("ig_freelancers", listings);
  return listings;
}

export function saveMarketplaceListing(listingData) {
  const listingItem = {
    id: listingData.id || `list-${Date.now()}`,
    currency: "FCFA",
    status: "pending",
    rating: 0,
    reviews: 0,
    completedJobs: 0,
    qrCodeUrl: qrFor(`/marketplace/${listingData.id || `list-${Date.now()}`}`, 200),
    createdAt: new Date().toISOString(),
    ...listingData,
  };
  saveMarketplaceListings([listingItem, ...getMarketplaceProviders()]);
  return listingItem;
}

export function saveMarketplaceListingDraft(listing) {
  return saveMarketplaceListing({ ...listing, status: "draft" });
}

export function getProviderById(providerId) {
  return getMarketplaceProviders().find((item) => String(item.id) === String(providerId));
}

export function addProviderRequest(request) {
  ensureDemoData();
  const existing = readKey(DEMO_STORAGE_KEYS.quoteRequests);
  const newRequest = {
    id: `REQ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "submitted",
    ...request,
  };
  writeKey(DEMO_STORAGE_KEYS.quoteRequests, [newRequest, ...existing]);
  return newRequest;
}

export function getQuoteRequests() {
  ensureDemoData();
  return readKey(DEMO_STORAGE_KEYS.quoteRequests);
}

export function recommendProviders({ query = "", category = "", location = "", budget = "" } = {}) {
  const words = `${query} ${category}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const normalizedLocation = location.toLowerCase();
  const numericBudget = Number(String(budget).replace(/[^0-9]/g, ""));
  return getMarketplaceProviders()
    .map((provider) => {
      const haystack = [provider.businessName, provider.name, provider.title, provider.category, provider.location, provider.description, ...(provider.tags || [])]
        .join(" ")
        .toLowerCase();
      const wordScore = words.reduce((score, word) => score + (haystack.includes(word) ? 8 : 0), 0);
      const locationScore = normalizedLocation && provider.location.toLowerCase().includes(normalizedLocation) ? 18 : 0;
      const budgetScore = numericBudget ? (Number(provider.price || provider.startingPrice) <= numericBudget ? 12 : -8) : 0;
      return { ...provider, matchScore: wordScore + locationScore + budgetScore + Number(provider.rating || 0) * 3 };
    })
    .filter((provider) => provider.matchScore > 8)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

export function getListingQrCodeUrl(id) {
  return qrFor(`/marketplace/${id}`, 200);
}

export function getBookings() {
  return ensureDemoData().bookings;
}

export function getBookingById(id) {
  return getBookings().find((booking) => String(booking.id) === String(id));
}

export function addBooking(booking) {
  const newBooking = { id: booking.id || `BKG-${Date.now()}`, createdAt: new Date().toISOString(), ...booking };
  writeKey(DEMO_STORAGE_KEYS.bookings, [newBooking, ...getBookings()]);
  return newBooking;
}

export function getTickets() {
  return ensureDemoData().tickets;
}

export function getPayments() {
  return ensureDemoData().payments;
}

export function getMemories() {
  return ensureDemoData().memories;
}

export function getMemoriesByEventId(eventId) {
  return getMemories().filter((memory) => String(memory.eventId) === String(eventId));
}

export function getInvoices() {
  return MOCK_INVOICES;
}

export function getGuests() {
  return MOCK_GUESTS;
}

export function getNotifications() {
  return MOCK_NOTIFICATIONS;
}

export function getInbox() {
  return MOCK_INBOX;
}

export function getCalendar() {
  return MOCK_CALENDAR;
}

export function addGuest(guest) {
  return { id: Date.now(), status: "Pending", rsvp: "Maybe", ...guest };
}

export function getMyTickets(userId) {
  const currentUser = userId || safeParse(localStorage.getItem("invitegenie_auth"), {})?.id;
  return getTickets().filter((ticket) => String(ticket.userId) === String(currentUser));
}

export function buyTicket(eventItem, qty = 1) {
  const ticket = {
    id: `TKT-${Date.now()}`,
    eventName: eventItem.title,
    buyerName: safeParse(localStorage.getItem("invitegenie_auth"), {})?.name || "Guest",
    price: Number(eventItem.price || 0) * qty,
    amount: Number(eventItem.price || 0) * qty,
    date: eventItem.date,
    quantity: qty,
    status: "valid",
    qrValue: `INVITEGENIE-${Date.now()}`,
  };
  writeKey(DEMO_STORAGE_KEYS.tickets, [ticket, ...getTickets()]);
  return ticket;
}

export function getUserProfile() {
  return safeParse(localStorage.getItem("invitegenie_profile"), {
    name: "Marie Ngalle",
    email: "marie.user@invitegenie.cm",
    level: "Free",
    points: 2450,
    tier: "Free User",
    joinDate: "May 2026",
    avatar: "MN",
  });
}

export function saveUserProfile(profile) {
  localStorage.setItem("invitegenie_profile", JSON.stringify(profile));
  return profile;
}
