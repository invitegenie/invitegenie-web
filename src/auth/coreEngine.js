/**
 * Invite Genie Core Engine
 * Event management + tickets + feed + freelancer marketplace
 * LocalStorage MVP with live subscriptions for React components.
 */

import {
  MOCK_EVENTS,
  MOCK_MEMORIES,
  MOCK_BOOKINGS,
  MOCK_PAYMENTS,
} from "../services/mockData";

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

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  notify(key, data);
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data } }));
  return data;
};

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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

export const getEvents = () => get(KEYS.EVENTS);

export const getEventById = (id) =>
  getEvents().find((event) => String(event.id) === String(id));

export const createEvent = (eventData) => {
  const events = getEvents();

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

  save(KEYS.EVENTS, [newEvent, ...events]);

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

export const updateEvent = (id, data) => {
  const events = getEvents();

  const updatedEvents = events.map((event) =>
    String(event.id) === String(id)
      ? { ...event, ...data, updatedAt: new Date().toISOString() }
      : event
  );

  save(KEYS.EVENTS, updatedEvents);
  return getEventById(id);
};

export const deleteEvent = (id) => {
  const events = getEvents().filter((event) => String(event.id) !== String(id));
  save(KEYS.EVENTS, events);
  return true;
};

export const getEventsByHost = (hostId) =>
  getEvents().filter((event) => String(event.hostId) === String(hostId));

// =============================
// TICKETS / PAYMENTS
// =============================

export const buyTicket = (eventId, userId, ticketType = "Standard") => {
  const event = getEventById(eventId);
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

  const tickets = get(KEYS.TICKETS);
  save(KEYS.TICKETS, [ticket, ...tickets]);

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

export const getTicketsByUser = (userId) =>
  get(KEYS.TICKETS).filter((ticket) => String(ticket.userId) === String(userId));

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

export const createMockPayment = (eventId, userId, amount, ticketId = null) => {
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

  save(KEYS.PAYMENTS, [payment, ...payments]);
  return payment;
};

export const getAllPayments = () => get(KEYS.PAYMENTS);

export const getPaymentsByUser = (userId) =>
  getAllPayments().filter((payment) => String(payment.userId) === String(userId));

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

export const getMemories = () => get(KEYS.MEMORIES);

export const createMemory = ({ eventId, userId, caption, media, userName }) => {
  const memories = getMemories();

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

  save(KEYS.MEMORIES, [memory, ...memories]);

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

export const createInvitation = (data) => {
  const invitations = get(KEYS.INVITATIONS);

  const invitation = {
    id: makeId("inv"),
    status: "draft",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    ...data,
  };

  save(KEYS.INVITATIONS, [invitation, ...invitations]);
  return invitation;
};

export const getInvitationsByUser = (userId) =>
  get(KEYS.INVITATIONS).filter((item) => String(item.userId) === String(userId));

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

export const getFreelancers = () => get(KEYS.FREELANCERS);

export const getFreelancerById = (id) =>
  getFreelancers().find((freelancer) => String(freelancer.id) === String(id));

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

export const getGigs = () => get(KEYS.GIGS);

export const getGigById = (id) =>
  getGigs().find((gig) => String(gig.id) === String(id));

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

export const getDashboardStats = () => {
  const events = getEvents();
  const tickets = get(KEYS.TICKETS);
  const payments = getAllPayments();
  const memories = getMemories();
  const freelancers = getFreelancers();
  const gigs = getGigs();

  const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return {
    totalEvents: events.length,
    totalTickets: tickets.length,
    totalRevenue: revenue,
    totalMemories: memories.length,
    totalFreelancers: freelancers.length,
    totalGigs: gigs.length,
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