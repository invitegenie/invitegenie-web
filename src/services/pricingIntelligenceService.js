export const COMPETITOR_PRICING_KEY = "demo_competitor_pricing";

const FALLBACK_COMPETITORS = [
  {
    id: "comp-catering-1",
    name: "Maison Saveurs Prestige",
    category: "Catering",
    location: "Douala",
    priceRange: [65000, 145000],
    rating: 4.7,
    positioning: "Premium buffet and private event catering",
  },
  {
    id: "comp-catering-2",
    name: "Bantu Table Events",
    category: "Catering",
    location: "Yaounde",
    priceRange: [50000, 120000],
    rating: 4.5,
    positioning: "Modern Cameroonian menus for weddings and birthdays",
  },
  {
    id: "comp-beauty-1",
    name: "Queen Glow Studio",
    category: "Beauty",
    location: "Douala",
    priceRange: [12000, 55000],
    rating: 4.8,
    positioning: "Luxury facial, makeup, lashes, and bridal prep",
  },
  {
    id: "comp-beauty-2",
    name: "Naya Spa Signature",
    category: "Beauty",
    location: "Buea",
    priceRange: [10000, 45000],
    rating: 4.6,
    positioning: "Spa care and glow treatments for premium clients",
  },
  {
    id: "comp-photo-1",
    name: "Kamer Lens Atelier",
    category: "Photography",
    location: "Douala",
    priceRange: [85000, 300000],
    rating: 4.9,
    positioning: "Editorial wedding and corporate photography",
  },
  {
    id: "comp-dj-1",
    name: "Pulse Afrique DJ",
    category: "DJ",
    location: "Yaounde",
    priceRange: [75000, 250000],
    rating: 4.7,
    positioning: "Afrobeats, bikutsi, makossa, and corporate event sound",
  },
  {
    id: "comp-decor-1",
    name: "Or Royal Decor",
    category: "Decor",
    location: "Douala",
    priceRange: [150000, 750000],
    rating: 4.8,
    positioning: "Luxury floral design, stage styling, and table decor",
  },
  {
    id: "comp-hotel-1",
    name: "Hotel Atrium Executive",
    category: "Hotel",
    location: "Douala",
    priceRange: [55000, 180000],
    rating: 4.5,
    positioning: "Corporate rooms, bridal suites, and event guest blocks",
  },
  {
    id: "comp-transport-1",
    name: "Prestige Mobility CM",
    category: "Transportation",
    location: "Douala",
    priceRange: [45000, 220000],
    rating: 4.6,
    positioning: "VIP cars, bridal convoy, airport pickup, and event logistics",
  },
];

const CATEGORY_BENCHMARKS = {
  catering: { min: 50000, max: 160000, premium: 220000 },
  beauty: { min: 10000, max: 60000, premium: 85000 },
  photography: { min: 75000, max: 280000, premium: 450000 },
  dj: { min: 65000, max: 260000, premium: 400000 },
  decor: { min: 120000, max: 650000, premium: 1200000 },
  hotel: { min: 45000, max: 180000, premium: 280000 },
  transportation: { min: 35000, max: 220000, premium: 350000 },
  default: { min: 15000, max: 95000, premium: 180000 },
};

export function getDemoCompetitorPricing() {
  if (typeof localStorage === "undefined") return FALLBACK_COMPETITORS;
  const stored = safeParse(localStorage.getItem(COMPETITOR_PRICING_KEY), null);
  if (Array.isArray(stored) && stored.length) return stored;
  localStorage.setItem(COMPETITOR_PRICING_KEY, JSON.stringify(FALLBACK_COMPETITORS));
  return FALLBACK_COMPETITORS;
}

export function generatePricingSuggestion(context = {}) {
  const service = context.service || context.selectedService || {};
  const provider = context.provider || {};
  const category = normalizeCategory(service.category || provider.category || context.category);
  const benchmark = CATEGORY_BENCHMARKS[category] || CATEGORY_BENCHMARKS.default;
  const currentPrice = toNumber(service.price, Math.round((benchmark.min + benchmark.max) / 2));
  const relatedCompetitors = findRelatedCompetitors({
    category,
    location: context.city || provider.location || service.location,
  });
  const marketAverage = relatedCompetitors.length
    ? average(relatedCompetitors.map((item) => midpoint(item.priceRange)))
    : (benchmark.min + benchmark.max) / 2;

  const rating = toNumber(provider.rating || service.rating || context.rating, 4.5);
  const bookingCount = toNumber(provider.completedJobs || service.bookingCount || context.bookingCount, 12);
  const demandLevel = getDemandLevel({ category, bookingCount, goal: context.campaignGoal || context.goal });
  const ratingMultiplier = rating >= 4.8 ? 1.14 : rating >= 4.5 ? 1.08 : rating >= 4.2 ? 1.02 : 0.96;
  const demandMultiplier = demandLevel === "High" ? 1.12 : demandLevel === "Medium" ? 1.05 : 0.98;
  const budgetMultiplier = getBudgetMultiplier(context.budget || context.budgetTier);
  const rawSuggestion = marketAverage * ratingMultiplier * demandMultiplier * budgetMultiplier;
  const suggestedPrice = clamp(roundToNearest(rawSuggestion, 5000), benchmark.min, benchmark.premium);
  const minPrice = clamp(roundToNearest(suggestedPrice * 0.88, 5000), benchmark.min, benchmark.premium);
  const maxPrice = clamp(roundToNearest(suggestedPrice * 1.18, 5000), benchmark.min, benchmark.premium);
  const confidence = Math.min(94, Math.max(68, 70 + relatedCompetitors.length * 5 + Math.round((rating - 4) * 10)));

  return {
    currentPrice,
    suggestedPrice,
    minPrice,
    maxPrice,
    currency: "FCFA",
    marketEstimate: roundToNearest(marketAverage, 5000),
    demandLevel,
    budgetTier: context.budget || context.budgetTier || "Standard",
    confidence,
    pricingStrategy:
      suggestedPrice > currentPrice
        ? "Move toward a premium anchor price and add a limited booking incentive instead of discounting the full service."
        : "Keep the current price as a conversion offer and use add-ons to lift average order value.",
    reason: `Your current price is FCFA ${formatNumber(currentPrice)}. Based on similar ${displayCategory(category)} vendors around ${provider.location || context.city || "your target city"} and a ${rating.toFixed(1)} rating signal, InviteGenie suggests FCFA ${formatNumber(minPrice)}-${formatNumber(maxPrice)}.`,
  };
}

export function generateCompetitorPricingAnalysis(context = {}) {
  const service = context.service || context.selectedService || {};
  const provider = context.provider || {};
  const category = normalizeCategory(service.category || provider.category || context.category);
  const location = context.city || provider.location || service.location || "Douala";
  const currentPrice = toNumber(service.price, CATEGORY_BENCHMARKS[category]?.min || CATEGORY_BENCHMARKS.default.min);
  const competitors = findRelatedCompetitors({ category, location });
  const source = competitors.length ? competitors : getDemoCompetitorPricing().slice(0, 4);
  const competitorAverage = roundToNearest(average(source.map((item) => midpoint(item.priceRange))), 5000);
  const premiumVendorAverage = roundToNearest(average(source.map((item) => item.priceRange?.[1] || competitorAverage)) * 1.16, 5000);
  const suggestion = generatePricingSuggestion({ ...context, service, provider });

  return {
    summary: `${provider.name || provider.businessName || "Your business"} is positioned against ${source.length} comparable ${displayCategory(category)} vendors in ${location}.`,
    you: {
      name: provider.name || provider.businessName || "You",
      category: displayCategory(category),
      location,
      priceRange: [currentPrice, currentPrice],
      rating: toNumber(provider.rating || context.rating, 4.5),
      positioning: "Current InviteGenie storefront price",
    },
    competitorAverage,
    premiumVendorAverage,
    suggestedPrice: suggestion.suggestedPrice,
    recommendation:
      currentPrice < competitorAverage
        ? "You are priced below the local average. Use stronger proof, reviews, and a premium package tier before increasing price."
        : "You are already near premium territory. Keep the price and strengthen conversion with scarcity, testimonials, and clear inclusions.",
    competitors: source.map((item) => ({
      ...item,
      priceRangeText: `FCFA ${formatNumber(item.priceRange?.[0])}-${formatNumber(item.priceRange?.[1])}`,
    })),
  };
}

function findRelatedCompetitors({ category, location }) {
  const normalizedLocation = String(location || "").toLowerCase();
  return getDemoCompetitorPricing()
    .filter((item) => normalizeCategory(item.category) === category)
    .sort((a, b) => {
      const aLocal = String(a.location || "").toLowerCase() === normalizedLocation ? 1 : 0;
      const bLocal = String(b.location || "").toLowerCase() === normalizedLocation ? 1 : 0;
      return bLocal - aLocal || (b.rating || 0) - (a.rating || 0);
    });
}

function normalizeCategory(value = "") {
  const text = String(value).toLowerCase();
  if (/cater|buffet|food|menu|cuisine/.test(text)) return "catering";
  if (/beauty|makeup|spa|visage|facial|hair|cils|laser|hammam/.test(text)) return "beauty";
  if (/photo|video|camera|shoot/.test(text)) return "photography";
  if (/dj|music|sound|entertain/.test(text)) return "dj";
  if (/decor|floral|stage|design/.test(text)) return "decor";
  if (/hotel|suite|room|venue/.test(text)) return "hotel";
  if (/transport|car|mobility|driver|shuttle/.test(text)) return "transportation";
  return "default";
}

function displayCategory(category) {
  const labels = {
    catering: "catering",
    beauty: "beauty and spa",
    photography: "photography",
    dj: "music and DJ",
    decor: "decor",
    hotel: "hotel",
    transportation: "transportation",
    default: "service",
  };
  return labels[category] || labels.default;
}

function getDemandLevel({ category, bookingCount, goal }) {
  const goalText = String(goal || "").toLowerCase();
  if (/weekend|launch|wedding|luxury/.test(goalText)) return "High";
  if (["catering", "beauty", "photography", "decor"].includes(category) && Number(bookingCount) >= 15) return "High";
  if (Number(bookingCount) >= 6) return "Medium";
  return "Emerging";
}

function getBudgetMultiplier(value = "") {
  const text = String(value).toLowerCase();
  if (/high|luxury|premium|enterprise|business/.test(text)) return 1.15;
  if (/low|free|basic|budget/.test(text)) return 0.92;
  return 1;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("InviteGenie competitor pricing data could not be parsed.", error);
    return fallback;
  }
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function midpoint(range = []) {
  const min = toNumber(range[0], 0);
  const max = toNumber(range[1], min);
  return (min + max) / 2;
}

function average(values = []) {
  const clean = values.map((value) => Number(value)).filter(Number.isFinite);
  if (!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function roundToNearest(value, step = 1000) {
  return Math.round(Number(value || 0) / step) * step;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("fr-CM");
}
