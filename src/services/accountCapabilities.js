export const ACCOUNT_TYPES = {
  FREE: "FREE",
  PRO: "PRO",
  VENDOR_PRO: "VENDOR_PRO",
  BUSINESS: "BUSINESS",
  ENTERPRISE: "ENTERPRISE",
};

export const BILLING_CYCLES = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export const CAPABILITY_STORAGE_KEY = "demo_capabilities";
export const TASKER_STORAGE_KEY = "demo_taskers";
export const SUBSCRIPTION_STORAGE_KEY = "demo_subscriptions";

export const DEFAULT_CAPABILITIES = {
  vendorMode: false,
  plannerMode: true,
  taskerMode: false,
  checkInMode: false,
};

export const PLAN_LIMITS = {
  [ACCOUNT_TYPES.FREE]: {
    maxServices: 15,
    maxEvents: 2,
    maxGuestsPerEvent: 50,
    staffAccounts: 0,
  },
  [ACCOUNT_TYPES.PRO]: {
    maxServices: 50,
    maxEvents: 5,
    maxGuestsPerEvent: 200,
    staffAccounts: 1,
  },
  [ACCOUNT_TYPES.VENDOR_PRO]: {
    maxServices: 100,
    maxEvents: 10,
    maxGuestsPerEvent: 3000,
    staffAccounts: 3,
  },
  [ACCOUNT_TYPES.BUSINESS]: {
    unlimitedServices: true,
    maxEvents: 50,
    maxGuestsPerEvent: 30000,
    staffAccounts: 15,
  },
  [ACCOUNT_TYPES.ENTERPRISE]: {
    unlimitedEverything: true,
    unlimitedServices: true,
    unlimitedEvents: true,
    maxEvents: Infinity,
    maxGuestsPerEvent: Infinity,
    staffAccounts: Infinity,
  },
};

const LEGACY_ACCOUNT_MAP = {
  normal_user: ACCOUNT_TYPES.FREE,
  basic_user: ACCOUNT_TYPES.FREE,
  free_user: ACCOUNT_TYPES.FREE,
  demo: ACCOUNT_TYPES.FREE,
  free: ACCOUNT_TYPES.FREE,
  pro_user: ACCOUNT_TYPES.PRO,
  pro: ACCOUNT_TYPES.PRO,
  vendor: ACCOUNT_TYPES.BUSINESS,
  vendor_basic: ACCOUNT_TYPES.BUSINESS,
  vendor_pro: ACCOUNT_TYPES.VENDOR_PRO,
  event_planner: ACCOUNT_TYPES.PRO,
  planner: ACCOUNT_TYPES.PRO,
  tasker: ACCOUNT_TYPES.FREE,
  tasker_freelancer: ACCOUNT_TYPES.FREE,
  checkin_agent: ACCOUNT_TYPES.FREE,
  check_in_agent: ACCOUNT_TYPES.FREE,
  enterprise_client: ACCOUNT_TYPES.ENTERPRISE,
  enterprise: ACCOUNT_TYPES.ENTERPRISE,
  finance_admin: ACCOUNT_TYPES.ENTERPRISE,
  app_admin: ACCOUNT_TYPES.ENTERPRISE,
  super_admin: ACCOUNT_TYPES.ENTERPRISE,
  "free user": ACCOUNT_TYPES.FREE,
  "pro user": ACCOUNT_TYPES.PRO,
  "vendor basic": ACCOUNT_TYPES.BUSINESS,
  "vendor pro": ACCOUNT_TYPES.VENDOR_PRO,
  "event planner": ACCOUNT_TYPES.PRO,
  "check-in agent": ACCOUNT_TYPES.FREE,
  "finance admin": ACCOUNT_TYPES.ENTERPRISE,
  "app admin": ACCOUNT_TYPES.ENTERPRISE,
  "super admin": ACCOUNT_TYPES.ENTERPRISE,
};

const LEGACY_CAPABILITY_MAP = {
  vendor: { vendorMode: true },
  vendor_basic: { vendorMode: true },
  vendor_pro: { vendorMode: true },
  event_planner: { plannerMode: true },
  planner: { plannerMode: true },
  enterprise_client: { vendorMode: true, plannerMode: true, checkInMode: true },
  tasker: { taskerMode: true },
  tasker_freelancer: { taskerMode: true },
  checkin_agent: { checkInMode: true },
  check_in_agent: { checkInMode: true },
  finance_admin: { vendorMode: true, plannerMode: true, checkInMode: true },
  app_admin: { vendorMode: true, plannerMode: true, taskerMode: true, checkInMode: true },
  super_admin: { vendorMode: true, plannerMode: true, taskerMode: true, checkInMode: true },
};

const PLAN_FEATURE_PERMISSIONS = {
  [ACCOUNT_TYPES.FREE]: [
    "browse_events",
    "buy_ticket",
    "post_memory",
    "like",
    "comment",
    "share",
    "view_gallery",
    "browse_marketplace",
    "buy_marketplace_item",
    "book_vendor",
    "manage_profile",
    "view_qr",
    "post_memories",
    "review_vendor",
    "create_event",
    "create_events",
    "manage_own_events",
    "basic_seating_planner",
    "use_ai_marketing_studio",
    "generate_promo_captions",
    "generate_whatsapp_ads",
  ],
  [ACCOUNT_TYPES.PRO]: [
    "premium_features",
    "premium_templates",
    "priority_support",
    "budget_management",
    "automated_reminders",
    "view_event_analytics",
    "gallery_pages",
  ],
  [ACCOUNT_TYPES.VENDOR_PRO]: [
    "advanced_gallery",
    "ai_event_website_generator",
    "vendor_recommendation_engine",
    "smart_seating_planner",
    "guest_segmentation",
    "vip_guest_tagging",
    "generate_flyers",
    "generate_instagram_carousels",
    "use_pricing_suggestions",
  ],
  [ACCOUNT_TYPES.BUSINESS]: [
    "multi_branch_management",
    "white_label_storefront",
    "crm_tools",
    "team_collaboration",
    "premium_analytics",
    "lead_management",
    "featured_homepage_placement",
    "multi_admin_event_teams",
    "staff_coordination",
    "advanced_qr_checkin",
    "sponsor_management",
    "booth_vendor_allocation",
    "multi_day_event_support",
    "livestream_integrations",
    "generate_email_campaigns",
    "use_competitor_analysis",
    "export_marketing_assets",
    "manage_brand_voice",
  ],
  [ACCOUNT_TYPES.ENTERPRISE]: [
    "unlimited_everything",
    "enterprise_analytics",
    "api_ready",
    "regional_management",
    "dedicated_support",
    "white_label_marketplace",
    "government_workflows",
    "security_access_control",
    "ai_attendee_intelligence",
    "smart_networking_recommendations",
    "enterprise_reporting",
    "custom_domains",
    "sso_ready",
  ],
};

const MODE_PERMISSIONS = {
  vendorMode: [
    "create_marketplace_listing",
    "manage_own_storefront",
    "create_marketplace_product",
    "edit_own_marketplace_product",
    "manage_listing",
    "view_orders",
    "view_earnings",
    "receive_quote_requests",
    "sell_marketplace_item",
    "request_quote",
    "manage_own_listing",
    "receive_requests",
    "view_financials",
    "request_payout",
    "view_own_withdrawals",
    "view_vendor_wallet",
    "view_vendor_earnings",
    "manage_vendor_portfolio",
    "view_vendor_reviews",
    "manage_own_marketplace_profile",
    "view_vendor_insights",
    "advanced_vendor_insights",
    "use_vendor_genie",
    "manage_ai_vendor_tools",
    "use_ai_marketing_studio",
    "generate_promo_captions",
    "generate_whatsapp_ads",
    "view_wallet",
  ],
  plannerMode: [
    "create_event",
    "create_events",
    "manage_event",
    "manage_own_events",
    "manage_guests",
    "manage_guest_list",
    "sell_event_tickets",
    "assign_event_roles",
  ],
  taskerMode: [
    "create_marketplace_listing",
    "manage_own_storefront",
    "create_marketplace_product",
    "edit_own_marketplace_product",
    "accept_tasks",
    "complete_tasks",
    "receive_payouts",
    "staffing_marketplace_visibility",
    "apply_staffing_jobs",
  ],
  checkInMode: [
    "scan_qr",
    "validate_ticket",
    "mark_checked_in",
    "scan_event_qr",
    "checkin_dashboard",
  ],
};

export function normalizeAccountType(value) {
  if (!value) return ACCOUNT_TYPES.FREE;
  const raw = String(value).trim();
  const upper = raw.toUpperCase();
  if (Object.values(ACCOUNT_TYPES).includes(upper)) return upper;
  return LEGACY_ACCOUNT_MAP[raw.toLowerCase()] || ACCOUNT_TYPES.FREE;
}

export function getAccountType(user = {}) {
  return normalizeAccountType(user.accountType || user.account_type || user.plan || user.tier || user.role);
}

export function getPlanLimits(userOrAccountType) {
  const accountType = typeof userOrAccountType === "string" ? normalizeAccountType(userOrAccountType) : getAccountType(userOrAccountType);
  return PLAN_LIMITS[accountType] || PLAN_LIMITS[ACCOUNT_TYPES.FREE];
}

export function normalizeCapabilities(user = {}) {
  const roleKey = String(user.legacyRole || user.legacy_role || user.role || user.admin_role || "").toLowerCase();
  const stored = readCapabilityStore();
  const storedCapabilities = user.id ? stored[user.id] || {} : {};
  return {
    ...DEFAULT_CAPABILITIES,
    ...(LEGACY_CAPABILITY_MAP[roleKey] || {}),
    ...(user.capabilities || {}),
    ...storedCapabilities,
  };
}

export function getEffectiveCapabilities(user = {}) {
  const accountType = getAccountType(user);
  const capabilities = normalizeCapabilities(user);
  const proPlus = [ACCOUNT_TYPES.PRO, ACCOUNT_TYPES.VENDOR_PRO, ACCOUNT_TYPES.BUSINESS, ACCOUNT_TYPES.ENTERPRISE].includes(accountType);
  const businessPlus = [ACCOUNT_TYPES.BUSINESS, ACCOUNT_TYPES.ENTERPRISE].includes(accountType);
  const enterprise = accountType === ACCOUNT_TYPES.ENTERPRISE;

  return {
    ...capabilities,
    canSellServices: Boolean(capabilities.vendorMode),
    canHostEvents: true,
    canBeTasker: Boolean(capabilities.taskerMode),
    canRunCheckIn: Boolean(capabilities.checkInMode),
    canManageGuests: capabilities.plannerMode || proPlus,
    canJoinMarketplace: true,
    hasPriorityVisibility: proPlus,
    hasVerifiedBadge: proPlus,
    hasAnalytics: proPlus,
    hasTeamStaffing: businessPlus,
    hasEnterpriseWorkforce: enterprise,
  };
}

export function getPlanPermissions(user = {}) {
  const accountType = getAccountType(user);
  const capabilities = normalizeCapabilities(user);
  const planOrder = [ACCOUNT_TYPES.FREE, ACCOUNT_TYPES.PRO, ACCOUNT_TYPES.VENDOR_PRO, ACCOUNT_TYPES.BUSINESS, ACCOUNT_TYPES.ENTERPRISE];
  const allowedPlanIndex = planOrder.indexOf(accountType);
  const permissions = planOrder
    .filter((_, index) => index <= allowedPlanIndex)
    .flatMap((plan) => PLAN_FEATURE_PERMISSIONS[plan] || []);

  Object.entries(capabilities).forEach(([mode, enabled]) => {
    if (enabled) permissions.push(...(MODE_PERMISSIONS[mode] || []));
  });

  return Array.from(new Set(permissions));
}

export function updateUserCapabilities(user, updates = {}) {
  if (!user?.id) return null;
  const capabilities = { ...normalizeCapabilities(user), ...updates };
  const store = readCapabilityStore();
  const nextStore = { ...store, [user.id]: capabilities };
  writeCapabilityStore(nextStore);
  return capabilities;
}

export function buildUnifiedUser(user = {}) {
  const accountType = getAccountType(user);
  const capabilities = normalizeCapabilities(user);
  return {
    ...user,
    accountType,
    billingCycle: user.billingCycle || BILLING_CYCLES.MONTHLY,
    capabilities,
    subscriptionStatus: user.subscriptionStatus || "active",
    subscriptionRenewalDate: user.subscriptionRenewalDate || null,
  };
}

export function checkEventPlanLimit({ user, existingEvents = [], guestCount = 0 }) {
  const limits = getPlanLimits(user);
  const ownedActiveEvents = existingEvents.filter((event) => {
    const ownerId = event.ownerId || event.hostId || event.vendorId;
    const isOwner = String(ownerId) === String(user?.id);
    const status = String(event.status || "ACTIVE").toUpperCase();
    return isOwner && status !== "ARCHIVED" && status !== "CANCELLED";
  });

  if (!limits.unlimitedEverything && !limits.unlimitedEvents && ownedActiveEvents.length >= limits.maxEvents) {
    return {
      allowed: false,
      reason: "maxEvents",
      current: ownedActiveEvents.length,
      limit: limits.maxEvents,
      recommendedPlan: getNextPlan(user),
      message: `Your ${getAccountType(user)} plan includes ${limits.maxEvents} active events.`,
    };
  }

  if (!limits.unlimitedEverything && Number(guestCount || 0) > limits.maxGuestsPerEvent) {
    return {
      allowed: false,
      reason: "maxGuestsPerEvent",
      current: Number(guestCount || 0),
      limit: limits.maxGuestsPerEvent,
      recommendedPlan: getNextPlan(user),
      message: `Your ${getAccountType(user)} plan supports up to ${limits.maxGuestsPerEvent.toLocaleString()} guests per event.`,
    };
  }

  return { allowed: true, current: ownedActiveEvents.length, limit: limits.unlimitedEverything || limits.unlimitedEvents ? Infinity : limits.maxEvents };
}

export function checkServicePlanLimit({ user, existingServices = [] }) {
  const limits = getPlanLimits(user);

  const ownedServices = existingServices.filter((service) => {
    const ownerId = service.ownerId || service.userId || service.sellerId;
    return String(ownerId) === String(user?.id);
  });

  if (limits.unlimitedEverything || limits.unlimitedServices) {
    return { allowed: true, current: ownedServices.length, limit: Infinity };
  }

  if (ownedServices.length >= limits.maxServices) {
    return {
      allowed: false,
      reason: "maxServices",
      current: ownedServices.length,
      limit: limits.maxServices,
      recommendedPlan: getNextPlan(user),
      message: `Your ${getAccountType(user)} plan includes up to ${limits.maxServices} products or services.`,
    };
  }

  return { allowed: true, current: ownedServices.length, limit: limits.maxServices };
}

export function getTaskerProfiles() {
  if (typeof localStorage === "undefined") return [];
  return safeParse(localStorage.getItem(TASKER_STORAGE_KEY), []);
}

export function saveTaskerProfile(profile) {
  if (!profile?.userId) return null;
  const profiles = getTaskerProfiles();
  const exists = profiles.some((item) => String(item.userId) === String(profile.userId));
  const nextProfile = {
    active: true,
    skills: [],
    availability: "Flexible",
    rating: 0,
    completedJobs: 0,
    verificationStatus: "basic",
    preferredLocations: [],
    createdAt: new Date().toISOString(),
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  const nextProfiles = exists
    ? profiles.map((item) => (String(item.userId) === String(profile.userId) ? { ...item, ...nextProfile } : item))
    : [nextProfile, ...profiles];
  localStorage.setItem(TASKER_STORAGE_KEY, JSON.stringify(nextProfiles));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: TASKER_STORAGE_KEY, data: nextProfiles } }));
  return nextProfile;
}

export function getNextPlan(userOrAccountType) {
  const accountType = typeof userOrAccountType === "string" ? normalizeAccountType(userOrAccountType) : getAccountType(userOrAccountType);
  if (accountType === ACCOUNT_TYPES.FREE) return ACCOUNT_TYPES.PRO;
  if (accountType === ACCOUNT_TYPES.PRO) return ACCOUNT_TYPES.VENDOR_PRO;
  if (accountType === ACCOUNT_TYPES.VENDOR_PRO) return ACCOUNT_TYPES.BUSINESS;
  return ACCOUNT_TYPES.ENTERPRISE;
}

function readCapabilityStore() {
  if (typeof localStorage === "undefined") return {};
  return safeParse(localStorage.getItem(CAPABILITY_STORAGE_KEY), {});
}

function writeCapabilityStore(value) {
  if (typeof localStorage === "undefined") return value;
  localStorage.setItem(CAPABILITY_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: CAPABILITY_STORAGE_KEY, data: value } }));
  return value;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("InviteGenie account capability storage could not be parsed.", error);
    return fallback;
  }
}
