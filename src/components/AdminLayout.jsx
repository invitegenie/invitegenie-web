import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasPermission, USER_ROLES } from "../services/roles";

const ADMIN_NAV_ITEMS = [
  { label: "Overview", path: "/admin", icon: "dashboard" },
  { label: "Super Admin", path: "/admin/super", icon: "workspace_premium", superOnly: true },
  { label: "Users", path: "/admin/users", icon: "group", permission: "view_all_users" },
  { label: "Admin Roles", path: "/admin/roles", icon: "admin_panel_settings", permission: "manage_roles" },
  { label: "Permissions", path: "/admin/permissions", icon: "key", permission: "assign_permissions" },
  { label: "Feed Moderation", path: "/admin/feed", icon: "dynamic_feed", permission: "moderate_feed" },
  {
    label: "Storefront Moderation",
    path: "/admin/marketplace",
    icon: "storefront",
    permission: "moderate_storefronts",
  },
  { label: "Events", path: "/admin/events", icon: "event_available", permission: "view_all_events" },
  { label: "Financials", path: "/admin/financials", icon: "payments", permission: "view_all_financials" },
  { label: "Withdrawals", path: "/admin/withdrawals", icon: "account_balance", permission: "manage_payouts" },
  { label: "Pricing", path: "/admin/pricing", icon: "sell", permission: "manage_pricing" },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: "manage_search", permission: "view_audit_logs" },
  {
    label: "Platform Settings",
    path: "/admin/platform-settings",
    icon: "settings",
    permission: "manage_platform_settings",
  },
];

export default function AdminLayout() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = role === USER_ROLES.SUPER_ADMIN;

  const visibleItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.superOnly) return isSuperAdmin;
    if (!item.permission) return true;
    return hasPermission(profile || role, item.permission);
  });

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0D1320] xl:flex xl:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <button type="button" onClick={() => navigate("/admin")} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E]" />
              <div className="text-left">
                <p className="text-sm font-black tracking-tight">InviteGenie</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Admin Console</p>
              </div>
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-[#070A12]"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="truncate text-sm font-bold text-white">{profile?.full_name || "Admin"}</p>
              <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                isSuperAdmin ? "text-amber-400" : "text-[#A78BFA]"
              }`}>
                {isSuperAdmin ? "God Mode Tier" : (profile?.admin_role || role)}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/admin/login", { replace: true });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-rose-300 transition hover:bg-rose-500/10"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A12]/95 px-4 py-4 backdrop-blur-xl xl:hidden">
            <div className="mb-3 flex items-center justify-between gap-3">
              <button type="button" onClick={() => navigate("/admin")} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E]" />
                <span className="font-black">Admin</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate("/admin/login", { replace: true });
                }}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300"
              >
                Sign out
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                      isActive ? "bg-white text-[#070A12]" : "bg-white/[0.04] text-slate-300"
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
