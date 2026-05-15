﻿﻿﻿import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasPermission } from "../services/roles";

const ADMIN_MODULES = [
  {
    title: "Users",
    description: "Search users, review status, and manage account access.",
    path: "/admin/users",
    icon: "group",
    permission: "view_all_users",
  },
  {
    title: "Storefront Moderation",
    description: "Review storefront products, approve pending services, and hide inappropriate listings.",
    path: "/admin/marketplace",
    icon: "storefront",
    permission: "moderate_storefronts",
  },
  {
    title: "Vendor Reviews",
    description: "Review and moderate vendor reviews.",
    path: "/admin/vendor-reviews",
    icon: "reviews",
    permission: "moderate_vendor_reviews",
  },
  {
    title: "Vendor Wallets",
    description: "Manage all vendor wallets and platform commissions.",
    path: "/admin/vendor-wallets",
    icon: "account_balance_wallet",
    permission: "manage_all_vendor_wallets",
  },
  {
    title: "Vendor Profiles",
    description: "Moderate and manage all vendor profiles.",
    path: "/admin/vendor-profiles",
    icon: "store",
    permission: "manage_all_vendor_profiles",
  },
  {
    title: "Feed Moderation",
    description: "Review event memories, public posts, comments, and reported content.",
    path: "/admin/feed",
    icon: "dynamic_feed",
    permission: "moderate_feed",
  },
  {
    title: "Events",
    description: "Monitor platform events and operational health.",
    path: "/admin/events",
    icon: "event_available",
    permission: "view_all_events",
  },
  {
    title: "Sponsorship Moderation",
    description: "Review and moderate event sponsorships across the platform.",
    path: "/admin/sponsorships",
    icon: "stars",
    permission: "moderate_event_sponsors",
  },
  {
    title: "Payment Gateway",
    description: "Monitor centralized payment flows across MoMo, Orange Money, Flutterwave, etc.",
    path: "/admin/payments",
    icon: "account_balance",
    permission: "view_all_payments",
  },
  {
    title: "Financials",
    description: "View platform revenue, fees, and commission controls.",
    path: "/admin/financials",
    icon: "payments",
    permission: "view_all_financials",
  },
  {
    title: "Pricing",
    description: "Manage plan pricing and platform billing packages.",
    path: "/admin/pricing",
    icon: "sell",
    permission: "manage_pricing",
  },
  {
    title: "Audit Logs",
    description: "Inspect security-sensitive admin actions.",
    path: "/admin/audit-logs",
    icon: "manage_search",
    permission: "view_audit_logs",
  },
  {
    title: "Platform Settings",
    description: "Manage global platform configuration and security settings.",
    path: "/admin/platform-settings",
    icon: "settings",
    permission: "manage_platform_settings",
  },
];

export default function AdminDashboard() {
  const { profile, permissions } = useAuth();
  const visibleModules = ADMIN_MODULES.filter((module) => hasPermission(profile, module.permission));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#A78BFA]">Admin Overview</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Welcome, {profile?.full_name || "Admin"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Your console is permission-scoped. The sidebar only shows modules available to your current admin role.
          </p>
        </div>
        {hasPermission(profile, "manage_roles") ? (
          <Link
            to="/admin/roles"
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#070A12] transition hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            Manage Roles
          </Link>
        ) : null}
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Role" value={profile?.admin_role || profile?.role || "admin"} icon="badge" />
        <Metric label="Permissions" value={permissions?.length || 0} icon="key" />
        <Metric label="Status" value={profile?.status || "active"} icon="verified_user" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleModules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="rounded-2xl border border-white/10 bg-[#0D1320] p-5 transition hover:border-[#A78BFA]/50 hover:bg-white/[0.04]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-[#A78BFA]">
                <span className="material-symbols-outlined">{module.icon}</span>
              </div>
              <div>
                <h2 className="font-black text-white">{module.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">{module.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#A78BFA]">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}
