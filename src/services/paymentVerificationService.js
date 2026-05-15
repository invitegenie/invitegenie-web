import { updatePaymentStatus, getPaymentById } from "./paymentGatewayService";
import { confirmMarketplaceOrder } from "./ticketingService";

export function confirmManualPayment(paymentId, adminId) {
  const payment = getPaymentById(paymentId);
  if (!payment) return;
  updatePaymentStatus(paymentId, "confirmed", adminId);
  
  // Securely trigger the ticketing/escrow system resolution loop
  confirmMarketplaceOrder(payment.bookingId || payment.orderId);
}

export function rejectManualPayment(paymentId, adminId, reason) {
  updatePaymentStatus(paymentId, "failed", adminId, reason);
}