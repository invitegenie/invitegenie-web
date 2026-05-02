/**
 * Canonical User Roles for InviteGenie - The Foundation Layer.
 */
export const USER_ROLES = {
  NORMAL_USER: "normal_user",
  PRO_USER: "pro_user",
  VENDOR: "vendor",
  EVENT_PLANNER: "event_planner",
  ENTERPRISE_CLIENT: "enterprise_client",
  TASKER: "tasker",
  CHECKIN_AGENT: "checkin_agent",
  FINANCE_ADMIN: "finance_admin",
  APP_ADMIN: "app_admin",
  SUPER_ADMIN: "super_admin",

  PUBLIC_GUEST: "normal_user",
  BASIC_USER: "normal_user",
  EVENT_HOST: "event_planner",
  VENDOR_BASIC: "vendor",
  VENDOR_PRO: "vendor",
  TASKER_FREELANCER: "tasker",
  STAFF: "checkin_agent",
  STAFF_AGENT: "checkin_agent",
  CHECK_IN_AGENT: "checkin_agent",
  CHECKIN_ADMIN: "app_admin",
  ADMIN: "app_admin",
  SUPPORT_ADMIN: "app_admin",
  MARKETPLACE_ADMIN: "app_admin",
  CONTENT_MODERATOR: "app_admin",
};

export const NORMAL_USER_ROLES = [
  USER_ROLES.NORMAL_USER,
  USER_ROLES.PRO_USER,
  USER_ROLES.VENDOR,
  USER_ROLES.EVENT_PLANNER,
  USER_ROLES.ENTERPRISE_CLIENT,
  USER_ROLES.TASKER,
  USER_ROLES.CHECKIN_AGENT,
];

export const ADMIN_ROLES = [
  USER_ROLES.FINANCE_ADMIN,
  USER_ROLES.APP_ADMIN,
  USER_ROLES.SUPER_ADMIN,
];

export const ADMIN_LOGIN_ROLES = ADMIN_ROLES;

const LEGACY_ROLE_MAP = {
  PUBLIC_GUEST: USER_ROLES.NORMAL_USER,
  BASIC_USER: USER_ROLES.NORMAL_USER,
  BASIC: USER_ROLES.NORMAL_USER,
  NORMAL_USER: USER_ROLES.NORMAL_USER,
  PRO_USER: USER_ROLES.PRO_USER,
  EVENT_HOST: USER_ROLES.EVENT_PLANNER,
  HOST: USER_ROLES.EVENT_PLANNER,
  EVENT_PLANNER: USER_ROLES.EVENT_PLANNER,
  ENTERPRISE_CLIENT: USER_ROLES.ENTERPRISE_CLIENT,
  VENDOR_BASIC: USER_ROLES.VENDOR,
  VENDOR_PRO: USER_ROLES.VENDOR,
  VENDOR: USER_ROLES.VENDOR,
  TASKER_FREELANCER: USER_ROLES.TASKER,
  TASKER: USER_ROLES.TASKER,
  STAFF: USER_ROLES.CHECKIN_AGENT,
  STAFF_AGENT: USER_ROLES.CHECKIN_AGENT,
  CHECK_IN_AGENT: USER_ROLES.CHECKIN_AGENT,
  CHECKIN_AGENT: USER_ROLES.CHECKIN_AGENT,
  CHECKIN_ADMIN: USER_ROLES.APP_ADMIN,
  CHECK_IN_ADMIN: USER_ROLES.APP_ADMIN,
  FINANCE_ADMIN: USER_ROLES.FINANCE_ADMIN,
  SUPPORT_ADMIN: USER_ROLES.APP_ADMIN,
  MARKETPLACE_ADMIN: USER_ROLES.APP_ADMIN,
  CONTENT_MODERATOR: USER_ROLES.APP_ADMIN,
  APP_ADMIN: USER_ROLES.APP_ADMIN,
  ADMIN: USER_ROLES.APP_ADMIN,
  SUPER_ADMIN: USER_ROLES.SUPER_ADMIN,
};

const LEGACY_VALUE_MAP = {
  basic_user: USER_ROLES.NORMAL_USER,
  event_host: USER_ROLES.EVENT_PLANNER,
  vendor_basic: USER_ROLES.VENDOR,
  vendor_pro: USER_ROLES.VENDOR,
  tasker_freelancer: USER_ROLES.TASKER,
  staff: USER_ROLES.CHECKIN_AGENT,
  staff_agent: USER_ROLES.CHECKIN_AGENT,
  check_in_agent: USER_ROLES.CHECKIN_AGENT,
  checkin_admin: USER_ROLES.APP_ADMIN,
  support_admin: USER_ROLES.APP_ADMIN,
  marketplace_admin: USER_ROLES.APP_ADMIN,
  content_moderator: USER_ROLES.APP_ADMIN,
  admin: USER_ROLES.APP_ADMIN,
};

export function normalizeRole(role) {
  if (!role) return USER_ROLES.NORMAL_USER;
  const raw = String(role).trim();
  if (Object.values(USER_ROLES).includes(raw)) return raw;
  if (LEGACY_VALUE_MAP[raw]) return LEGACY_VALUE_MAP[raw];
  return LEGACY_ROLE_MAP[raw.toUpperCase()] || raw.toLowerCase();
}

export function isAdminRole(role) {
  const normalized = normalizeRole(role);
  return ADMIN_ROLES.includes(normalized);
}

export function isNormalUserRole(role) {
  const normalized = normalizeRole(role);
  return NORMAL_USER_ROLES.includes(normalized);
}
