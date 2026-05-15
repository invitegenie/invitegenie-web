const AUDIT_STORAGE_KEY = "demo_payment_audit_logs";

export function getPaymentAuditLogs() {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function logPaymentAudit(paymentId, action, actorId, note = "") {
  const logs = getPaymentAuditLogs();
  const newLog = {
    id: `AUD-${Date.now()}`,
    paymentId,
    action,
    actorId: actorId || "system",
    note,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([newLog, ...logs]));
}