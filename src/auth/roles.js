// User account types and permissions
export const USER_ROLES = {
  BASIC_USER: "BASIC_USER",
  EVENT_HOST: "EVENT_HOST",
  VENDOR_BASIC: "VENDOR_BASIC",
  VENDOR_PRO: "VENDOR_PRO",
  STAFF_AGENT: "STAFF_AGENT",
  FINANCE_ADMIN: "FINANCE_ADMIN",
  APP_ADMIN: "APP_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const ROLE_PERMISSIONS = {
  BASIC_USER: [
    "browse_events",
    "buy_tickets",
    "view_vouchers",
    "post_memories",
    "like_memories",
    "manage_profile",
  ],
  PUBLIC_GUEST: [
    "browse_events",
    "buy_tickets",
    "manage_profile",
  ],
  EVENT_HOST: [
    "browse_events",
    "create_events",
    "manage_own_events",
    "manage_guest_list",
    "send_invitations",
    "view_event_analytics",
    "view_bookings",
    "generate_vouchers",
    "manage_profile",
    "upload_gallery",
  ],
  VENDOR_BASIC: [
    "create_vendor_profile",
    "list_services",
    "receive_bookings",
    "view_sales_dashboard",
    "manage_listings",
    "browse_events",
  ],
  VENDOR_PRO: [
    "create_vendor_profile",
    "list_services",
    "receive_bookings",
    "view_sales_dashboard",
    "manage_listings",
    "featured_listings",
    "advanced_analytics",
    "promotions_boosting",
    "custom_branding",
    "priority_visibility",
    "export_reports",
    "browse_events",
  ],
  STAFF_AGENT: [
    "scan_qr",
    "validate_vouchers",
    "mark_checkin",
    "browse_events",
  ],
  FINANCE_ADMIN: [
    "view_bookings",
    "view_invoices",
    "view_payments",
    "manage_refunds",
    "manage_reconciliation",
  ],
  APP_ADMIN: [
    "manage_users",
    "manage_events",
    "moderate_content",
    "resolve_support",
    "view_platform_analytics",
    "manage_flagged_content",
    "view_financials",
  ],
  SUPER_ADMIN: [
    "manage_users",
    "manage_events",
    "moderate_content",
    "resolve_support",
    "view_platform_analytics",
    "manage_flagged_content",
    "manage_admins",
    "configure_pricing",
    "manage_vendors",
    "view_financials",
    "manage_platform_settings",
    "delete_records",
  ],
};

export function hasPermission(role, permission) {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role, permissions) {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return permissions.some(p => ROLE_PERMISSIONS[role].includes(p));
}
