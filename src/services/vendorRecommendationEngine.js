import { mockVendors, SMART_VENDOR_STORAGE_KEY } from "../data/vendors";

const SCORE_WEIGHTS = {
  location: 30,
  category: 25,
  budget: 20,
  rating: 15,
  availability: 25,
  style: 20,
  capacity: 15,
};

const MAX_SCORE = Object.values(SCORE_WEIGHTS).reduce((sum, value) => sum + value, 0);

const EVENT_CATEGORY_MAP = {
  wedding: ["Catering", "Makeup", "Photography", "DJ", "Decor", "Hotels", "Transportation", "Security"],
  weddings: ["Catering", "Makeup", "Photography", "DJ", "Decor", "Hotels", "Transportation", "Security"],
  gala: ["Catering", "Photography", "DJ", "Decor", "Hotels", "Transportation", "Security", "Makeup"],
  corporate: ["Catering", "Photography", "Decor", "Hotels", "Transportation", "Security", "DJ"],
  conference: ["Catering", "Photography", "Decor", "Hotels", "Transportation", "Security"],
  music: ["DJ", "Security", "Photography", "Transportation", "Catering", "Hotels"],
  concert: ["DJ", "Security", "Photography", "Transportation", "Catering", "Hotels"],
  concerts: ["DJ", "Security", "Photography", "Transportation", "Catering", "Hotels"],
  fashion: ["Photography", "Makeup", "DJ", "Decor", "Transportation", "Hotels", "Security"],
  cultural: ["Catering", "Photography", "DJ", "Decor", "Transportation", "Security"],
  fundraiser: ["Catering", "Photography", "Decor", "DJ", "Transportation", "Security"],
  networking: ["Catering", "Photography", "Hotels", "Transportation", "Decor"],
  private: ["Catering", "Photography", "DJ", "Decor", "Transportation", "Security"],
};

const BUDGET_RANK = {
  budget: 1,
  elegant: 1,
  mid: 2,
  standard: 2,
  premium: 3,
  high: 3,
  luxury: 4,
  ultra: 4,
};

const CITY_GROUPS = [
  ["douala", "buea", "limbe", "kribi"],
  ["yaounde", "mfoundi"],
  ["bafoussam", "bamenda"],
  ["lagos", "accra", "abidjan"],
];

function safeParseArray(rawValue, fallback = []) {
  try {
    const parsed = rawValue ? JSON.parse(rawValue) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn("InviteGenie vendor recommendations could not parse storage.", error);
    return fallback;
  }
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredVendors() {
  if (!canUseStorage()) return mockVendors;

  const stored = safeParseArray(localStorage.getItem(SMART_VENDOR_STORAGE_KEY), []);
  if (stored.length) return stored;

  localStorage.setItem(SMART_VENDOR_STORAGE_KEY, JSON.stringify(mockVendors));
  window.dispatchEvent(
    new CustomEvent("invitegenie:data-change", {
      detail: { key: SMART_VENDOR_STORAGE_KEY, data: mockVendors },
    })
  );
  return mockVendors;
}

export function saveStoredVendors(vendors) {
  const nextVendors = Array.isArray(vendors) ? vendors : [];
  if (!canUseStorage()) return nextVendors;

  localStorage.setItem(SMART_VENDOR_STORAGE_KEY, JSON.stringify(nextVendors));
  window.dispatchEvent(
    new CustomEvent("invitegenie:data-change", {
      detail: { key: SMART_VENDOR_STORAGE_KEY, data: nextVendors },
    })
  );
  return nextVendors;
}

export function buildVendorRecommendationInputFromEvent(event = {}) {
  return {
    eventType: event.eventType || event.category || event.type || event.title || "",
    location: event.location || [event.venueName, event.city, event.country].filter(Boolean).join(", "),
    guestCount: event.guestCount || event.totalTickets || event.capacity || event.expectedGuests || 0,
    budget: event.budget || event.budgetTier || event.price || event.ticketPrice || "",
    theme:
      event.theme ||
      event.themePreference ||
      event.aiArtDirection?.style ||
      event.website?.designSystem?.uiMood ||
      event.eventWebsiteExperience?.designSystem?.uiMood ||
      "",
    style: [
      event.style,
      event.shortSummary,
      event.description,
      event.website?.eventBranding?.visualStyleDirection,
      event.eventWebsiteExperience?.eventBranding?.visualStyleDirection,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export function recommendVendors(eventInput = {}, options = {}) {
  const vendors = Array.isArray(options.vendors) ? options.vendors : getStoredVendors();
  const normalizedEvent = normalizeEventInput(eventInput);
  const limit = Number(options.limit || 8);

  return vendors
    .map((vendor) => scoreVendor(vendor, normalizedEvent))
    .sort((left, right) => right.score - left.score || right.rating - left.rating)
    .slice(0, limit)
    .map((recommendation, index) => ({ ...recommendation, rank: index + 1 }));
}

export function getRecommendationInsight(eventInput = {}, recommendations = []) {
  const normalizedEvent = normalizeEventInput(eventInput);
  const topCategories = unique(recommendations.map((vendor) => vendor.category)).slice(0, 4);
  const location = normalizedEvent.location || "your event location";
  const eventType = normalizedEvent.eventType || "event";
  const guestText = normalizedEvent.guestCount ? `${normalizedEvent.guestCount} guests` : "your guest size";
  const categoriesText = topCategories.length ? topCategories.join(", ") : "trusted vendors";

  return `InviteGenie AI selected ${categoriesText} because they match your ${eventType} profile, ${guestText}, ${location}, budget fit, availability, and style signals.`;
}

function scoreVendor(vendor, eventInput) {
  const categoryScore = getCategoryScore(vendor, eventInput);
  const locationScore = getLocationScore(vendor, eventInput);
  const budgetScore = getBudgetScore(vendor, eventInput);
  const ratingScore = Math.round((Number(vendor.rating || 0) / 5) * SCORE_WEIGHTS.rating);
  const availabilityScore = getAvailabilityScore(vendor);
  const styleScore = getStyleScore(vendor, eventInput);
  const capacityScore = getCapacityScore(vendor, eventInput);

  const rawScore =
    categoryScore +
    locationScore +
    budgetScore +
    ratingScore +
    availabilityScore +
    styleScore +
    capacityScore;
  const score = Math.min(100, Math.round((rawScore / MAX_SCORE) * 100));

  return {
    ...vendor,
    score,
    rawScore,
    scoreBreakdown: {
      location: locationScore,
      category: categoryScore,
      budget: budgetScore,
      rating: ratingScore,
      availability: availabilityScore,
      style: styleScore,
      capacity: capacityScore,
    },
    matchReasons: buildMatchReasons({
      vendor,
      eventInput,
      locationScore,
      categoryScore,
      budgetScore,
      availabilityScore,
      styleScore,
      capacityScore,
    }),
    recommendationLabel: getRecommendationLabel(vendor),
  };
}

function normalizeEventInput(input = {}) {
  const eventType = normalizeText(input.eventType || input.category || input.title || "");
  const location = input.location || [input.venueName, input.city, input.country].filter(Boolean).join(", ");
  const guestCount = Number(input.guestCount || input.totalTickets || input.capacity || 0);
  const budgetTier = getBudgetTier(input.budget || input.price || input.ticketPrice || "");
  const styleText = [input.theme, input.style, input.description, input.eventType]
    .filter(Boolean)
    .join(" ");

  return {
    ...input,
    eventType,
    location,
    city: getCity(location),
    guestCount,
    budgetTier,
    preferredCategories: getPreferredCategories(eventType),
    styleTokens: tokenize(`${styleText} ${budgetTier}`),
  };
}

function getPreferredCategories(eventType) {
  const key = Object.keys(EVENT_CATEGORY_MAP).find((eventKey) => eventType.includes(eventKey));
  return key ? EVENT_CATEGORY_MAP[key] : ["Catering", "Photography", "DJ", "Decor", "Transportation", "Security"];
}

function getCategoryScore(vendor, eventInput) {
  if (eventInput.preferredCategories.includes(vendor.category)) return SCORE_WEIGHTS.category;
  const vendorCategory = normalizeText(vendor.category);
  const hasSoftMatch = eventInput.preferredCategories.some((category) =>
    normalizeText(category).includes(vendorCategory)
  );
  return hasSoftMatch ? Math.round(SCORE_WEIGHTS.category * 0.65) : Math.round(SCORE_WEIGHTS.category * 0.25);
}

function getLocationScore(vendor, eventInput) {
  const vendorCity = getCity(vendor.location);
  if (!eventInput.city || !vendorCity) return Math.round(SCORE_WEIGHTS.location * 0.3);
  if (vendorCity === eventInput.city) return SCORE_WEIGHTS.location;
  if (isNearbyCity(vendorCity, eventInput.city)) return Math.round(SCORE_WEIGHTS.location * 0.65);
  if (normalizeText(vendor.location).includes("cameroon") && normalizeText(eventInput.location).includes("cameroon")) {
    return Math.round(SCORE_WEIGHTS.location * 0.45);
  }
  return Math.round(SCORE_WEIGHTS.location * 0.15);
}

function getBudgetScore(vendor, eventInput) {
  const vendorRank = BUDGET_RANK[normalizeText(vendor.pricingTier)] || 2;
  const eventRank = BUDGET_RANK[eventInput.budgetTier] || 2;
  const difference = Math.abs(eventRank - vendorRank);

  if (difference === 0) return SCORE_WEIGHTS.budget;
  if (vendorRank < eventRank) return Math.max(12, SCORE_WEIGHTS.budget - difference * 4);
  return Math.max(5, SCORE_WEIGHTS.budget - difference * 7);
}

function getAvailabilityScore(vendor) {
  const status = normalizeText(vendor.availability?.status || vendor.availability || "available");
  if (status.includes("available")) return SCORE_WEIGHTS.availability;
  if (status.includes("limited")) return Math.round(SCORE_WEIGHTS.availability * 0.6);
  if (status.includes("waitlist")) return Math.round(SCORE_WEIGHTS.availability * 0.35);
  return 0;
}

function getStyleScore(vendor, eventInput) {
  const vendorTokens = tokenize(
    [...(vendor.styles || []), ...(vendor.tags || []), ...(vendor.services || [])].join(" ")
  );
  if (!eventInput.styleTokens.length || !vendorTokens.length) return Math.round(SCORE_WEIGHTS.style * 0.35);

  const overlap = eventInput.styleTokens.filter((token) => vendorTokens.includes(token));
  const ratio = Math.min(overlap.length / Math.max(eventInput.styleTokens.length, 1), 1);
  return Math.max(Math.round(SCORE_WEIGHTS.style * ratio), overlap.length ? 9 : 4);
}

function getCapacityScore(vendor, eventInput) {
  const guestCount = Number(eventInput.guestCount || 0);
  if (!guestCount) return Math.round(SCORE_WEIGHTS.capacity * 0.55);

  const capacity = vendor.guestCapacity || {};
  const maxCapacity = Number(capacity.max || capacity || 0);
  const minCapacity = Number(capacity.min || 0);

  if (!maxCapacity) return Math.round(SCORE_WEIGHTS.capacity * 0.45);
  if (guestCount >= minCapacity && guestCount <= maxCapacity) return SCORE_WEIGHTS.capacity;
  if (guestCount <= maxCapacity * 1.2) return Math.round(SCORE_WEIGHTS.capacity * 0.6);
  return Math.round(SCORE_WEIGHTS.capacity * 0.25);
}

function getBudgetTier(value) {
  if (typeof value === "number") {
    if (value >= 75000) return "luxury";
    if (value >= 25000) return "premium";
    if (value >= 10000) return "mid";
    return "budget";
  }

  const text = normalizeText(String(value || ""));
  if (text.includes("luxury") || text.includes("high") || text.includes("vip")) return "luxury";
  if (text.includes("premium")) return "premium";
  if (text.includes("elegant") || text.includes("standard") || text.includes("mid")) return "mid";
  if (text.includes("budget") || text.includes("low")) return "budget";
  return "mid";
}

function buildMatchReasons(scores) {
  const reasons = [];
  const { vendor, eventInput } = scores;

  if (scores.categoryScore >= 20) reasons.push(`${vendor.category} fits this ${eventInput.eventType || "event"}`);
  if (scores.locationScore >= 18) reasons.push(`Strong location fit for ${eventInput.location || "the venue"}`);
  if (scores.budgetScore >= 16) reasons.push(`${titleCase(vendor.pricingTier)} budget fit`);
  if (scores.availabilityScore >= 20) reasons.push(vendor.availability?.note || "Available for this event profile");
  if (scores.styleScore >= 9) reasons.push("Style signals match the event mood");
  if (scores.capacityScore >= 12) reasons.push("Can support the expected guest size");

  return reasons.slice(0, 4);
}

function getRecommendationLabel(vendor) {
  if (vendor.luxuryPick) return "Luxury Pick";
  if (vendor.mostBooked) return "Most Booked";
  if (vendor.trending) return "Trending";
  if (vendor.budgetFriendly) return "Budget Friendly";
  return "Recommended";
}

function getCity(location = "") {
  return normalizeText(String(location).split(",")[0] || location);
}

function isNearbyCity(cityA, cityB) {
  return CITY_GROUPS.some((group) => group.includes(cityA) && group.includes(cityB));
}

function tokenize(value = "") {
  return unique(
    normalizeText(value)
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2)
  );
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function titleCase(value = "") {
  return String(value)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
