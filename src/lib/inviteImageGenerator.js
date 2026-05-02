const IMAGE_GENERATION_ENDPOINT = import.meta.env.VITE_INVITE_IMAGE_GENERATION_ENDPOINT;

export async function generateInviteImage(event) {
  const prompt = buildInviteImagePrompt(event);

  if (IMAGE_GENERATION_ENDPOINT) {
    try {
      const response = await fetch(IMAGE_GENERATION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          event,
          width: 1200,
          height: 675,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.imageUrl || data.url || data.dataUrl;
        if (imageUrl) return imageUrl;
      }
    } catch (error) {
      console.warn("Invite image generation endpoint fallback used:", error);
    }
  }

  return createUniqueInviteArtwork({
    ...event,
    artSeed: event.artSeed || `${event.title}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  });
}

export function buildInviteImagePrompt(event) {
  const art = event.aiArtDirection || event.artDirection || {};
  return [
    "Create a premium event invitation cover image, 16:9 aspect ratio.",
    `Event title: ${event.title || "Invite Genie Event"}.`,
    `Category: ${event.category || "Event"}.`,
    `Location: ${event.location || "Venue to be announced"}.`,
    `Date/time: ${formatInviteDate(event.date, event.time)}.`,
    `Visual motif: ${art.motif || "luxury event atmosphere"}.`,
    `Accent detail: ${art.accent || "distinctive invite seal"}.`,
    `Palette: ${(art.palette || ["violet", "emerald", "white"]).join(", ")}.`,
    "High-end, modern, readable, celebratory, no distorted text, unique composition.",
  ].join(" ");
}

export function createUniqueInviteArtwork(event) {
  const art = event.aiArtDirection || event.artDirection || {};
  const palette = Array.isArray(art.palette) && art.palette.length >= 3
    ? art.palette
    : ["#8B5CF6", "#22C55E", "#F9FAFB"];
  const seed = hashSeed(event.artSeed || `${event.title}-${Date.now()}-${Math.random()}`);
  const motif = art.motif || event.category || "signature event";
  const accent = art.accent || "invite seal";
  const title = escapeSvg(event.title || "Invite Genie Event");
  const headline = escapeSvg(art.headline || "You Are Invited");
  const location = escapeSvg(event.location || "Venue to be announced");
  const date = escapeSvg(formatInviteDate(event.date, event.time));
  const category = escapeSvg(event.category || "Event");
  const price = Number(event.price || 0) > 0 ? `${Number(event.price).toLocaleString()} FCFA` : "Free Entry";
  const shapes = Array.from({ length: 9 }, (_, index) => {
    const cx = 70 + ((seed * (index + 3)) % 960);
    const cy = 70 + ((seed * (index + 7)) % 560);
    const radius = 18 + ((seed + index * 17) % 70);
    const opacity = 0.1 + (((seed + index) % 6) / 30);
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${palette[index % palette.length]}" opacity="${opacity.toFixed(2)}" />`;
  }).join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="45%" stop-color="${palette[0]}"/>
      <stop offset="100%" stop-color="${palette[1]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="25%" r="55%">
      <stop offset="0%" stop-color="${palette[2]}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${palette[2]}" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  ${shapes}
  <path d="M85 92 C245 40, 335 170, 482 96 S820 52, 1110 130" fill="none" stroke="${palette[2]}" stroke-width="2" opacity="0.35"/>
  <path d="M90 575 C250 510, 385 620, 520 552 S820 498, 1110 590" fill="none" stroke="${palette[2]}" stroke-width="2" opacity="0.28"/>
  <rect x="78" y="72" width="1044" height="531" rx="42" fill="#020617" opacity="0.54" stroke="rgba(255,255,255,0.22)" filter="url(#softShadow)"/>
  <rect x="118" y="114" width="964" height="447" rx="30" fill="none" stroke="${palette[2]}" stroke-width="2" opacity="0.6"/>
  <text x="150" y="178" fill="${palette[2]}" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="6">${headline}</text>
  <text x="150" y="292" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="68" font-weight="900">${title}</text>
  <text x="154" y="340" fill="#CBD5E1" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${category} - ${price}</text>
  <text x="154" y="426" fill="#F8FAFC" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800">${date}</text>
  <text x="154" y="468" fill="#CBD5E1" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600">${location}</text>
  <g transform="translate(880 178)">
    <circle cx="92" cy="92" r="86" fill="${palette[1]}" opacity="0.22"/>
    <circle cx="92" cy="92" r="62" fill="${palette[0]}" opacity="0.38"/>
    <text x="92" y="86" text-anchor="middle" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="900">${escapeSvg(accent).toUpperCase()}</text>
    <text x="92" y="114" text-anchor="middle" fill="#E2E8F0" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700">${escapeSvg(motif)}</text>
  </g>
  <text x="150" y="535" fill="${palette[2]}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="4">INVITEGENIE AI INVITE #${String(seed).slice(0, 6)}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function hashSeed(value) {
  return String(value).split("").reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function escapeSvg(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 80);
}

function formatInviteDate(dateValue, timeValue) {
  if (!dateValue) return "Date to be announced";
  const date = new Date(`${dateValue}T${timeValue || "18:00"}`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + (timeValue ? ` at ${timeValue}` : "");
}
