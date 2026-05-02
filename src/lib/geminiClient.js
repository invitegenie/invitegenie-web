/**
 * Google Gemini AI Client Configuration
 * 
 * For production deployment:
 * 1. Set VITE_GEMINI_API_KEY in .env.local
 * 2. For client-side calls, use with caution (never expose key in production)
 * 3. For production, create a backend API endpoint to call Gemini safely
 * 
 * Best practices:
 * - In production, create a backend endpoint (Firebase Cloud Function or Supabase Edge Function)
 * - The endpoint receives the prompt and makes the Gemini call server-side
 * - This prevents exposing your API key to clients
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} options - Additional options (temperature, maxTokens, etc.)
 * @returns {Promise<string>} - The generated response
 */
export const callGemini = async (prompt, options = {}) => {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured. Returning mock response.');
    return getMockResponse(prompt);
  }

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1000,
          topP: options.topP || 0.9,
          topK: options.topK || 40,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return getMockResponse(prompt);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not generate a response. Please try again.';
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getMockResponse(prompt);
  }
};

/**
 * Generate event description
 */
export const generateEventDescription = async (title, vibe) => {
  const prompt = `Act as a world-class event planner. Create a compelling, magical, and high-end description (approx 3 sentences) for an event titled "${title}". 
The user's initial idea is: "${vibe}". 
Make it sound exclusive, exciting, and professional. Do not use placeholders.`;

  return await callGemini(prompt, { temperature: 0.8 });
};

/**
 * Generate event ideas
 */
export const generateEventIdeas = async (category) => {
  const prompt = `Suggest 3 unique and creative event concepts for the category: "${category}". 
For each, provide a catchy title and a one-sentence hook. 
Format as a numbered list. Make them sound exclusive and magical.`;

  return await callGemini(prompt, { temperature: 0.9 });
};

/**
 * Improve event description
 */
export const improveEventDescription = async (currentDescription) => {
  const prompt = `You are a professional event marketing copywriter. Improve the following event description to make it more compelling, engaging, and professional. Keep it concise but impactful:

Current description: "${currentDescription}"

Provide only the improved description without any explanation.`;

  return await callGemini(prompt, { temperature: 0.7 });
};

/**
 * Generate invitation text
 */
export const generateInvitationText = async (eventTitle, eventType, tone = 'formal') => {
  const prompt = `Write a captivating ${tone} invitation message for the following event:
Event: ${eventTitle}
Type: ${eventType}

Make it compelling, elegant, and around 3-4 sentences. Include enthusiasm and intrigue without being too casual.`;

  return await callGemini(prompt, { temperature: 0.8 });
};

/**
 * Suggest event themes
 */
export const suggestEventThemes = async (eventTitle, eventType, guestCount) => {
  const prompt = `Suggest 5 unique and memorable theme ideas for:
Event: ${eventTitle}
Type: ${eventType}
Expected Guests: ${guestCount}

For each theme, provide a one-line description that explains the concept and why it would work well. Format as a numbered list.`;

  return await callGemini(prompt, { temperature: 0.9 });
};

/**
 * Generate a complete event draft for the create-event form.
 */
export const generateEventDraft = async (eventIdea = "", partialEvent = {}) => {
  const prompt = `Create a complete event draft for an event management app.
Return only valid JSON with this exact shape:
{
  "title": "short compelling event title",
  "category": "Corporate|Wedding|Gala|Music|Elegant|Modern|General|Tech",
  "dateOffsetDays": number,
  "time": "HH:MM",
  "location": "specific venue and city",
  "description": "2-3 sentence polished public event description",
  "price": number,
  "totalTickets": number,
  "artDirection": {
    "headline": "2-5 word invite headline",
    "palette": ["#hex", "#hex", "#hex"],
    "motif": "unique visual motif",
    "accent": "unique detail or symbol"
  }
}

User idea: "${eventIdea || "a premium Invite Genie event"}"
Existing form values: ${JSON.stringify(partialEvent)}

Use realistic Cameroon/West Africa-friendly locations when no location is supplied. Make every draft feel distinct.`;

  const response = await callGemini(prompt, { temperature: 0.9, maxTokens: 900 });
  return parseEventDraftResponse(response, eventIdea, partialEvent);
};

/**
 * Generate vendor description
 */
export const generateVendorDescription = async (vendorName, vendorType, services) => {
  const prompt = `Write a professional and compelling service description for a ${vendorType} vendor:
Vendor Name: ${vendorName}
Services Offered: ${services}

The description should be engaging, highlight unique value propositions, and appeal to event planners. Keep it to 2-3 sentences maximum.`;

  return await callGemini(prompt, { temperature: 0.7 });
};

/**
 * Summarize app activity (for admin)
 */
export const summarizeAppActivity = async (activityData) => {
  const prompt = `As an analytics expert, provide a brief executive summary of the following event management app activity:
${JSON.stringify(activityData, null, 2)}

Highlight key metrics, trends, and recommendations for improvement. Keep it concise and actionable.`;

  return await callGemini(prompt, { temperature: 0.6, maxTokens: 500 });
};

/**
 * Mock response when API is not configured
 */
function getMockResponse(prompt) {
  if (prompt.toLowerCase().includes('valid json') && prompt.toLowerCase().includes('event draft')) {
    const categories = ["Corporate", "Wedding", "Gala", "Music", "Elegant", "Modern", "General", "Tech"];
    const motifs = ["moonlit palm arches", "gold dust constellation", "emerald silk ribbons", "neon city sigil", "royal mask pattern", "starlit garden gates"];
    const index = Math.floor(Math.random() * motifs.length);
    return JSON.stringify({
      title: `${["Royal", "Luminous", "Velvet", "Golden", "Aurora", "Prestige"][index]} ${categories[index % categories.length]} Night`,
      category: categories[index % categories.length],
      dateOffsetDays: 21 + index * 5,
      time: ["18:00", "19:30", "20:00", "17:00", "16:30", "18:45"][index],
      location: ["Hilton Yaounde", "Akwa Palace Douala", "Mountain Club Buea", "Canal Olympia Douala", "Kribi Beach Resort", "Bastos Art House"][index],
      description: "Step into a polished celebration designed for connection, style, and unforgettable moments. Guests will enjoy a curated atmosphere with refined details, smooth entry, and a premium event experience from arrival to finale.",
      price: [15000, 25000, 10000, 5000, 30000, 20000][index],
      totalTickets: [180, 250, 120, 500, 160, 220][index],
      artDirection: {
        headline: "You Are Invited",
        palette: [["#8B5CF6", "#22C55E", "#F9FAFB"], ["#7C3AED", "#F59E0B", "#111827"], ["#06B6D4", "#A855F7", "#F8FAFC"]][index % 3],
        motif: motifs[index],
        accent: ["crescent seal", "gold foil initials", "emerald spark line", "neon ticket frame", "masked crest", "soft floral constellation"][index],
      },
    });
  }

  const responses = {
    description: "This is a spectacular and unforgettable experience that promises to delight every guest. From the moment you arrive, you'll be transported to a world of elegance and magic.",
    ideas: "1. Enchanted Garden Gala - A mystical outdoor celebration with magical lighting and whimsical decor\n2. Modern Elegance Soirée - A sophisticated indoor event with contemporary design and upscale ambiance\n3. Adventure Expedition - An action-packed celebration with interactive experiences and thrilling activities",
    invitation: "We cordially invite you to join us for an evening of elegance, wonder, and unforgettable memories. This is more than just an event—it's an experience crafted for those who appreciate the extraordinary.",
  };

  if (prompt.toLowerCase().includes('description')) return responses.description;
  if (prompt.toLowerCase().includes('idea')) return responses.ideas;
  if (prompt.toLowerCase().includes('invitation')) return responses.invitation;

  return "The Genie's powers are being restored. Please try again in a moment!";
}

function parseEventDraftResponse(response, eventIdea, partialEvent) {
  const fallback = buildFallbackEventDraft(eventIdea, partialEvent);
  try {
    const jsonText = String(response)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(jsonText);
    return {
      ...fallback,
      ...parsed,
      artDirection: {
        ...fallback.artDirection,
        ...(parsed.artDirection || {}),
      },
    };
  } catch {
    return fallback;
  }
}

function buildFallbackEventDraft(eventIdea, partialEvent) {
  const categories = ["Corporate", "Wedding", "Gala", "Music", "Elegant", "Modern", "General", "Tech"];
  const seed = `${eventIdea || ""}${Date.now()}${Math.random()}`;
  const index = Math.abs([...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % categories.length;
  return {
    title: partialEvent.title || `${["Luminous", "Royal", "Velvet", "Aurora", "Prestige", "Golden", "Summit", "Moonlit"][index]} ${categories[index]} Experience`,
    category: partialEvent.category || categories[index],
    dateOffsetDays: 21 + index * 3,
    time: partialEvent.time || ["18:00", "19:00", "20:00", "17:30"][index % 4],
    location: partialEvent.location || ["Hilton Yaounde", "Akwa Palace Douala", "Mountain Club Buea", "Canal Olympia Douala"][index % 4],
    description: partialEvent.description || "A refined event experience crafted with beautiful details, smooth guest flow, and an atmosphere built for memorable moments.",
    price: Number(partialEvent.price || [10000, 15000, 25000, 5000][index % 4]),
    totalTickets: Number(partialEvent.totalTickets || [120, 180, 250, 400][index % 4]),
    artDirection: {
      headline: "You Are Invited",
      palette: [["#8B5CF6", "#22C55E", "#F9FAFB"], ["#7C3AED", "#F59E0B", "#F8FAFC"], ["#06B6D4", "#A855F7", "#F9FAFB"]][index % 3],
      motif: ["constellation lines", "royal arch", "silk ribbon", "neon frame"][index % 4],
      accent: ["gold seal", "emerald flare", "violet spark", "glass ticket"][index % 4],
    },
  };
}

export const isGeminiConfigured = () => !!GEMINI_API_KEY;

export default {
  callGemini,
  generateEventDescription,
  generateEventIdeas,
  improveEventDescription,
  generateInvitationText,
  suggestEventThemes,
  generateEventDraft,
  generateVendorDescription,
  summarizeAppActivity,
  isGeminiConfigured,
};
