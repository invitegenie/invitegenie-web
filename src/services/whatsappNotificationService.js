import { sendNotification } from "./notificationService";

/**
 * Triggers a WhatsApp specific template via the secure edge function.
 * Handled securely to prevent META_WHATSAPP_TOKEN leakage.
 */
export const sendWhatsAppAlert = async (userId, template, data) => {
  return sendNotification({
    userId,
    channel: "whatsapp",
    template,
    data
  });
};