export function getAccessRequests() {
  try {
    return JSON.parse(localStorage.getItem("demo_event_access_requests")) || [];
  } catch {
    return [];
  }
}

export function saveAccessRequests(requests) {
  localStorage.setItem("demo_event_access_requests", JSON.stringify(requests));
}

export function requestEventAccess(eventId, user, message) {
  if (!user) throw new Error("Must be logged in to request access.");
  const requests = getAccessRequests();
  const existing = requests.find((r) => String(r.eventId) === String(eventId) && String(r.userId) === String(user.id));
  
  if (existing) return existing;
  
  const newRequest = {
    id: `REQ-${Date.now()}`,
    eventId,
    userId: user.id,
    userName: user.name || user.full_name || "User",
    message,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  
  saveAccessRequests([...requests, newRequest]);
  return newRequest;
}

export function isUserApproved(eventId, user) {
  if (!user) return false;
  return getAccessRequests().some((r) => String(r.eventId) === String(eventId) && String(r.userId) === String(user.id) && r.status === "approved");
}

export function hasPendingRequest(eventId, user) {
  if (!user) return false;
  return getAccessRequests().some((r) => String(r.eventId) === String(eventId) && String(r.userId) === String(user.id) && r.status === "pending");
}

export function isUserInvited(event, user) {
  if (!user || !event) return false;
  if (!Array.isArray(event.invitedUsers)) return false;
  return event.invitedUsers.includes(user.email) || event.invitedUsers.includes(user.id);
}