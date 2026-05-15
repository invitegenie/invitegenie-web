export const VENUE_STORAGE_KEY = "demo_venue_projects";

export const VENUE_ITEM_LIBRARY = {
  "Seating": [
    { type: "chair_standard", name: "Standard Chair", width: 40, height: 40, color: "#94a3b8", shape: "circle", capacity: 1, priceEstimate: 500, vendorCategory: "Rentals" },
    { type: "chair_vip", name: "VIP Banquet Chair", width: 45, height: 45, color: "#d6a23a", shape: "rect", capacity: 1, priceEstimate: 2000, vendorCategory: "Rentals" },
    { type: "sofa_lounge", name: "Lounge Sofa", width: 120, height: 60, color: "#8b5cf6", shape: "rect", capacity: 3, priceEstimate: 15000, vendorCategory: "Decor" }
  ],
  "Tables": [
    { type: "table_round", name: "Round Banquet Table", width: 120, height: 120, color: "#f8fafc", shape: "circle", capacity: 8, priceEstimate: 3000, vendorCategory: "Rentals" },
    { type: "table_rect", name: "Rectangular Table", width: 180, height: 75, color: "#f8fafc", shape: "rect", capacity: 6, priceEstimate: 2500, vendorCategory: "Rentals" },
    { type: "table_cocktail", name: "Cocktail Table", width: 60, height: 60, color: "#cbd5e1", shape: "circle", capacity: 3, priceEstimate: 2000, vendorCategory: "Rentals" }
  ],
  "Stage & Entertainment": [
    { type: "stage", name: "Main Stage", width: 400, height: 200, color: "#1e293b", shape: "rect", capacity: 0, priceEstimate: 150000, vendorCategory: "Staging" },
    { type: "dj_booth", name: "DJ Booth", width: 120, height: 80, color: "#334155", shape: "rect", capacity: 1, priceEstimate: 50000, vendorCategory: "Entertainment" },
    { type: "dance_floor", name: "Dance Floor", width: 300, height: 300, color: "#ffffff", shape: "rect", border: "dashed", capacity: 50, priceEstimate: 80000, vendorCategory: "Staging" }
  ],
  "Service Areas": [
    { type: "bar", name: "Drinks Bar", width: 200, height: 60, color: "#0f766e", shape: "rect", capacity: 0, priceEstimate: 40000, vendorCategory: "Catering" },
    { type: "buffet", name: "Buffet Station", width: 300, height: 80, color: "#b45309", shape: "rect", capacity: 0, priceEstimate: 35000, vendorCategory: "Catering" },
    { type: "sponsor_booth", name: "Sponsor Booth", width: 150, height: 150, color: "#6366f1", shape: "rect", capacity: 0, priceEstimate: 25000, vendorCategory: "Sponsors" }
  ],
  "Infrastructure": [
    { type: "entrance", name: "Main Entrance", width: 150, height: 40, color: "#22c55e", shape: "rect", capacity: 0, priceEstimate: 0, vendorCategory: "Venue" },
    { type: "canopy", name: "Outdoor Canopy", width: 400, height: 400, color: "#f1f5f9", shape: "rect", opacity: 0.2, capacity: 50, priceEstimate: 75000, vendorCategory: "Tents" },
    { type: "red_carpet", name: "Red Carpet", width: 80, height: 300, color: "#e11d48", shape: "rect", capacity: 0, priceEstimate: 10000, vendorCategory: "Decor" }
  ]
};

export function getVenueProject(projectId) {
  try {
    const projects = JSON.parse(localStorage.getItem(VENUE_STORAGE_KEY)) || [];
    return projects.find(p => String(p.id) === String(projectId)) || null;
  } catch {
    return null;
  }
}

export function saveVenueProject(project) {
  const projects = JSON.parse(localStorage.getItem(VENUE_STORAGE_KEY)) || [];
  const index = projects.findIndex(p => String(p.id) === String(project.id));
  const updated = { ...project, updatedAt: new Date().toISOString() };
  
  if (index >= 0) projects[index] = updated;
  else projects.unshift(updated);
  
  localStorage.setItem(VENUE_STORAGE_KEY, JSON.stringify(projects));
  return updated;
}

export function generateAIVenueLayout(eventBrief) {
  const { eventType, guestCount, dimensions = { w: 1000, h: 800 } } = eventBrief;
  const items = [];
  
  // Generate ID helper
  const genId = () => `itm-${Math.random().toString(36).substr(2, 9)}`;

  // 1. Place Stage (Top Center)
  items.push({
    ...VENUE_ITEM_LIBRARY["Stage & Entertainment"].find(i => i.type === "stage"),
    id: genId(), x: dimensions.w / 2 - 200, y: 50, rotation: 0, zIndex: 10
  });

  // 2. Place Dance Floor (Below Stage)
  items.push({
    ...VENUE_ITEM_LIBRARY["Stage & Entertainment"].find(i => i.type === "dance_floor"),
    id: genId(), x: dimensions.w / 2 - 150, y: 280, rotation: 0, zIndex: 5
  });

  // 3. Place Tables & Chairs based on guest count
  const tableItem = VENUE_ITEM_LIBRARY["Tables"].find(i => i.type === "table_round");
  const chairItem = VENUE_ITEM_LIBRARY["Seating"].find(i => i.type === "chair_standard");
  
  const tablesNeeded = Math.ceil(guestCount / tableItem.capacity);
  let tablesPlaced = 0;
  
  const startX = 150;
  const startY = 620;
  const gapX = 200;
  const gapY = 200;
  const cols = Math.floor((dimensions.w - 300) / gapX);
  
  for (let t = 0; t < tablesNeeded; t++) {
    const col = t % cols;
    const row = Math.floor(t / cols);
    const tx = startX + col * gapX;
    const ty = startY + row * gapY;
    
    // Place Table
    items.push({ ...tableItem, id: genId(), x: tx, y: ty, rotation: 0, zIndex: 15, name: `Table ${t+1}`, groupId: `grp-table-${t}` });
    
    // Place Chairs around table
    for (let c = 0; c < tableItem.capacity; c++) {
      const angle = (c / tableItem.capacity) * Math.PI * 2;
      const cx = tx + 40 + Math.cos(angle) * 70; // 40 is offset to center table
      const cy = ty + 40 + Math.sin(angle) * 70;
      items.push({ ...chairItem, id: genId(), x: cx, y: cy, rotation: (angle * 180 / Math.PI) + 90, zIndex: 20, groupId: `grp-table-${t}` });
    }
  }

  // 4. Place Entrance & Red Carpet
  items.push({
    ...VENUE_ITEM_LIBRARY["Infrastructure"].find(i => i.type === "entrance"),
    id: genId(), x: dimensions.w / 2 - 75, y: dimensions.h - 50, rotation: 0, zIndex: 10
  });
  items.push({
    ...VENUE_ITEM_LIBRARY["Infrastructure"].find(i => i.type === "red_carpet"),
    id: genId(), x: dimensions.w / 2 - 40, y: dimensions.h - 350, rotation: 0, zIndex: 2
  });

  // 5. Place Bar & Buffet
  items.push({
    ...VENUE_ITEM_LIBRARY["Service Areas"].find(i => i.type === "bar"),
    id: genId(), x: dimensions.w - 250, y: 100, rotation: 90, zIndex: 10
  });
  items.push({
    ...VENUE_ITEM_LIBRARY["Service Areas"].find(i => i.type === "buffet"),
    id: genId(), x: 50, y: 150, rotation: 90, zIndex: 10
  });

  // 6. Add Sponsor Booths
  for(let s = 0; s < 2; s++) {
    items.push({
      ...VENUE_ITEM_LIBRARY["Service Areas"].find(i => i.type === "sponsor_booth"),
      id: genId(), x: 50 + (s * 200), y: dimensions.h - 200, rotation: 0, zIndex: 10, name: `Sponsor ${s+1}`
    });
  }

  return {
    id: `PRJ-${Date.now()}`,
    eventId: eventBrief.eventId || null,
    title: `${eventType} Layout`,
    venueDimensions: dimensions,
    guestCount,
    items,
    createdAt: new Date().toISOString()
  };
}

export function analyzeVenueLayout(project) {
  const warnings = [];
  const requirements = {};
  let totalCost = 0;
  let totalSeating = 0;
  let totalTableCapacity = 0;

  const items = project?.items || [];
  const guestCount = project?.guestCount || 0;

  items.forEach(item => {
    if (item.hidden) return; // Ignore hidden items in capacity
    // Cost
    totalCost += Number(item.priceEstimate || 0);
    
    // Capacity
    if ((item.type || "").includes("chair")) totalSeating += (item.capacity || 1);
    if ((item.type || "").includes("table")) totalTableCapacity += (item.capacity || 0);
    
    // Vendor Requirements
    if (item.vendorCategory) {
      if (!requirements[item.vendorCategory]) requirements[item.vendorCategory] = {};
      requirements[item.vendorCategory][item.name] = (requirements[item.vendorCategory][item.name] || 0) + 1;
    }
  });

  // Validations
  if (totalSeating < guestCount) {
    warnings.push({ type: "critical", message: `Not enough chairs. Have ${totalSeating}, need ${guestCount}.` });
  }
  if (totalTableCapacity < guestCount) {
    warnings.push({ type: "warning", message: `Not enough table space for ${guestCount} guests.` });
  }
  
  const hasEntrance = items.some(i => i.type === "entrance");
  if (!hasEntrance) warnings.push({ type: "critical", message: "No entrance defined for guest flow." });
  
  const hasService = items.some(i => i.vendorCategory === "Catering");
  if (!hasService) warnings.push({ type: "warning", message: "No catering/bar zones found." });

  // Formatting Vendor Requirements for UI
  const vendorList = Object.entries(requirements).map(([cat, items]) => ({
    category: cat,
    items: Object.entries(items).map(([name, qty]) => `${qty}x ${name}`)
  }));

  return {
    totalCost,
    totalSeating,
    totalTableCapacity,
    warnings,
    vendorList
  };
}