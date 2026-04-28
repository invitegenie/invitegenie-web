// ===== MOCK EVENTS DATA =====
export const MOCK_EVENTS = [
  { id: 1, title: "Buea Wedding Gala Night", date: "2026-05-20", time: "18:00", location: "Mountain Club, Buea", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Wedding", price: 25000, vendorId: "v1", vendorName: "Royal Events CMR", availableTickets: 45, totalTickets: 200, ticketsSold: 155, revenue: 3875000, description: "A magical evening of love and joy at the foot of Mount Fako." },
  { id: 2, title: "Douala Afro Beats Festival", date: "2026-06-12", time: "20:00", location: "Canal Olympia, Douala", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Music", price: 15000, vendorId: "v2", vendorName: "Pulse Entertainment", availableTickets: 300, totalTickets: 1000, ticketsSold: 700, revenue: 10500000, description: "The best African music and culture in the heart of the economic capital." },
  { id: 3, title: "Yaoundé Business Summit", date: "2026-05-15", time: "09:00", location: "Hilton Hotel, Yaoundé", image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Corporate", price: 50000, vendorId: "v3", vendorName: "CEMAC Forum", availableTickets: 80, totalTickets: 400, ticketsSold: 320, revenue: 16000000, description: "Connect with industry leaders and innovators in Central Africa." },
  { id: 4, title: "Limbe Beach Festival", date: "2026-07-04", time: "10:00", location: "Down Beach, Limbe", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800", status: "DRAFT", category: "Music", price: 10000, vendorId: "v4", vendorName: "Oceanic Vibe", availableTickets: 500, totalTickets: 500, ticketsSold: 0, revenue: 0, description: "Sun, sand, and soul at the Limbe Down Beach." },
  { id: 5, title: "Bamenda Cultural Night", date: "2026-04-10", time: "19:00", location: "Congress Hall, Bamenda", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800", status: "PAST", category: "Traditional", price: 8000, vendorId: "v5", vendorName: "Grassfields Heritage", availableTickets: 0, totalTickets: 300, ticketsSold: 300, revenue: 2400000, description: "Honoring the rich traditions of the North West region." },
  { id: 6, title: "Kribi Beach White Party", date: "2026-08-15", time: "14:00", location: "Lobe Falls, Kribi", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Music", price: 30000, vendorId: "v2", vendorName: "Pulse Entertainment", availableTickets: 120, totalTickets: 250, ticketsSold: 130, revenue: 3900000, description: "Kribi's most exclusive beach event of the season." },
  { id: 7, title: "Lagos Creative Fashion Expo", date: "2026-08-22", time: "14:00", location: "Victoria Island, Lagos", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Fashion", price: 75000, vendorId: "v7", vendorName: "West Africa Style", availableTickets: 15, totalTickets: 150, ticketsSold: 135, revenue: 10125000, description: "Showcasing the future of African creative design." },
  { id: 8, title: "Abidjan Corporate Awards", date: "2026-09-05", time: "19:00", location: "Sofitel Abidjan", image: "https://images.unsplash.com/photo-1475721027185-4041193486ec?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Corporate", price: 65000, vendorId: "v8", vendorName: "Ivorian Business Hub", availableTickets: 100, totalTickets: 300, ticketsSold: 200, revenue: 13000000, description: "Celebrating corporate excellence across West Africa." },
  { id: 9, title: "Accra Afro-Fusion Concert", date: "2026-10-12", time: "20:00", location: "Black Star Square, Accra", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Music", price: 20000, vendorId: "v9", vendorName: "Gold Coast Vibes", availableTickets: 450, totalTickets: 2000, ticketsSold: 1550, revenue: 31000000, description: "A high-energy fusion of traditional and modern sound." },
  { id: 10, title: "Bonamoussadi Food Fair", date: "2026-11-20", time: "10:00", location: "Douala V, Cameroon", image: "https://images.unsplash.com/photo-1555121880-94e220e084d2?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Corporate", price: 5000, vendorId: "v10", vendorName: "Sabor Catering", availableTickets: 600, totalTickets: 1000, ticketsSold: 400, revenue: 2000000, description: "Taste the best culinary delights from across Cameroon." },
  { id: 11, title: "Mount Cameroon Charity Run", date: "2026-02-15", time: "06:00", location: "Buea Stadium", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800", status: "DRAFT", category: "Traditional", price: 2500, vendorId: "v11", vendorName: "Fako Athletics", availableTickets: 1000, totalTickets: 1000, ticketsSold: 0, revenue: 0, description: "Racing for a cause at the roof of Central Africa." },
  { id: 12, title: "Yaoundé Tech Startup Expo", date: "2026-06-25", time: "09:00", location: "Palais des Sports", image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Corporate", price: 15000, vendorId: "v12", vendorName: "Silicon Mountain", availableTickets: 200, totalTickets: 500, ticketsSold: 300, revenue: 4500000, description: "Central Africa's premier technology and innovation expo." },
  { id: 13, title: "Ndop Cultural Ceremony", date: "2026-12-10", time: "09:00", location: "Ndop Central", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Traditional", price: 0, vendorId: "v13", vendorName: "Heritage Council", availableTickets: 2000, totalTickets: 2000, ticketsSold: 0, revenue: 0, description: "A sacred display of Ndop artistry and history." },
  { id: 14, title: "Douala Luxury Bridal Expo", date: "2026-05-30", time: "11:00", location: "Akwa Palace Hotel", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Fashion", price: 10000, vendorId: "v1", vendorName: "Royal Events CMR", availableTickets: 150, totalTickets: 300, ticketsSold: 150, revenue: 1500000, description: "Premier wedding planning and fashion exhibition." },
  { id: 15, title: "Bafoussam Networking", date: "2026-07-15", time: "18:00", location: "Zingana Hotel", image: "https://images.unsplash.com/photo-1475721027185-4041193486ec?auto=format&fit=crop&q=80&w=800", status: "ACTIVE", category: "Corporate", price: 20000, vendorId: "v15", vendorName: "Western Nexus", availableTickets: 40, totalTickets: 100, ticketsSold: 60, revenue: 1200000, description: "Executive networking in the heart of the West Region." },
  { id: 16, title: "CEMAC Trade Forum", date: "2026-03-22", time: "08:30", location: "Eko Atlantic", image: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800", status: "PAST", category: "Corporate", price: 100000, vendorId: "v16", vendorName: "Trade Africa", availableTickets: 0, totalTickets: 250, ticketsSold: 250, revenue: 25000000, description: "Strategic trade discussions for the CEMAC sub-region." },
];

// ===== MOCK BOOKINGS DATA =====
export const MOCK_BOOKINGS = [
  { id: "INV10011", date: "2026-05-15 10:30 AM", name: "Jackson Moore", event: "Buea Wedding Gala Night", category: "Diamond", price: 50000, qty: 2, amount: 100000, status: "Confirmed", voucher: "123456-MUSIC" },
  { id: "INV10012", date: "2026-06-01 03:45 PM", name: "Alicia Smithson", event: "Douala Afro Beats Festival", category: "Platinum", price: 120000, qty: 1, amount: 120000, status: "Pending", voucher: "-" },
  { id: "INV10013", date: "2026-05-10 01:15 PM", name: "Natalie Johnson", event: "Yaoundé Corporate Summit", category: "CAT 1", price: 80000, qty: 3, amount: 240000, status: "Confirmed", voucher: "789101-WELLNESS" },
  { id: "INV10014", date: "2026-05-12 09:00 AM", name: "Patrick Cooper", event: "Buea Wedding Gala Night", category: "CAT 3", price: 30000, qty: 4, amount: 120000, status: "Cancelled", voucher: "-" },
  { id: "INV10015", date: "2026-06-05 05:30 PM", name: "Gilda Ramos", event: "Douala Afro Beats Festival", category: "Silver", price: 25000, qty: 2, amount: 50000, status: "Confirmed", voucher: "202324-ART" },
];

// ===== MOCK INVOICES DATA =====
export const MOCK_INVOICES = [
  { id: "INV-2024-001", amount: 100000, status: "Paid", date: "2024-12-15", event: "Buea Wedding Gala Night", dueDate: "2024-12-20" },
  { id: "INV-2024-002", amount: 120000, status: "Pending", date: "2024-12-16", event: "Douala Afro Beats Festival", dueDate: "2024-12-22" },
  { id: "INV-2024-003", amount: 240000, status: "Paid", date: "2024-12-17", event: "Yaoundé Corporate Summit", dueDate: "2024-12-25" },
];

// ===== MOCK GUESTS DATA =====
export const MOCK_GUESTS = [
  { id: 1, name: "Jackson Moore", email: "jackson@example.com", phone: "+237123456789", status: "Confirmed", rsvp: "Yes", event: "Buea Wedding Gala Night" },
  { id: 2, name: "Alicia Smithson", email: "alicia@example.com", phone: "+237987654321", status: "Pending", rsvp: "Maybe", event: "Douala Afro Beats Festival" },
  { id: 3, name: "Natalie Johnson", email: "natalie@example.com", phone: "+237555123456", status: "Confirmed", rsvp: "Yes", event: "Yaoundé Corporate Summit" },
  { id: 4, name: "Patrick Cooper", email: "patrick@example.com", phone: "+237666789012", status: "Cancelled", rsvp: "No", event: "Buea Wedding Gala Night" },
];

// ===== MOCK NOTIFICATIONS =====
export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "RSVP Confirmed", message: "Jackson Moore confirmed for Buea Wedding Gala Night", time: "2 hours ago", read: false, type: "booking" },
  { id: 2, title: "Payment Received", message: "Payment of FCFA 100,000 received for event ticket", time: "1 day ago", read: false, type: "payment" },
  { id: 3, title: "New Guest Invitation", message: "Alicia Smithson invited to Douala Afro Beats Festival", time: "2 days ago", read: true, type: "guest" },
];

// ===== MOCK INBOX MESSAGES =====
export const MOCK_INBOX = [
  { id: 1, from: "Jackson Moore", subject: "Question about the event timing", message: "Hi, is the event starting at 1 PM sharp?", time: "2 hours ago", read: false },
  { id: 2, from: "Alicia Smithson", subject: "Event confirmation", message: "Thank you for the invitation! See you at the event.", time: "1 day ago", read: true },
  { id: 3, from: "Support Team", subject: "Welcome to InviteGenie!", message: "We're excited to have you onboard. Start creating events now!", time: "7 days ago", read: true },
];

// ===== MOCK CALENDAR AGENDA =====
export const MOCK_CALENDAR = [
  { id: 1, date: "2024-12-20", title: "Buea Wedding Gala Night", time: "13:00", location: "Mountain Club", type: "event" },
  { id: 2, date: "2024-12-22", title: "Douala Afro Beats Festival", time: "18:00", location: "Limbe Beach", type: "event" },
  { id: 3, date: "2024-12-25", title: "Yaoundé Corporate Summit", time: "09:00", location: "Hilton Yaoundé", type: "event" },
];

// ===== MOCK MEMORIES =====
export const MOCK_MEMORIES = [
  { id: 1, eventId: 1, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400", date: "2024-12-20", caption: "Beautiful ceremony moment" },
  { id: 2, eventId: 1, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400", date: "2024-12-20", caption: "Reception dancing" },
];

// ===== MOCK PAYMENTS =====
export const MOCK_PAYMENTS = [
  { id: 1, method: "Visa ***1234", amount: 100000, date: "2024-12-15", event: "Buea Wedding Gala Night", status: "Completed" },
  { id: 2, method: "Orange Money", amount: 120000, date: "2024-12-16", event: "Douala Afro Beats Festival", status: "Pending" },
  { id: 3, method: "Mastercard ***5678", amount: 240000, date: "2024-12-17", event: "Yaoundé Corporate Summit", status: "Completed" },
];

// ===== ANALYTICS DATA =====
export const MOCK_ANALYTICS = {
  totalInvites: 2145,
  rsvpRate: 78.5,
  guestAttendance: 1689,
  lastUpdated: new Date().toISOString(),
  monthlyData: [
    { month: "Oct", events: 12, rsvps: 856 },
    { month: "Nov", events: 8, rsvps: 642 },
    { month: "Dec", events: 15, rsvps: 1203 },
  ],
};

// ===== MOCK INVITATION TEMPLATES =====
export const MOCK_TEMPLATES = [
  { id: 't1', category: 'Wedding', name: 'Royal Gold', preview: 'https://images.unsplash.com/photo-1519741497674-611481863552' },
  { id: 't2', category: 'Birthday', name: 'Neon Party', preview: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15' },
  { id: 't3', category: 'Corporate', name: 'Minimal Tech', preview: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe6' },
  { id: 't4', category: 'VIP', name: 'Black Tie', preview: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3' },
  { id: 't5', category: 'Cultural', name: 'Ndop Heritage', preview: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7' },
  { id: 't6', category: 'Concert', name: 'Afro Beats', preview: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e' },
  { id: 't7', category: 'Baby Shower', name: 'Cloud Soft', preview: 'https://images.unsplash.com/photo-1519689680058-324335c77eba' },
  { id: 't8', category: 'Graduation', name: 'Ivy League', preview: 'https://images.unsplash.com/photo-1523050853064-814040f935b0' },
  { id: 't9', category: 'Funeral', name: 'Eternity', preview: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205' },
  { id: 't10', category: 'Religious', name: 'Divine Light', preview: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2' },
  { id: 't11', category: 'Nightlife', name: 'Skyline Club', preview: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7' },
  { id: 't12', category: 'Private Party', name: 'Secret Garden', preview: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622' },
];

// ===== MOCK TICKETS (MY TICKETS) =====
export const getMyTickets = () => {
  const stored = localStorage.getItem("invitegenie_my_tickets");
  if (stored) return JSON.parse(stored);
  return [];
};

export const buyTicket = (event, qty) => {
  const tickets = getMyTickets();
  const newTicket = {
    id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    eventName: event.title,
    buyerName: JSON.parse(localStorage.getItem("invitegenie_user"))?.name || "Guest",
    price: event.price * qty,
    date: event.date,
    status: "Active",
    qrValue: `VOUCHER-${Math.random()}`
  };
  tickets.push(newTicket);
  localStorage.setItem("invitegenie_my_tickets", JSON.stringify(tickets));
  return newTicket;
};

// ===== USER PROFILE =====
const DEFAULT_PROFILE = {
  name: "Marie Ngalle",
  email: "marie@invitegenie.com",
  level: "Master",
  points: 2450,
  tier: "PRO",
  joinDate: "Jan 2024",
  eventsHosted: 28,
  totalGuests: 1847,
  avatar: "M",
};

// ===== HELPER FUNCTIONS =====

// Get events from localStorage or mock
export const getEvents = () => {
  const stored = localStorage.getItem("invitegenie_events");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored events", e);
    }
  }
  return MOCK_EVENTS;
};

/**
 * Update a single event in persistence
 */
export const updateEvent = (updatedEvent) => {
  const events = getEvents();
  const newEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
  localStorage.setItem("invitegenie_events", JSON.stringify(newEvents));
  return updatedEvent;
};

// Get single event by ID
export const getEventById = (id) => {
  const events = getEvents();
  return events.find((e) => e.id == id);
};

// Get bookings
export const getBookings = () => {
  const stored = localStorage.getItem("invitegenie_bookings");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_BOOKINGS;
    }
  }
  return MOCK_BOOKINGS;
};

// Get booking by ID
export const getBookingById = (id) => {
  const bookings = getBookings();
  return bookings.find((b) => b.id == id);
};

// Get invoices
export const getInvoices = () => {
  const stored = localStorage.getItem("invitegenie_invoices");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_INVOICES;
    }
  }
  return MOCK_INVOICES;
};

// Get guests
export const getGuests = () => {
  const stored = localStorage.getItem("invitegenie_guests");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_GUESTS;
    }
  }
  return MOCK_GUESTS;
};

// Get notifications
export const getNotifications = () => {
  return MOCK_NOTIFICATIONS;
};

// Get inbox messages
export const getInbox = () => {
  return MOCK_INBOX;
};

// Get calendar events
export const getCalendar = () => {
  return MOCK_CALENDAR;
};

// Get memories
export const getMemories = () => {
  const stored = localStorage.getItem("invitegenie_memories");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_MEMORIES;
    }
  }
  return MOCK_MEMORIES;
};

// Get memories by event ID
export const getMemoriesByEventId = (eventId) => {
  const memories = getMemories();
  return memories.filter((m) => m.eventId == eventId);
};

// Get payments
export const getPayments = () => {
  return MOCK_PAYMENTS;
};

// Save event to localStorage
export const saveEvent = (event) => {
  const events = getEvents();
  const newEvent = {
    id: Date.now(),
    ...event,
    status: "UPCOMING",
    rsvpProgress: 0,
    guests: 0,
  };
  events.push(newEvent);
  localStorage.setItem("invitegenie_events", JSON.stringify(events));
  return newEvent;
};

// Add booking
export const addBooking = (booking) => {
  const bookings = getBookings();
  const newBooking = {
    id: `INV${Date.now()}`,
    date: new Date().toLocaleString(),
    ...booking,
  };
  bookings.push(newBooking);
  localStorage.setItem("invitegenie_bookings", JSON.stringify(bookings));
  return newBooking;
};

// Add guest
export const addGuest = (guest) => {
  const guests = getGuests();
  const newGuest = {
    id: Date.now(),
    ...guest,
    status: "Pending",
    rsvp: "Maybe",
  };
  guests.push(newGuest);
  localStorage.setItem("invitegenie_guests", JSON.stringify(guests));
  return newGuest;
};

// Get user profile from localStorage or default
export const getUserProfile = () => {
  const stored = localStorage.getItem("invitegenie_profile");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }
  return DEFAULT_PROFILE;
};

// Save user profile
export const saveUserProfile = (profile) => {
  localStorage.setItem("invitegenie_profile", JSON.stringify(profile));
  return profile;
};
