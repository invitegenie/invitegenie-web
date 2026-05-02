import { USER_ROLES, normalizeRole, isAdminRole } from "./userRoles"; // Standardized import

export const ROLE_PERMISSIONS = {
  [USER_ROLES.NORMAL_USER]: [
    "browse_events",
    "buy_ticket",
    "post_memory",
    "like",
    "comment",
    "share",
    "view_gallery",
    "browse_marketplace",
    "buy_marketplace_item",
    "manage_profile",
    "view_qr",
    "post_memories",
    "review_vendor",
  ],
  [USER_ROLES.PRO_USER]: [
    "browse_events",
    "buy_ticket",
    "post_memory",
    "like",
    "comment",
    "share",
    "view_gallery",
    "browse_marketplace",
    "buy_marketplace_item",
    "premium_features",
    "premium_templates",
    "advanced_gallery",
    "priority_support",
    "manage_profile",
    "view_qr",
    "post_memories",
    "review_vendor",
  ],
  [USER_ROLES.VENDOR]: [
    "browse_events",
    "manage_listing",
    "view_orders",
    "view_earnings",
    "receive_quote_requests",
    "sell_marketplace_item",
    "request_quote",
    "manage_own_listing",
    "receive_requests",
    "view_financials",
    "manage_profile",
    "request_payout",
    "view_own_withdrawals",
    "view_vendor_wallet",
    "view_vendor_earnings",
    "manage_vendor_portfolio",
    "view_vendor_reviews",
    "manage_own_marketplace_profile",
    "featured_listing",
    "advanced_vendor_analytics",
  ],
  [USER_ROLES.EVENT_PLANNER]: [
    "create_event",
    "manage_event",
    "manage_guests",
    "scanner_access",
    "assign_event_roles",
    "sell_event_tickets",
    "browse_events",
    "browse_marketplace",
    "post_memory",
    "like",
    "comment",
    "share",
    "view_gallery",
    "create_events",
    "manage_own_events",
    "manage_guest_list",
    "post_memories",
    "view_event_analytics",
    "view_qr",
    "manage_profile",
    "request_payout",
    "view_own_withdrawals",
    "review_vendor",
    "book_vendor",
  ],
  [USER_ROLES.ENTERPRISE_CLIENT]: [
    "create_event",
    "assign_company_users",
    "bulk_invite_guests",
    "approve_team_events",
    "enterprise_billing",
    "browse_events",
    "browse_marketplace",
    "post_memory",
    "like",
    "comment",
    "share",
    "view_gallery",
    "create_events",
    "manage_own_events",
    "manage_guest_list",
    "post_memories",
    "view_event_analytics",
    "view_qr",
    "manage_profile",
    "request_payout",
    "view_company_withdrawals",
    "review_vendor",
    "book_vendor",
  ],
  [USER_ROLES.TASKER]: [
    "create_marketplace_listing",
    "accept_tasks",
    "complete_tasks",
    "receive_payouts",
    "browse_events",
    "browse_marketplace",
    "request_quote",
    "view_financials",
    "manage_profile",
    "request_payout",
    "view_own_withdrawals",
    "view_vendor_wallet",
    "view_vendor_earnings",
    "manage_vendor_portfolio",
  ],
  [USER_ROLES.CHECKIN_AGENT]: [
    "scan_qr",
    "validate_ticket",
    "mark_checked_in",
    "browse_events",
    "scan_event_qr",
    "view_qr",
    "manage_profile",
  ],
  [USER_ROLES.FINANCE_ADMIN]: [
    "view_financials",
    "view_transactions",
    "view_invoices",
    "process_refunds",
    "view_payments",
    "manage_refunds",
    "view_withdrawals",
    "manage_payouts",
    "view_all_vendor_wallets",
    "manage_vendor_payouts",
  ],
  [USER_ROLES.APP_ADMIN]: [
    "manage_users",
    "moderate_feed",
    "moderate_marketplace",
    "approve_listings",
    "manage_events",
    "view_reports",
    "view_all_users",
    "view_all_events",
    "view_all_marketplace_listings",
    "approve_marketplace_listings",
    "moderate_content",
    "view_withdrawals",
    "manage_payouts",
    "moderate_vendor_profiles",
    "moderate_vendor_reviews",
    "moderate_marketplace",
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    "all_permissions",
    "manage_roles",
    "assign_permissions",
    "manage_admins",
    "platform_settings",
    "audit_logs",
    "manage_pricing",
    "manage_payout_settings",
    "manage_commissions",
    "manage_all_events",
    "manage_all_marketplace",
    "manage_all_vendor_wallets",
    "manage_all_vendor_profiles",
    "manage_vendor_commissions",
    "create_admin_role",
    "edit_admin_role",
    "delete_admin_role",
    "assign_admin_role",
    "revoke_admin_role",
    "create_permission",
    "edit_permission",
    "delete_permission",
    "view_all_users",
    "view_all_events",
    "view_all_marketplace_listings",
    "approve_marketplace_listings",
    "moderate_content",
    "view_all_financials",
    "manage_platform_settings",
    "manage_commission_rates",
    "manage_2fa_settings",
    "view_audit_logs",
  ],
};

export const SUPER_ADMIN_PERMISSIONS = ROLE_PERMISSIONS[USER_ROLES.SUPER_ADMIN];

export const ADMIN_PERMISSION_OPTIONS = [
  { id: "manage_users", label: "Manage users", group: "Users" },
  { id: "moderate_feed", label: "Moderate feed", group: "Content" },
  { id: "moderate_marketplace", label: "Moderate marketplace", group: "Marketplace" },
  { id: "approve_listings", label: "Approve listings", group: "Marketplace" },
  { id: "moderate_vendor_profiles", label: "Moderate vendor profiles", group: "Marketplace" },
  { id: "moderate_vendor_reviews", label: "Moderate vendor reviews", group: "Marketplace" },
  { id: "manage_all_vendor_profiles", label: "Manage all vendor profiles", group: "Marketplace" },
  { id: "manage_events", label: "Manage events", group: "Events" },
  { id: "view_reports", label: "View reports", group: "Reports" },
  { id: "view_financials", label: "View financials", group: "Finance" },
  { id: "view_transactions", label: "View transactions", group: "Finance" },
  { id: "view_withdrawals", label: "View withdrawals", group: "Finance" },
  { id: "manage_payouts", label: "Manage payouts", group: "Finance" },
  { id: "view_all_vendor_wallets", label: "View all vendor wallets", group: "Finance" },
  { id: "manage_vendor_payouts", label: "Manage vendor payouts", group: "Finance" },
  { id: "manage_all_vendor_wallets", label: "Manage all vendor wallets", group: "Finance" },
  { id: "manage_payout_settings", label: "Manage payout settings", group: "Platform" },
  { id: "view_invoices", label: "View invoices", group: "Finance" },
  { id: "process_refunds", label: "Process refunds", group: "Finance" },
  { id: "view_payments", label: "View payments", group: "Finance" },
  { id: "manage_pricing", label: "Manage pricing", group: "Platform" },
  { id: "manage_commissions", label: "Manage commissions", group: "Platform" },
  { id: "manage_roles", label: "Manage roles", group: "Roles" },
  { id: "assign_permissions", label: "Assign permissions", group: "Roles" },
  { id: "manage_admins", label: "Manage admins", group: "Roles" },
  { id: "platform_settings", label: "Platform settings", group: "Platform" },
  { id: "audit_logs", label: "Audit logs", group: "Security" },
  { id: "create_admin_role", label: "Create admin roles", group: "Legacy Admin Roles" },
  { id: "edit_admin_role", label: "Edit admin roles", group: "Legacy Admin Roles" },
  { id: "delete_admin_role", label: "Delete admin roles", group: "Legacy Admin Roles" },
  { id: "assign_admin_role", label: "Assign admin roles", group: "Legacy Admin Roles" },
  { id: "view_all_users", label: "View all users", group: "Legacy Users" },
  { id: "view_all_events", label: "View all events", group: "Legacy Events" },
  { id: "view_all_financials", label: "View all financials", group: "Legacy Finance" },
  { id: "approve_marketplace_listings", label: "Approve marketplace listings", group: "Legacy Marketplace" },
  { id: "view_audit_logs", label: "View audit logs", group: "Legacy Audit" },
];

export const DEFAULT_ADMIN_ROLES = [
  {
    id: USER_ROLES.APP_ADMIN,
    name: USER_ROLES.APP_ADMIN,
    label: "App Admin",
    description: "General platform operator with user, event, marketplace, and moderation access.",
    permissions: ROLE_PERMISSIONS[USER_ROLES.APP_ADMIN],
  },
  {
    id: USER_ROLES.FINANCE_ADMIN,
    name: USER_ROLES.FINANCE_ADMIN,
    label: "Finance Admin",
    description: "Owns financial visibility, invoices, payments, refunds, and reports.",
    permissions: ROLE_PERMISSIONS[USER_ROLES.FINANCE_ADMIN],
  },
  {
    id: USER_ROLES.SUPER_ADMIN,
    name: USER_ROLES.SUPER_ADMIN,
    label: "Super Admin",
    description: "Platform owner with role, permission, pricing, commission, and global data control.",
    permissions: ROLE_PERMISSIONS[USER_ROLES.SUPER_ADMIN],
  },
];

export const ROLE_DASHBOARD_TOOLS = {
  [USER_ROLES.NORMAL_USER]: [
    { label: "Browse Events", path: "/events", icon: "event" },
    { label: "My Tickets", path: "/my-tickets", icon: "confirmation_number" },
    { label: "My Gallery", path: "/gallery", icon: "photo_library" },
    { label: "Feed", path: "/feed", icon: "dynamic_feed" },
    { label: "Marketplace", path: "/marketplace", icon: "storefront" },
  ],
  [USER_ROLES.PRO_USER]: [
    { label: "Browse Events", path: "/events", icon: "event" },
    { label: "My Tickets", path: "/my-tickets", icon: "confirmation_number" },
    { label: "My Gallery", path: "/gallery", icon: "photo_library" },
    { label: "Feed", path: "/feed", icon: "dynamic_feed" },
    { label: "Marketplace", path: "/marketplace", icon: "storefront" },
    { label: "Saved Events", path: "/events?saved=true", icon: "bookmark" },
    { label: "Premium Templates", path: "/templates", icon: "workspace_premium" },
    { label: "Advanced Gallery", path: "/gallery", icon: "auto_awesome_motion" },
    { label: "Priority Support", path: "/support", icon: "support_agent" },
  ],
  [USER_ROLES.VENDOR]: [
    { label: "Marketplace Listings", path: "/marketplace", icon: "storefront" },
    { label: "Quote Requests", path: "/dashboard?panel=quotes", icon: "request_quote" },
    { label: "Orders", path: "/dashboard?panel=orders", icon: "shopping_bag" },
    { label: "Earnings", path: "/dashboard?panel=earnings", icon: "payments" },
    { label: "Create Listing", path: "/marketplace/new", icon: "add_business" },
  ],
  [USER_ROLES.EVENT_PLANNER]: [
    { label: "Create Event", path: "/events/new", icon: "add_circle" },
    { label: "Guests", path: "/guests", icon: "groups" },
    { label: "Bookings", path: "/bookings", icon: "confirmation_number" },
    { label: "Scanner", path: "/scanner", icon: "qr_code_scanner" },
    { label: "Event Analytics", path: "/analytics", icon: "analytics" },
    { label: "Marketplace Requests", path: "/marketplace", icon: "request_quote" },
    { label: "Assign Team Roles", path: "/dashboard?panel=event-team", icon: "manage_accounts" },
  ],
  [USER_ROLES.ENTERPRISE_CLIENT]: [
    { label: "Company Events", path: "/events", icon: "corporate_fare" },
    { label: "Team Members", path: "/dashboard?panel=team", icon: "groups" },
    { label: "Reports", path: "/reports", icon: "summarize" },
    { label: "Approvals", path: "/dashboard?panel=approvals", icon: "approval" },
    { label: "Billing", path: "/billing", icon: "receipt_long" },
    { label: "Assign Company Users", path: "/dashboard?panel=company-users", icon: "manage_accounts" },
  ],
  [USER_ROLES.TASKER]: [
    { label: "Task Listings", path: "/tasks", icon: "task_alt" },
    { label: "Active Jobs", path: "/tasks?status=active", icon: "work" },
    { label: "Earnings", path: "/dashboard?panel=earnings", icon: "payments" },
    { label: "Marketplace Profile", path: "/marketplace/new", icon: "badge" },
  ],
  [USER_ROLES.CHECKIN_AGENT]: [
    { label: "Scanner", path: "/scanner", icon: "qr_code_scanner" },
    { label: "Today's Events", path: "/events", icon: "today" },
    { label: "Checked-in Guests", path: "/guests", icon: "how_to_reg" },
    { label: "Validation Logs", path: "/dashboard?panel=validation-logs", icon: "fact_check" },
  ],
  [USER_ROLES.FINANCE_ADMIN]: [
    { label: "Financials", path: "/admin/financials", icon: "payments" },
    { label: "Invoices", path: "/admin/financials?tab=invoices", icon: "receipt" },
    { label: "Payments", path: "/admin/financials?tab=payments", icon: "account_balance_wallet" },
    { label: "Refunds", path: "/admin/financials?tab=refunds", icon: "currency_exchange" },
    { label: "Reports", path: "/admin", icon: "summarize" },
  ],
  [USER_ROLES.APP_ADMIN]: [
    { label: "Users", path: "/admin/users", icon: "group" },
    { label: "Events", path: "/admin/events", icon: "event_available" },
    { label: "Marketplace Moderation", path: "/admin/marketplace", icon: "storefront" },
    { label: "Reports", path: "/admin", icon: "summarize" },
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    { label: "Everything", path: "/admin/super", icon: "workspace_premium" },
    { label: "Admin Roles", path: "/admin/roles", icon: "admin_panel_settings" },
    { label: "Permissions", path: "/admin/permissions", icon: "key" },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: "manage_search" },
    { label: "Pricing", path: "/admin/pricing", icon: "sell" },
    { label: "Commissions", path: "/admin/financials", icon: "percent" },
  ],
};

export function normalizePermissions(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      return normalizePermissions(JSON.parse(value));
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value.permissions)) return normalizePermissions(value.permissions);
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([permission]) => permission);
  }
  return [];
}

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[normalizeRole(role)] || [];
}

export function getPermissionsForProfile(profileOrRole) {
  if (!profileOrRole) return [];
  if (typeof profileOrRole === "string") return getRolePermissions(profileOrRole);
  
  const role = normalizeRole(profileOrRole?.role || profileOrRole?.admin_role);
  const rolePermissions = getRolePermissions(role);
  const profilePermissions = normalizePermissions(profileOrRole?.permissions);
  
  const merged = Array.from(new Set([...rolePermissions, ...profilePermissions]));
  return merged.includes("all_permissions") ? SUPER_ADMIN_PERMISSIONS : merged;
}

export function hasPermission(profileOrRole, permission) {
  const permissions = getPermissionsForProfile(profileOrRole);
  return permissions.includes("all_permissions") || permissions.includes(permission);
}

export function hasAnyPermission(user, permissions = []) {
  return permissions.some((permission) => hasPermission(user, permission));
}

export function getDashboardToolsForRole(role) {
  return ROLE_DASHBOARD_TOOLS[normalizeRole(role)] || ROLE_DASHBOARD_TOOLS.normal_user;
}

/**
 * Specific Capability Policies
 */
export function canCreateMarketplaceListing(profileOrRole) {
  return hasPermission(profileOrRole, "create_marketplace_listing");
}
export function canCreateEvent(profileOrRole) {
  return hasPermission(profileOrRole, "create_event");
}
export function canViewFinancials(profileOrRole) {
  return hasPermission(profileOrRole, "view_financials") || hasPermission(profileOrRole, "view_all_financials");
}
export function canViewAdmin(profileOrRole) {
  const role = typeof profileOrRole === "string" ? profileOrRole : profileOrRole?.role;
  return isAdminRole(role);
}