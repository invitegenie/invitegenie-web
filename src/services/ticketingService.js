import {
  DEMO_STORAGE_KEYS,
  ensureDemoData,
  getEventById,
  getProviderById,
  getTickets,
  saveEvents,
  getEvents,
} from "./mockData";
import { syncAvailabilityAfterBooking } from "./availabilityService";
import { addBookingToCRM } from "./vendorCRMService";

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

export function normalizeTicket(ticket) {
  if (!ticket) return null;
  const ticketTypeLower = String(ticket.ticketType || ticket.type || "").toLowerCase();
  let accessLevel = ticket.accessLevel || "standard";
  if (ticketTypeLower.includes("vip")) accessLevel = "vip";
  else if (ticketTypeLower.includes("backstage")) accessLevel = "backstage";
  
  return {
    ...ticket,
    accessLevel,
    ticketStatus: ticket.ticketStatus || (ticket.status === "valid" ? "valid" : ticket.status),
    paymentStatus: ticket.paymentStatus || "paid",
    scanHistory: ticket.scanHistory || [],
  };
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
  const ticket = getTickets().find((ticket) => String(ticket.id) === String(ticketId));
  return normalizeTicket(ticket);
}

export function getBookingById(bookingId) {
  ensureDemoData();
  return getBookings().find((booking) => String(booking.id) === String(bookingId));
}

export function getTicketsByUser(userId) {
  ensureDemoData();
  return getTickets().filter((ticket) => String(ticket.userId) === String(userId)).map(normalizeTicket);
}

export function getBookingsByUser(userId) {
  return getBookings().filter((booking) => String(booking.userId) === String(userId));
}

export function hasValidTicket(userId, eventId) {
  if (!userId || !eventId) return false;
  const tickets = getTicketsByUser(userId);
  return tickets.some(t => String(t.eventId) === String(eventId) && t.status !== "cancelled");
}

export function getTicketOptions(event) {
  if (!event) return [];
  if (Array.isArray(event.ticketOptions) && event.ticketOptions.length) return event.ticketOptions;
  return [
    { type: "Standard", price: Number(event.price || 0), available: Number(event.availableTickets || 0) },
    { type: "VIP", price: Math.round(Number(event.price || 0) * 2), available: Math.min(30, Number(event.availableTickets || 0)) },
  ];
}

export function updateTicketStatus(ticketId, updates) {
  ensureDemoData();
  const tickets = readKey(DEMO_STORAGE_KEYS.tickets, []);
  const index = tickets.findIndex(t => String(t.id) === String(ticketId));
  if (index === -1) return null;
  tickets[index] = { ...tickets[index], ...updates };
  writeKey(DEMO_STORAGE_KEYS.tickets, tickets);
  return normalizeTicket(tickets[index]);
}

export function updateMarketplaceOrderStatus(orderId, status) {
  ensureDemoData();
  const orders = readKey(DEMO_STORAGE_KEYS.marketplaceOrders, []);
  const index = orders.findIndex(o => String(o.id) === String(orderId));
  if (index === -1) return null;
  orders[index] = { ...orders[index], status, paymentStatus: status === "confirmed" ? "paid" : orders[index].paymentStatus };
  writeKey(DEMO_STORAGE_KEYS.marketplaceOrders, orders);
  return orders[index];
}

export function updatePaymentStatus(paymentId, status) {
  ensureDemoData();
  const payments = readKey(DEMO_STORAGE_KEYS.payments, []);
  const index = payments.findIndex(p => String(p.id) === String(paymentId));
  if (index === -1) return null;

  payments[index] = { ...payments[index], status };
  writeKey(DEMO_STORAGE_KEYS.payments, payments);
  return payments[index];
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
  tableAddon = null,
  initialStatus = "valid",
  initialPaymentStatus = "paid"
}) {
  ensureDemoData();
  const event = getEventById(eventId);
  if (!event) throw new Error("Event not found.");
  const qty = Math.max(Number(quantity || 1), 1);
  if (Number(event.availableTickets || 0) < qty) throw new Error("Not enough tickets available.");

  const option = getTicketOptions(event).find((item) => item.type === ticketType) || getTicketOptions(event)[0];
  const unitPrice = Number(option?.price || event.price || 0);
  const amount = (unitPrice * qty) + (tableAddon ? tableAddon.price : 0);
  const ticketId = `TKT-${Date.now()}`;
  const bookingId = `BKG-${Date.now()}`;
  const ticketUrl = `/bookings/${bookingId}/voucher`;

  let accessLevel = "standard";
  const lTicketType = ticketType.toLowerCase();
  if (lTicketType.includes("vip")) accessLevel = "vip";
  else if (lTicketType.includes("backstage")) accessLevel = "backstage";
  else if (tableAddon) accessLevel = "table";
  
  const qrPayload = JSON.stringify({
    ticketId,
    eventId: event.id,
    buyerId: user.id,
    accessLevel,
    hash: btoa(`SEC-${ticketId}-${Date.now()}`).substring(0, 10)
  });

  const ticket = {
    id: ticketId,
    bookingId,
    userId: user.id,
    eventId: event.id,
    buyerName: buyerName || user.full_name || user.name || "Guest",
    buyerEmail: buyerEmail || user.email || "",
    buyerPhone: buyerPhone || user.phone || "",
    eventName: event.title,
    ticketType: tableAddon ? `${ticketType} + ${tableAddon.id}` : ticketType,
    type: tableAddon ? `${ticketType} + ${tableAddon.id}` : ticketType,
    accessLevel,
    ticketStatus: initialStatus,
    paymentStatus: initialPaymentStatus,
    scanHistory: [],
    scanCount: 0,
    quantity: qty,
    amount,
    price: amount,
    unitPrice,
    status: initialStatus,
    qrCodeUrl: qrFor(ticketUrl),
    qrValue: qrPayload,
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
    status: initialStatus === "valid" ? "confirmed" : "pending_payment",
    paymentMethod,
    buyerName: ticket.buyerName,
    eventName: event.title,
    createdAt: ticket.createdAt,
    timestamp: ticket.timestamp,
  };

  const paymentStatus = initialPaymentStatus === "paid" ? "completed" : "pending_payment";
  const payment = {
    id: `PAY-${Date.now()}`,
    userId: user.id,
    eventId: event.id,
    bookingId,
    amount,
    currency: "FCFA",
    status: paymentStatus,
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
  productId,
  itemTitle,
  selectedItem,
  packageName,
  source = "marketplace_provider",
  quantity = 1,
  buyerNotes = "",
  selectedDate,
  selectedTime,
  subtotal,
  tax,
  platformFee,
  amount,
  status = "confirmed",
  paymentMethod = "MTN Mobile Money",
}) {
  ensureDemoData();
  const listing = getProviderById(listingId);
  if (!listing) throw new Error("Marketplace listing not found.");

  const sellerId = listing.ownerId || listing.sellerId || listing.userId;
  const timestamp = Date.now();
  const createdAt = new Date().toISOString();
  const orderId = `MKT-${timestamp}`;
  const totalAmount = Number(amount || selectedItem?.price || listing.price || listing.startingPrice || 0);
  const orderSubtotal = Number(subtotal || selectedItem?.price || totalAmount || 0);
  const orderTax = Number(tax || 0);
  const orderPlatformFee = Number(platformFee || Math.round(orderSubtotal * 0.05));
  const sellerPayout = Math.max(totalAmount - orderPlatformFee, 0);

  const order = {
    id: orderId,
    buyerId: buyer.id,
    buyerName: buyer.full_name || buyer.name || "InviteGenie User",
    buyerEmail: buyer.email || "",
    buyerPhone: buyer.phone || "",
    sellerId,
    listingId: listing.id,
    productId,
    source,
    listingTitle: itemTitle || listing.title || listing.businessName || listing.name,
    providerName: listing.businessName || listing.name,
    packageName: packageName || itemTitle,
    quantity: Math.max(1, Number(quantity || 1)),
    buyerNotes,
    selectedDate,
    selectedTime,
    selectedItem,
    subtotal: orderSubtotal,
    tax: orderTax,
    platformFee: orderPlatformFee,
    amount: totalAmount,
    sellerPayout,
    currency: "FCFA",
    status,
    paymentStatus: status === "confirmed" ? "paid" : "pending",
    paymentMethod,
    qrCodeUrl: qrFor(`/marketplace/${listing.id}/book?order=${orderId}`),
    statusHistory: [
      { status: "pending_payment", at: createdAt },
      { status, at: createdAt },
    ],
    createdAt,
    timestamp,
  };

  writeKey(DEMO_STORAGE_KEYS.marketplaceOrders, [order, ...getMarketplaceOrders()]);
  
  if (status !== "pending_payment") {
    recordMarketplacePayment({ order, buyer, listing, paymentMethod });
    creditMarketplaceWallets({ order, sellerId, buyer });
  }
  createMarketplaceNotifications({ order, sellerId, buyer });
  
  try {
    syncAvailabilityAfterBooking({ providerId: listing.id, date: selectedDate, startTime: selectedTime, quantity });
  } catch (e) {
    console.warn("Could not sync availability", e);
  }
  
  try {
    addBookingToCRM(sellerId, buyer, order);
  } catch (e) {
    console.warn("Could not sync CRM", e);
  }

  return order;
}

function recordMarketplacePayment({ order, buyer, listing, paymentMethod }) {
  const payment = {
    id: `PAY-${order.id}`,
    type: "marketplace_order",
    userId: buyer.id,
    buyerId: buyer.id,
    sellerId: order.sellerId,
    listingId: listing.id,
    productId: order.productId,
    orderId: order.id,
    bookingId: order.id,
    amount: order.amount,
    currency: order.currency,
    status: "completed",
    method: paymentMethod,
    createdAt: order.createdAt,
    timestamp: order.timestamp,
  };
  writeKey(DEMO_STORAGE_KEYS.payments, [payment, ...getPayments()]);
  return payment;
}

function creditMarketplaceWallets({ order, sellerId, buyer }) {
  const walletTx = {
    id: `WTX-${order.id}`,
    userId: buyer.id,
    orderId: order.id,
    type: "debit",
    title: `Marketplace booking - ${order.listingTitle}`,
    amount: order.amount,
    currency: order.currency,
    status: "completed",
    createdAt: order.createdAt,
    timestamp: order.timestamp,
  };

  const vendorTx = {
    id: `VTX-${order.id}`,
    vendorId: sellerId,
    sellerId,
    orderId: order.id,
    type: "credit",
    title: `Storefront booking - ${order.listingTitle}`,
    grossAmount: order.amount,
    platformFee: order.platformFee,
    amount: order.sellerPayout,
    currency: order.currency,
    status: "available",
    createdAt: order.createdAt,
    timestamp: order.timestamp,
  };

  const vendorWallets = readKey(DEMO_STORAGE_KEYS.vendorWallets);
  const existingWallet = vendorWallets.find((wallet) => String(wallet.vendorId || wallet.sellerId || wallet.userId) === String(sellerId));
  const nextWallet = {
    id: existingWallet?.id || `wallet-${sellerId}`,
    vendorId: sellerId,
    sellerId,
    balance: Number(existingWallet?.balance || 0) + order.sellerPayout,
    pendingBalance: Number(existingWallet?.pendingBalance || 0),
    lifetimeEarnings: Number(existingWallet?.lifetimeEarnings || 0) + order.sellerPayout,
    currency: order.currency,
    updatedAt: order.createdAt,
    createdAt: existingWallet?.createdAt || order.createdAt,
  };

  const nextWallets = existingWallet
    ? vendorWallets.map((wallet) => (String(wallet.vendorId || wallet.sellerId || wallet.userId) === String(sellerId) ? { ...wallet, ...nextWallet } : wallet))
    : [nextWallet, ...vendorWallets];

  writeKey(DEMO_STORAGE_KEYS.walletTransactions, [walletTx, ...readKey(DEMO_STORAGE_KEYS.walletTransactions)]);
  writeKey(DEMO_STORAGE_KEYS.vendorTransactions, [vendorTx, ...readKey(DEMO_STORAGE_KEYS.vendorTransactions)]);
  writeKey(DEMO_STORAGE_KEYS.vendorWallets, nextWallets);
}

function createMarketplaceNotifications({ order, sellerId, buyer }) {
  const notifications = readKey("ig_notifications");
  const buyerName = buyer.full_name || buyer.name || "A customer";
  writeKey("ig_notifications", [
    {
      id: `notif-seller-${order.id}`,
      userId: sellerId,
      type: "marketplace_order",
      title: "New Storefront Booking",
      message: `${buyerName} booked ${order.listingTitle} for FCFA ${Number(order.amount || 0).toLocaleString()}.`,
      path: "/dashboard?panel=orders",
      referenceId: order.id,
      read: false,
      createdAt: order.createdAt,
      timestamp: order.timestamp,
    },
    {
      id: `notif-buyer-${order.id}`,
      userId: buyer.id,
      type: "booking",
      title: "Booking Confirmed",
      message: `Your booking for ${order.listingTitle} is confirmed.`,
      path: "/bookings",
      referenceId: order.id,
      read: false,
      createdAt: order.createdAt,
      timestamp: order.timestamp,
    },
    ...notifications,
  ]);
}

export function getMarketplaceOrdersForSeller(sellerId) {
  return getMarketplaceOrders().filter((order) => String(order.sellerId) === String(sellerId));
}

export function getMarketplaceOrdersForBuyer(buyerId) {
  return getMarketplaceOrders().filter((order) => String(order.buyerId) === String(buyerId));
}

export function confirmMarketplaceOrder(orderId) {
  ensureDemoData();
  const orders = readKey(DEMO_STORAGE_KEYS.marketplaceOrders, []);
  const index = orders.findIndex(o => String(o.id) === String(orderId));
  if (index === -1) return null;
  
  const order = orders[index];
  if (order.status === "confirmed") return order; // Already confirmed
  
  order.status = "confirmed";
  order.paymentStatus = "paid";
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({ status: "confirmed", at: new Date().toISOString() });
  
  orders[index] = order;
  writeKey(DEMO_STORAGE_KEYS.marketplaceOrders, orders);

  const users = readKey(DEMO_STORAGE_KEYS.users, []);
  const buyer = users.find(u => String(u.id) === String(order.buyerId)) || { id: order.buyerId, full_name: order.buyerName || "User" };
  const listing = getProviderById(order.listingId) || { id: order.listingId };

  recordMarketplacePayment({ order, buyer, listing, paymentMethod: order.paymentMethod });
  creditMarketplaceWallets({ order, sellerId: order.sellerId, buyer });

  return order;
}
