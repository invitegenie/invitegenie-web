import { updateWalletBalance } from "./walletService";

export const ESCROW_STORAGE_KEY = "demo_escrow_records";

export function getEscrowRecords() {
  try {
    return JSON.parse(localStorage.getItem(ESCROW_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function createEscrowRecord({ paymentId, orderId, orderType, eventId, sellerId, buyerId, amount, currency = "XAF" }) {
  const records = getEscrowRecords();
  const record = {
    id: `ESC-${Date.now()}`,
    paymentId,
    orderId,
    orderType,
    eventId,
    vendorId: sellerId,
    clientId: buyerId,
    amount,
    currency,
    status: "held",
    releaseMode: "milestone",
    totalReleased: 0,
    remainingHeld: amount,
    milestones: [
      { id: `M1-${Date.now()}`, title: "Setup / Arrival", releasePercentage: 50, releaseAmount: amount * 0.5, status: "pending" },
      { id: `M2-${Date.now()}`, title: "Event Completion", releasePercentage: 50, releaseAmount: amount * 0.5, status: "pending" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify([record, ...records]));
  
  // Credit Vendor Wallet as Escrow Held
  updateWalletBalance(sellerId, { escrow: amount });
  
  return record;
}

export function releaseMilestone(escrowId, milestoneId, approvedById) {
  const records = getEscrowRecords();
  const escrow = records.find(e => e.id === escrowId);
  if (!escrow) return null;
  
  const milestone = escrow.milestones.find(m => m.id === milestoneId);
  if (!milestone || milestone.status === "released") return null;
  
  milestone.status = "released";
  milestone.approvedBy = approvedById;
  milestone.releasedAt = new Date().toISOString();
  
  escrow.totalReleased += milestone.releaseAmount;
  escrow.remainingHeld -= milestone.releaseAmount;
  
  if (escrow.remainingHeld <= 0) escrow.status = "released";
  else escrow.status = "partially_released";
  
  localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(records));
  
  // Move funds from Escrow to Available in Vendor Wallet
  updateWalletBalance(escrow.vendorId, { 
    escrow: -milestone.releaseAmount, 
    available: milestone.releaseAmount,
    lifetime: milestone.releaseAmount 
  });
  
  return escrow;
}

export function submitMilestoneProof(escrowId, milestoneId, proofImageUrl, note) {
  const records = getEscrowRecords();
  const escrow = records.find(e => e.id === escrowId);
  const milestone = escrow?.milestones.find(m => m.id === milestoneId);
  if (milestone) {
    milestone.status = "proof_submitted";
    milestone.proofImageUrl = proofImageUrl;
    milestone.proofNote = note;
    milestone.submittedAt = new Date().toISOString();
    localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(records));
  }
  return escrow;
}