export const BOOKED_VENDORS_KEY = "demo_event_booked_vendors";

export function getBookedVendors() {
  try {
    return JSON.parse(localStorage.getItem(BOOKED_VENDORS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveBookedVendors(vendors) {
  localStorage.setItem(BOOKED_VENDORS_KEY, JSON.stringify(vendors));
}

export function getBookedVendorsForEvent(eventId) {
  return getBookedVendors().filter(v => String(v.eventId) === String(eventId));
}

export function bookVendorForEvent(eventId, vendorData) {
  const vendors = getBookedVendors();
  const newVendor = {
    id: `EVV-${Date.now()}`,
    eventId,
    status: "booked",
    publicVisible: true,
    bookedAt: new Date().toISOString(),
    ...vendorData
  };
  saveBookedVendors([newVendor, ...vendors]);
  return newVendor;
}