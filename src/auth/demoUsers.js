import { USER_ROLES } from "./roles";

// Default pro user for demo
export const DEFAULT_PRO_USER = {
  id: "user-pro-001",
  name: "Invite Genie Pro",
  full_name: "Invite Genie Pro",
  email: "invitegenie.app@gmail.com",
  password: "password123",
  role: USER_ROLES.EVENT_HOST,
  tier: "PRO",
  accountType: "pro",
  avatar: "IG",
  avatarUrl: "",
  plan: "Pro Account"
};

export const DEMO_USERS = [
  DEFAULT_PRO_USER,
  {
    id: "u-1",
    name: "Marie Ngalle",
    email: "guest@invitegenie.com",
    password: "password123",
    role: USER_ROLES.BASIC_USER,
    tier: "BASIC",
    avatar: "MN"
  },
  {
    id: "u-2",
    name: "Akoh Mbawa",
    email: "host@invitegenie.com",
    password: "password123",
    role: USER_ROLES.EVENT_HOST,
    tier: "PRO",
    avatar: "AM"
  },
  {
    id: "u-3",
    name: "DJ Brice Mix",
    email: "vendor@invitegenie.com",
    password: "password123",
    role: USER_ROLES.VENDOR_PRO,
    tier: "BUSINESS",
    avatar: "DB"
  },
  {
    id: "u-3-basic",
    name: "Mama Awa Catering",
    email: "vendorbasic@invitegenie.com",
    password: "password123",
    role: USER_ROLES.VENDOR_BASIC,
    tier: "BASIC",
    avatar: "MA"
  },
  {
    id: "u-tasker-1",
    name: "Emmanuel Runner",
    email: "tasker@invitegenie.com",
    password: "password123",
    role: USER_ROLES.TASKER_FREELANCER,
    tier: "TASKER",
    avatar: "ER"
  },
  {
    id: "u-4",
    name: "Nfor Security",
    email: "staff@invitegenie.com",
    password: "password123",
    role: USER_ROLES.CHECK_IN_AGENT,
    tier: "STAFF",
    avatar: "NS"
  },
  {
    id: "finance-1",
    name: "Sandrine Finance",
    email: "finance@invitegenie.com",
    password: "password123",
    role: USER_ROLES.FINANCE_ADMIN,
    tier: "FINANCE",
    avatar: "SF"
  },
  {
    id: "app-admin-1",
    name: "InviteGenie Admin",
    email: "admin@invitegenie.com",
    password: "password123",
    role: USER_ROLES.APP_ADMIN,
    tier: "ADMIN",
    avatar: "IA"
  },
  {
    id: "admin-1",
    name: "Platform Owner",
    email: "superadmin@invitegenie.com",
    password: "super123",
    role: USER_ROLES.SUPER_ADMIN,
    tier: "GOD_MODE",
    avatar: "SA"
  }
];
