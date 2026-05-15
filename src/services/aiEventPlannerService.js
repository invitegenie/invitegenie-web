// InviteGenie AI Event Planner Service
// Currently uses heuristic parsing & mock data. Future-ready for OpenAI/Gemini integration.

import { getMarketplaceProviders } from "./mockData";

export const AI_EVENT_PLANNER_KEYS = {
  plans: "demo_ai_event_plans",
  checklists: "demo_ai_event_checklists",
  timelines: "demo_ai_event_timelines",
  exports: "demo_ai_event_exports",
};

const STORAGE_KEY = AI_EVENT_PLANNER_KEYS.plans;

export async function getAIEventPlans(userId) {
  const plans = getLocalPlans();
  if (!userId) return plans;
  return plans.filter((plan) => String(plan.userId) === String(userId) || plan.userId === "guest");
}

export function getLocalPlans() {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export async function getAIEventPlanById(id) {
  return getLocalPlanById(id);
}

function getLocalPlanById(id) {
  return getLocalPlans().find((p) => String(p.id) === String(id));
}

export async function saveAIEventPlan(plan) {
  return saveLocalPlan(plan);
}

function saveLocalPlan(plan) {
  const plans = getLocalPlans();
  const nextPlan = { ...plan, updatedAt: new Date().toISOString() };
  const existingIndex = plans.findIndex((p) => String(p.id) === String(plan.id));
  if (existingIndex >= 0) {
    plans[existingIndex] = { ...plans[existingIndex], ...nextPlan };
  } else {
    plans.unshift({ ...nextPlan, createdAt: new Date().toISOString() });
  }
  const savedPlan = plans[existingIndex >= 0 ? existingIndex : 0];
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    persistPlanArtifacts(savedPlan);
    window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: STORAGE_KEY, data: plans } }));
  }
  return savedPlan;
}

export async function updateAIChecklistItem(planId, taskId, completed) {
  const plan = await getAIEventPlanById(planId);
  if (!plan) return;
  plan.checklist = plan.checklist.map((task) => (task.id === taskId ? { ...task, completed } : task));
  return await saveAIEventPlan(plan);
}

export function saveAIEventPlanExport(planId, type = "pdf") {
  const exports = readLocalArray(AI_EVENT_PLANNER_KEYS.exports);
  const exportRecord = {
    id: `AIEXPORT-${Date.now()}`,
    planId,
    type,
    status: "demo_ready",
    createdAt: new Date().toISOString(),
  };
  const nextExports = [exportRecord, ...exports].slice(0, 50);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(AI_EVENT_PLANNER_KEYS.exports, JSON.stringify(nextExports));
    window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: AI_EVENT_PLANNER_KEYS.exports, data: nextExports } }));
  }
  return exportRecord;
}

/**
 * Core AI Generation Engine (Async to prepare for real LLM integration)
 */
export async function generateAIEventPlan(prompt, userProfile, options = {}) {
  // In the future: const response = await openai.chat.completions.create({...})
  
  const lowerPrompt = prompt.toLowerCase();
  
  // Heuristic Parsing
  let budget = 1500000; // Default 1.5M FCFA
  const budgetMatchM = lowerPrompt.match(/(\d+(?:\.\d+)?)\s*m/);
  const budgetMatchK = lowerPrompt.match(/(\d+(?:\.\d+)?)\s*k/);
  const budgetMatchRaw = lowerPrompt.match(/(\d{2,})\s*(?:fcfa|francs)/);
  
  if (budgetMatchM) budget = parseFloat(budgetMatchM[1]) * 1000000;
  else if (budgetMatchK) budget = parseFloat(budgetMatchK[1]) * 1000;
  else if (budgetMatchRaw) budget = parseInt(budgetMatchRaw[1], 10);

  let guestCount = 100;
  const guestMatch = lowerPrompt.match(/(\d+)\s*(?:guests|people|pax|attendees)/);
  if (guestMatch) guestCount = parseInt(guestMatch[1], 10);

  let eventType = "Premium Event";
  if (lowerPrompt.includes("wedding") || lowerPrompt.includes("marriage")) eventType = "Wedding";
  else if (lowerPrompt.includes("gala")) eventType = "Gala";
  else if (lowerPrompt.includes("corporate") || lowerPrompt.includes("conference")) eventType = "Corporate Event";
  else if (lowerPrompt.includes("birthday")) eventType = "Birthday Party";
  else if (lowerPrompt.includes("baby shower")) eventType = "Baby Shower";

  let location = "Douala";
  if (lowerPrompt.includes("yaounde") || lowerPrompt.includes("yaoundé")) location = "Yaoundé";
  else if (lowerPrompt.includes("kribi")) location = "Kribi";
  else if (lowerPrompt.includes("limbe")) location = "Limbe";
  else if (lowerPrompt.includes("buea")) location = "Buea";

  const aesthetic = lowerPrompt.includes("luxury") || lowerPrompt.includes("vip") ? "Luxury & Elegant" 
                  : lowerPrompt.includes("traditional") ? "Cultural & Royal" 
                  : "Modern & Chic";

  // Calculate Budget Breakdown
  const budgetBreakdown = {
    venue: Math.round(budget * 0.25),
    catering: Math.round(budget * 0.35),
    decor: Math.round(budget * 0.15),
    photography: Math.round(budget * 0.08),
    entertainment: Math.round(budget * 0.07),
    logistics: Math.round(budget * 0.05),
    contingency: Math.round(budget * 0.05),
  };

  // Mock Vendor Matching
  const allVendors = getMarketplaceProviders() || [];
  const vendorSuggestions = allVendors
    .filter(v => v.category !== 'Other')
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .map(v => ({
      vendorId: v.id,
      name: v.businessName || v.title,
      category: v.category,
      estimatedPrice: v.price || Math.round(budget * 0.1),
      rating: v.rating || 4.8,
      styleMatch: "98%",
      image: v.image
    }));

  const plan = {
    id: `AIPLAN-${Date.now()}`,
    eventId: options.eventId || null,
    userId: userProfile?.id || "guest",
    title: `${aesthetic} ${eventType} in ${location}`,
    prompt,
    eventType,
    eventStyle: aesthetic,
    location,
    guestCount,
    estimatedBudget: budget,
    currency: "FCFA",
    
    aiSummary: `Based on your request, I've designed a comprehensive strategy for a ${aesthetic.toLowerCase()} ${eventType.toLowerCase()} for ${guestCount} guests in ${location} with an estimated budget of ${budget.toLocaleString()} FCFA. The allocation prioritizes premium catering and venue experience.`,

    generatedTheme: {
      primaryColor: aesthetic.includes("Royal") ? "#D6A23A" : "#0F172A",
      secondaryColor: aesthetic.includes("Chic") ? "#FBCFE8" : "#F5E6C8",
      aesthetic,
      vibe: aesthetic.includes("Luxury") ? "Exclusive, high-end, cinematic" : "Warm, energetic, memorable",
      dressCode: aesthetic.includes("Luxury") ? "Black Tie / Evening Gown" : "Elegant Formal",
      decorKeywords: ["Floral arches", "Warm ambient lighting", "Gold accents", "Textured linens"]
    },

    budgetBreakdown,

    timeline: [
      { phase: "3 Months Before", tasks: ["Finalize venue booking", "Pay deposits for catering and decor", "Send save-the-dates"] },
      { phase: "1 Month Before", tasks: ["Send official invitations", "Finalize menu tasting", "Confirm event schedule"] },
      { phase: "1 Week Before", tasks: ["Lock in final guest count", "Share seating plan with venue", "Confirm vendor arrival times"] },
      { phase: "Event Day", tasks: ["Venue setup (8:00 AM)", "Vendor sound/light check (2:00 PM)", "Guest arrival (4:00 PM)"] }
    ],

    checklist: [
      { id: "t1", title: "Secure venue deposit", completed: false, category: "Venue" },
      { id: "t2", title: "Book premium caterer", completed: false, category: "Catering" },
      { id: "t3", title: "Hire photographer & videographer", completed: false, category: "Media" },
      { id: "t4", title: "Select decor theme and florist", completed: false, category: "Decor" },
      { id: "t5", title: "Send digital RSVPs via InviteGenie", completed: false, category: "Invitations" },
      { id: "t6", title: "Book DJ/Band", completed: false, category: "Entertainment" },
      { id: "t7", title: "Arrange VIP security", completed: false, category: "Logistics" }
    ],

    vendorSuggestions,

    seatingSuggestions: {
      tableCount: Math.ceil(guestCount / 10),
      vipTables: Math.max(1, Math.ceil(guestCount * 0.1 / 8)),
      familyTables: Math.max(1, Math.ceil(guestCount * 0.2 / 10)),
      stagePlacement: "Central focal point",
      layoutStyle: "Banquet rounds of 10 with generous spacing for premium flow"
    },

    cateringEstimate: {
      estimatedMeals: Math.ceil(guestCount * 1.05), // 5% buffer
      drinks: `${Math.ceil(guestCount * 3)} bottles/glasses total`,
      dessert: `${guestCount} portions`,
      serviceStaff: Math.max(3, Math.ceil(guestCount / 15)) // 1 staff per 15 guests
    },

    riskRecommendations: [
      { title: "Weather Backup", desc: "If outdoors in Cameroon, ensure heavy-duty marquees are on standby." },
      { title: "Power Supply", desc: "Confirm venue has a silent standby generator with auto-switch." },
      { title: "Traffic Timing", desc: "Start time accounts for evening traffic in major cities." }
    ],

    emergencyPreparation: [
      "Have a 5% budget buffer (already allocated).",
      "Keep a printed copy of the guest list.",
      "Assign a day-of coordinator so you do not handle vendor calls."
    ],

    generatedWebsiteId: null
  };

  return saveAIEventPlan(plan);
}

export function buildWebsiteInputFromAIPlan(plan) {
  return {
    event_type: plan.eventType,
    user_prompt: plan.prompt,
    location: plan.location,
    guest_count: plan.guestCount,
    budget: plan.estimatedBudget > 2000000 ? "Luxury" : "Premium",
    theme_preference: plan.generatedTheme.aesthetic,
    primary_colors: [plan.generatedTheme.primaryColor, plan.generatedTheme.secondaryColor],
    event_date: "TBD",
    host_names: "InviteGenie Host"
  };
}

function persistPlanArtifacts(plan) {
  if (!plan || typeof localStorage === "undefined") return;
  const checklists = readLocalArray(AI_EVENT_PLANNER_KEYS.checklists);
  const timelines = readLocalArray(AI_EVENT_PLANNER_KEYS.timelines);
  localStorage.setItem(
    AI_EVENT_PLANNER_KEYS.checklists,
    JSON.stringify([{ planId: plan.id, checklist: plan.checklist || [], updatedAt: plan.updatedAt }, ...checklists.filter((item) => item.planId !== plan.id)])
  );
  localStorage.setItem(
    AI_EVENT_PLANNER_KEYS.timelines,
    JSON.stringify([{ planId: plan.id, timeline: plan.timeline || [], updatedAt: plan.updatedAt }, ...timelines.filter((item) => item.planId !== plan.id)])
  );
}

function readLocalArray(key) {
  if (typeof localStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
