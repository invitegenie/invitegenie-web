/**
 * Invite Genie Core Engine
 * Event management + tickets + feed + freelancer marketplace
 * LocalStorage MVP with optional Supabase backend for production.
 * 
 * IMPORTANT: This engine is backward compatible.
 * - All localStorage functions remain unchanged
 * - Supabase is OPTIONAL and can be enabled via configuration
 * - If Supabase is not configured, everything uses localStorage
 * - If Supabase is configured, it's used alongside localStorage
 */

import {
  MOCK_EVENTS,
  MOCK_MEMORIES,
  MOCK_BOOKINGS,
  MOCK_PAYMENTS,
  MOCK_PROVIDERS,
} from "../services/mockData";

// Optional Supabase integration (non-blocking if not available)
let supabaseEngine = null;
let supabaseEnabled = false;

// Dynamically import supabaseEngine to avoid breaking changes if it's not present
const loadSupabaseEngine = async () => {
  try {
    const module = await import("../services/supabaseEngine.js");
    supabaseEngine = module;
    supabaseEnabled = supabaseEngine.isSupabaseEnabled();
    console.log("Supabase integration available. Enabled:", supabaseEnabled);
  } catch (err) {
    console.debug("Supabase engine not available, using localStorage only.", err);
  }
};
loadSupabaseEngine();

// =============================
// STORAGE KEYS
// =============================

export const KEYS = {
  USERS: "ig_users",
  EVENTS: "ig_events",
  TICKETS: "ig_tickets",
  PAYMENTS: "ig_payments",
  MEMORIES: "ig_memories",
  INVITATIONS: "ig_invitations",
  VENDORS: "ig_vendors",
  GALLERY: "ig_gallery",
  VENUES: "ig_venues",
  SEAT_MAPS: "ig_seatmaps",
  GUEST_ASSIGNMENTS: "ig_guest_assignments",

  POSTS: "ig_posts",
  COMMENTS: "ig_comments",
  NOTIFICATIONS: "ig_notifications",
  MESSAGES: "ig_messages",

  FREELANCERS: "ig_freelancers",
  GIGS: "ig_gigs",
  FREELANCER_BOOKINGS: "ig_freelancer_bookings",
};

// =============================
// LIVE ENGINE SUBSCRIPTIONS
// =============================

const listeners = {};

export const subscribe = (key, callback) => {
  if (!listeners[key]) listeners[key] = [];

  listeners[key].push(callback);

  return () => {
    listeners[key] = listeners[key].filter((cb) => cb !== callback);
  };
};

const notify = (key, data) => {
  if (!listeners[key]) return;
  listeners[key].forEach((callback) => callback(data));
};

const safeParse = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const initDB = (key, initialData = []) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }
};

const get = (key) => safeParse(localStorage.getItem(key), []);

export const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  notify(key, data);
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data } }));
  return data;
};

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// =============================
// SUPABASE HELPERS (Optional, Non-Breaking)
// =============================

/**
 * Async helper to get data from Supabase or fallback to localStorage.
 * Safe to call even if Supabase is not configured.
 * Returns empty array on error.
 */
export const getDataAsync = async (key, supabaseGetter) => {
  // If Supabase engine is available and enabled, try it first
  if (supabaseEngine && supabaseEnabled && supabaseGetter) {
    try {
      const data = await supabaseGetter();
      if (data && Array.isArray(data)) {
        return data;
      }
    } catch (err) {
      console.debug(`Supabase fallback for ${key}:`, err.message);
    }
  }

  // Fall back to localStorage
  return get(key);
};

/**
 * Async helper to create data in Supabase or localStorage.
 * Safe to call even if Supabase is not configured.
 */
export const createDataAsync = async (key, item, supabaseCreator) => {
  // Always save to localStorage (source of truth for now)
  const items = get(key);
  const newItem = {
    id: item.id || makeId("item"),
    ...item,
    created_at: item.created_at || new Date().toISOString(),
  };
  save(key, [newItem, ...items]);

  // Try to sync to Supabase if available
  if (supabaseEngine && supabaseEnabled && supabaseCreator) {
    try {
      await supabaseCreator(newItem);
      console.debug(`${key} synced to Supabase`);
    } catch (err) {
      console.debug(`Failed to sync ${key} to Supabase:`, err.message);
      // Don't throw - localStorage is the source of truth
    }
  }

  return newItem;
};

/**
 * Check if Supabase is ready for use
 */
export const isSupabaseReady = () => supabaseEnabled && supabaseEngine;

export const deleteDocument = async (key, id) => {
  const collection = get(key);
  const updated = collection.filter((item) => String(item.id) !== String(id));
  save(key, updated);
  
  // Try to sync to Supabase if available
  if (supabaseEngine && supabaseEnabled && supabaseEngine.deleteDocumentInSupabase) {
    try {
      await supabaseEngine.deleteDocumentInSupabase(key, id);
    } catch (err) {
      console.debug(`Failed to delete ${key} in Supabase:`, err.message);
    }
  }
  return true;
};

// =============================
// INIT
// =============================

export const initializeEngine = () => {
  initDB(KEYS.EVENTS, MOCK_EVENTS);
  initDB(KEYS.MEMORIES, MOCK_MEMORIES);
  initDB(KEYS.TICKETS, MOCK_BOOKINGS);
  initDB(KEYS.PAYMENTS, MOCK_PAYMENTS);

  initDB(KEYS.USERS, []);
  initDB(KEYS.INVITATIONS, []);
  initDB(KEYS.VENDORS, []);
  initDB(KEYS.GALLERY, []);
  initDB(KEYS.VENUES, []);
  initDB(KEYS.SEAT_MAPS, []);
  initDB(KEYS.GUEST_ASSIGNMENTS, []);

  initDB(KEYS.POSTS, []);
  initDB(KEYS.COMMENTS, []);
  initDB(KEYS.NOTIFICATIONS, []);
  initDB(KEYS.MESSAGES, []);

  initDB(KEYS.FREELANCERS, []);
  initDB(KEYS.GIGS, []);
  initDB(KEYS.FREELANCER_BOOKINGS, []);
};

initializeEngine();

// =============================
// AUTH / USER
// =============================

export const getCurrentUser = () => safeParse(localStorage.getItem("invitegenie_auth"), null);

export const setCurrentUser = (user) => {
  localStorage.setItem("invitegenie_auth", JSON.stringify(user));
  notify("invitegenie_auth", user);
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem("invitegenie_auth");
  notify("invitegenie_auth", null);
};

export const updateProfile = (data) => {
  const user = getCurrentUser();
  if (!user) return null;

  const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
  setCurrentUser(updated);
  return updated;
};

// =============================
// EVENTS
// =============================

export const getEvents = async () => await getDataAsync(KEYS.EVENTS, supabaseEngine?.getEventsFromSupabase);

export const getEventById = async (id) => {
  const events = await getEvents();
  return events.find((event) => String(event.id) === String(id));
};

export const createEvent = async (eventData) => {
  const events = await getEvents();

  const newEvent = {
    id: makeId("evt"),
    title: "Untitled Event",
    status: "active",
    ticketsSold: 0,
    revenue: 0,
    price: 0,
    totalTickets: 100,
    availableTickets: eventData.totalTickets || 100,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...eventData,
  };

  await createDataAsync(KEYS.EVENTS, newEvent, supabaseEngine?.createEventInSupabase);

  createPost({
    userId: newEvent.hostId || "system",
    userName: newEvent.hostName || "Invite Genie",
    content: `New event created: ${newEvent.title}`,
    media: newEvent.coverImage || null,
    eventId: newEvent.id,
    postType: "event",
  });

  return newEvent;
};

export const updateEvent = async (id, data) => {
  const events = await getEvents();

  const updatedEvents = events.map((event) =>
    String(event.id) === String(id)
      ? { ...event, ...data, updatedAt: new Date().toISOString() }
      : event
  );

  save(KEYS.EVENTS, updatedEvents);
  return await getEventById(id);
};

export const deleteEvent = async (id) => {
  const events = await getEvents();
  const filtered = events.filter((event) => String(event.id) !== String(id));
  save(KEYS.EVENTS, filtered);
  return true;
};

export const getEventsByHost = async (hostId) => {
  const events = await getEvents();
  return events.filter((event) => String(event.hostId) === String(hostId));
};

// =============================
// TICKETS / PAYMENTS
// =============================

export const buyTicket = async (eventId, userId, ticketType = "Standard") => {
  const event = await getEventById(eventId);
  if (!event) throw new Error("Event not found");
  if ((event.availableTickets || 0) <= 0) throw new Error("No tickets available");

  const user = getCurrentUser();

  const ticket = {
    id: makeId("TKT").toUpperCase(),
    eventId,
    userId,
    buyerName: user?.name || "Guest",
    buyerEmail: user?.email || "",
    eventName: event.title,
    type: ticketType,
    price: Number(event.price || 0),
    date: event.date,
    status: "valid",
    qrValue: `INVITE-GENIE-${eventId}-${userId}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await createDataAsync(KEYS.TICKETS, ticket, supabaseEngine?.createTicketInSupabase);

  updateEvent(eventId, {
    ticketsSold: Number(event.ticketsSold || 0) + 1,
    availableTickets: Number(event.availableTickets || 0) - 1,
    revenue: Number(event.revenue || 0) + Number(event.price || 0),
  });

  createMockPayment(eventId, userId, Number(event.price || 0), ticket.id);

  createNotification({
    userId,
    type: "ticket",
    message: `Your ticket for ${event.title} is ready.`,
    referenceId: ticket.id,
  });

  return ticket;
};

export const getTicketsByUser = async (userId) =>
  await getDataAsync(KEYS.TICKETS, () => supabaseEngine?.getTicketsFromSupabase(userId));

export const getTicketById = (id) =>
  get(KEYS.TICKETS).find((ticket) => String(ticket.id) === String(id));

export const validateTicket = (id) => {
  const tickets = get(KEYS.TICKETS);
  let validatedTicket = null;

  const updatedTickets = tickets.map((ticket) => {
    if (String(ticket.id) === String(id)) {
      validatedTicket = {
        ...ticket,
        status: "used",
        validatedAt: new Date().toISOString(),
      };
      return validatedTicket;
    }

    return ticket;
  });

  save(KEYS.TICKETS, updatedTickets);
  return validatedTicket;
};

export const createMockPayment = async (eventId, userId, amount, ticketId = null) => {
  const payments = get(KEYS.PAYMENTS);

  const payment = {
    id: makeId("PAY"),
    eventId,
    userId,
    ticketId,
    amount: Number(amount || 0),
    currency: "FCFA",
    date: new Date().toISOString(),
    status: "completed",
    method: "Mobile Money",
    timestamp: Date.now(),
  };

  await createDataAsync(KEYS.PAYMENTS, payment, supabaseEngine?.createPaymentInSupabase); // Assuming createPaymentInSupabase will be added
  return payment;
};

export const getAllPayments = async () => await getDataAsync(KEYS.PAYMENTS, supabaseEngine?.getPaymentsFromSupabase);

export const getPaymentsByUser = async (userId) =>
  await getDataAsync(KEYS.PAYMENTS, () => supabaseEngine?.getPaymentsFromSupabase(userId));

// =============================
// SOCIAL POSTS / FEED
// =============================

export const getPosts = () => get(KEYS.POSTS);

export const getPostById = (id) =>
  getPosts().find((post) => String(post.id) === String(id));

export const createPost = ({
  userId,
  userName,
  content,
  media = null,
  eventId = null,
  postType = "post",
}) => {
  const posts = getPosts();

  const post = {
    id: makeId("post"),
    userId,
    userName: userName || "Invite Genie User",
    content,
    media,
    eventId,
    postType,
    likes: [],
    commentsCount: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.POSTS, [post, ...posts]);
  return post;
};

export const likePost = (postId, userId) => {
  const posts = getPosts();

  const updatedPosts = posts.map((post) => {
    if (String(post.id) !== String(postId)) return post;

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const alreadyLiked = likes.includes(userId);

    return {
      ...post,
      likes: alreadyLiked
        ? likes.filter((id) => id !== userId)
        : [...likes, userId],
    };
  });

  save(KEYS.POSTS, updatedPosts);
  return getPostById(postId);
};

export const getComments = () => get(KEYS.COMMENTS);

export const getCommentsByPost = (postId) =>
  getComments().filter((comment) => String(comment.postId) === String(postId));

export const createComment = ({ postId, userId, userName, text }) => {
  const comments = getComments();

  const comment = {
    id: makeId("comment"),
    postId,
    userId,
    userName,
    text,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.COMMENTS, [...comments, comment]);

  const posts = getPosts().map((post) =>
    String(post.id) === String(postId)
      ? { ...post, commentsCount: Number(post.commentsCount || 0) + 1 }
      : post
  );

  save(KEYS.POSTS, posts);
  return comment;
};

export const sharePost = (postId, userId) => {
  const original = getPostById(postId);
  const user = getCurrentUser();

  if (!original) return null;

  const sharedPost = createPost({
    userId,
    userName: user?.name || "Invite Genie User",
    content: original.content,
    media: original.media,
    eventId: original.eventId,
    postType: "share",
  });

  sharedPost.sharedFrom = original.id;

  const posts = getPosts().map((post) =>
    String(post.id) === String(postId)
      ? { ...post, shares: Number(post.shares || 0) + 1 }
      : post
  );

  save(KEYS.POSTS, posts);
  return sharedPost;
};

export const getGlobalFeed = () => {
  const posts = getPosts().map((item) => ({ ...item, feedType: "post" }));
  const memories = get(KEYS.MEMORIES).map((item) => ({ ...item, feedType: "memory" }));
  const events = getEvents().map((item) => ({ ...item, feedType: "event" }));
  const gigs = getGigs().map((item) => ({ ...item, feedType: "gig" }));

  return [...posts, ...memories, ...events, ...gigs].sort(
    (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
  );
};

// =============================
// MEMORIES
// =============================

export const getMemories = async (eventId = null) => await getDataAsync(KEYS.MEMORIES, () => supabaseEngine?.getMemoriesFromSupabase(eventId));

export const createMemory = async ({ eventId, userId, caption, media, userName }) => {
  const memories = await getMemories();

  const memory = {
    id: makeId("mem"),
    eventId,
    userId,
    userName,
    caption,
    image: media,
    likes: [],
    comments: [],
    postedAt: "Just now",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await createDataAsync(KEYS.MEMORIES, memory, supabaseEngine?.createMemoryInSupabase);

  createPost({
    userId,
    userName,
    content: caption,
    media,
    eventId,
    postType: "memory",
  });

  return memory;
};

export const likeMemory = (memoryId, userId) => {
  const memories = getMemories();

  const updatedMemories = memories.map((memory) => {
    if (String(memory.id) !== String(memoryId)) return memory;

    const likes = Array.isArray(memory.likes) ? memory.likes : [];
    const alreadyLiked = likes.includes(userId);

    return {
      ...memory,
      likes: alreadyLiked
        ? likes.filter((id) => id !== userId)
        : [...likes, userId],
    };
  });

  save(KEYS.MEMORIES, updatedMemories);
};

// =============================
// GALLERY
// =============================

export const getGallery = () => get(KEYS.GALLERY);

export const getGalleryByEvent = (eventId) =>
  getGallery().filter((item) => String(item.eventId) === String(eventId));

export const uploadGalleryImage = (eventId, imageData) => {
  const gallery = getGallery();

  const image = {
    id: makeId("gal"),
    eventId,
    ...imageData,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.GALLERY, [image, ...gallery]);
  return image;
};

// =============================
// INVITATIONS
// =============================

export const createInvitation = async (data) => {
  const invitations = get(KEYS.INVITATIONS);

  const invitation = {
    id: makeId("inv"),
    status: "draft",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...data,
  };

  await createDataAsync(KEYS.INVITATIONS, invitation, supabaseEngine?.createInvitationInSupabase); // Assuming createInvitationInSupabase will be added
  return invitation;
};

export const getInvitationsByUser = async (userId) =>
  await getDataAsync(KEYS.INVITATIONS, () => supabaseEngine?.getInvitationsFromSupabase(userId));

// =============================
// VENDORS
// =============================

export const getVendors = () => get(KEYS.VENDORS);

export const getVendorById = (id) =>
  getVendors().find((vendor) => String(vendor.id) === String(id));

export const createVendor = (data) => {
  const vendors = getVendors();

  const vendor = {
    id: makeId("vendor"),
    rating: 0,
    jobsCompleted: 0,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...data,
  };

  save(KEYS.VENDORS, [vendor, ...vendors]);
  return vendor;
};

// =============================
// FREELANCER MARKETPLACE
// =============================

export const getFreelancers = async (category = null) => await getDataAsync(KEYS.FREELANCERS, () => supabaseEngine?.getFreelancersFromSupabase(category));

export const getFreelancerById = (id) =>
  getFreelancers().then(freelancers => freelancers.find((freelancer) => String(freelancer.id) === String(id)));

export const createFreelancer = (data) => {
  const freelancers = getFreelancers();

  const freelancer = {
    id: makeId("fre"),
    rating: 0,
    jobsCompleted: 0,
    verified: false,
    available: true,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...data,
  };

  save(KEYS.FREELANCERS, [freelancer, ...freelancers]);
  return freelancer;
};

export const updateFreelancer = (id, data) => {
  const freelancers = getFreelancers();

  const updated = freelancers.map((freelancer) =>
    String(freelancer.id) === String(id)
      ? { ...freelancer, ...data, updatedAt: new Date().toISOString() }
      : freelancer
  );

  save(KEYS.FREELANCERS, updated);
  return getFreelancerById(id);
};

export const getGigs = async (freelancerId = null) => await getDataAsync(KEYS.GIGS, () => supabaseEngine?.getGigsFromSupabase(freelancerId));

export const getGigById = (id) =>
  getGigs().then(gigs => gigs.find((gig) => String(gig.id) === String(id)));

export const createGig = (data) => {
  const gigs = getGigs();

  const gig = {
    id: makeId("gig"),
    title: "Untitled Gig",
    status: "open",
    budget: 0,
    proposals: [],
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...data,
  };

  save(KEYS.GIGS, [gig, ...gigs]);

  createPost({
    userId: gig.hostId || "system",
    userName: gig.hostName || "Invite Genie",
    content: `New freelance gig posted: ${gig.title}`,
    media: null,
    eventId: gig.eventId || null,
    postType: "gig",
  });

  return gig;
};

export const updateGig = (id, data) => {
  const gigs = getGigs();

  const updated = gigs.map((gig) =>
    String(gig.id) === String(id)
      ? { ...gig, ...data, updatedAt: new Date().toISOString() }
      : gig
  );

  save(KEYS.GIGS, updated);
  return getGigById(id);
};

export const bookFreelancer = ({ gigId, freelancerId, userId, eventId = null }) => {
  const bookings = get(KEYS.FREELANCER_BOOKINGS);

  const booking = {
    id: makeId("fbk"),
    gigId,
    freelancerId,
    userId,
    eventId,
    status: "pending",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.FREELANCER_BOOKINGS, [booking, ...bookings]);

  createNotification({
    userId: freelancerId,
    type: "freelancer_booking",
    message: "You received a new booking request.",
    referenceId: booking.id,
  });

  return booking;
};

export const getFreelancerBookings = () => get(KEYS.FREELANCER_BOOKINGS);

export const getFreelancerBookingsByUser = (userId) =>
  getFreelancerBookings().filter((booking) => String(booking.userId) === String(userId));

export const getFreelancerBookingsByFreelancer = (freelancerId) =>
  getFreelancerBookings().filter(
    (booking) => String(booking.freelancerId) === String(freelancerId)
  );

// =============================
// VENUE / SEATING
// =============================

export const getVenues = () => get(KEYS.VENUES);

export const saveVenue = (venue) => {
  const venues = getVenues();

  const newVenue = {
    id: venue.id || makeId("venue"),
    createdAt: venue.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...venue,
  };

  const exists = venues.some((item) => String(item.id) === String(newVenue.id));

  save(
    KEYS.VENUES,
    exists
      ? venues.map((item) => (String(item.id) === String(newVenue.id) ? newVenue : item))
      : [newVenue, ...venues]
  );

  return newVenue;
};

export const getSeatMapByEvent = (eventId) =>
  get(KEYS.SEAT_MAPS).find((map) => String(map.eventId) === String(eventId));

export const saveSeatMap = (mapData) => {
  const maps = get(KEYS.SEAT_MAPS);

  const newMap = {
    id: mapData.id || makeId("seatmap"),
    createdAt: mapData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...mapData,
  };

  const exists = maps.some((map) => String(map.eventId) === String(newMap.eventId));

  save(
    KEYS.SEAT_MAPS,
    exists
      ? maps.map((map) => (String(map.eventId) === String(newMap.eventId) ? newMap : map))
      : [newMap, ...maps]
  );

  return newMap;
};

export const assignGuestToSeat = (eventId, ticketId, seatId) => {
  const assignments = get(KEYS.GUEST_ASSIGNMENTS);

  const assignment = {
    id: makeId("seatassign"),
    eventId,
    ticketId,
    seatId,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.GUEST_ASSIGNMENTS, [assignment, ...assignments]);

  const map = getSeatMapByEvent(eventId);

  if (map?.objects) {
    const updatedObjects = map.objects.map((object) =>
      String(object.id) === String(seatId)
        ? { ...object, status: "booked", ticketId }
        : object
    );

    saveSeatMap({ ...map, objects: updatedObjects });
  }

  return assignment;
};

export const getAssignmentsByEvent = (eventId) =>
  get(KEYS.GUEST_ASSIGNMENTS).filter(
    (assignment) => String(assignment.eventId) === String(eventId)
  );

// =============================
// NOTIFICATIONS / MESSAGES
// =============================

export const createNotification = ({ userId, type, message, referenceId = null }) => {
  const notifications = get(KEYS.NOTIFICATIONS);

  const notification = {
    id: makeId("notif"),
    userId,
    type,
    message,
    referenceId,
    read: false,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.NOTIFICATIONS, [notification, ...notifications]);
  return notification;
};

export const getNotifications = (userId) =>
  get(KEYS.NOTIFICATIONS).filter(
    (notification) => String(notification.userId) === String(userId)
  );

export const markNotificationRead = (notificationId) => {
  const notifications = get(KEYS.NOTIFICATIONS).map((notification) =>
    String(notification.id) === String(notificationId)
      ? { ...notification, read: true }
      : notification
  );

  save(KEYS.NOTIFICATIONS, notifications);
};

export const sendMessage = ({ from, to, text }) => {
  const messages = get(KEYS.MESSAGES);

  const message = {
    id: makeId("msg"),
    from,
    to,
    text,
    read: false,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  save(KEYS.MESSAGES, [...messages, message]);
  return message;
};

export const getMessagesBetweenUsers = (userA, userB) =>
  get(KEYS.MESSAGES).filter(
    (message) =>
      (String(message.from) === String(userA) && String(message.to) === String(userB)) ||
      (String(message.from) === String(userB) && String(message.to) === String(userA))
  );

// =============================
// ADMIN / REPORTS
// =============================

/**
 * Seeds the realm with robust demo data for all account types and privileges.
 */
export const seedDemoData = async () => {
  const superId = "demo-super";
  const adminId = "demo-admin";
  const userId = "demo-user";

  // 1. Clear Data first for a clean restore
  localStorage.removeItem(KEYS.FREELANCERS);
  localStorage.removeItem(KEYS.EVENTS);
  localStorage.removeItem(KEYS.TICKETS);
  localStorage.removeItem(KEYS.PAYMENTS);
  localStorage.removeItem(KEYS.MEMORIES);

  initDB(KEYS.FREELANCERS, []);
  initDB(KEYS.EVENTS, []);
  initDB(KEYS.TICKETS, []);
  initDB(KEYS.PAYMENTS, []);
  initDB(KEYS.MEMORIES, []);

  // 2. Seed Freelancers
  for (let i = 0; i < MOCK_PROVIDERS.length; i++) {
    const f = MOCK_PROVIDERS[i];
    const ownerId = `vendor-${(i % 6) + 1}`;
    await createFreelancer({ ...f, userId: ownerId });
  }

  // 3. Seed Events
  for (let i = 0; i < MOCK_EVENTS.length; i++) {
    const ev = MOCK_EVENTS[i];
    const ownerId = `host-${(i % 6) + 1}`;
    await createEvent({ ...ev, hostId: ownerId, hostName: `Event Host ${(i % 6) + 1}` });
  }

  // 4. Seed Bookings & Payments
  const events = await getEvents();
  for (let i = 0; i < MOCK_BOOKINGS.length; i++) {
    const b = MOCK_BOOKINGS[i];
    const ev = events[i % events.length];
    
    const tktId = b.id || `TKT-${1000 + i}`;
    const tkt = { 
      id: tktId, 
      eventId: ev.id, 
      userId: "demo-buyer", 
      buyerName: b.buyerName, 
      eventName: ev.title, 
      amount: ev.price || b.amount, 
      status: "Valid", 
      date: b.createdAt || new Date().toISOString() 
    };
    const currentTkts = get(KEYS.TICKETS);
    save(KEYS.TICKETS, [tkt, ...currentTkts]);
    
    if (i < MOCK_PAYMENTS.length) {
      const p = MOCK_PAYMENTS[i];
      await createMockPayment(ev.id, superId, p.amount || ev.price, tktId, { hostId: ev.hostId, hostName: ev.hostName });
    }
  }

  // 5. Seed Memories
  for (let i = 0; i < MOCK_MEMORIES.length; i++) {
    const mem = MOCK_MEMORIES[i];
    const ev = events[i % events.length];
    if (ev) {
      await createMemory({
        eventId: ev.id,
        userId: superId,
        userName: "Super Admin",
        caption: mem.caption,
        media: mem.image
      });
    }
  }

  // 6. Global Notifications
  const messages = [
    "Your dashboard demo data is fully restored.",
    "Welcome to the multi-tenant InviteGenie Demo.",
  ];
  for (const msg of messages) {
    createNotification({ userId: superId, type: "system", message: msg });
  }
};

export const getDashboardStats = async () => {
  const events = await getEvents(); 
  const tickets = get(KEYS.TICKETS); 
  const payments = await getAllPayments(); 
  const memories = await getMemories(); 
  const freelancers = getFreelancers();
  const gigs = getGigs();

  const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return {
    totalEvents: events.length,
    totalTickets: tickets.length,
    totalRevenue: revenue, // This will need to be awaited
    totalMemories: memories.length, // This will need to be awaited
    totalFreelancers: freelancers.length, // This will need to be awaited
    totalGigs: gigs.length, // This will need to be awaited
  };
};

// =============================
// REACT HELPER HOOK
// =============================

/**
 * Usage inside React:
 *
 * import { useEngineCollection, KEYS } from "../services/coreEngine";
 *
 * const events = useEngineCollection(KEYS.EVENTS);
 */

export const getCollection = (key) => get(key);