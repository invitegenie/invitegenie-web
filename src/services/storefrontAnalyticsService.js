const ANALYTICS_STORAGE_KEY = "invitegenie_storefront_analytics";

function getAnalytics() {
  const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  if (data) { try { return JSON.parse(data); } catch (e) {} }
  return {};
}

function saveAnalytics(data) {
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
}

function initTenantAnalytics(tenantId, analytics) {
  if (!analytics[tenantId]) {
    analytics[tenantId] = { visits: 0, serviceViews: 0, bookings: 0, whatsappClicks: 0, shareClicks: 0, productViews: {} };
  }
}

export function trackStorefrontView(tenantId) {
  if (!tenantId) return;
  const analytics = getAnalytics();
  initTenantAnalytics(tenantId, analytics);
  analytics[tenantId].visits += 1;
  saveAnalytics(analytics);
}

export function trackServiceView(tenantId, productId) {
  if (!tenantId || !productId) return;
  const analytics = getAnalytics();
  initTenantAnalytics(tenantId, analytics);
  analytics[tenantId].serviceViews += 1;
  analytics[tenantId].productViews[productId] = (analytics[tenantId].productViews[productId] || 0) + 1;
  saveAnalytics(analytics);
}

export function trackBookingClick(tenantId, productId) {
  if (!tenantId) return;
  const analytics = getAnalytics();
  initTenantAnalytics(tenantId, analytics);
  analytics[tenantId].bookings += 1;
  saveAnalytics(analytics);
}

export function trackWhatsAppClick(tenantId) {
  if (!tenantId) return;
  const analytics = getAnalytics();
  initTenantAnalytics(tenantId, analytics);
  analytics[tenantId].whatsappClicks += 1;
  saveAnalytics(analytics);
}

export function trackShareClick(tenantId) {
  if (!tenantId) return;
  const analytics = getAnalytics();
  initTenantAnalytics(tenantId, analytics);
  analytics[tenantId].shareClicks += 1;
  saveAnalytics(analytics);
}

export function getStorefrontAnalytics(tenantId) {
  const analytics = getAnalytics();
  return analytics[tenantId] || { visits: 0, serviceViews: 0, bookings: 0, whatsappClicks: 0, shareClicks: 0, productViews: {} };
}