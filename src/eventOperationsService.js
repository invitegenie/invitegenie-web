import { getTasks } from './liveTaskService';
import { getStaff } from './staffCoordinationService';
import { getVendorCheckins } from './vendorCheckinService';
import { getTimeline } from './eventTimelineService';
import { getIncidents } from './emergencyAlertService';

export const OPS_STORAGE_KEY = "demo_event_operations";

function read(key, fallback = {}) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data } }));
}

export function getEventOperations(eventId) {
  const ops = read(OPS_STORAGE_KEY);
  return ops[eventId] || {
    id: eventId,
    status: 'Upcoming',
    health: 100,
    lastUpdated: new Date().toISOString(),
  };
}

export function saveEventOperations(eventId, data) {
  const ops = read(OPS_STORAGE_KEY);
  const updated = { ...(ops[eventId] || {}), ...data, lastUpdated: new Date().toISOString() };
  ops[eventId] = updated;
  write(OPS_STORAGE_KEY, ops);
  return updated;
}

export function calculateEventHealth(eventId) {
  let score = 100;
  let deductions = [];

  // Task health
  const tasks = getTasks(eventId);
  const totalTasks = tasks.length;
  if (totalTasks > 0) {
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const taskProgress = (completedTasks / totalTasks) * 100;
    const delayedTasks = tasks.filter(t => t.status === 'Delayed').length;
    const blockedTasks = tasks.filter(t => t.status === 'Blocked').length;
    if (delayedTasks > 0) { score -= delayedTasks * 5; deductions.push(`${delayedTasks} delayed tasks`); }
    if (blockedTasks > 0) { score -= blockedTasks * 10; deductions.push(`${blockedTasks} blocked tasks`); }
  }

  // Vendor health
  const vendors = getVendorCheckins(eventId);
  if (vendors.length > 0) {
    const missingVendors = vendors.filter(v => v.status === 'Missing').length;
    if (missingVendors > 0) { score -= missingVendors * 20; deductions.push(`${missingVendors} missing vendors`); }
  }

  // Incident health
  const incidents = getIncidents(eventId);
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  if (activeIncidents.length > 0) {
    const criticalIncidents = activeIncidents.filter(i => i.severity === 'Critical' || i.severity === 'Emergency').length;
    score -= activeIncidents.length * 5;
    score -= criticalIncidents * 15;
    deductions.push(`${activeIncidents.length} active incidents`);
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const healthStatus = finalScore > 90 ? 'Excellent' : finalScore > 70 ? 'Stable' : finalScore > 50 ? 'Warning' : 'Critical';

  return { score: finalScore, status: healthStatus, deductions };
}