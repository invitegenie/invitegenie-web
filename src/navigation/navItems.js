export const NAV_ITEMS = [
  // Main
  { label: "Dashboard", path: "/dashboard", icon: "dashboard", category: "main" },
  { label: "Home", path: "/home", icon: "home", category: "main" },
  { label: "Events", path: "/events", icon: "event", category: "main" },
  { label: "Marketplace", path: "/marketplace", icon: "storefront", category: "main" },
  { label: "Create Invitation", path: "/create-invitation", icon: "edit_square", category: "main" },
  { label: "Invitation Templates", path: "/invitations/templates", icon: "dashboard_customize", category: "main" },
  { label: "My Templates", path: "/my-templates", icon: "view_quilt", category: "main" },
  { label: "My Tickets", path: "/my-tickets", icon: "confirmation_number", category: "main" },
  { label: "Global Feed", path: "/feed", icon: "rss_feed", category: "main" },
  { label: "Upload Memory", path: "/feed/upload", icon: "add_photo_alternate", category: "main" },
  { label: "Gallery", path: "/gallery", icon: "photo_library", category: "main" },
  { label: "Calendar", path: "/calendar", icon: "calendar_month", category: "main" },
  { label: "Inbox", path: "/inbox", icon: "inbox", category: "main" },
  
  // Business
  { label: "Payments", path: "/payments", icon: "payments", category: "business" },
  { label: "Payment Methods", path: "/payment-methods", icon: "credit_card", category: "business" },
  { label: "Subscription & Billing", path: "/billing", icon: "receipt_long", category: "business" },
  { label: "Financials", path: "/financials", icon: "monitoring", category: "business" },
  { label: "Reports", path: "/reports", icon: "bar_chart", category: "business" },
  { label: "Integrations", path: "/integrations", icon: "hub", category: "business" },
  
  // Admin
  { label: "Users Management", path: "/users-management", icon: "group", category: "admin" },
  { label: "Events Management", path: "/events-management", icon: "event_available", category: "admin" },
  { label: "Vendors Management", path: "/vendors-management", icon: "store", category: "admin" },
  { label: "Finance Management", path: "/finance-management", icon: "account_balance_wallet", category: "admin" },
  { label: "Content Moderation", path: "/content-moderation", icon: "shield", category: "admin" },
  { label: "Support Management", path: "/support-management", icon: "support_agent", category: "admin" },
  { label: "Platform Settings", path: "/platform-settings", icon: "admin_panel_settings", category: "admin" },
  
  // Genie / Fun
  { label: "Convert Points", path: "/convert-points", icon: "redeem", category: "genie" },
  { label: "Make a Wish", path: "/make-a-wish", icon: "auto_awesome", category: "genie" },
  { label: "Summon a Genie", path: "/summon-genie", icon: "magic_button", category: "genie" },
  
  // Account
  { label: "Profile", path: "/profile", icon: "person", category: "account" },
  { label: "Notification Settings", path: "/notification-settings", icon: "notifications", category: "account" },
  { label: "Settings", path: "/settings", icon: "settings", category: "account" },
];

export const CATEGORY_LABELS = {
  main: "Main",
  business: "Business",
  admin: "Admin",
  genie: "Genie Magic",
  account: "Account",
};
