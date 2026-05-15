import { hasValidTicket } from "./ticketingService";
import { isUserInvited } from "./eventAccessService";

export function canUserViewEvent(user, event) {
  if (!event) return false;
  // Host always sees their event
  if (user && String(event.hostId) === String(user.id)) return true;
  
  const visibility = event.visibility || "public";
  
  if (visibility === "public" || visibility === "vip_request") {
    return true;
  }
  
  if (visibility === "invite_only") {
    return isUserInvited(event, user) || hasValidTicket(user?.id, event.id);
  }
  
  if (visibility === "private_hidden") {
    return hasValidTicket(user?.id, event.id) || isUserInvited(event, user);
  }
  
  return false;
}

export function getVisibleEventsForUser(user, events) {
  return events.filter((e) => canUserViewEvent(user, e));
}