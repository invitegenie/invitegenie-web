// InviteGenie Milestone Release Service (Demo)
// Handles milestone creation, proof, approval, and release (localStorage only)

const MILESTONE_KEY = 'demo_escrow_milestones';

export function createMilestone({ escrowId, eventId, vendorId, title, description, releasePercentage, releaseAmount, proofType }) {
  const milestones = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]');
  const id = 'milestone_' + Date.now();
  const milestone = {
    id,
    escrowId,
    eventId,
    vendorId,
    title,
    description,
    releasePercentage,
    releaseAmount,
    status: 'pending',
    proofType,
    proofImageUrl: '',
    proofNote: '',
    submittedBy: '',
    submittedAt: '',
    approvedBy: '',
    approvedAt: '',
    releasedAt: ''
  };
  milestones.push(milestone);
  localStorage.setItem(MILESTONE_KEY, JSON.stringify(milestones));
  return milestone;
}

export function submitMilestoneProof(milestoneId, { proofImageUrl, proofNote, submittedBy }) {
  const milestones = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]');
  const idx = milestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  milestones[idx] = {
    ...milestones[idx],
    proofImageUrl,
    proofNote,
    submittedBy,
    submittedAt: new Date().toISOString(),
    status: 'proof_submitted'
  };
  localStorage.setItem(MILESTONE_KEY, JSON.stringify(milestones));
  return milestones[idx];
}

export function approveMilestone(milestoneId, approvedBy) {
  const milestones = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]');
  const idx = milestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  milestones[idx] = {
    ...milestones[idx],
    status: 'approved',
    approvedBy,
    approvedAt: new Date().toISOString()
  };
  localStorage.setItem(MILESTONE_KEY, JSON.stringify(milestones));
  return milestones[idx];
}

export function releaseMilestone(milestoneId) {
  const milestones = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]');
  const idx = milestones.findIndex(m => m.id === milestoneId);
  if (idx === -1) return null;
  milestones[idx] = {
    ...milestones[idx],
    status: 'released',
    releasedAt: new Date().toISOString()
  };
  localStorage.setItem(MILESTONE_KEY, JSON.stringify(milestones));
  return milestones[idx];
}
