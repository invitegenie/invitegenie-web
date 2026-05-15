export const EVENT_STORAGE_KEY = "invitegenie_events";
export const LEGACY_EVENT_STORAGE_KEYS = ["demo_events", "ig_events"];
export const ALL_EVENT_STORAGE_KEYS = [EVENT_STORAGE_KEY, ...LEGACY_EVENT_STORAGE_KEYS];

function safeParseArray(value, key = "events") {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`InviteGenie could not parse ${key}; falling back to an empty list.`, error);
    return [];
  }
}

function makeEventId() {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getOrigin() {
  return typeof window !== "undefined" ? window.location.origin : "https://invitegenie.local";
}

function qrForEvent(eventId) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${getOrigin()}/events/${eventId}`)}`;
}

export function normalizeEventForStorage(event = {}) {
  const id = event.id || makeEventId();
  const createdAt = event.createdAt || event.created_at || new Date().toISOString();
  const website = event.website || event.eventWebsiteExperience || null;
  const totalTickets = Number(event.totalTickets || 100);
  const ticketsSold = Number(event.ticketsSold || 0);
  const location =
    event.location ||
    [event.venueName, event.city, event.country].filter(Boolean).join(", ") ||
    "Location to be confirmed";

  return {
    status: event.status || "ACTIVE",
    currency: event.currency || "FCFA",
    totalTickets,
    ticketsSold,
    availableTickets: Number(event.availableTickets ?? Math.max(totalTickets - ticketsSold, 0)),
    price: Number(event.price || 0),
    category: event.category || event.type || "Private Event",
    title: event.title || "Untitled Event",
    description: event.description || event.shortSummary || "A premium InviteGenie event experience.",
    location,
    date: event.date || "",
    time: event.time || event.startTime || "18:00",
    image: event.image || event.coverImage || "",
    coverImage: event.coverImage || event.image || "",
    qrCodeUrl: event.qrCodeUrl || qrForEvent(id),
    createdAt,
    timestamp: Number(event.timestamp || new Date(createdAt).getTime() || Date.now()),
    ...event,
    id,
    website,
    eventWebsiteExperience: event.eventWebsiteExperience || website,
  };
}

function dedupeEvents(events) {
  const byId = new Map();
  events.filter(Boolean).forEach((event) => {
    const normalized = normalizeEventForStorage(event);
    const existing = byId.get(String(normalized.id));
    if (!existing) {
      byId.set(String(normalized.id), normalized);
      return;
    }
    const existingUpdated = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
    const nextUpdated = new Date(normalized.updatedAt || normalized.createdAt || 0).getTime();
    byId.set(String(normalized.id), nextUpdated >= existingUpdated ? { ...existing, ...normalized } : existing);
  });
  return Array.from(byId.values()).sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
}

export function writeEventsToStorage(events) {
  const normalizedEvents = dedupeEvents(Array.isArray(events) ? events : []);
  if (typeof localStorage === "undefined") return normalizedEvents;

  try {
    ALL_EVENT_STORAGE_KEYS.forEach((key) => {
      localStorage.setItem(key, JSON.stringify(normalizedEvents));
      window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: normalizedEvents } }));
    });
  } catch (error) {
    console.warn("InviteGenie could not persist events to localStorage.", error);
  }

  return normalizedEvents;
}

export function readEventsFromStorage(seedEvents = []) {
  if (typeof localStorage === "undefined") return dedupeEvents(seedEvents);

  const canonicalRaw = localStorage.getItem(EVENT_STORAGE_KEY);
  const canonicalEvents = safeParseArray(canonicalRaw, EVENT_STORAGE_KEY);
  const legacyEvents = LEGACY_EVENT_STORAGE_KEYS.flatMap((key) => safeParseArray(localStorage.getItem(key), key));
  const collections = [...canonicalEvents, ...legacyEvents];
  const events = collections.length ? dedupeEvents(collections) : dedupeEvents(seedEvents);
  const canonicalIds = new Set(canonicalEvents.map((event) => String(event.id)));
  const needsSync =
    !canonicalRaw ||
    !canonicalEvents.length ||
    events.length !== canonicalEvents.length ||
    events.some((event) => !canonicalIds.has(String(event.id)));

  if (needsSync) writeEventsToStorage(events);
  return events;
}

export function appendEventToStorage(eventData, seedEvents = []) {
  const events = readEventsFromStorage(seedEvents);
  const event = normalizeEventForStorage(eventData);
  const nextEvents = [event, ...events.filter((item) => String(item.id) !== String(event.id))];
  writeEventsToStorage(nextEvents);
  return event;
}

export function updateEventInStorage(eventId, updates, seedEvents = []) {
  const events = readEventsFromStorage(seedEvents);
  let found = false;
  const nextEvents = events.map((event) => {
    if (String(event.id) !== String(eventId)) return event;
    found = true;
    return normalizeEventForStorage({ ...event, ...updates, updatedAt: new Date().toISOString() });
  });

  if (!found) {
    console.warn(`InviteGenie could not update event ${eventId}; event was not found.`);
  }

  writeEventsToStorage(nextEvents);
  return nextEvents.find((event) => String(event.id) === String(eventId)) || null;
}
