const USAGE_KEY = "demo_ai_theme_usage";

export function getAIThemeUsage(userId) {
  try {
    const data = JSON.parse(localStorage.getItem(USAGE_KEY)) || {};
    return data[userId] || { used: 0, limit: 10 };
  } catch {
    return { used: 0, limit: 10 };
  }
}

export function trackAIThemeUsage(userId, accountType) {
  const usageMap = getAIThemeUsage(userId);
  const limit = accountType === "ENTERPRISE" || accountType === "BUSINESS" ? Infinity : 10;
  const newUsage = { ...usageMap, used: (usageMap.used || 0) + 1, limit };
  
  try {
    const allData = JSON.parse(localStorage.getItem(USAGE_KEY)) || {};
    allData[userId] = newUsage;
    localStorage.setItem(USAGE_KEY, JSON.stringify(allData));
  } catch (e) {
    console.error(e);
  }
  return newUsage;
}

export function generateAIStorefrontThemes(input) {
  // MOCK AI LOGIC
  // In production, this would call OpenAI/Gemini to analyze uploaded assets and text context
  
  const baseColors = input.preferredColors || ["#D4AF37", "#111827"];
  const category = input.category || "Store";
  const mood = input.mood || "Modern";
  
  return [
    {
      id: `ai-theme-${Date.now()}-1`,
      name: `${mood} ${category} (Primary)`,
      themeType: "primary",
      description: `A highly tailored ${mood} theme optimized to build trust in the ${category} space.`,
      confidence: 94,
      visualDirection: "Clean and premium with bold contrasting actions.",
      colors: {
        primaryColor: baseColors[0],
        secondaryColor: baseColors[1] || "#111827",
        accentColor: "#FBBF24",
        backgroundColor: "#090806",
        textColor: "#FFFFFF",
      },
      typography: { fontStyle: "sans" },
      layout: { borderRadius: "1rem", heroStyle: "gradient", cardStyle: "elevated" }
    },
    {
      id: `ai-theme-${Date.now()}-2`,
      name: `Elegant ${category}`,
      themeType: "elegant",
      description: "Focuses on typography, generous spacing, and a luxurious feel.",
      confidence: 89,
      visualDirection: "Sophisticated and minimal, letting your work shine.",
      colors: {
        primaryColor: "#FFFFFF",
        secondaryColor: "#111827",
        accentColor: baseColors[0],
        backgroundColor: "#000000",
        textColor: "#FFFFFF",
      },
      typography: { fontStyle: "serif" },
      layout: { borderRadius: "0", heroStyle: "image", cardStyle: "minimal" }
    },
    {
      id: `ai-theme-${Date.now()}-3`,
      name: `Bold ${mood}`,
      themeType: "bold",
      description: "High contrast layout designed to capture attention immediately.",
      confidence: 85,
      visualDirection: "Striking and vibrant presentation.",
      colors: {
        primaryColor: baseColors[0],
        secondaryColor: "#FFFFFF",
        accentColor: "#000000",
        backgroundColor: "#FFFFFF",
        textColor: "#111827",
      },
      typography: { fontStyle: "sans" },
      layout: { borderRadius: "0.5rem", heroStyle: "solid", cardStyle: "bordered" }
    }
  ];
}