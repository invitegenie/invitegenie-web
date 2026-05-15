import { getTickets } from "./mockData";
import { normalizeTicket } from "./ticketingService";

export function getEventCheckInStats(eventId) {
  const rawTickets = getTickets().filter(t => String(t.eventId) === String(eventId) && t.status !== "cancelled" && t.ticketStatus !== "cancelled");
  const tickets = rawTickets.map(normalizeTicket);
  
  const total = tickets.length;
  const checkedIn = tickets.filter(t => t.ticketStatus === "checked_in").length;
  const noShows = total - checkedIn;
  const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const accessBreakdown = tickets.reduce((acc, t) => {
    const level = t.accessLevel || "standard";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  
  const vipCheckedIn = tickets.filter(t => t.ticketStatus === "checked_in" && (t.accessLevel === "vip" || t.accessLevel === "backstage")).length;
  const vipTotal = (accessBreakdown["vip"] || 0) + (accessBreakdown["backstage"] || 0);

  return { total, checkedIn, noShows, checkInRate, accessBreakdown, vipCheckedIn, vipTotal };
}