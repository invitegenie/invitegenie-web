const TENANT_STORAGE_KEY = "invitegenie_demo_tenants";

const RESERVED_SLUGS = [
  "admin", "login", "signup", "pricing", "marketplace", "events", 
  "api", "dashboard", "settings", "support", "escrow", "wallet",
  "storefront", "theme", "analytics", "s", "store", "vendor", "user"
];

function initializeTenants() {
  const existing = localStorage.getItem(TENANT_STORAGE_KEY);
  if (existing) return JSON.parse(existing);

  const seedTenants = [
    {
      id: "tenant-1",
      ownerId: "user-1",
      providerId: "1", // linking to mockData provider id 1
      businessName: "Adjoa's Creations",
      slug: "adjoas-creations",
      customDomain: "",
      domainStatus: "not_connected",
      logo: "",
      coverImage: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000",
      category: "Decorator",
      description: "Premium event decoration and floral design.",
      location: "Douala",
      phone: "+237600000001",
      whatsapp: "+237600000001",
      email: "hello@adjoascreations.com",
      status: "published",
      planType: "PRO",
      createdAt: new Date().toISOString()
    },
    {
      id: "tenant-2",
      ownerId: "user-2",
      providerId: "2",
      businessName: "DJ Brice Mix",
      slug: "djbricemix",
      customDomain: "",
      domainStatus: "not_connected",
      logo: "",
      coverImage: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=1000",
      category: "DJ",
      description: "Professional DJ services for events.",
      location: "Yaounde",
      phone: "+237600000002",
      whatsapp: "+237600000002",
      email: "dj@bricemix.com",
      status: "published",
      planType: "BUSINESS",
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(seedTenants));
  return seedTenants;
}

export function getTenants() {
  return initializeTenants();
}

export function generateSlug(businessName) {
  if (!businessName) return "";
  return businessName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function validateSlug(slug) {
  if (!slug) return { valid: false, error: "Slug is required" };
  if (slug.length < 3) return { valid: false, error: "Slug must be at least 3 characters" };
  if (slug.length > 40) return { valid: false, error: "Slug must be at most 40 characters" };
  if (!/^[a-z0-9-]+$/.test(slug)) return { valid: false, error: "Slug can only contain lowercase letters, numbers, and hyphens" };
  if (RESERVED_SLUGS.includes(slug)) return { valid: false, error: "This slug is reserved" };
  return { valid: true };
}

export function isSlugAvailable(slug, excludeTenantId = null) {
  const tenants = getTenants();
  return !tenants.some(t => t.slug === slug && String(t.id) !== String(excludeTenantId));
}

export function getTenantBySlug(slug) {
  const tenants = getTenants();
  return tenants.find(t => t.slug === slug) || null;
}

export function getTenantByProviderId(providerId) {
  const tenants = getTenants();
  return tenants.find(t => String(t.providerId) === String(providerId)) || null;
}

export function saveTenant(tenantData) {
  let tenants = getTenants();
  const existingIndex = tenants.findIndex(t => t.id === tenantData.id || String(t.providerId) === String(tenantData.providerId));
  
  if (existingIndex >= 0) {
    tenants[existingIndex] = { ...tenants[existingIndex], ...tenantData, updatedAt: new Date().toISOString() };
    localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenants));
    return tenants[existingIndex];
  } else {
    const newTenant = {
      id: "tenant-" + Date.now(),
      status: "draft",
      planType: "FREE",
      createdAt: new Date().toISOString(),
      ...tenantData
    };
    tenants.push(newTenant);
    localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenants));
    return newTenant;
  }
}