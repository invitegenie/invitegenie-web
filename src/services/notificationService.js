import { supabase } from "../lib/supabaseClient";

/**
 * Sends a secure notification via Supabase Edge Functions.
 * Never exposes SendGrid, Resend, or Twilio keys to the frontend.
 */
export const sendNotification = async ({ userId, channel = "in_app", template, data }) => {
  if (supabase) {
    try {
      // Invoke the secure edge function
      await supabase.functions.invoke('send-notification', {
        body: { userId, channel, template, data }
      });
    } catch (error) {
      console.error("Failed to trigger edge notification:", error);
    }
  } else {
    // Demo Mode Logging
    const localNotifs = JSON.parse(localStorage.getItem('ig_notifications') || '[]');
    const mockEvent = { id: `notif-${Date.now()}`, userId, type: template, title: "Alert", message: `Demo Mode: ${template} sent to ${channel}`, read: false, createdAt: new Date().toISOString() };
    localStorage.setItem('ig_notifications', JSON.stringify([mockEvent, ...localNotifs]));
    console.log(`[DEMO MODE] Notification queued: ${template} via ${channel}`);
  }
};