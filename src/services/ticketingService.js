import {
  DEMO_STORAGE_KEYS,
  ensureDemoData,
  getEventById,
  getProviderById,
  getTickets,
  saveEvents,
  getEvents,
} from "./mockData";

function readKey(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: value } }));
  if (key === DEMO_STORAGE_KEYS.tickets) localStorage.setItem("ig_tickets", JSON.stringify(value));
  if (key === DEMO_STORAGE_KEYS.payments) localStorage.setItem("ig_payments", JSON.stringify(value));
  if (key === DEMO_STORAGE_KEYS.bookings) localStorage.setItem("invitegenie_bookings", JSON.stringify(value));
  return value;
}

function qrFor(path) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://invitegenie.local";
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(origin + path)}`;
}

export function getBookings() {
  ensureDemoData();
  return readKey(DEMO_STORAGE_KEYS.bookings);
}

export function getPayments() {
  ensureDemoData();
  return readKey(DEMO_STORAGE_KEYS.payments);
}

export function getTicketById(ticketId) {
  ensureDemoData();
  return getTickets().find((ticket) => String(ticket.id) === String(ticketId));
}

export function getBookingById(bookingId) {
  ensureDemoData();
  return getBookings().find((booking) => String(booking.id) === String(bookingId));
}

export function getTicketsByUser(userId) {
  ensureDemoData();
  return getTickets().filter((ticket) => String(ticket.userId) === String(userId));
}

export function getBookingsByUser(userId) {
  return getBookings().filter((booking) => String(booking.userId) === String(userId));
}

export function getTicketOptions(event) {
  if (!event) return [];
  if (Array.isArray(event.ticketOptions) && event.ticketOptions.length) return event.ticketOptions;
  return [
    { type: "Standard", price: Number(event.price || 0), available: Number(event.availableTickets || 0) },
    { type: "VIP", price: Math.round(Number(event.price || 0) * 2), available: Math.min(30, Number(event.availableTickets || 0)) },
  ];
}

export function createTicketPurchase({
  user,
  eventId,
  ticketType = "Standard",
  quantity = 1,
  buyerName,
  buyerEmail,
  buyerPhone,
  paymentMethod = "MTN Mobile Money",
}) {
  ensureDemoData();
  const event = getEventById(eventId);
  if (!event) throw new Error("Event not found.");
  const qty = Math.max(Number(quantity || 1), 1);
  if (Number(event.availableTickets || 0) < qty) throw new Error("Not enough tickets available.");

  const option = getTicketOptions(event).find((item) => item.type === ticketType) || getTicketOptions(event)[0];
  const unitPrice = Number(option?.price || event.price || 0);
  const amount = unitPrice * qty;
  const ticketId = `TKT-${Date.now()}`;
  const bookingId = `BKG-${Date.now()}`;
  const ticketUrl = `/bookings/${bookingId}/voucher`;

  const ticket = {
    id: ticketId,
    bookingId,
    userId: user.id,
    eventId: event.id,
    buyerName: buyerName || user.full_name || user.name || "Guest",
    buyerEmail: buyerEmail || user.email || "",
    buyerPhone: buyerPhone || user.phone || "",
    eventName: event.title,
    ticketType,
    type: ticketType,
    quantity: qty,
    amount,
    price: amount,
    unitPrice,
    status: "valid",
    qrCodeUrl: qrFor(ticketUrl),
    qrValue: `${ticketId}:${bookingId}:${event.id}:${user.id}`,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  const booking = {
    id: bookingId,
    userId: user.id,
    eventId: event.id,
    ticketId,
    amount,
    quantity: qty,
    status: "confirmed",
    paymentMethod,
    buyerName: ticket.buyerName,
    eventName: event.title,
    createdAt: ticket.createdAt,
    timestamp: ticket.timestamp,
  };

  const payment = {
    id: `PAY-${Date.now()}`,
    userId: user.id,
    eventId: event.id,
    bookingId,
    amount,
    currency: "FCFA",
    status: "completed",
    method: paymentMethod,
    createdAt: ticket.createdAt,
    timestamp: ticket.timestamp,
  };

  writeKey(DEMO_STORAGE_KEYS.tickets, [ticket, ...getTickets()]);
  writeKey(DEMO_STORAGE_KEYS.bookings, [booking, ...getBookings()]);
  writeKey(DEMO_STORAGE_KEYS.payments, [payment, ...getPayments()]);

  const updatedEvents = getEvents().map((item) =>
    String(item.id) === String(event.id)
      ? {
          ...item,
          ticketsSold: Number(item.ticketsSold || 0) + qty,
          availableTickets: Math.max(Number(item.availableTickets || 0) - qty, 0),
          revenue: Number(item.revenue || 0) + amount,
        }
      : item
  );
  saveEvents(updatedEvents);

  return { ticket, booking, payment };
}

export function getMarketplaceOrders() {
  ensureDemoData();
  return readKey(DEMO_STORAGE_KEYS.marketplaceOrders);
}

export function createMarketplaceOrder({
  buyer,
  listingId,
  amount,
  status = "confirmed",
  paymentMethod = "MTN Mobile Money",
}) {
  ensureDemoData();
  const listing = getProviderById(listingId);
  if (!listing) throw new Error("Marketplace listing not found.");

  const order = {
    id: `MKT-${Date.now()}`,
    buyerId: buyer.id,
    sellerId: listing.ownerId || listing.sellerId || listing.userId,
    listingId: listing.id,
    listingTitle: listing.title || listing.businessName || listing.name,
    amount: Number(amount || listing.price || listing.startingPrice || 0),
    status,
    paymentMethod,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  writeKey(DEMO_STORAGE_KEYS.marketplaceOrders, [order, ...getMarketplaceOrders()]);
  return order;
}

export function getMarketplaceOrdersForSeller(sellerId) {
  return getMarketplaceOrders().filter((order) => String(order.sellerId) === String(sellerId));
}

export function getMarketplaceOrdersForBuyer(buyerId) {
  return getMarketplaceOrders().filter((order) => String(order.buyerId) === String(buyerId));
}
