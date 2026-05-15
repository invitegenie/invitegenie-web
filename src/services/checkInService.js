import { getTicketById, updateTicketStatus } from "./ticketingService";

export function scanTicket(qrPayload, scannerUserId, expectedEventId = null) {
  let ticketId = qrPayload;
  
  // Handle JSON Encoded Payloads or Legacy Colons
  if (qrPayload.startsWith("{")) {
    try {
      const parsed = JSON.parse(qrPayload);
      ticketId = parsed.ticketId || parsed.id;
    } catch (e) {}
  } else if (qrPayload.includes(":")) {
    ticketId = qrPayload.split(":")[0];
  } else if (qrPayload.startsWith("INVITEGENIE-")) {
    return { success: false, code: "INVALID", message: "Legacy demo QR code detected. Not a valid ticket." };
  }

  const ticket = getTicketById(ticketId);
  
  if (!ticket) {
    return { success: false, code: "NOT_FOUND", message: "Ticket not found in the system." };
  }

  if (expectedEventId && expectedEventId !== "all" && String(ticket.eventId) !== String(expectedEventId)) {
    return { success: false, code: "WRONG_EVENT", message: "This ticket belongs to a different event.", ticket };
  }

  if (ticket.status === "cancelled" || ticket.ticketStatus === "cancelled") {
    return { success: false, code: "CANCELLED", message: "This ticket has been cancelled.", ticket };
  }
  
  if (ticket.status === "refunded" || ticket.ticketStatus === "refunded") {
    return { success: false, code: "REFUNDED", message: "This ticket has been refunded.", ticket };
  }

  if (ticket.paymentStatus === "unpaid") {
    return { success: false, code: "UNPAID", message: "Payment pending. Cannot check in.", ticket };
  }

  if (ticket.ticketStatus === "checked_in") {
    const prev = ticket.scanHistory?.[ticket.scanHistory.length - 1];
    return { 
      success: false, 
      code: "DUPLICATE", 
      message: "Ticket already checked in.", 
      ticket, 
      previousCheckIn: ticket.checkedInAt || prev?.scannedAt 
    };
  }

  const now = new Date().toISOString();
  const scanHistory = [...(ticket.scanHistory || []), { scannedAt: now, scannerId: scannerUserId, status: "success" }];

  const updated = updateTicketStatus(ticket.id, {
    ticketStatus: "checked_in",
    checkedInAt: now,
    checkedInBy: scannerUserId,
    scanCount: (ticket.scanCount || 0) + 1,
    scanHistory
  });

  return { success: true, code: "OK", message: "Check-in successful", ticket: updated };
}