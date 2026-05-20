import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateGenieContent(prompt, systemInstruction = "") {
  if (!API_KEY) {
    console.warn("Gemini API key missing. Using fallback for beta.");
    return "Beta mode: Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Genie AI Error:", error);
    throw new Error("The Genie is currently resting. Please try again in a moment.", { cause: error });
  }
}
