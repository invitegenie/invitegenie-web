const THEME_STORAGE_KEY = "invitegenie_storefront_themes";

export const THEME_PRESETS = {
  "luxury-gold": { primaryColor: "#D4AF37", secondaryColor: "#111827", accentColor: "#FBBF24", backgroundColor: "#090806", textColor: "#FFFFFF", layoutStyle: "luxury", fontStyle: "serif", borderRadius: "0rem", heroStyle: "gradient", cardStyle: "minimal" },
  "beauty-champagne": { primaryColor: "#F4DFD0", secondaryColor: "#FAFAFA", accentColor: "#D4AF37", backgroundColor: "#FFFFFF", textColor: "#4A403A", layoutStyle: "beauty", fontStyle: "sans", borderRadius: "1.5rem", heroStyle: "soft", cardStyle: "elevated" },
  "afro-premium": { primaryColor: "#D97706", secondaryColor: "#292524", accentColor: "#B45309", backgroundColor: "#1C1917", textColor: "#FEF3C7", layoutStyle: "afro-premium", fontStyle: "sans", borderRadius: "0.5rem", heroStyle: "image", cardStyle: "bordered" },
  "corporate-emerald": { primaryColor: "#059669", secondaryColor: "#F3F4F6", accentColor: "#10B981", backgroundColor: "#FFFFFF", textColor: "#111827", layoutStyle: "corporate", fontStyle: "sans", borderRadius: "0.25rem", heroStyle: "solid", cardStyle: "flat" },
  "wedding-romance": { primaryColor: "#F472B6", secondaryColor: "#FFF1F2", accentColor: "#BE185D", backgroundColor: "#FFFFFF", textColor: "#4C1D95", layoutStyle: "wedding", fontStyle: "serif", borderRadius: "2rem", heroStyle: "image", cardStyle: "minimal" },
  "fashion-noir": { primaryColor: "#FFFFFF", secondaryColor: "#111827", accentColor: "#9CA3AF", backgroundColor: "#000000", textColor: "#FFFFFF", layoutStyle: "fashion", fontStyle: "sans", borderRadius: "0", heroStyle: "image", cardStyle: "bordered" },
  "catering-warmth": { primaryColor: "#EA580C", secondaryColor: "#FFF7ED", accentColor: "#C2410C", backgroundColor: "#FFFFFF", textColor: "#431407", layoutStyle: "catering", fontStyle: "sans", borderRadius: "1rem", heroStyle: "gradient", cardStyle: "elevated" },
  "minimal-white": { primaryColor: "#000000", secondaryColor: "#F3F4F6", accentColor: "#3B82F6", backgroundColor: "#FFFFFF", textColor: "#111827", layoutStyle: "minimal", fontStyle: "sans", borderRadius: "0", heroStyle: "solid", cardStyle: "flat" }
};

export function getThemeSettings(tenantId) {
  const data = localStorage.getItem(THEME_STORAGE_KEY);
  let themes = {};
  if (data) { try { themes = JSON.parse(data); } catch (e) {} }
  return themes[tenantId] || THEME_PRESETS["luxury-gold"];
}

export function saveThemeSettings(tenantId, themeData) {
  const data = localStorage.getItem(THEME_STORAGE_KEY);
  let themes = {};
  if (data) { try { themes = JSON.parse(data); } catch (e) {} }
  themes[tenantId] = { ...THEME_PRESETS["luxury-gold"], ...themeData };
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themes));
  return themes[tenantId];
}