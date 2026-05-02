import { DEMO_STORAGE_KEYS, ensureDemoData } from "./mockData";

export const DEFAULT_PRICING_PLANS = [
  {
    id: "free_user",
    name: "Free User",
    price: 0,
    interval: "month",
    roleTarget: "normal_user",
    features: ["browse events", "buy tickets", "view limited memories", "basic gallery"],
  },
  {
    id: "pro_user",
    name: "Pro User",
    price: 3000,
    interval: "month",
    roleTarget: "pro_user",
    features: ["advanced gallery", "premium templates", "priority support", "enhanced event memory features"],
  },
  {
    id: "vendor_basic",
    name: "Vendor Basic",
    price: 5000,
    interval: "month",
    roleTarget: "vendor",
    features: ["create marketplace listing", "receive quote requests", "basic earnings dashboard"],
  },
  {
    id: "vendor_pro",
    name: "Vendor Pro",
    price: 15000,
    interval: "month",
    roleTarget: "vendor",
    features: ["featured marketplace listing", "advanced analytics", "promoted services", "priority leads"],
  },
  {
    id: "event_planner",
    name: "Event Planner",
    price: 25000,
    interval: "month",
    roleTarget: "event_planner",
    features: ["create/manage events", "ticket sales", "guest management", "scanner/check-in", "event analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    interval: "custom",
    roleTarget: "enterprise_client",
    features: ["company events", "team members", "bulk invitations", "approvals", "enterprise reports", "custom billing"],
  },
];

function readPlans() {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEYS.pricingPlans);
    return stored ? JSON.parse(stored) : null;
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

export function selectPlanForUser(user, planId) {
  const plan = getPricingPlans().find((item) => item.id === planId);
  if (!plan || !user) return null;

  const authUser = JSON.parse(localStorage.getItem("invitegenie_auth") || "{}");
  const profile = JSON.parse(localStorage.getItem("invitegenie_profile") || "{}");
  const nextAuthUser = {
    ...authUser,
    accountType: plan.name,
    plan: plan.name,
    tier: plan.name,
    role: plan.roleTarget || authUser.role,
  };
  const nextProfile = {
    ...profile,
    accountType: plan.name,
    plan: plan.name,
    tier: plan.name,
    role: plan.roleTarget || profile.role,
  };

  localStorage.setItem("invitegenie_auth", JSON.stringify(nextAuthUser));
  localStorage.setItem("invitegenie_profile", JSON.stringify(nextProfile));
  return { plan, user: nextAuthUser, profile: nextProfile };
}
