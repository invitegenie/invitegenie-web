export const CRM_KEYS = {
  LEADS: "demo_crm_leads",
  CUSTOMERS: "demo_crm_customers",
  FOLLOWUPS: "demo_crm_followups",
  INVOICES: "demo_crm_invoices",
  NOTES: "demo_crm_notes",
};

function read(key, fallback = []) {
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

export function getCRMPlanLimits(accountType) {
  const tier = (accountType || "BASIC").toUpperCase();
  if (tier === "FREE" || tier === "BASIC") return { maxLeads: 10, maxCustomers: 25, canInvoice: false };
  if (tier === "PRO" || tier === "PRO_USER") return { maxLeads: 200, maxCustomers: 500, canInvoice: true };
  return { maxLeads: Infinity, maxCustomers: Infinity, canInvoice: true }; // BUSINESS & ENTERPRISE
}

export function checkCRMLimit(userId, accountType, entityType) {
  const limits = getCRMPlanLimits(accountType);
  
  if (entityType === "leads") {
    const current = getLeads(userId).length;
    if (current >= limits.maxLeads) {
      return { allowed: false, current, limit: limits.maxLeads, reason: "maxLeads", message: "You have reached your limit for active leads.", recommendedPlan: "PRO" };
    }
  }
  if (entityType === "customers") {
    const current = getCustomers(userId).length;
    if (current >= limits.maxCustomers) {
      return { allowed: false, current, limit: limits.maxCustomers, reason: "maxCustomers", message: "You have reached your limit for customers.", recommendedPlan: "PRO" };
    }
  }
  if (entityType === "invoices") {
    if (!limits.canInvoice) {
      return { allowed: false, current: 0, limit: 0, reason: "canInvoice", message: "Invoicing is not available on your current plan.", recommendedPlan: "PRO" };
    }
  }
  return { allowed: true };
}

// Leads
export function getLeads(userId) {
  return read(CRM_KEYS.LEADS).filter(item => String(item.ownerId) === String(userId));
}

export function getLead(id) {
  return read(CRM_KEYS.LEADS).find(item => item.id === id);
}

export function saveLead(lead) {
  const list = read(CRM_KEYS.LEADS);
  const index = list.findIndex(l => l.id === lead.id);
  const updated = { ...lead, updatedAt: new Date().toISOString() };
  if (index > -1) {
    list[index] = updated;
  } else {
    updated.id = lead.id || `lead-${Date.now()}`;
    updated.createdAt = new Date().toISOString();
    list.unshift(updated);
  }
  write(CRM_KEYS.LEADS, list);
  return updated;
}

export function deleteLead(id) {
  write(CRM_KEYS.LEADS, read(CRM_KEYS.LEADS).filter(l => l.id !== id));
}

// Customers
export function getCustomers(userId) {
  return read(CRM_KEYS.CUSTOMERS).filter(item => String(item.ownerId) === String(userId));
}

export function getCustomer(id) {
  return read(CRM_KEYS.CUSTOMERS).find(item => item.id === id);
}

export function saveCustomer(customer) {
  const list = read(CRM_KEYS.CUSTOMERS);
  const index = list.findIndex(c => c.id === customer.id);
  const updated = { ...customer, updatedAt: new Date().toISOString() };
  if (index > -1) {
    list[index] = updated;
  } else {
    updated.id = customer.id || `cus-${Date.now()}`;
    updated.createdAt = new Date().toISOString();
    list.unshift(updated);
  }
  write(CRM_KEYS.CUSTOMERS, list);
  return updated;
}

// Notes
export function getNotes(entityId) {
  return read(CRM_KEYS.NOTES).filter(n => n.entityId === entityId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveNote(note) {
  const list = read(CRM_KEYS.NOTES);
  const next = { ...note, id: note.id || `note-${Date.now()}`, createdAt: new Date().toISOString() };
  list.unshift(next);
  write(CRM_KEYS.NOTES, list);
  return next;
}

// Follow-ups
export function getFollowUps(userId) {
  return read(CRM_KEYS.FOLLOWUPS).filter(item => String(item.ownerId) === String(userId)).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export function saveFollowUp(followUp) {
  const list = read(CRM_KEYS.FOLLOWUPS);
  const index = list.findIndex(f => f.id === followUp.id);
  const updated = { ...followUp, updatedAt: new Date().toISOString() };
  if (index > -1) {
    list[index] = updated;
  } else {
    updated.id = followUp.id || `fu-${Date.now()}`;
    updated.createdAt = new Date().toISOString();
    list.unshift(updated);
  }
  write(CRM_KEYS.FOLLOWUPS, list);
  return updated;
}

// Invoices
export function getInvoices(userId) {
  return read(CRM_KEYS.INVOICES).filter(item => String(item.ownerId) === String(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getInvoice(id) {
  return read(CRM_KEYS.INVOICES).find(item => item.id === id);
}

export function saveInvoice(invoice) {
  const list = read(CRM_KEYS.INVOICES);
  const index = list.findIndex(i => i.id === invoice.id);
  const updated = { ...invoice, updatedAt: new Date().toISOString() };
  if (index > -1) {
    list[index] = updated;
  } else {
    updated.id = invoice.id || `inv-${Date.now()}`;
    updated.createdAt = new Date().toISOString();
    list.unshift(updated);
  }
  write(CRM_KEYS.INVOICES, list);
  return updated;
}

// Integration hook
export function addBookingToCRM(ownerId, buyer, order) {
  if (!ownerId || !buyer) return;
  
  let customers = getCustomers(ownerId);
  let customer = customers.find(c => c.email === buyer.email || (c.phone && c.phone === buyer.phone) || c.fullName === (buyer.full_name || buyer.name));
  
  if (!customer) {
    customer = {
      ownerId,
      fullName: buyer.full_name || buyer.name || "Guest",
      email: buyer.email || "",
      phone: buyer.phone || "",
      city: buyer.city || "",
      totalBookings: 1,
      totalSpent: order.amount || 0,
      lastBookingAt: new Date().toISOString(),
      tags: ["Booking Client"],
      notes: []
    };
    saveCustomer(customer);
  } else {
    customer.totalBookings = (customer.totalBookings || 0) + 1;
    customer.totalSpent = (customer.totalSpent || 0) + (order.amount || 0);
    customer.lastBookingAt = new Date().toISOString();
    saveCustomer(customer);
  }

  saveNote({
    entityId: customer.id,
    ownerId,
    text: `System: New booking created for ${order.listingTitle || 'Service'}. Amount: FCFA ${order.amount}`,
    type: "booking"
  });
}