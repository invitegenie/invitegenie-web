export const SPONSOR_STORAGE_KEY = "demo_event_sponsors";

export function getSponsors() {
  try {
    return JSON.parse(localStorage.getItem(SPONSOR_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveSponsors(sponsors) {
  localStorage.setItem(SPONSOR_STORAGE_KEY, JSON.stringify(sponsors));
}

export function requestSponsorship(data) {
  const sponsors = getSponsors();
  const newSponsor = {
    id: `SPO-${Date.now()}`,
    status: "pending",
    showOnTicket: true,
    showOnEventPage: true,
    createdAt: new Date().toISOString(),
    ...data
  };
  saveSponsors([newSponsor, ...sponsors]);
  return newSponsor;
}

export function getSponsorsForEvent(eventId) {
  return getSponsors().filter(s => String(s.eventId) === String(eventId));
}

export function updateSponsorStatus(sponsorId, status) {
  const sponsors = getSponsors().map(s => 
    s.id === sponsorId ? { ...s, status } : s
  );
  saveSponsors(sponsors);
}