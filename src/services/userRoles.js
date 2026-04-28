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
  [USER_ROLES.PUBLIC_GUEST]: [
    "browse_events",
    "buy_tickets",
    "view_own_vouchers",
    "post_memories",
    "interact_memories",
    "manage_own_profile",
  ],
  [USER_ROLES.EVENT_HOST]: [
    "browse_events",
    "buy_tickets",
    "create_events",
    "manage_own_events",
    "manage_guest_list",
    "send_invitations",
    "view_event_analytics",
    "view_own_bookings",
    "generate_vouchers",
  ],
  [USER_ROLES.VENDOR_BASIC]: [
    "browse_events",
    "create_vendor_profile",
    "list_services",
    "receive_bookings",
    "view_limited_sales",
    "manage_own_listings",
  ],
  [USER_ROLES.VENDOR_PRO]: [
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
  [USER_ROLES.STAFF]: [
    "browse_events",
    "scan_qr",
    "validate_vouchers",
    "check_in_guests",
  ],
  [USER_ROLES.FINANCE_ADMIN]: [
    "browse_events",
    "view_bookings",
    "view_invoices",
    "view_payments",
    "manage_invoices",
    "manage_refunds",
  ],
  [USER_ROLES.APP_ADMIN]: [
    "browse_events",
    "manage_users",
    "manage_all_events",
    "moderate_feed",
    "resolve_support",
    "view_platform_analytics",
    "moderate_content",
  ],
  [USER_ROLES.SUPER_ADMIN]: [
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

/**
 * Check if a role has a specific permission
 * @param {string} role 
 * @param {string} permission 
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

/**
 * Mock current user getter for demo purposes
 * Change this value to test different UI states
 */
export const getCurrentUserRole = () => {
  const user = JSON.parse(localStorage.getItem("invitegenie_user"));
  return user?.role || null;
};

/**
 * Mock login function
 */
export const loginUser = (role) => {
  const mockUser = {
    id: `user_${role}`,
    name: `${role.replace('_', ' ').toUpperCase()} User`,
    role: role,
    avatar: role[0].toUpperCase()
  };
  localStorage.setItem("invitegenie_user", JSON.stringify(mockUser));
  window.location.href = "/dashboard";
};

export const logoutUser = () => {
  localStorage.removeItem("invitegenie_user");
  window.location.href = "/";
};