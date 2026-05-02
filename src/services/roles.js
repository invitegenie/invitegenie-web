/**
 * InviteGenie Aggregated Roles & Permissions Service
 */

export { 
  USER_ROLES, 
  ADMIN_ROLES, 
  ADMIN_LOGIN_ROLES,
  NORMAL_USER_ROLES, 
  normalizeRole, 
  isAdminRole, 
  isNormalUserRole 
} from "./userRoles";

export { 
  ROLE_PERMISSIONS, 
  SUPER_ADMIN_PERMISSIONS,
  ADMIN_PERMISSION_OPTIONS,
  DEFAULT_ADMIN_ROLES,
  ROLE_DASHBOARD_TOOLS,
  getPermissionsForProfile, 
  hasPermission, 
  hasAnyPermission, 
  getDashboardToolsForRole,
  canCreateMarketplaceListing,
  canCreateEvent,
  canViewFinancials,
  canViewAdmin,
  normalizePermissions,
  getRolePermissions
} from "./permissions";

export { 
  DEMO_ACCOUNTS,
  DEFAULT_DEMO_USERS,
  findDemoAccount, 
  getDemoUsers, 
  getDemoUserById 
} from "./demoUsers";
