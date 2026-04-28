import { USER_ROLES } from "./roles";

export const DEMO_USERS = [
  {
    id: "u-1",
    name: "Guest User",
    email: "guest@invitegenie.com",
    password: "password123",
    role: USER_ROLES.BASIC_USER,
    tier: "BASIC",
    avatar: "GU"
  },
  {
    id: "u-2",
    name: "Marie Ngalle",
    email: "host@invitegenie.com",
    password: "password123",
    role: USER_ROLES.EVENT_HOST,
    tier: "PRO",
    avatar: "MN"
  },
  {
    id: "u-3",
    name: "Vendor Pro",
    email: "vendor@invitegenie.com",
    password: "password123",
    role: USER_ROLES.VENDOR_PRO,
    tier: "BUSINESS",
    avatar: "VP"
  },
  {
    id: "u-4",
    name: "Staff Agent",
    email: "staff@invitegenie.com",
    password: "password123",
    role: USER_ROLES.STAFF_AGENT,
    tier: "STAFF",
    avatar: "SA"
  },
  {
    id: "admin-1",
    name: "Super Admin",
    email: "superadmin@invitegenie.com",
    password: "super123",
    role: USER_ROLES.SUPER_ADMIN,
    tier: "GOD_MODE",
    avatar: "SA"
  }
];