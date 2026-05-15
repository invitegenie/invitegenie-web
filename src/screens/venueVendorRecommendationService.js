export function generateVendorRecommendationsFromObjects(objects) {
  if (!objects || !objects.length) return [];

  const vendorGroups = {
    furniture: { category: "Furniture Rental", items: new Set(), qty: 0, cost: 0, priority: "High", ids: [], tags: ["furniture", "chair rental", "table rental"], reason: "Seating and tables are required for guests." },
    av: { category: "Audio Visual Vendor", items: new Set(), qty: 0, cost: 0, priority: "High", ids: [], tags: ["dj", "lighting", "stage", "sound"], reason: "Audio, lighting, and stage setup are needed for entertainment." },
    catering: { category: "Catering & Bar Vendor", items: new Set(), qty: 0, cost: 0, priority: "Critical", ids: [], tags: ["caterer", "bartender", "food stall"], reason: "Food and beverage stations are present on the floorplan." },
    decor: { category: "Decor & Tent Vendor", items: new Set(), qty: 0, cost: 0, priority: "Medium", ids: [], tags: ["decorator", "tent", "canopy", "florist"], reason: "Structural decor and canopies require professional setup." },
    utilities: { category: "Utilities & Security Vendor", items: new Set(), qty: 0, cost: 0, priority: "Critical", ids: [], tags: ["generator", "security", "portable toilets", "parking"], reason: "Essential utilities and safety infrastructure are planned." },
    services: { category: "Event Services Vendor", items: new Set(), qty: 0, cost: 0, priority: "Medium", ids: [], tags: ["photobooth", "vendor booth"], reason: "Specialty services and booths are included in the layout." }
  };

  objects.forEach((obj) => {
    const type = (obj.type || "").toLowerCase();
    let group = null;
    let unitCost = 0;

    if (type.includes("table") || type.includes("chair") || type.includes("sofa") || type.includes("stool")) {
      group = vendorGroups.furniture;
      unitCost = type.includes("chair") || type.includes("stool") ? 2000 : 35000;
    } else if (type.includes("stage") || type.includes("dj") || type.includes("light") || type.includes("speaker")) {
      group = vendorGroups.av;
      unitCost = 200000;
    } else if (type.includes("buffet") || type.includes("bar") || type.includes("food") || type.includes("stall")) {
      group = vendorGroups.catering;
      unitCost = 95000;
    } else if (type.includes("canopy") || type.includes("tent") || type.includes("decor") || type.includes("arch") || type.includes("carpet") || type.includes("floral")) {
      group = vendorGroups.decor;
      unitCost = type.includes("canopy") || type.includes("tent") ? 150000 : 45000;
    } else if (type.includes("generator") || type.includes("toilet") || type.includes("exit") || type.includes("parking") || type.includes("security")) {
      group = vendorGroups.utilities;
      unitCost = type.includes("generator") || type.includes("toilet") ? 50000 : 15000;
    } else if (type.includes("photo") || type.includes("booth") || type.includes("led") || type.includes("vendorbooth")) {
      group = vendorGroups.services;
      unitCost = 120000;
    }

    if (group) {
      group.items.add(obj.name || obj.type);
      group.qty++;
      group.cost += unitCost;
      group.ids.push(obj.id);
    }
  });

  return Object.entries(vendorGroups)
    .filter(([_, data]) => data.qty > 0)
    .map(([key, data]) => ({
      id: `rec-${key}-${Date.now()}`, vendorType: key, category: data.category, requiredItems: Array.from(data.items), quantity: data.qty, estimatedBudget: data.cost, urgency: data.priority, linkedObjectIds: data.ids, suggestedVendorSearchTags: data.tags, reason: data.reason, actions: ["Find Vendors", "Send RFQ", "Add to Event Checklist"]
    }))
    .sort((a, b) => b.estimatedBudget - a.estimatedBudget);
}