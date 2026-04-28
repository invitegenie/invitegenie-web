import {
  generateEventDescription,
  generateEventIdeas,
  improveEventDescription,
  generateInvitationText,
  suggestEventThemes,
  generateVendorDescription,
  summarizeAppActivity,
} from '../lib/geminiClient';

/**
 * Core AI service for Invite Genie.
 * Integrates with Gemini API through environment variables.
 * Supports both direct Gemini calls and future Supabase Edge Function routing.
 */

export {
  generateEventDescription,
  generateEventIdeas,
  improveEventDescription,
  generateInvitationText,
  suggestEventThemes,
  generateVendorDescription,
  summarizeAppActivity,
};

/**
 * Generic chat interaction with history support.
 * Will be enhanced with conversation history tracking.
 */
export const getGenieResponse = async (history, message) => {
  // For now, return a friendly message
  // TODO: Implement proper conversation history with Gemini
  return "I am the Genie of Invite Genie! I'm here to help you create magical events. Tell me what you need, and I'll conjure the perfect suggestions for you!";
};

export default {
  generateEventDescription,
  generateEventIdeas,
  improveEventDescription,
  generateInvitationText,
  suggestEventThemes,
  generateVendorDescription,
  summarizeAppActivity,
  getGenieResponse,
};