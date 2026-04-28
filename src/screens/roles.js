export const USER_ROLES = {
  PUBLIC_GUEST: "public_guest",
  EVENT_HOST: "event_host",
  VENDOR_BASIC: "vendor_basic",
  VENDOR_PRO: "vendor_pro",
  STAFF: "staff",
  FINANCE_ADMIN: "finance_admin",
  APP_ADMIN: "app_admin",
  SUPER_ADMIN: "super_admin",
};

export const ROLE_PERMISSIONS = {
  public_guest: [
    "browse_events",
    "buy_tickets",
    "view_own_vouchers",
    "post_memories",
    "interact_memories",
    "manage_own_profile",
  ],
  event_host: [
    "browse_events",
    "buy_tickets",
    "create_events",
    "manage_own_events",
    "manage_guest_list",
    "send_invitations",
    "view_event_analytics",
    "view_own_bookings",
    "generate_vouchers",
    "upload_gallery",
  ],
  vendor_basic: [
    "browse_events",
    "create_vendor_profile",
    "list_services",
    "receive_bookings",
    "view_limited_sales",
    "manage_own_listings",
  ],
  vendor_pro: [
    "browse_events",
    "create_vendor_profile",
    "list_services",
    "receive_bookings",
    "manage_own_listings",
    "featured_listings",
    "advanced_analytics",
    "promotions",
    "custom_branding",
    "priority_visibility",
    "export_reports",
  ],
  staff: [
    "browse_events",
    "scan_qr",
    "validate_vouchers",
    "check_in_guests",
  ],
  finance_admin: [
    "browse_events",
    "view_bookings",
    "view_invoices",
    "view_payments",
    "manage_invoices",
    "manage_refunds",
  ],
  app_admin: [
    "browse_events",
    "manage_users",
    "manage_all_events",
    "moderate_feed",
    "resolve_support",
    "view_platform_analytics",
    "moderate_content",
  ],
  super_admin: [
    "browse_events",
    "manage_users",
    "manage_all_events",
    "moderate_feed",
    "resolve_support",
    "view_platform_analytics",
    "moderate_content",
    "manage_admins",
    "configure_pricing",
    "manage_all_vendors",
    "view_all_financials",
    "platform_settings",
    "delete_records",
  ],
};

export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const hasAnyPermission = (role, permissions) => {
  if (!role || !ROLE_PERMISSIONS[role] || !Array.isArray(permissions)) return false;
  return permissions.some(permission => ROLE_PERMISSIONS[role].includes(permission));
};