const PAYMENTS_KEY = "ig_payments";

export function getPayments() {
  try {
    return JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function initiatePayment({ amount, customer, providerId, orderType, orderId, metadata }) {
  const payments = getPayments();
  const newPayment = {
    id: `PAY-${Date.now()}`,
    amount,
    customerName: customer?.name || customer?.full_name || "Guest",
    customerEmail: customer?.email || "",
    selectedPaymentMethod: providerId,
    method: providerId,
    orderType,
    orderId,
    bookingId: metadata?.bookingId || orderId,
    metadata,
    status: "pending_gateway",
    createdAt: new Date().toISOString(),
  };
  payments.unshift(newPayment);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: PAYMENTS_KEY, data: payments } }));
  return newPayment;
}

export function getPaymentById(id) {
  return getPayments().find(p => String(p.id) === String(id));
}

export function updatePaymentStatus(id, status, actor, reason) {
  const payments = getPayments();
  const idx = payments.findIndex(p => String(p.id) === String(id));
  if (idx !== -1) {
    payments[idx].status = status;
    if (reason) payments[idx].rejectionReason = reason;
    if (actor) payments[idx].reviewedBy = actor;
    payments[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: PAYMENTS_KEY, data: payments } }));
  }
}

export function submitPaymentProof(id, { phone, reference, proofImageUrl }) {
  const payments = getPayments();
  const idx = payments.findIndex(p => String(p.id) === String(id));
  if (idx !== -1) {
    payments[idx].status = "pending_verification";
    payments[idx].userPaymentPhone = phone;
    payments[idx].userPaymentReference = reference;
    payments[idx].proofImageUrl = proofImageUrl;
    payments[idx].submittedAt = new Date().toISOString();
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key: PAYMENTS_KEY, data: payments } }));
  }
}