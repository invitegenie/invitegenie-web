/**
 * Real webhooks must be handled server-side to prevent tampering.
 * This file prepares the normalization architecture for when the backend is connected.
 */
export function normalizeWebhookEvent(provider, payload) {
  console.log(`[Webhook Demo] Received ${provider} webhook:`, payload);
  return {
    status: payload.status === "successful" ? "successful" : "failed",
    reference: payload.tx_ref || payload.reference,
    amount: payload.amount
  };
}