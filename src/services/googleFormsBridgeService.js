/**
 * Google Forms integration service for Invite Genie.
 * Will integrate with Supabase in Step 4.
 * For now, provides mock implementations with localStorage fallback.
 */

export const connectGoogleFormIntegration = async (eventId, formId, scriptUrl) => {
  // Mock implementation - will be replaced with Supabase in Step 4
  const integration = { event_id: eventId, form_id: formId, apps_script_url: scriptUrl };
  
  // Store in localStorage as temporary fallback
  const integrations = JSON.parse(localStorage.getItem('google_form_integrations') || '[]');
  integrations.push(integration);
  localStorage.setItem('google_form_integrations', JSON.stringify(integrations));
  
  return { data: integration, error: null };
};

export const getGuestsImportedFromGoogleForms = async (eventId) => {
  // Mock implementation - will be replaced with Supabase in Step 4
  const guests = JSON.parse(localStorage.getItem('imported_google_form_guests') || '[]');
  const eventGuests = guests.filter(g => g.event_id === eventId);
  
  return { data: eventGuests, error: null };
};