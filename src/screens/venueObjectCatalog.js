export const STORAGE_RENDER_KEY = "demo_venue_render_mode_requests";
export const STORAGE_SNAPSHOTS_KEY = "demo_venue_render_snapshots";
export const STORAGE_DRAFTS_KEY = "demo_venue_drafts";
export const MIN_DESKTOP_WIDTH = 1024;

export const cn = (...classes) => classes.filter(Boolean).join(" ");
export const money = (value = 0) => `${Number(value || 0).toLocaleString()} FCFA`;
export const uid = (prefix = "obj") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const extendedVenueObjects = {
  seating: [
    { name: "Chiavari Chair", icon: "event_seat" },
    { name: "Banquet Chair", icon: "chair" },
    { name: "Plastic Chair", icon: "chair_alt" },
    { name: "VIP Sofa", icon: "weekend" },
    { name: "Cocktail Stool", icon: "airline_seat_recline_normal" },
  ],
  tables: [
    { name: "Round Table", icon: "circle" },
    { name: "Rectangular Table", icon: "crop_16_9" },
    { name: "Cocktail Table", icon: "wine_bar" },
    { name: "Cake Table", icon: "table_restaurant" },
    { name: "Buffet Table", icon: "table_bar" },
  ],
  structures: [
    { name: "Canopy Tent", icon: "roofing" },
    { name: "Wedding Tent", icon: "home_work" },
    { name: "Entrance Arch", icon: "filter_vintage" },
    { name: "Backdrop", icon: "select_all" },
    { name: "Runway Carpet", icon: "linear_scale" },
  ],
  decor: [
    { name: "Floral Decor", icon: "local_florist" },
    { name: "Center Piece", icon: "emoji_events" },
    { name: "LED Wall", icon: "tv" },
    { name: "Dance Floor", icon: "grid_view" },
    { name: "Photo Booth", icon: "photo_camera" },
  ],
  utilities: [
    { name: "Generator", icon: "bolt" },
    { name: "Toilet Area", icon: "wc" },
    { name: "Emergency Exit", icon: "exit_to_app" },
    { name: "Parking Zone", icon: "local_parking" },
    { name: "Security Check", icon: "security" },
  ],
  vendor: [
    { name: "Vendor Booth", icon: "storefront" },
    { name: "Food Stall", icon: "restaurant" },
    { name: "Bar", icon: "local_bar" },
    { name: "DJ Booth", icon: "album" },
    { name: "Lighting Tower", icon: "lightbulb" },
  ],
};

export const librarySections = [
  { title: "Seating", items: extendedVenueObjects.seating },
  { title: "Tables", items: extendedVenueObjects.tables },
  { title: "Structures", items: extendedVenueObjects.structures },
  { title: "Decor & Lighting", items: extendedVenueObjects.decor },
  { title: "Utilities & Safety", items: extendedVenueObjects.utilities },
  { title: "Vendor & Service", items: extendedVenueObjects.vendor },
];

export const previewCards = [
  { id: "2d", title: "2D Plan", icon: "grid_on" },
  { id: "iso", title: "3D Isometric", icon: "view_in_ar" },
  { id: "walk", title: "3D Walkthrough", icon: "directions_walk" },
  { id: "flow", title: "Guest Flow", icon: "alt_route" },
  { id: "heat", title: "Capacity Heatmap", icon: "radar" },
];

export const VENUE_TEMPLATES = [
  {
    id: "royal_wedding",
    title: "Royal Wedding Reception",
    description: "Elegant setup with head table, dance floor, and round seating.",
    venueSize: { w: 1200, h: 1000 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Wedding Stage", x: w * 0.35, y: 20, width: w * 0.3, height: 130, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      { id: uid("t-dance"), type: "danceFloor", name: "Dance Floor", x: w * 0.42, y: 170, width: 220, height: 165, color: "#8B5A2B", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-vip"), type: "headTable", name: "VIP Head Table", x: w * 0.36, y: 360, width: 320, height: 52, color: "#F7D77E", rotation: 0, zIndex: 14, metadata: {} },
      ...Array.from({ length: 12 }).map((_, i) => ({ id: uid("t-tbl"), type: "roundTable", name: `Guest Table ${i + 1}`, x: i % 2 === 0 ? 150 : w - 250, y: 200 + Math.floor(i / 2) * 120, width: 96, height: 96, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: { seats: 8 } })),
      { id: uid("t-bar"), type: "bar", name: "Cocktail Bar", x: w - 200, y: 50, width: 165, height: 52, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-buffet"), type: "buffet", name: "Grand Buffet", x: 40, y: 200, width: 65, height: 220, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "Entrance Arch", x: w * 0.46, y: h - 100, width: 115, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "corporate_conference",
    title: "Corporate Conference",
    description: "Presentation setup with rows of chairs and coffee stations.",
    venueSize: { w: 1000, h: 800 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Presentation Stage", x: w * 0.25, y: 20, width: w * 0.5, height: 100, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      ...Array.from({ length: 24 }).map((_, i) => ({ id: uid("t-chr"), type: "chair", name: `Seat ${i + 1}`, x: 200 + (i % 8) * 80, y: 200 + Math.floor(i / 8) * 60, width: 42, height: 42, color: "#CBD5E1", rotation: 0, zIndex: 16, metadata: {} })),
      { id: uid("t-buffet"), type: "buffet", name: "Coffee Break Station", x: 40, y: h - 100, width: 220, height: 65, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "Registration", x: w / 2 - 60, y: h - 100, width: 120, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "gala_dinner",
    title: "Gala Dinner",
    description: "Premium setup with wide round tables and photo opportunities.",
    venueSize: { w: 1400, h: 1000 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Gala Stage", x: w / 2 - 200, y: 40, width: 400, height: 120, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      ...Array.from({ length: 15 }).map((_, i) => ({ id: uid("t-tbl"), type: "roundTable", name: `Gala Table ${i + 1}`, x: 200 + (i % 5) * 220, y: 250 + Math.floor(i / 5) * 200, width: 110, height: 110, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: { seats: 10 } })),
      { id: uid("t-photo"), type: "photoBooth", name: "Red Carpet Photo", x: 100, y: h - 150, width: 120, height: 80, color: "#111827", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "Red Carpet Entry", x: w / 2 - 75, y: h - 100, width: 150, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "outdoor_festival",
    title: "Outdoor Festival",
    description: "Large open space with vendor booths, huge stage, and utilities.",
    venueSize: { w: 2000, h: 1500 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Main Stage", x: w / 2 - 250, y: 40, width: 500, height: 200, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      ...Array.from({ length: 6 }).map((_, i) => ({ id: uid("t-vend"), type: "vendorBooth", name: `Vendor ${i + 1}`, x: 50 + (i % 2) * 200, y: 300 + Math.floor(i / 2) * 200, width: 140, height: 90, color: "#F59E0B", rotation: 0, zIndex: 16, metadata: {} })),
      ...Array.from({ length: 4 }).map((_, i) => ({ id: uid("t-food"), type: "foodStall", name: `Food Stall ${i + 1}`, x: w - 250, y: 300 + i * 200, width: 160, height: 100, color: "#FB923C", rotation: 0, zIndex: 16, metadata: {} })),
      { id: uid("t-toilet"), type: "toilet", name: "Restrooms", x: 100, y: h - 200, width: 150, height: 120, color: "#0EA5E9", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-gen"), type: "generator", name: "Main Generator", x: w - 200, y: 40, width: 140, height: 85, color: "#374151", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "Main Gates", x: w / 2 - 100, y: h - 120, width: 200, height: 100, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "traditional_ceremony",
    title: "Traditional Ceremony",
    description: "Canopy tents arranged in a U-shape for families.",
    venueSize: { w: 1200, h: 1000 },
    getObjects: (w, h) => [
      { id: uid("t-canopy-1"), type: "canopy", name: "Bride Family Tent", x: 100, y: 200, width: 220, height: 400, color: "#10B981", rotation: 0, zIndex: 10, metadata: {} },
      { id: uid("t-canopy-2"), type: "canopy", name: "Groom Family Tent", x: w - 320, y: 200, width: 220, height: 400, color: "#10B981", rotation: 0, zIndex: 10, metadata: {} },
      { id: uid("t-canopy-3"), type: "canopy", name: "Elders Tent", x: w / 2 - 200, y: 50, width: 400, height: 150, color: "#10B981", rotation: 0, zIndex: 10, metadata: {} },
      ...Array.from({ length: 8 }).map((_, i) => ({ id: uid("t-tbl"), type: "rectangularTable", name: `Table ${i + 1}`, x: i < 4 ? 140 : w - 280, y: 250 + (i % 4) * 80, width: 140, height: 40, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: {} })),
      { id: uid("t-buffet"), type: "buffet", name: "Traditional Buffet", x: w / 2 - 100, y: h - 200, width: 200, height: 65, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "concert",
    title: "Concert / VIP Show",
    description: "Massive stage with lighting, DJ, and standing VIP zones.",
    venueSize: { w: 1500, h: 1200 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Concert Stage", x: w / 2 - 300, y: 40, width: 600, height: 200, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      { id: uid("t-dj"), type: "djBooth", name: "DJ/Sound Control", x: w / 2 - 60, y: h - 300, width: 120, height: 70, color: "#7C3AED", rotation: 0, zIndex: 15, metadata: {} },
      { id: uid("t-light-1"), type: "lightingTower", name: "Tower Left", x: w / 2 - 350, y: 150, width: 70, height: 70, color: "#FDE047", rotation: 0, zIndex: 30, metadata: {} },
      { id: uid("t-light-2"), type: "lightingTower", name: "Tower Right", x: w / 2 + 280, y: 150, width: 70, height: 70, color: "#FDE047", rotation: 0, zIndex: 30, metadata: {} },
      { id: uid("t-carpet"), type: "carpet", name: "VIP Standing Area", x: w / 2 - 250, y: 300, width: 500, height: 400, color: "#DC2626", rotation: 0, zIndex: 8, metadata: {} },
      { id: uid("t-bar-1"), type: "bar", name: "Left Bar", x: 50, y: h / 2, width: 60, height: 200, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-bar-2"), type: "bar", name: "Right Bar", x: w - 110, y: h / 2, width: 60, height: 200, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "General Admission Entry", x: w / 2 - 100, y: h - 120, width: 200, height: 100, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "birthday",
    title: "Birthday Party",
    description: "Intimate party setup with cake table and dance floor.",
    venueSize: { w: 800, h: 800 },
    getObjects: (w, h) => [
      { id: uid("t-dance"), type: "danceFloor", name: "Dance Floor", x: w / 2 - 100, y: 200, width: 200, height: 200, color: "#8B5A2B", rotation: 0, zIndex: 10, metadata: {} },
      { id: uid("t-dj"), type: "djBooth", name: "DJ", x: w / 2 - 60, y: 80, width: 120, height: 70, color: "#7C3AED", rotation: 0, zIndex: 15, metadata: {} },
      ...Array.from({ length: 6 }).map((_, i) => ({ id: uid("t-tbl"), type: "roundTable", name: `Table ${i + 1}`, x: i % 2 === 0 ? 50 : w - 150, y: 200 + Math.floor(i / 2) * 150, width: 80, height: 80, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: { seats: 6 } })),
      { id: uid("t-cake"), type: "roundTable", name: "Cake Table", x: w / 2 - 40, y: h / 2 + 50, width: 80, height: 80, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: { seats: 0 } },
      { id: uid("t-bar"), type: "bar", name: "Drinks", x: w - 200, y: h - 100, width: 150, height: 50, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
      { id: uid("t-entry"), type: "entrance", name: "Entrance", x: w / 2 - 50, y: h - 80, width: 100, height: 60, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  },
  {
    id: "church",
    title: "Church Event",
    description: "Spiritual gathering with large seating capacity and altar.",
    venueSize: { w: 1000, h: 1200 },
    getObjects: (w, h) => [
      { id: uid("t-stage"), type: "stage", name: "Altar / Stage", x: w / 2 - 250, y: 50, width: 500, height: 150, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
      { id: uid("t-decor"), type: "decor", name: "Flower Setup", x: w / 2 - 45, y: 220, width: 90, height: 40, color: "#EC4899", rotation: 0, zIndex: 15, metadata: {} },
      ...Array.from({ length: 40 }).map((_, i) => ({ id: uid("t-chr"), type: "chair", name: `Seat row ${i + 1}`, x: 150 + (i % 8) * 90, y: 350 + Math.floor(i / 8) * 100, width: 42, height: 42, color: "#CBD5E1", rotation: 0, zIndex: 16, metadata: {} })),
      { id: uid("t-entry"), type: "entrance", name: "Main Doors", x: w / 2 - 100, y: h - 100, width: 200, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} }
    ]
  }
];

export const initialVenueObjects = [
  { id: "stage-main", type: "stage", name: "Main Stage", x: 420, y: 0, width: 360, height: 130, color: "#6D28D9", rotation: 0, zIndex: 20, metadata: {} },
  { id: "dance-floor", type: "danceFloor", name: "Dance Floor", x: 490, y: 215, width: 245, height: 175, color: "#8B5A2B", rotation: 0, zIndex: 10, metadata: {} },
  { id: "head-table", type: "headTable", name: "VIP / Head Table", x: 455, y: 465, width: 295, height: 50, color: "#F7D77E", rotation: 0, zIndex: 14, metadata: {} },
  { id: "buffet", type: "buffet", name: "Buffet Area", x: 40, y: 280, width: 60, height: 220, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
  { id: "bar", type: "bar", name: "Bar", x: 960, y: 170, width: 165, height: 52, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
  { id: "entrance", type: "entrance", name: "Entrance", x: 545, y: 920, width: 115, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} },
  { id: "photo-booth", type: "photoBooth", name: "Photo Booth", x: 1110, y: 650, width: 65, height: 95, color: "#111827", rotation: 0, zIndex: 12, metadata: {} },
  ...[
    [145, 195], [300, 205], [145, 370], [320, 360], [175, 540], [360, 610],
    [855, 205], [740, 360], [900, 390], [1000, 565], [825, 610], [610, 565],
  ].map(([x, y], index) => ({
    id: `table-${index + 1}`,
    type: "roundTable",
    name: `Table ${index + 1}`,
    x,
    y,
    width: 96,
    height: 96,
    color: "#F8FAFC",
    rotation: 0,
    zIndex: 16,
    metadata: { seats: 8, tableNumber: `T-${index + 1}` },
  })),
];

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getRulerMarks(size, step = 100) {
  return Array.from({ length: Math.floor(size / step) + 1 }, (_, index) => index * step);
}

export function makeObjectFromLibraryItem(item, venueSize) {
  const lower = `${item?.name || ""} ${item?.icon || ""}`.toLowerCase();
  let type = "custom";
  let width = 110;
  let height = 80;
  let color = "#8B5CF6";
  let metadata = {};

  if (lower.includes("round")) {
    type = "roundTable";
    width = 96;
    height = 96;
    color = "#F8FAFC";
    metadata = { seats: 8, tableNumber: "New" };
  } else if (lower.includes("chair")) {
    type = "chair";
    width = 42;
    height = 42;
    color = "#CBD5E1";
  } else if (lower.includes("stage")) {
    type = "stage";
    width = 260;
    height = 105;
    color = "#6D28D9";
  } else if (lower.includes("dj")) {
    type = "djBooth";
    width = 120;
    height = 70;
    color = "#7C3AED";
  } else if (lower.includes("dance")) {
    type = "danceFloor";
    width = 200;
    height = 160;
    color = "#8B5A2B";
  } else if (lower.includes("bar")) {
    type = "bar";
    width = 150;
    height = 55;
    color = "#F7D77E";
  } else if (lower.includes("buffet") || lower.includes("catering")) {
    type = "buffet";
    width = 170;
    height = 58;
    color = "#F7D77E";
  } else if (lower.includes("generator")) {
    type = "generator";
    width = 140;
    height = 85;
    color = "#374151";
  } else if (lower.includes("toilet")) {
    type = "toilet";
    width = 110;
    height = 90;
    color = "#0EA5E9";
  } else if (lower.includes("parking")) {
    type = "parking";
    width = 260;
    height = 180;
    color = "#1E293B";
  } else if (lower.includes("vendor")) {
    type = "vendorBooth";
    width = 140;
    height = 90;
    color = "#F59E0B";
  } else if (lower.includes("stall")) {
    type = "foodStall";
    width = 160;
    height = 100;
    color = "#FB923C";
  } else if (lower.includes("light")) {
    type = "lightingTower";
    width = 70;
    height = 180;
    color = "#FDE047";
  } else if (lower.includes("exit")) {
    type = "exit";
    width = 120;
    height = 70;
    color = "#16A34A";
  } else if (lower.includes("carpet") || lower.includes("runway")) {
    type = "carpet";
    width = 280;
    height = 55;
    color = "#DC2626";
  } else if (lower.includes("decor") || lower.includes("flower")) {
    type = "decor";
    width = 95;
    height = 95;
    color = "#EC4899";
  } else if (lower.includes("canopy")) {
    type = "canopy";
    width = 220;
    height = 160;
    color = "#10B981";
  } else if (lower.includes("arch")) {
    type = "arch";
    width = 115;
    height = 125;
    color = "#22C55E";
  }

  return {
    id: uid(),
    type,
    name: item?.name || "Venue Object",
    x: Math.max(20, venueSize.w / 2 - width / 2),
    y: Math.max(20, venueSize.h / 2 - height / 2),
    width,
    height,
    color,
    rotation: 0,
    zIndex: 30,
    locked: false,
    hidden: false,
    opacity: 1,
    metadata,
  };
}