import { ROLE_PERMISSIONS } from "./permissions";
import { normalizeRole, isAdminRole } from "./userRoles";

const DEMO_USERS_KEY = "demo_users";
const now = "2026-05-01T12:00:00.000Z";

const roleAccountType = {
  normal_user: "FREE",
  pro_user: "PRO",
  vendor: "BUSINESS",
  event_planner: "PRO",
  enterprise_client: "ENTERPRISE",
  tasker: "FREE",
  checkin_agent: "FREE",
  finance_admin: "ENTERPRISE",
  app_admin: "ENTERPRISE",
  super_admin: "ENTERPRISE",
};

function initials(name) {
  return String(name || "InviteGenie User")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function buildUser({ id, full_name, email, password = "demo123", phone, role, city, country = "Cameroon", accountType }) {
  const normalizedRole = normalizeRole(role);
  return {
    id,
    full_name,
    email,
    password,
    phone,
    role,
    accountType: accountType || roleAccountType[role] || role,
    permissions: ROLE_PERMISSIONS[normalizedRole] || [],
    avatar: initials(full_name),
    city,
    country,
    createdAt: now,
    status: "active",
    tier: accountType || roleAccountType[role] || role,
  };
}

export const DEFAULT_DEMO_USERS = [
  buildUser({
    id: "normal-marie",
    full_name: "Marie Ngalle",
    email: "marie.user@invitegenie.cm",
    phone: "+237 6 70 11 22 33",
    role: "normal_user",
    city: "Douala",
  }),
  buildUser({
    id: "normal-junior",
    full_name: "Junior Tabi",
    email: "junior.user@invitegenie.cm",
    phone: "+237 6 71 22 33 44",
    role: "normal_user",
    city: "Buea",
  }),
  buildUser({
    id: "pro-estelle",
    full_name: "Estelle Muna",
    email: "estelle.pro@invitegenie.cm",
    phone: "+237 6 72 33 44 55",
    role: "pro_user",
    city: "Yaounde",
  }),
  buildUser({
    id: "pro-patrick",
    full_name: "Patrick Fotso",
    email: "patrick.pro@invitegenie.cm",
    phone: "+237 6 73 44 55 66",
    role: "pro_user",
    city: "Limbe",
  }),
  buildUser({
    id: "vendor-brice",
    full_name: "Brice Moukoko",
    email: "brice.vendor@invitegenie.cm",
    phone: "+237 6 74 55 66 77",
    role: "vendor",
    city: "Douala",
  }),
  buildUser({
    id: "vendor-awa",
    full_name: "Awa Njoya",
    email: "awa.vendor@invitegenie.cm",
    phone: "+237 6 75 66 77 88",
    role: "vendor",
    city: "Yaounde",
  }),
  buildUser({
    id: "planner-sandra",
    full_name: "Sandra Etoundi",
    email: "sandra.planner@invitegenie.cm",
    phone: "+237 6 76 77 88 99",
    role: "event_planner",
    city: "Douala",
  }),
  buildUser({
    id: "planner-mbarga",
    full_name: "Mbarga Essomba",
    email: "mbarga.planner@invitegenie.cm",
    phone: "+237 6 77 88 99 10",
    role: "event_planner",
    city: "Yaounde",
  }),
  buildUser({
    id: "enterprise-mtn",
    full_name: "MTN Cameroon Events Desk",
    email: "mtn.enterprise@invitegenie.cm",
    phone: "+237 6 78 99 10 11",
    role: "enterprise_client",
    city: "Douala",
  }),
  buildUser({
    id: "enterprise-orange",
    full_name: "Orange Cameroon Partnerships",
    email: "orange.enterprise@invitegenie.cm",
    phone: "+237 6 79 10 11 12",
    role: "enterprise_client",
    city: "Yaounde",
  }),
  buildUser({
    id: "tasker-emmanuel",
    full_name: "Emmanuel Fomunyoh",
    email: "emmanuel.tasker@invitegenie.cm",
    phone: "+237 6 80 11 12 13",
    role: "tasker",
    city: "Buea",
  }),
  buildUser({
    id: "tasker-clarisse",
    full_name: "Clarisse Talla",
    email: "clarisse.tasker@invitegenie.cm",
    phone: "+237 6 81 12 13 14",
    role: "tasker",
    city: "Douala",
  }),
  buildUser({
    id: "checkin-nfor",
    full_name: "Nfor Che",
    email: "nfor.checkin@invitegenie.cm",
    phone: "+237 6 82 13 14 15",
    role: "checkin_agent",
    city: "Bamenda",
  }),
  buildUser({
    id: "checkin-bello",
    full_name: "Bello Ibrahim",
    email: "bello.checkin@invitegenie.cm",
    phone: "+237 6 83 14 15 16",
    role: "checkin_agent",
    city: "Garoua",
  }),
  buildUser({
    id: "finance-1",
    full_name: "Finance Admin One",
    email: "finance1@invitegenie.cm",
    phone: "+237 6 84 15 16 17",
    role: "finance_admin",
    city: "Douala",
  }),
  buildUser({
    id: "finance-2",
    full_name: "Finance Admin Two",
    email: "finance2@invitegenie.cm",
    phone: "+237 6 85 16 17 18",
    role: "finance_admin",
    city: "Yaounde",
  }),
  buildUser({
    id: "app-admin-1",
    full_name: "InviteGenie Admin One",
    email: "admin1@invitegenie.cm",
    phone: "+237 6 86 17 18 19",
    role: "app_admin",
    city: "Douala",
  }),
  buildUser({
    id: "app-admin-2",
    full_name: "InviteGenie Admin Two",
    email: "admin2@invitegenie.cm",
    phone: "+237 6 87 18 19 20",
    role: "app_admin",
    city: "Buea",
  }),
  buildUser({
    id: "super-main",
    full_name: "InviteGenie Super Admin",
    email: "super@invitegenie.cm",
    phone: "+237 6 88 19 20 21",
    role: "super_admin",
    city: "Douala",
  }),
  buildUser({
    id: "super-owner",
    full_name: "InviteGenie Owner",
    email: "owner@invitegenie.cm",
    phone: "+237 6 89 20 21 22",
    role: "super_admin",
    city: "Yaounde",
  }),
  buildUser({
    id: "demo-super",
    full_name: "InviteGenie Legacy Super Admin",
    email: "superadmin@invitegenie.com",
    password: "super123",
    phone: "+237 6 90 21 22 23",
    role: "super_admin",
    city: "Douala",
  }),
  buildUser({
    id: "demo-admin",
    full_name: "InviteGenie Legacy Admin",
    email: "admin@invitegenie.com",
    password: "admin123",
    phone: "+237 6 91 22 23 24",
    role: "app_admin",
    city: "Douala",
  }),
  buildUser({
    id: "demo-user",
    full_name: "InviteGenie Demo Planner",
    email: "user@invitegenie.com",
    password: "password123",
    phone: "+237 6 92 23 24 25",
    role: "event_planner",
    city: "Buea",
  }),
  buildUser({
    id: "demo-buyer",
    full_name: "Ticket Buyer",
    email: "buyer@invitegenie.com",
    password: "password123",
    phone: "+237 6 93 24 25 26",
    role: "normal_user",
    city: "Limbe",
  }),
  ...Array.from({ length: 6 }).map((_, index) =>
    buildUser({
      id: `vendor-${index + 1}`,
      full_name: `Legacy Vendor ${index + 1}`,
      email: `vendor${index + 1}@invitegenie.com`,
      password: "password123",
      phone: `+237 6 94 3${index} 00 0${index}`,
      role: "vendor",
      city: index % 2 ? "Yaounde" : "Douala",
      accountType: "Vendor Pro",
    })
  ),
  ...Array.from({ length: 6 }).map((_, index) =>
    buildUser({
      id: `host-${index + 1}`,
      full_name: `Legacy Event Host ${index + 1}`,
      email: `host${index + 1}@invitegenie.com`,
      password: "password123",
      phone: `+237 6 95 4${index} 00 0${index}`,
      role: "event_planner",
      city: index % 2 ? "Buea" : "Douala",
    })
  ),
];

function readStoredUsers() {
  try {
    const stored = localStorage.getItem(DEMO_USERS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getDemoUsers() {
  if (typeof localStorage === "undefined") return DEFAULT_DEMO_USERS;

  const stored = readStoredUsers();
  if (!stored) {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
    return DEFAULT_DEMO_USERS;
  }

  const byEmail = new Map(stored.map((user) => [String(user.email).toLowerCase(), user]));
  let changed = false;
  DEFAULT_DEMO_USERS.forEach((user) => {
    const key = user.email.toLowerCase();
    if (!byEmail.has(key)) {
      byEmail.set(key, user);
      changed = true;
    }
  });

  const users = Array.from(byEmail.values()).map((user) => ({
    ...user,
    accountType: roleAccountType[user.role] || user.accountType || "FREE",
    permissions: user.permissions?.length ? user.permissions : ROLE_PERMISSIONS[normalizeRole(user.role)] || [],
  }));

  if (changed) localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  return users;
}

export function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  return users;
}

export function findDemoUser(email, password) {
  return getDemoUsers().find(
    (user) =>
      user.email.toLowerCase() === String(email || "").trim().toLowerCase() &&
      user.password === password
  );
}

export function getDemoUserById(id) {
  return getDemoUsers().find((user) => String(user.id) === String(id));
}

export function findDemoAccount(email, password) {
  const account = findDemoUser(email, password);
  return account 
    ? { 
        ...account, 
        legacyRole: account.role,
        role: normalizeRole(account.role), 
        admin_role: isAdminRole(account.role) ? normalizeRole(account.role) : null 
      } 
    : null;
}

export const DEMO_ACCOUNTS = DEFAULT_DEMO_USERS;
