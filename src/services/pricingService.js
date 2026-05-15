import { DEMO_STORAGE_KEYS, ensureDemoData } from "./mockData";
import {
  ACCOUNT_TYPES,
  BILLING_CYCLES,
  buildUnifiedUser,
  PLAN_LIMITS,
} from "./accountCapabilities";

export const DEFAULT_PRICING_PLANS = [
  {
    id: ACCOUNT_TYPES.FREE,
    name: "Free",
    accountType: ACCOUNT_TYPES.FREE,
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "FCFA",
    tagline: "Start selling, hosting, staffing, and checking in with basic limits.",
    featured: false,
    limits: PLAN_LIMITS[ACCOUNT_TYPES.FREE],
    vendorFeatures: [
      "Up to 15 services/products",
      "Public storefront",
      "WhatsApp integration",
      "Basic booking",
      "Customer reviews",
      "Basic analytics",
      "Mobile dashboard",
      "Marketplace visibility",
      "3 AI marketing outputs per month",
      "Basic promo captions and WhatsApp messages",
    ],
    eventFeatures: [
      "Up to 2 active events",
      "Maximum 50 guests per event",
      "RSVP page",
      "AI invitation generation",
      "WhatsApp invitations",
      "Countdown page",
      "QR guest pass",
      "Basic seating planner",
    ],
    taskerFeatures: ["Activate tasker mode", "Basic staffing visibility", "Apply for staffing jobs"],
    checkInFeatures: ["Assist with event check-in", "Basic QR scanning access"],
  },
  {
    id: ACCOUNT_TYPES.PRO,
    name: "Pro",
    accountType: ACCOUNT_TYPES.PRO,
    monthlyPrice: 12500,
    yearlyPrice: 120000,
    currency: "FCFA",
    tagline: "For growing creators, vendors, and event hosts.",
    featured: false,
    limits: PLAN_LIMITS[ACCOUNT_TYPES.PRO],
    vendorFeatures: [
      "Up to 50 products/services",
      "AI service generation",
      "AI marketing assistant",
      "50 AI marketing generations per month",
      "Featured listings",
      "Vendor verification badge",
      "Saved marketing history",
      "Up to 1 staff account",
      "Custom storefront branding",
    ],
    eventFeatures: [
      "Up to 5 active events",
      "Up to 200 guests per event",
      "Premium invitation themes",
      "Vendor recommendation engine",
      "Basic seating planner",
      "Budget management",
      "Automated reminders",
      "Event analytics dashboard",
      "Guest segmentation",
    ],
    taskerFeatures: ["Priority staffing visibility", "Verified tasker badge", "Accept staffing bookings"],
    checkInFeatures: ["Advanced QR check-in"],
  },
  {
    id: ACCOUNT_TYPES.VENDOR_PRO,
    name: "Vendor Pro",
    accountType: ACCOUNT_TYPES.VENDOR_PRO,
    monthlyPrice: 50000,
    yearlyPrice: 500000,
    currency: "FCFA",
    tagline: "Most popular for premium creators, vendors, and event hosts.",
    featured: true,
    limits: PLAN_LIMITS[ACCOUNT_TYPES.VENDOR_PRO],
    vendorFeatures: [
      "Up to 100 products/services",
      "AI service generation",
      "AI marketing assistant",
      "100 AI marketing generations per month",
      "Basic flyer generation",
      "Instagram carousel captions",
      "Featured listings",
      "Advanced analytics",
      "Vendor verification badge",
      "Smart pricing suggestions",
      "Saved marketing history",
      "Up to 3 staff accounts",
      "Custom storefront branding",
    ],
    eventFeatures: [
      "Up to 10 active events",
      "Up to 3,000 guests per event",
      "AI event website generator",
      "Premium invitation themes",
      "Vendor recommendation engine",
      "Smart seating planner",
      "Budget management",
      "Automated reminders",
      "Event analytics dashboard",
      "Guest segmentation",
      "VIP guest tagging",
      "Gallery pages",
    ],
    taskerFeatures: ["Priority staffing visibility", "Verified tasker badge", "Staffing analytics", "Accept staffing bookings"],
    checkInFeatures: ["Advanced QR check-in", "Guest attendance dashboard"],
  },
  {
    id: ACCOUNT_TYPES.BUSINESS,
    name: "Business",
    accountType: ACCOUNT_TYPES.BUSINESS,
    monthlyPrice: 100000,
    yearlyPrice: 1000000,
    currency: "FCFA",
    tagline: "Scale teams, multi-branch storefronts, and high-capacity events.",
    featured: false,
    limits: PLAN_LIMITS[ACCOUNT_TYPES.BUSINESS],
    vendorFeatures: [
      "Unlimited products/services",
      "Multi-branch management",
      "Up to 15 staff accounts",
      "White-label storefront",
      "CRM tools",
      "Team collaboration",
      "Premium analytics",
      "Lead management",
      "Featured homepage placement",
      "1,000 AI marketing generations per month",
      "Email campaigns",
      "Competitor pricing analysis",
      "Brand voice presets",
      "Export marketing content",
    ],
    eventFeatures: [
      "Up to 50 active events",
      "Up to 30,000 guests per event",
      "Multi-admin event teams",
      "Staff coordination",
      "Advanced QR check-in",
      "AI-generated schedules",
      "Sponsor management",
      "Booth/vendor allocation",
      "Multi-day event support",
      "Livestream integrations",
      "Advanced RSVP analytics",
    ],
    taskerFeatures: ["Team staffing management", "Staff assignment tools", "Staff coordination dashboard"],
    checkInFeatures: ["Team check-in system", "Multiple scanners/devices", "Real-time attendance sync"],
  },
  {
    id: ACCOUNT_TYPES.ENTERPRISE,
    name: "Enterprise",
    accountType: ACCOUNT_TYPES.ENTERPRISE,
    monthlyPrice: 150000,
    yearlyPrice: 1500000,
    priceSuffix: "+",
    currency: "FCFA",
    tagline: "Regional, government, and corporate workflows with dedicated support.",
    featured: false,
    limits: PLAN_LIMITS[ACCOUNT_TYPES.ENTERPRISE],
    vendorFeatures: [
      "Unlimited branches",
      "Unlimited staff accounts",
      "Enterprise analytics",
      "ERP/API-ready architecture",
      "Regional management",
      "Enterprise onboarding",
      "Dedicated support",
      "White-label marketplace",
      "Unlimited AI marketing generations",
      "Multi-branch campaigns",
      "Advanced competitor insights",
      "Approval workflows",
    ],
    eventFeatures: [
      "Unlimited events",
      "Unlimited guests",
      "Government/corporate workflows",
      "Security access control",
      "AI attendee intelligence",
      "Smart networking recommendations",
      "Enterprise reporting",
      "Custom domains",
      "SSO-ready architecture",
    ],
    taskerFeatures: ["Enterprise workforce management", "Regional staffing deployment"],
    checkInFeatures: ["Enterprise access management", "High-scale entry validation", "Multi-location check-in systems"],
  },
];

function readPlans() {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEYS.pricingPlans);
    const parsed = stored ? JSON.parse(stored) : null;
    if (!Array.isArray(parsed) || parsed.length !== 5) return null;
    return parsed.every((plan) => Object.values(ACCOUNT_TYPES).includes(plan.accountType || plan.id)) ? parsed : null;
  } catch {
    return null;
  }
}

export function getPricingPlans() {
  ensureDemoData();
  const stored = readPlans();
  if (stored?.length) return stored;
  localStorage.setItem(DEMO_STORAGE_KEYS.pricingPlans, JSON.stringify(DEFAULT_PRICING_PLANS));
  return DEFAULT_PRICING_PLANS;
}

export function savePricingPlans(plans) {
  localStorage.setItem(DEMO_STORAGE_KEYS.pricingPlans, JSON.stringify(plans));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: DEMO_STORAGE_KEYS.pricingPlans, data: plans } }));
  return plans;
}

export function getPlanByAccountType(accountType) {
  return getPricingPlans().find((plan) => plan.accountType === accountType || plan.id === accountType) || DEFAULT_PRICING_PLANS[0];
}

export function getPlanPrice(plan, billingCycle = BILLING_CYCLES.MONTHLY) {
  const value = billingCycle === BILLING_CYCLES.YEARLY ? plan.yearlyPrice : plan.monthlyPrice;
  if (value === null || value === undefined) return "Custom";
  return `FCFA ${Number(value).toLocaleString("fr-CM")}${plan.priceSuffix || ""}`;
}

export function selectPlanForUser(user, planId, billingCycle = BILLING_CYCLES.MONTHLY) {
  const plan = getPricingPlans().find((item) => item.id === planId || item.accountType === planId);
  if (!plan || !user) return null;

  const authUser = JSON.parse(localStorage.getItem("invitegenie_auth") || "{}");
  const profile = JSON.parse(localStorage.getItem("invitegenie_profile") || "{}");
  const nextAuthUser = buildUnifiedUser({
    ...authUser,
    accountType: plan.accountType,
    plan: plan.accountType,
    tier: plan.accountType,
    billingCycle,
    subscriptionStatus: "active",
    subscriptionRenewalDate: getNextRenewalDate(billingCycle),
  });
  const nextProfile = buildUnifiedUser({
    ...profile,
    accountType: plan.accountType,
    plan: plan.accountType,
    tier: plan.accountType,
    billingCycle,
    subscriptionStatus: "active",
    subscriptionRenewalDate: getNextRenewalDate(billingCycle),
  });

  const subscriptions = readSubscriptions();
  const nextSubscriptions = [
    {
      userId: nextProfile.id || nextAuthUser.id,
      accountType: plan.accountType,
      billingCycle,
      status: "active",
      renewalDate: nextProfile.subscriptionRenewalDate,
      updatedAt: new Date().toISOString(),
    },
    ...subscriptions.filter((item) => String(item.userId) !== String(nextProfile.id || nextAuthUser.id)),
  ];

  localStorage.setItem("invitegenie_auth", JSON.stringify(nextAuthUser));
  localStorage.setItem("invitegenie_profile", JSON.stringify(nextProfile));
  localStorage.setItem("demo_subscriptions", JSON.stringify(nextSubscriptions));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: "demo_subscriptions", data: nextSubscriptions } }));
  return { plan, user: nextAuthUser, profile: nextProfile };
}

function readSubscriptions() {
  try {
    const stored = localStorage.getItem("demo_subscriptions");
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getNextRenewalDate(billingCycle) {
  const date = new Date();
  date.setMonth(date.getMonth() + (billingCycle === BILLING_CYCLES.YEARLY ? 12 : 1));
  return date.toISOString();
}
