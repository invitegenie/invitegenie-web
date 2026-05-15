import { getMarketplaceProviders } from "./mockData";
import { hasAnyPermission, hasPermission, normalizeRole, USER_ROLES } from "./roles";

export const STOREFRONT_STORAGE_KEYS = {
  products: "demo_marketplace_products",
  settings: "demo_storefront_settings",
  commissionRate: "demo_storefront_commission_rate",
  selectedItem: "demo_marketplace_selected_item",
};

const createdAt = "2026-05-01T12:00:00.000Z";

const beautyImages = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&q=80&w=1100",
];

const fallbackServiceImages = [
  "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=1100",
  "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=1100",
];

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
  if (typeof localStorage === "undefined") return value;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: value } }));
  return value;
}

function getOrigin() {
  return typeof window !== "undefined" ? window.location.origin : "https://invitegenie.local";
}

function slugify(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function toArray(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
}

export function getStorefrontProductQrCodeUrl(providerId, productId) {
  const path = `/marketplace/${providerId}/storefront?product=${productId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getOrigin() + path)}`;
}

function makeProduct({
  id,
  providerId,
  ownerId,
  title,
  category,
  type = "service",
  price,
  description,
  included = [],
  duration = "45 min",
  requirements = [],
  image,
  tags = [],
  status = "published",
  featured = false,
}) {
  const productId = id || `prod-${providerId}-${slugify(title)}`;
  return {
    id: productId,
    providerId,
    ownerId,
    title,
    category,
    type,
    price: Number(price || 0),
    currency: "FCFA",
    description,
    included: toArray(included),
    duration,
    requirements: toArray(requirements),
    image,
    tags: Array.from(new Set([...toArray(tags), featured ? "featured" : ""].filter(Boolean))),
    status,
    qrCodeUrl: getStorefrontProductQrCodeUrl(providerId, productId),
    createdAt,
  };
}

function getProviderImage(provider, index = 0) {
  return provider?.image || fallbackServiceImages[index % fallbackServiceImages.length];
}

function seedBeautyProducts(provider) {
  if (!provider) return [];
  const ownerId = provider.ownerId || provider.userId || provider.sellerId;
  return [
    makeProduct({
      id: `prod-${provider.id}-solo-glow`,
      providerId: provider.id,
      ownerId,
      title: "Solo Glow Ritual",
      category: "Solo",
      type: "package",
      price: 25000,
      description: "A polished beauty ritual for one client with skincare, relaxation, and a luminous finish.",
      included: ["Diagnostic peau express", "Soin visage glow", "Modelage relaxant", "Conseils post-soin"],
      duration: "1h 15 min",
      requirements: ["Arrive with clean skin", "Share allergies before the appointment"],
      image: beautyImages[0],
      tags: ["beauty", "spa", "solo", "featured"],
      featured: true,
    }),
    makeProduct({
      id: `prod-${provider.id}-couple-hammam`,
      providerId: provider.id,
      ownerId,
      title: "Duo Hammam Signature",
      category: "Couple",
      type: "package",
      price: 45000,
      description: "A premium hammam experience for two with exfoliation, steam ritual, and body hydration.",
      included: ["Hammam traditionnel", "Gommage au savon noir", "Hydratation corporelle", "Boisson de bienvenue"],
      duration: "1h 45 min",
      requirements: ["Book 24 hours ahead", "Bring swimwear or spa robe"],
      image: beautyImages[1],
      tags: ["hammam", "couple", "spa"],
    }),
    makeProduct({
      id: `prod-${provider.id}-hydrafacial`,
      providerId: provider.id,
      ownerId,
      title: "Hydrafacial Signature",
      category: "Visage",
      type: "service",
      price: 15000,
      description: "Soin complet pour nettoyer, hydrater et illuminer la peau.",
      included: ["Nettoyage profond du visage", "Hydratation intense", "Extraction ciblee", "Effet glow immediat"],
      duration: "45 min",
      requirements: ["Avoid heavy makeup before appointment"],
      image: beautyImages[2],
      tags: ["beauty", "spa", "face care", "hydrafacial"],
      featured: true,
    }),
    makeProduct({
      id: `prod-${provider.id}-cils-volume`,
      providerId: provider.id,
      ownerId,
      title: "Pose Cils Volume Elegant",
      category: "Cils",
      type: "service",
      price: 18000,
      description: "Extension de cils effet volume pour un regard defini et naturel.",
      included: ["Preparation des cils", "Pose volume leger", "Brossage final", "Kit entretien"],
      duration: "1h 30 min",
      requirements: ["Arrive without mascara", "Avoid water for 24 hours after service"],
      image: beautyImages[3],
      tags: ["beauty", "lashes", "cils"],
    }),
    makeProduct({
      id: `prod-${provider.id}-laser-session`,
      providerId: provider.id,
      ownerId,
      title: "Session Laser Zone Ciblee",
      category: "Laser",
      type: "service",
      price: 30000,
      description: "Seance laser ciblee avec preparation, protection, et suivi professionnel.",
      included: ["Consultation rapide", "Preparation de la zone", "Seance laser", "Recommandations apres soin"],
      duration: "30 min",
      requirements: ["No waxing 10 days before", "Avoid sun exposure before and after"],
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1100",
      tags: ["laser", "beauty", "care"],
    }),
    makeProduct({
      id: `prod-${provider.id}-formation-beauty`,
      providerId: provider.id,
      ownerId,
      title: "Formation Soin Visage Pro",
      category: "Formation",
      type: "service",
      price: 75000,
      description: "Training package for beauty professionals learning facial care protocols and client workflow.",
      included: ["Training materials", "Live practice session", "Protocol checklist", "Certificate of participation"],
      duration: "1 day",
      requirements: ["Basic beauty kit", "Notebook", "Prior salon experience recommended"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1100",
      tags: ["formation", "training", "beauty"],
    }),
  ];
}

function buildSeedProducts() {
  const providers = getMarketplaceProviders();
  const beautyProvider =
    providers.find((provider) => /makeup|beauty|spa|glam/i.test(`${provider.category} ${provider.businessName} ${provider.title}`)) ||
    providers[0];

  const products = seedBeautyProducts(beautyProvider);
  providers.forEach((provider, providerIndex) => {
    const ownerId = provider.ownerId || provider.userId || provider.sellerId;
    if (provider.id === beautyProvider?.id) return;

    const packages = provider.packages?.length
      ? provider.packages.slice(0, 3)
      : [
          {
            name: provider.title || provider.category,
            description: provider.description || provider.shortBio || `Professional ${provider.category} service.`,
            price: provider.price || provider.startingPrice || 0,
            deliveryTime: provider.serviceTime || provider.responseTime || "1-2 days",
          },
        ];

    packages.forEach((pack, index) => {
      products.push(
        makeProduct({
          id: `prod-${provider.id}-${slugify(pack.name)}`,
          providerId: provider.id,
          ownerId,
          title: pack.name === "Starter" ? provider.title : `${provider.category} ${pack.name}`,
          category: index === 0 ? "Services" : "Packages",
          type: index === 0 ? provider.type || "service" : "package",
          price: pack.price || provider.price || provider.startingPrice || 0,
          description: pack.description || provider.description || provider.shortBio,
          included: provider.included || provider.tags || [provider.category],
          duration: pack.deliveryTime || provider.serviceTime || provider.responseTime || "1-2 days",
          requirements: provider.requirements || ["Confirm date, location, and service scope before booking"],
          image: getProviderImage(provider, providerIndex + index),
          tags: [provider.category, provider.type, ...(provider.tags || [])],
          featured: Boolean(provider.pro && index === 0),
        })
      );
    });
  });

  return products;
}

function buildSeedSettings() {
  return getMarketplaceProviders().map((provider) => ({
    providerId: provider.id,
    ownerId: provider.ownerId || provider.userId || provider.sellerId,
    businessName: provider.businessName || provider.name || provider.title,
    category: provider.category,
    location: provider.location,
    rating: provider.rating || 0,
    reviews: provider.reviews || 0,
    verified: Boolean(provider.verified),
    featured: Boolean(provider.pro),
    avatar: provider.logo || provider.avatar || provider.image,
    coverImage: provider.coverImage || provider.image,
    contactPhone: provider.contactPhone || provider.phone || "+237 6 75 66 77 88",
    whatsappText: `Bonjour, je souhaite reserver ${provider.businessName || provider.name || "ce service"} via InviteGenie.`,
    createdAt,
  }));
}

export function ensureStorefrontData() {
  const seedProducts = buildSeedProducts();
  const seedSettings = buildSeedSettings();

  const storedProducts = readKey(STOREFRONT_STORAGE_KEYS.products, null);
  let productsChanged = !Array.isArray(storedProducts);
  const products = Array.isArray(storedProducts)
    ? [
        ...storedProducts,
        ...seedProducts.filter((seed) => !storedProducts.some((item) => String(item.id) === String(seed.id))),
      ]
    : seedProducts;
  if (Array.isArray(storedProducts) && products.length !== storedProducts.length) productsChanged = true;

  const storedSettings = readKey(STOREFRONT_STORAGE_KEYS.settings, null);
  let settingsChanged = !Array.isArray(storedSettings);
  const settings = Array.isArray(storedSettings)
    ? [
        ...storedSettings,
        ...seedSettings.filter((seed) => !storedSettings.some((item) => String(item.providerId) === String(seed.providerId))),
      ]
    : seedSettings;
  if (Array.isArray(storedSettings) && settings.length !== storedSettings.length) settingsChanged = true;

  if (productsChanged) writeKey(STOREFRONT_STORAGE_KEYS.products, products);
  if (settingsChanged) writeKey(STOREFRONT_STORAGE_KEYS.settings, settings);
  if (typeof localStorage !== "undefined" && !localStorage.getItem(STOREFRONT_STORAGE_KEYS.commissionRate)) {
    localStorage.setItem(STOREFRONT_STORAGE_KEYS.commissionRate, JSON.stringify(5));
  }

  return { products, settings };
}

export function getAllStorefrontProducts({ includeHidden = true } = {}) {
  const { products } = ensureStorefrontData();
  return includeHidden ? products : products.filter((item) => item.status !== "hidden");
}

export function getStorefrontProducts(providerId, { includeDrafts = false, includeHidden = false } = {}) {
  return getAllStorefrontProducts({ includeHidden: true }).filter((item) => {
    const sameProvider = String(item.providerId) === String(providerId);
    const status = item.status || "published";
    const visibleStatus = status === "published" || (includeDrafts && ["draft", "pending"].includes(status)) || (includeHidden && status === "hidden");
    return sameProvider && visibleStatus;
  });
}

export function getStorefrontProductById(productId) {
  return getAllStorefrontProducts({ includeHidden: true }).find((item) => String(item.id) === String(productId));
}

export function saveStorefrontProduct(productData, status = "published") {
  const providerId = productData.providerId;
  const id = productData.id || `prod-${providerId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const product = {
    id,
    providerId,
    ownerId: productData.ownerId,
    title: productData.title,
    category: productData.category,
    type: productData.type || "service",
    price: Number(productData.price || 0),
    currency: "FCFA",
    description: productData.description,
    included: toArray(productData.included),
    duration: productData.duration || "",
    requirements: toArray(productData.requirements),
    image: productData.image || fallbackServiceImages[0],
    tags: toArray(productData.tags),
    status,
    qrCodeUrl: productData.qrCodeUrl || getStorefrontProductQrCodeUrl(providerId, id),
    createdAt: productData.createdAt || new Date().toISOString(),
  };

  const products = getAllStorefrontProducts({ includeHidden: true });
  const exists = products.some((item) => String(item.id) === String(id));
  const nextProducts = exists
    ? products.map((item) => (String(item.id) === String(id) ? { ...item, ...product } : item))
    : [product, ...products];
  writeKey(STOREFRONT_STORAGE_KEYS.products, nextProducts);
  return product;
}

export function updateStorefrontProductStatus(productId, status) {
  const products = getAllStorefrontProducts({ includeHidden: true });
  const nextProducts = products.map((item) =>
    String(item.id) === String(productId)
      ? {
          ...item,
          status,
          moderatedAt: new Date().toISOString(),
        }
      : item
  );
  writeKey(STOREFRONT_STORAGE_KEYS.products, nextProducts);
  return nextProducts.find((item) => String(item.id) === String(productId));
}

export function getStorefrontSettings(providerId) {
  const provider = getMarketplaceProviders().find((item) => String(item.id) === String(providerId));
  const { settings } = ensureStorefrontData();
  const stored = settings.find((item) => String(item.providerId) === String(providerId)) || {};
  return {
    providerId,
    ownerId: provider?.ownerId || provider?.userId || provider?.sellerId || stored.ownerId,
    businessName: provider?.businessName || provider?.name || stored.businessName || "InviteGenie Storefront",
    category: provider?.category || stored.category || "Marketplace",
    location: provider?.location || stored.location || "Cameroon",
    rating: provider?.rating || stored.rating || 0,
    reviews: provider?.reviews || stored.reviews || 0,
    verified: Boolean(provider?.verified || stored.verified),
    featured: Boolean(stored.featured || provider?.pro),
    avatar: stored.avatar || provider?.logo || provider?.avatar || provider?.image,
    coverImage: stored.coverImage || provider?.coverImage || provider?.image,
    contactPhone: stored.contactPhone || provider?.contactPhone || provider?.phone || "",
    whatsappText: stored.whatsappText || `Bonjour, je souhaite reserver ${provider?.businessName || "ce service"} via InviteGenie.`,
    description: provider?.description || provider?.shortBio || stored.description || "",
  };
}

export function updateStorefrontSettings(providerId, updates) {
  const { settings } = ensureStorefrontData();
  const exists = settings.some((item) => String(item.providerId) === String(providerId));
  const nextSettings = exists
    ? settings.map((item) => (String(item.providerId) === String(providerId) ? { ...item, ...updates } : item))
    : [{ providerId, ...updates, createdAt: new Date().toISOString() }, ...settings];
  writeKey(STOREFRONT_STORAGE_KEYS.settings, nextSettings);
  return nextSettings.find((item) => String(item.providerId) === String(providerId));
}

export function getStorefrontCommissionRate() {
  return Number(readKey(STOREFRONT_STORAGE_KEYS.commissionRate, 5) || 5);
}

export function saveStorefrontCommissionRate(rate) {
  const nextRate = Math.max(0, Math.min(Number(rate || 0), 100));
  writeKey(STOREFRONT_STORAGE_KEYS.commissionRate, nextRate);
  return nextRate;
}

export function getOwnedProviderForUser(userId) {
  if (!userId) return null;
  return getMarketplaceProviders().find((provider) => String(provider.ownerId || provider.userId || provider.sellerId) === String(userId));
}

export function canCreateStorefrontProduct(profileOrUser, provider) {
  if (!profileOrUser || !provider) return false;
  const role = normalizeRole(profileOrUser.role || profileOrUser.admin_role);
  if ([USER_ROLES.APP_ADMIN, USER_ROLES.SUPER_ADMIN].includes(role)) return true;
  if (hasPermission(profileOrUser, "manage_all_storefronts")) return true;

  const userId = profileOrUser.id;
  const ownerId = provider.ownerId || provider.userId || provider.sellerId;
  const ownsProvider = userId && ownerId && String(userId) === String(ownerId);
  return Boolean(
    ownsProvider &&
      hasAnyPermission(profileOrUser, [
        "manage_own_storefront",
        "create_marketplace_product",
        "create_marketplace_listing",
      ])
  );
}

export function canEditStorefrontProduct(profileOrUser, product) {
  if (!profileOrUser || !product) return false;
  const role = normalizeRole(profileOrUser.role || profileOrUser.admin_role);
  if ([USER_ROLES.APP_ADMIN, USER_ROLES.SUPER_ADMIN].includes(role)) return true;
  if (hasPermission(profileOrUser, "manage_all_storefronts")) return true;
  return Boolean(
    String(profileOrUser.id) === String(product.ownerId) &&
      hasAnyPermission(profileOrUser, ["edit_own_marketplace_product", "manage_own_storefront"])
  );
}

export function canModerateStorefronts(profileOrUser) {
  return hasAnyPermission(profileOrUser, [
    "moderate_storefronts",
    "approve_marketplace_products",
    "manage_all_storefronts",
    "all_permissions",
  ]);
}

export function generateProductSuggestionFromPhoto(image, providerCategory = "") {
  const category = String(providerCategory || "").toLowerCase();
  const looksLikeCatering = /cater|food|buffet|drink|bar|beverage/.test(category);
  const looksLikeBeauty = /beauty|spa|makeup|glam|visage|hammam|cils|laser|salon/.test(category);

  if (looksLikeCatering) {
    return {
      title: "Premium Wedding Buffet",
      category: "Catering",
      type: "package",
      price: 75000,
      currency: "FCFA",
      description: "Professional Cameroonian catering package for weddings and private events.",
      included: ["Menu planning", "Buffet setup", "Serving staff", "Traditional and modern dishes"],
      duration: "Event day service",
      requirements: ["Confirm guest count", "Share venue access time", "Book at least 48 hours ahead"],
      image,
      tags: ["catering", "wedding", "buffet", "Cameroon"],
      ctaText: "Reserve this buffet",
    };
  }

  if (looksLikeBeauty) {
    return {
      title: "Hydrafacial Signature",
      category: "Soin Visage",
      type: "service",
      price: 15000,
      currency: "FCFA",
      description: "Soin complet pour nettoyer, hydrater et illuminer la peau.",
      included: ["Nettoyage profond du visage", "Hydratation intense", "Extraction ciblee", "Effet glow immediat"],
      duration: "45 min",
      requirements: ["Arrive with clean skin", "Mention allergies before the treatment"],
      image,
      tags: ["beauty", "spa", "face care", "hydrafacial"],
      ctaText: "Reserver ce soin",
    };
  }

  return {
    title: "Signature Marketplace Service",
    category: providerCategory || "Services",
    type: "service",
    price: 25000,
    currency: "FCFA",
    description: "A polished service package ready for InviteGenie marketplace bookings.",
    included: ["Service planning", "Professional setup", "Client coordination", "Basic support"],
    duration: "1-2 hours",
    requirements: ["Confirm date and location", "Share service expectations before booking"],
    image,
    tags: ["marketplace", "service", "Cameroon"],
    ctaText: "Book this service",
  };
}
