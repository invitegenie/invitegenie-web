import { getSponsorsForEvent } from "./eventSponsorService";

export const SPONSOR_TIERS = {
  "Bronze Sponsor": { eventPage: true, sponsorSection: true, tickets: false, flyers: false, websites: false, rsvpPages: false, livestream: false, amount: 50000 },
  "Silver Sponsor": { eventPage: true, sponsorSection: true, tickets: true, flyers: false, websites: false, rsvpPages: false, livestream: false, amount: 150000 },
  "Gold Sponsor": { eventPage: true, sponsorSection: true, tickets: true, flyers: true, websites: true, rsvpPages: true, livestream: false, amount: 300000 },
  "Platinum Sponsor": { eventPage: true, sponsorSection: true, tickets: true, flyers: true, websites: true, rsvpPages: true, livestream: true, amount: 500000 },
  "Custom Contribution": { eventPage: true, sponsorSection: true, tickets: false, flyers: false, websites: false, rsvpPages: false, livestream: false, amount: 0 }
};

export function getActiveSponsorBranding(eventId) {
  return getSponsorsForEvent(eventId).filter(s => s.status === "approved" && s.active !== false);
}

export function injectSponsorsIntoTicket(ticket, sponsors) {
  return sponsors.filter(s => s.visibility?.tickets);
}

export function injectSponsorsIntoFlyer(flyer, sponsors) {
  return sponsors.filter(s => s.visibility?.flyers);
}

export function injectSponsorsIntoWebsite(website, sponsors) {
  return sponsors.filter(s => s.visibility?.websites);
}

export function injectSponsorsIntoInvitation(invitation, sponsors) {
  return sponsors.filter(s => s.visibility?.invitationCards);
}

export function injectSponsorsIntoRSVP(rsvpPage, sponsors) {
  return sponsors.filter(s => s.visibility?.rsvpPages);
}

export function injectSponsorsIntoMedia(media, sponsors) {
  return sponsors.filter(s => s.visibility?.livestream);
}

// Mock Analytics
export const SPONSOR_ANALYTICS_KEY = "demo_sponsor_analytics";

export function getSponsorAnalytics(sponsorId) {
  try {
    const cache = JSON.parse(localStorage.getItem(SPONSOR_ANALYTICS_KEY)) || {};
    if (cache[sponsorId]) return cache[sponsorId];
    
    // Generate realistic mock analytics for demo
    const mockData = {
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 300) + 50,
      ticketViews: Math.floor(Math.random() * 800) + 200,
      websiteViews: Math.floor(Math.random() * 1500) + 500,
    };
    cache[sponsorId] = mockData;
    localStorage.setItem(SPONSOR_ANALYTICS_KEY, JSON.stringify(cache));
    return mockData;
  } catch {
    return { impressions: 0, clicks: 0, ticketViews: 0, websiteViews: 0 };
  }
}