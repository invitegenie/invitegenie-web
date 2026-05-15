export const EVENT_WEBSITE_STORAGE_KEYS = {
  websites: "demo_event_websites",
};

const fallbackColors = ["#0B0B0A", "#F5E6C8", "#D6A23A"];

function safeParse(value, fallback = []) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readWebsites() {
  if (typeof localStorage === "undefined") return [];
  return safeParse(localStorage.getItem(EVENT_WEBSITE_STORAGE_KEYS.websites), []);
}

function writeWebsites(websites) {
  if (typeof localStorage === "undefined") return websites;
  localStorage.setItem(EVENT_WEBSITE_STORAGE_KEYS.websites, JSON.stringify(websites));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: EVENT_WEBSITE_STORAGE_KEYS.websites, data: websites } }));
  return websites;
}

function clean(value, fallback = "") {
  return String(value || fallback).trim();
}

function titleCase(value) {
  return clean(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function splitColors(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return clean(value)
    .split(/,|\n|\//)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getColors(primaryColors) {
  const colors = splitColors(primaryColors);
  return [colors[0] || fallbackColors[0], colors[1] || fallbackColors[1], colors[2] || fallbackColors[2]];
}

function inferBudgetTier(value) {
  const raw = clean(value).toLowerCase();
  if (/lux|prem|vip|high|platinum|gold/.test(raw)) return "Luxury";
  if (/standard|mid|medium/.test(raw)) return "Premium";
  if (/low|simple|starter|basic/.test(raw)) return "Elegant";
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));
  if (numeric >= 5000000) return "Luxury";
  if (numeric >= 1500000) return "Premium";
  return raw ? titleCase(raw) : "Premium";
}

function getEventFamily(eventType) {
  const type = clean(eventType).toLowerCase();
  if (/wed|traditional|engagement|vow|bride|groom/.test(type)) return "wedding";
  if (/corporate|conference|summit|network|launch|dinner|executive/.test(type)) return "corporate";
  if (/concert|music|festival|party|night/.test(type)) return "entertainment";
  if (/fashion|runway|style/.test(type)) return "fashion";
  if (/cultural|heritage|traditional/.test(type)) return "cultural";
  if (/gala|fundraiser|award/.test(type)) return "gala";
  return "celebration";
}

function formatGuestCount(value) {
  const number = Number(value || 0);
  return number > 0 ? number : 150;
}

function buildTitle({ eventType, hostNames, location }) {
  const family = getEventFamily(eventType);
  const hosts = clean(hostNames);
  const city = clean(location).split(",")[0];

  if (family === "wedding" && hosts) return `${hosts} Golden Vow Celebration`;
  if (family === "corporate") return `${city || "InviteGenie"} Executive Signature Experience`;
  if (family === "entertainment") return `${city || "African"} Afterglow Live Experience`;
  if (family === "fashion") return `${city || "African"} Luxe Style Showcase`;
  if (family === "cultural") return `${city || "African"} Heritage Luxe Gathering`;
  if (family === "gala") return `${city || "InviteGenie"} Prestige Gala`;
  return `${city || "InviteGenie"} Signature Celebration`;
}

function getToneWords(family) {
  const map = {
    wedding: {
      tagline: "A celebration of love, legacy, and unforgettable elegance.",
      mood: "Romantic, ceremonial, warm, family-centered, and deeply polished.",
      dressCode: "Black tie elegance with a touch of gold.",
      signature: "With love, honor, and anticipation.",
    },
    corporate: {
      tagline: "Where ambition, influence, and premium hospitality meet.",
      mood: "Executive, polished, confident, social, and high-trust.",
      dressCode: "Executive elegance with refined evening details.",
      signature: "Designed for meaningful connections and lasting momentum.",
    },
    entertainment: {
      tagline: "A night built for rhythm, energy, and unforgettable memories.",
      mood: "Cinematic, expressive, social-first, energetic, and premium.",
      dressCode: "Statement evening wear with a luxe African edge.",
      signature: "Come ready for the moment everyone will talk about.",
    },
    fashion: {
      tagline: "A visual celebration of style, culture, and modern luxury.",
      mood: "Editorial, bold, image-led, stylish, and highly shareable.",
      dressCode: "High-fashion formal with expressive accessories.",
      signature: "Where every arrival becomes part of the runway.",
    },
    cultural: {
      tagline: "An elegant tribute to heritage, rhythm, and community.",
      mood: "Warm, ceremonial, rooted, elevated, and culturally rich.",
      dressCode: "Modern traditional elegance.",
      signature: "Honoring culture with beauty, pride, and presence.",
    },
    gala: {
      tagline: "A prestige evening of purpose, elegance, and celebration.",
      mood: "Formal, luminous, generous, graceful, and premium.",
      dressCode: "Gala formal with gold or ivory accents.",
      signature: "An evening of elegance, impact, and shared legacy.",
    },
  };
  return map[family] || {
    tagline: "A premium celebration crafted for unforgettable connection.",
    mood: "Elegant, emotional, modern, visual, and guest-first.",
    dressCode: "Elegant evening wear.",
    signature: "Created for beautiful memories and effortless celebration.",
  };
}

function buildTimeline(family) {
  const shared = [
    { time: "2:00 PM", title: "Ceremony", description: "A refined opening moment with host welcome, arrival guidance, and elegant guest reception." },
    { time: "4:00 PM", title: "Reception", description: "Guests transition into the main experience with drinks, music, photos, and premium hospitality." },
    { time: "5:30 PM", title: "Entertainment", description: "Curated performances, DJ moments, cultural highlights, or keynote energy begin the evening arc." },
    { time: "7:00 PM", title: "Dinner", description: "A polished dining experience with thoughtful service, local flavor, and premium presentation." },
    { time: "8:30 PM", title: "Special Moments", description: "Signature speeches, awards, blessings, first dance, reveals, or host-led highlights." },
    { time: "11:30 PM", title: "Closing", description: "Final music, guest send-off, memory capture, and a graceful close to the celebration." },
  ];

  if (family === "corporate") {
    return [
      { time: "4:00 PM", title: "Executive Arrival", description: "Priority check-in, welcome drinks, media wall moments, and networking." },
      { time: "5:00 PM", title: "Opening Ceremony", description: "Host welcome, brand story, keynote introduction, and guest orientation." },
      { time: "6:00 PM", title: "Reception", description: "Curated networking with sponsor visibility and concierge-style guest flow." },
      { time: "7:30 PM", title: "Dinner", description: "Premium plated or buffet service designed for conversation and comfort." },
      { time: "8:30 PM", title: "Special Moments", description: "Awards, announcements, partner recognition, or product reveal." },
      { time: "10:30 PM", title: "Closing", description: "Final remarks, guest appreciation, and post-event connection prompts." },
    ];
  }

  return shared;
}

function buildVendors({ family, budgetTier, location, guestCount }) {
  const guestText = `${guestCount} guests`;
  const base = [
    ["Photography", `Editorial event photographer in ${location} with luxury portrait, candid storytelling, and same-week gallery delivery for ${guestText}.`],
    ["Catering", `${budgetTier} caterer with Cameroonian fusion menus, buffet or plated service, and staffing sized for ${guestText}.`],
    ["Decoration", `Stage, floral, lighting, and tablescape designer with modern African luxury styling for ${location}.`],
    ["Music/DJ", "DJ or live band comfortable with Afrobeats, makossa, amapiano, classics, and smooth programme transitions."],
    ["Makeup", family === "wedding" ? "Bridal and family glam team with touch-up coverage and soft luxury finishing." : "On-call glam and grooming artist for hosts, speakers, or VIP guests."],
    ["Transportation", "VIP car service for host arrival, family movement, airport pickup, and late-night guest coordination."],
    ["Security", "Discreet access-control team for gate flow, VIP protection, QR validation, and parking coordination."],
    ["Hotels", `Nearby hotel partner with room blocks, VIP suites, early check-in, and guest transport support around ${location}.`],
  ];

  return base.map(([category, idealVendor]) => ({
    category,
    idealVendor,
    budgetFit: budgetTier,
    recommendationNote: `Prioritize vendors with proven ${family} experience and polished guest communication.`,
  }));
}

function buildPremiumFeatures(family) {
  const features = [
    "Live streaming for remote family, executives, or diaspora guests",
    "QR guest check-in with VIP pass logic",
    "AI seating optimization by family, role, language, and relationship group",
    "Digital gift registry or contribution link",
    "Event livestream countdown",
    "Guest memory wall for photos, notes, and short videos",
    "AI-powered photo gallery with highlight curation",
  ];

  if (family === "corporate") {
    return [...features, "Sponsor visibility moments and post-event lead capture"];
  }

  return features;
}

export function generateEventWebsiteExperience(input = {}) {
  const eventType = clean(input.event_type || input.eventType || input.category, "Premium Event");
  const userPrompt = clean(input.user_prompt || input.prompt || input.description, "A premium InviteGenie event experience.");
  const location = clean(input.location, "Douala, Cameroon");
  const guestCount = formatGuestCount(input.guest_count || input.guestCount);
  const budgetTier = inferBudgetTier(input.budget || input.budgetTier);
  const themePreference = clean(input.theme_preference || input.themePreference, "Modern African luxury");
  const eventDate = clean(input.event_date || input.eventDate, "To be announced");
  const hostNames = clean(input.host_names || input.hostNames, "InviteGenie Hosts");
  const family = getEventFamily(eventType);
  const tone = getToneWords(family);
  const [primaryColor, secondaryColor, accentColor] = getColors(input.primary_colors || input.primaryColors);
  const title = buildTitle({ eventType, hostNames, location });
  const hashtag = `#${title.replace(/[^A-Za-z0-9]/g, "").slice(0, 42) || "InviteGenieExperience"}`;

  return {
    eventBranding: {
      eventTitle: title,
      tagline: tone.tagline,
      description: `${userPrompt} The experience is shaped as a ${budgetTier.toLowerCase()} ${eventType.toLowerCase()} in ${location}, designed for ${guestCount} guests with emotional storytelling, elegant flow, and premium guest care.`,
      visualStyleDirection: `${themePreference} with cinematic imagery, polished spacing, subtle gold detailing, modern African pattern accents, and a social-first mobile composition.`,
      eventType,
      location,
      guestCount,
      budgetTier,
      hostNames,
      eventDate,
    },
    designSystem: {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundStyle: "Deep premium canvas with soft ivory panels, subtle textured grain, and geometric line patterns inspired by modern African luxury textiles.",
      typographyStyle: "Elegant serif display headlines paired with clean SaaS-style sans-serif body text.",
      uiMood: tone.mood,
      animationStyle: "Slow reveal animations, gentle image parallax, refined countdown transitions, and subtle gold shimmer on important calls to action.",
      decorativePatterns: "Thin-line woven geometry, refined border motifs, gold foil separators, and low-contrast textile-inspired pattern bands.",
    },
    heroSection: {
      headline: `Welcome To ${title}`,
      subtext: tone.tagline,
      ctaButtons: ["RSVP Now", "View Details", "Share Invitation"],
      countdownTimerConcept: `A polished mobile countdown to ${eventDate}, showing days, hours, minutes, and seconds in a refined ${accentColor} accent treatment.`,
      heroBackgroundConcept: "Full-bleed cinematic event image with a dark luxury overlay, warm highlight gradient, and subtle pattern frame at the lower edge.",
    },
    rsvpSection: {
      title: "Reserve Your Presence",
      fields: ["Full Name", "Phone Number", "Email Address", "Attendance Status", "Number of Guests", "Meal Preference", "Special Notes"],
      confirmationMessage: "Your presence has been beautifully confirmed. We cannot wait to welcome you into this unforgettable experience.",
      vipGuestFlowSuggestion: "VIP guests receive a personalized QR pass, reserved seating note, priority arrival instructions, and WhatsApp concierge confirmation.",
    },
    timeline: buildTimeline(family),
    vendors: buildVendors({ family, budgetTier, location, guestCount }),
    invitation: {
      wording: `With joy and great honor, ${hostNames} invite you to ${title}, a beautifully curated ${eventType.toLowerCase()} experience in ${location}.`,
      dressCode: tone.dressCode,
      eventSignatureLine: tone.signature,
    },
    seatingPlan: {
      tableArrangement: `Round tables of 8-10 guests, sized for approximately ${Math.ceil(guestCount / 10)} tables, with clear stage visibility and generous movement paths.`,
      vipSectionLogic: "Place hosts, elders, executives, sponsors, bridal party, or honored guests in front-view tables with concierge support.",
      familyGroupingLogic: "Group guests by relationship, age comfort, language preference, family branch, and shared travel logistics.",
      guestFlowOptimization: "Keep QR check-in near entry, photo moments before the main room, bar away from stage traffic, and service paths behind guest seating.",
    },
    socialMedia: {
      instagramHashtag: hashtag,
      tiktokCaption: `${title} is giving premium African luxury, emotion, style, and unforgettable guest energy.`,
      whatsAppInvitationText: `You are warmly invited to ${title} in ${location}. Kindly RSVP through InviteGenie and join us for a premium celebration crafted with elegance and care.`,
      shareableSlogan: family === "wedding" ? "Where love becomes legacy." : "Designed for the moment everyone remembers.",
    },
    premiumFeatures: buildPremiumFeatures(family),
    uiSuggestions: [
      "Mobile-first single-page event website",
      "Sticky RSVP CTA at the bottom of mobile screens",
      "Floating WhatsApp concierge button",
      "Fast-loading image-led layout with compressed media",
      "Touch-friendly navigation tabs for story, schedule, RSVP, vendors, and memories",
      "Luxury countdown timer above RSVP",
      "Shareable invitation preview card",
    ],
  };
}

export function buildEventWebsiteInputFromEvent(event = {}) {
  return {
    event_type: event.category || event.type || "Premium Event",
    user_prompt: event.description || event.shortSummary || event.title,
    location: event.location || [event.venueName, event.city, event.country].filter(Boolean).join(", "),
    guest_count: event.totalTickets || event.guestCount || 150,
    budget: event.budgetTier || event.price || "Premium",
    theme_preference: event.themePreference || event.aiArtDirection?.style || "Modern African luxury",
    primary_colors: event.primaryColors || "",
    event_date: event.date,
    host_names: event.hostName || event.vendorName || event.organizerName || "InviteGenie Hosts",
  };
}

export function getEventWebsiteExperience(eventId) {
  return readWebsites().find((item) => String(item.eventId) === String(eventId))?.website || null;
}

export function saveEventWebsiteExperience(eventId, website) {
  if (!eventId || !website) return null;
  const websites = readWebsites();
  const record = {
    eventId,
    website,
    updatedAt: new Date().toISOString(),
  };
  const nextWebsites = websites.some((item) => String(item.eventId) === String(eventId))
    ? websites.map((item) => (String(item.eventId) === String(eventId) ? record : item))
    : [record, ...websites];
  writeWebsites(nextWebsites);
  return record;
}
