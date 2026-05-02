import { Link } from "react-router-dom";
import { SUPER_ADMIN_PERMISSIONS } from "../services/roles";
import { seedDemoData } from "../auth/coreEngine";

const SUPER_ADMIN_MODULES = [
  { title: "Users", path: "/admin/users", icon: "group", value: "All accounts" },
  { title: "Admin Roles", path: "/admin/roles", icon: "admin_panel_settings", value: "Role builder" },
  { title: "Permissions", path: "/admin/permissions", icon: "key", value: "Permission catalog" },
  { title: "Marketplace Approvals", path: "/admin/marketplace", icon: "storefront", value: "Review queue" },
  { title: "Events", path: "/admin/events", icon: "event_available", value: "Global view" },
  { title: "Financials", path: "/admin/financials", icon: "payments", value: "Revenue ops" },
  { title: "Audit Logs", path: "/admin/audit-logs", icon: "manage_search", value: "Security trail" },
  { title: "Platform Settings", path: "/admin/platform-settings", icon: "settings", value: "System controls" },
];

export default function SuperAdminDashboard() {
  const handleRestoreData = async () => {
    if (window.confirm("Are you sure you want to completely wipe and restore all demo data? This cannot be undone.")) {
      await seedDemoData();
      alert("Demo data fully restored! The page will now refresh.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-400/10 to-orange-400/5 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">God Mode Status</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Sovereign Control Center
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-amber-50/75">
          Authorized access to the God Mode administrative tier. Every high-risk action should be backed
          by Supabase RLS, server-side checks, and audit logging before production.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Account Tier" value="God Mode" icon="workspace_premium" />
        <Metric label="Permission Count" value={SUPER_ADMIN_PERMISSIONS.length} icon="key" />
        <Metric label="2FA Status" value="Verified" icon="security" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {SUPER_ADMIN_MODULES.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="rounded-2xl border border-white/10 bg-[#0D1320] p-5 transition hover:border-amber-200/50 hover:bg-white/[0.04]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-amber-200">
              <span className="material-symbols-outlined">{module.icon}</span>
            </div>
            <h2 className="mt-5 font-black text-white">{module.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{module.value}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-black text-white">Production security checklist</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add Supabase Phone MFA, server-side admin checks, RLS policies, and immutable audit logs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRestoreData}
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-rose-400 transition hover:bg-rose-500 hover:text-white"
            >
              <span className="material-symbols-outlined text-base">restore</span>
              Restore Demo Data
            </button>
            <Link
              to="/admin/roles"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#070A12] transition hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Configure Roles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-amber-200">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}
