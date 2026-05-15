import { ACCOUNT_TYPES, getAccountType, getNextPlan } from "./accountCapabilities";
import {
  generateCompetitorPricingAnalysis as generateLocalCompetitorPricingAnalysis,
  generatePricingSuggestion as generateLocalPricingSuggestion,
} from "./pricingIntelligenceService";

export const AI_MARKETING_STORAGE_KEYS = {
  history: "demo_ai_marketing_history",
  usage: "demo_ai_marketing_usage",
  brandVoice: "demo_brand_voice_profiles",
  competitors: "demo_competitor_pricing",
  savedCampaigns: "demo_saved_campaigns",
};

export const BRAND_VOICE_PRESETS = [
  "Luxury",
  "Friendly",
  "Corporate",
  "Youthful",
  "Romantic",
  "Premium African",
  "Minimalist",
];

export const AI_MARKETING_LIMITS = {
  [ACCOUNT_TYPES.FREE]: 3,
  [ACCOUNT_TYPES.PRO]: 100,
  [ACCOUNT_TYPES.BUSINESS]: 1000,
  [ACCOUNT_TYPES.ENTERPRISE]: Infinity,
};

export const MARKETING_MODULES = [
  {
    id: "flyer",
    label: "Flyer Generator",
    icon: "imagesmode",
    description: "Create polished flyer copy and a premium preview concept.",
    permission: "generate_flyers",
    minimumPlan: ACCOUNT_TYPES.PRO,
  },
  {
    id: "promo_caption",
    label: "Promo Caption",
    icon: "campaign",
    description: "Generate captions for Instagram, Facebook, TikTok, and general posts.",
    permission: "generate_promo_captions",
    minimumPlan: ACCOUNT_TYPES.FREE,
  },
  {
    id: "whatsapp_ad",
    label: "WhatsApp Ad",
    icon: "forum",
    description: "Write broadcast-ready WhatsApp booking copy.",
    permission: "generate_whatsapp_ads",
    minimumPlan: ACCOUNT_TYPES.FREE,
  },
  {
    id: "instagram_carousel",
    label: "Instagram Carousel",
    icon: "view_carousel",
    description: "Plan a 5-slide carousel with a hook, proof, and CTA.",
    permission: "generate_instagram_carousels",
    minimumPlan: ACCOUNT_TYPES.PRO,
  },
  {
    id: "email_campaign",
    label: "Email Campaign",
    icon: "mark_email_read",
    description: "Generate subject lines, body copy, and follow-up emails.",
    permission: "generate_email_campaigns",
    minimumPlan: ACCOUNT_TYPES.BUSINESS,
  },
  {
    id: "pricing_suggestions",
    label: "Pricing Suggestions",
    icon: "sell",
    description: "Estimate ideal FCFA pricing from rating, demand, and category.",
    permission: "use_pricing_suggestions",
    minimumPlan: ACCOUNT_TYPES.PRO,
  },
  {
    id: "competitor_analysis",
    label: "Competitor Analysis",
    icon: "query_stats",
    description: "Compare your offer against local demo marketplace pricing.",
    permission: "use_competitor_analysis",
    minimumPlan: ACCOUNT_TYPES.BUSINESS,
  },
  {
    id: "saved_campaigns",
    label: "Saved Campaigns",
    icon: "folder_special",
    description: "Review saved marketing assets and campaign ideas.",
    permission: "use_ai_marketing_studio",
    minimumPlan: ACCOUNT_TYPES.FREE,
    passive: true,
  },
];

const DEFAULT_CONTEXT = {
  campaignGoal: "Get more bookings",
  tone: "Luxury",
  targetAudience: "Beauty clients",
  platform: "Instagram",
  offer: "",
  city: "Douala",
  language: "Bilingual",
};

export function getMarketingUsage(userId, accountType = ACCOUNT_TYPES.FREE) {
  const month = getCurrentMonthKey();
  const limit = AI_MARKETING_LIMITS[getAccountType({ accountType })] ?? AI_MARKETING_LIMITS[ACCOUNT_TYPES.FREE];
  const usage = readStore(AI_MARKETING_STORAGE_KEYS.usage, []);
  const existing = usage.find((item) => String(item.userId) === String(userId) && item.month === month);
  return {
    userId,
    month,
    used: Number(existing?.used || 0),
    limit,
    storedLimit: serializeLimit(limit),
  };
}

export function trackGenerationUsage(userId, accountType = ACCOUNT_TYPES.FREE) {
  const month = getCurrentMonthKey();
  const current = getMarketingUsage(userId, accountType);
  if (current.limit !== Infinity && current.used >= current.limit) {
    return { ...current, allowed: false, recommendedPlan: getNextPlan(accountType) };
  }

  const usage = readStore(AI_MARKETING_STORAGE_KEYS.usage, []);
  const nextRecord = {
    userId,
    month,
    used: current.used + 1,
    limit: current.storedLimit,
    updatedAt: new Date().toISOString(),
  };
  const nextUsage = [
    nextRecord,
    ...usage.filter((item) => !(String(item.userId) === String(userId) && item.month === month)),
  ];
  writeStore(AI_MARKETING_STORAGE_KEYS.usage, nextUsage);
  return {
    ...nextRecord,
    limit: current.limit,
    allowed: true,
    recommendedPlan: getNextPlan(accountType),
  };
}

export function canUseMarketingModule(user, moduleId) {
  const accountType = getAccountType(user || {});
  const module = MARKETING_MODULES.find((item) => item.id === moduleId);
  if (!module) return { allowed: false, reason: "missing_module" };
  const planOrder = [ACCOUNT_TYPES.FREE, ACCOUNT_TYPES.PRO, ACCOUNT_TYPES.BUSINESS, ACCOUNT_TYPES.ENTERPRISE];
  const allowed = planOrder.indexOf(accountType) >= planOrder.indexOf(module.minimumPlan);
  return {
    allowed,
    permission: module.permission,
    minimumPlan: module.minimumPlan,
    recommendedPlan: allowed ? getNextPlan(accountType) : module.minimumPlan,
  };
}

export function getBrandVoice(userId) {
  const voices = readStore(AI_MARKETING_STORAGE_KEYS.brandVoice, {});
  return voices[userId] || "Premium African";
}

export function saveBrandVoice(userId, brandVoice) {
  const voices = readStore(AI_MARKETING_STORAGE_KEYS.brandVoice, {});
  const next = { ...voices, [userId]: brandVoice || "Premium African" };
  writeStore(AI_MARKETING_STORAGE_KEYS.brandVoice, next);
  return next[userId];
}

export function getGenerationHistory(userId) {
  return readStore(AI_MARKETING_STORAGE_KEYS.history, [])
    .filter((item) => String(item.userId) === String(userId))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export function saveGeneration(userId, generation) {
  if (!userId || !generation) return null;
  const history = readStore(AI_MARKETING_STORAGE_KEYS.history, []);
  const nextGeneration = {
    id: generation.id || createId("gen"),
    userId,
    type: generation.type,
    input: generation.input || {},
    output: generation.output || {},
    serviceId: generation.serviceId || generation.input?.serviceId || null,
    createdAt: generation.createdAt || new Date().toISOString(),
    saved: Boolean(generation.saved),
    rating: generation.rating || null,
  };
  const nextHistory = [
    nextGeneration,
    ...history.filter((item) => item.id !== nextGeneration.id),
  ].slice(0, 80);
  writeStore(AI_MARKETING_STORAGE_KEYS.history, nextHistory);
  return nextGeneration;
}

export function getSavedCampaigns(userId) {
  return readStore(AI_MARKETING_STORAGE_KEYS.savedCampaigns, [])
    .filter((item) => String(item.userId) === String(userId))
    .sort((a, b) => new Date(b.savedAt || b.createdAt || 0) - new Date(a.savedAt || a.createdAt || 0));
}

export function saveCampaign(userId, generation) {
  if (!userId || !generation) return null;
  const campaigns = readStore(AI_MARKETING_STORAGE_KEYS.savedCampaigns, []);
  const nextCampaign = {
    ...generation,
    id: generation.id || createId("campaign"),
    userId,
    saved: true,
    savedAt: new Date().toISOString(),
  };
  const nextCampaigns = [
    nextCampaign,
    ...campaigns.filter((item) => item.id !== nextCampaign.id),
  ].slice(0, 60);
  writeStore(AI_MARKETING_STORAGE_KEYS.savedCampaigns, nextCampaigns);
  saveGeneration(userId, nextCampaign);
  return nextCampaign;
}

export function generateFlyerConcept(context = {}) {
  const ctx = normalizeContext(context);
  const service = ctx.service;
  const palette = getPalette(ctx.tone, ctx.brandVoice);
  return {
    headline: translate(ctx, `${service.title} in ${ctx.city}`, `${service.title} a ${ctx.city}`, `${service.title} in ${ctx.city}`),
    subheadline: translate(
      ctx,
      buildToneLine(ctx),
      buildFrenchToneLine(ctx),
      `${buildToneLine(ctx)} / ${buildFrenchToneLine(ctx)}`
    ),
    offerText: ctx.offer || translate(ctx, "Limited booking slots this week", "Places limitees cette semaine", "Limited slots / Places limitees"),
    serviceName: service.title,
    price: `FCFA ${formatNumber(service.price)}`,
    cta: getCta(ctx),
    colorPalette: palette,
    layoutStyle: ctx.brandVoice === "Minimalist" ? "Editorial split layout" : "Premium image-led poster",
    footerText: translate(ctx, `Available in ${ctx.city}`, `Disponible a ${ctx.city}`, `Available in ${ctx.city} / Disponible a ${ctx.city}`),
    imageSuggestion: service.image ? "Use the selected storefront service image." : "Use a warm premium service image with gold lighting.",
  };
}

export function generatePromoCaptions(context = {}) {
  const ctx = normalizeContext(context);
  const service = ctx.service;
  const hashtags = buildHashtags(ctx, ["InviteGenie", service.category, ctx.city]);
  return {
    shortCaption: translate(
      ctx,
      `${service.title} is ready for your next premium moment in ${ctx.city}. ${ctx.offer ? `${ctx.offer}. ` : ""}${getCta(ctx)}`,
      `${service.title} est pret pour votre prochain moment premium a ${ctx.city}. ${ctx.offer ? `${ctx.offer}. ` : ""}${getCta(ctx)}`,
      `${service.title} is ready in ${ctx.city}. ${ctx.offer || "Reserve your moment."} / ${service.title} est pret a ${ctx.city}.`
    ),
    longCaption: translate(
      ctx,
      `For ${ctx.targetAudience.toLowerCase()} who want an experience that feels polished from first message to final detail, ${service.title} brings a refined service, clear inclusions, and a booking flow made for comfort. ${service.description} ${getCta(ctx)}`,
      `Pour les clients qui veulent une experience soignee du premier message au dernier detail, ${service.title} offre un service raffine, des inclusions claires et une reservation simple. ${service.description} ${getCta(ctx)}`,
      `For ${ctx.targetAudience.toLowerCase()}, ${service.title} brings a premium experience with clear inclusions and easy booking. Pour une experience soignee et memorable, reservez ${service.title} aujourd'hui. ${getCta(ctx)}`
    ),
    hashtags,
    cta: getCta(ctx),
    emojiLightVersion: `${service.title} in ${ctx.city}. ${ctx.offer || "Premium slots open."} ${getCta(ctx)}`,
    professionalVersion: `${service.title} is available for ${ctx.targetAudience.toLowerCase()} in ${ctx.city}. Includes ${service.included.slice(0, 2).join(", ")}. ${getCta(ctx)}`,
  };
}

export function generateWhatsAppAd(context = {}) {
  const ctx = normalizeContext(context);
  const service = ctx.service;
  const bookingLink = ctx.bookingLink || `${windowOrigin()}/marketplace/${ctx.provider.id || "provider"}/storefront?product=${service.id || "service"}`;
  return {
    shortMessage: translate(
      ctx,
      `Hello, ${service.title} is now available in ${ctx.city}. Price starts at FCFA ${formatNumber(service.price)}. ${ctx.offer ? `${ctx.offer}. ` : ""}${getCta(ctx)} ${bookingLink}`,
      `Bonjour, ${service.title} est disponible a ${ctx.city}. Prix a partir de FCFA ${formatNumber(service.price)}. ${ctx.offer ? `${ctx.offer}. ` : ""}${getCta(ctx)} ${bookingLink}`,
      `Hello / Bonjour. ${service.title} is available in ${ctx.city}. FCFA ${formatNumber(service.price)}. ${ctx.offer || "Slots open now."} ${bookingLink}`
    ),
    premiumMessage: translate(
      ctx,
      `Hi, we are opening a limited number of ${service.title} bookings for ${ctx.targetAudience.toLowerCase()} in ${ctx.city}. The package includes ${service.included.slice(0, 3).join(", ")} and starts at FCFA ${formatNumber(service.price)}. Reply BOOK or use this link: ${bookingLink}`,
      `Bonjour, nous ouvrons quelques reservations pour ${service.title} a ${ctx.city}. Le service comprend ${service.included.slice(0, 3).join(", ")} et commence a FCFA ${formatNumber(service.price)}. Repondez RESERVER ou utilisez ce lien: ${bookingLink}`,
      `Hi / Bonjour, ${service.title} is open for ${ctx.targetAudience.toLowerCase()} in ${ctx.city}. Includes ${service.included.slice(0, 3).join(", ")}. FCFA ${formatNumber(service.price)}. Reply BOOK / RESERVER: ${bookingLink}`
    ),
    cta: getCta(ctx),
    bookingLink,
    urgencyLine: translate(ctx, "Weekend slots are limited.", "Les places du week-end sont limitees.", "Weekend slots limited / Places limitees."),
    referralLine: translate(ctx, "Share with someone planning a beautiful moment.", "Partagez avec une personne qui prepare un beau moment.", "Share with someone planning a premium moment."),
  };
}

export function generateInstagramCarousel(context = {}) {
  const ctx = normalizeContext(context);
  const service = ctx.service;
  return {
    slides: [
      { slide: 1, title: "Hook", text: translate(ctx, `Your ${ctx.targetAudience.toLowerCase()} deserve a service that looks as good as it feels.`, `Vos clients meritent un service aussi beau que memorable.`, `Your event deserves beauty / Votre moment merite l'elegance.`) },
      { slide: 2, title: "Problem or desire", text: translate(ctx, `Most bookings feel rushed. ${service.title} is built for calm, polished preparation.`, `Trop de reservations sont faites dans la precipitation. ${service.title} apporte calme et precision.`, `${service.title} brings calm, detail, and polish.`) },
      { slide: 3, title: "Service benefit", text: service.description },
      { slide: 4, title: "Offer and proof", text: `${ctx.offer || "Premium booking slots are open."} Includes ${service.included.slice(0, 3).join(", ")}.` },
      { slide: 5, title: "CTA", text: getCta(ctx) },
    ],
    postCaption: `${service.title} for ${ctx.targetAudience.toLowerCase()} in ${ctx.city}. ${ctx.offer || "Reserve a polished premium experience."}`,
    hashtags: buildHashtags(ctx, ["InviteGenie", "CameroonEvents", service.category]),
    firstCommentText: `Booking details: FCFA ${formatNumber(service.price)} | ${service.duration || "Duration confirmed after booking"} | ${getCta(ctx)}`,
  };
}

export function generateEmailCampaign(context = {}) {
  const ctx = normalizeContext(context);
  const service = ctx.service;
  return {
    subjectLine: translate(ctx, `${service.title}: premium bookings now open in ${ctx.city}`, `${service.title}: reservations premium ouvertes a ${ctx.city}`, `${service.title}: premium bookings open / reservations ouvertes`),
    previewText: translate(ctx, `A polished offer for ${ctx.targetAudience.toLowerCase()} who want every detail handled.`, `Une offre soignee pour les clients qui veulent chaque detail maitrise.`, `A polished offer for every important moment.`),
    emailBody: translate(
      ctx,
      `Hello,\n\nWe are opening new booking slots for ${service.title} in ${ctx.city}. This offer is designed for ${ctx.targetAudience.toLowerCase()} who want a refined service, transparent pricing, and a beautiful experience from start to finish.\n\nIncluded: ${service.included.join(", ")}.\n\nPrice: FCFA ${formatNumber(service.price)}.\n\n${ctx.offer || "Reserve early to secure your preferred date."}\n\n${getCta(ctx)}`,
      `Bonjour,\n\nNous ouvrons de nouvelles reservations pour ${service.title} a ${ctx.city}. Cette offre est pensee pour les clients qui veulent un service raffine, un prix clair et une belle experience du debut a la fin.\n\nInclus: ${service.included.join(", ")}.\n\nPrix: FCFA ${formatNumber(service.price)}.\n\n${ctx.offer || "Reservez tot pour garantir votre date preferee."}\n\n${getCta(ctx)}`,
      `Hello / Bonjour,\n\n${service.title} is open for bookings in ${ctx.city}. This premium offer includes ${service.included.join(", ")} and starts at FCFA ${formatNumber(service.price)}.\n\n${ctx.offer || "Reserve early to secure your preferred date."}\n\n${getCta(ctx)}`
    ),
    ctaButtonText: translate(ctx, "Reserve My Date", "Reserver ma date", "Reserve / Reserver"),
    followUpEmail: translate(ctx, `A quick reminder: ${service.title} still has a few open slots for ${ctx.city}.`, `Petit rappel: ${service.title} a encore quelques disponibilites a ${ctx.city}.`, `${service.title} still has a few open slots.`),
    thankYouEmail: translate(ctx, `Thank you for booking ${service.title}. We will confirm the final details shortly.`, `Merci pour votre reservation de ${service.title}. Nous confirmerons les details tres bientot.`, `Thank you / Merci for booking ${service.title}.`),
  };
}

export function generatePricingSuggestion(context = {}) {
  return generateLocalPricingSuggestion(normalizeContext(context));
}

export function generateCompetitorPricingAnalysis(context = {}) {
  return generateLocalCompetitorPricingAnalysis(normalizeContext(context));
}

function normalizeContext(context = {}) {
  const service = normalizeService(context.service || context.selectedService || context.product || {});
  const provider = context.provider || {};
  return {
    ...DEFAULT_CONTEXT,
    ...context,
    provider,
    service,
    city: context.city || context.location || provider.location || "Douala",
    brandVoice: context.brandVoice || "Premium African",
    language: context.language || DEFAULT_CONTEXT.language,
    campaignGoal: context.campaignGoal || context.goal || DEFAULT_CONTEXT.campaignGoal,
    targetAudience: context.targetAudience || DEFAULT_CONTEXT.targetAudience,
    tone: context.tone || DEFAULT_CONTEXT.tone,
  };
}

function normalizeService(service = {}) {
  return {
    id: service.id || "demo-service",
    title: service.title || service.name || "Premium Event Service",
    category: service.category || "Event Service",
    price: Number(service.price || service.basePrice || 75000),
    duration: service.duration || "Booking duration confirmed after reservation",
    description: service.description || "A polished InviteGenie service designed for memorable events and premium client experiences.",
    included: Array.isArray(service.included) && service.included.length
      ? service.included
      : ["Personalized consultation", "Premium setup", "Booking confirmation", "Client support"],
    image: service.image || service.profileImage || service.coverImage || "",
    tags: Array.isArray(service.tags) ? service.tags : [],
  };
}

function translate(context, english, french, bilingual) {
  const language = String(context.language || "").toLowerCase();
  if (language.includes("french")) return french;
  if (language.includes("bilingual")) return bilingual;
  return english;
}

function getCta(context) {
  return translate(context, "Book now on InviteGenie", "Reservez maintenant sur InviteGenie", "Book now / Reservez sur InviteGenie");
}

function buildToneLine(context) {
  if (context.tone === "Romantic") return `Soft, elegant service for unforgettable ${context.targetAudience.toLowerCase()} moments.`;
  if (context.tone === "Corporate") return `Professional service designed for polished, reliable delivery.`;
  if (context.tone === "Energetic") return `A vibrant offer made to fill your calendar with high-intent bookings.`;
  return `${context.brandVoice} service crafted for clients who value detail, comfort, and presence.`;
}

function buildFrenchToneLine(context) {
  if (context.tone === "Romantic") return "Une experience douce et elegante pour les moments inoubliables.";
  if (context.tone === "Corporate") return "Un service professionnel pour une execution claire et fiable.";
  if (context.tone === "Energetic") return "Une offre dynamique pour attirer plus de reservations.";
  return "Un service premium pense pour les clients qui aiment les details et le confort.";
}

function buildHashtags(context, words = []) {
  return Array.from(
    new Set(
      words
        .concat([context.tone, context.targetAudience, context.city])
        .filter(Boolean)
        .map((word) => `#${String(word).replace(/[^a-z0-9]/gi, "")}`)
        .filter((word) => word.length > 1)
    )
  ).slice(0, 10);
}

function getPalette(tone, brandVoice) {
  if (brandVoice === "Corporate") return ["#08111F", "#D4AF37", "#FFFFFF"];
  if (tone === "Romantic") return ["#1B0D13", "#F7B7C8", "#F8E7D0"];
  if (tone === "Energetic") return ["#120A05", "#F97316", "#FBBF24"];
  return ["#090806", "#D4AF37", "#F97316"];
}

function readStore(key, fallback) {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`InviteGenie AI Marketing Studio could not parse ${key}.`, error);
    return fallback;
  }
}

function writeStore(key, value) {
  if (typeof localStorage === "undefined") return value;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: value } }));
  return value;
}

function getCurrentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function serializeLimit(limit) {
  return limit === Infinity ? "unlimited" : limit;
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("fr-CM");
}

function windowOrigin() {
  if (typeof window === "undefined") return "https://invitegenie.app";
  return window.location.origin;
}
