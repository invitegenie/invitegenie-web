import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    ["dashboard", "Dashboard", null, "/dashboard"],
    ["event", "Events", null, "/events"],
    ["task_alt", "Tasks", null, "/tasks"],
    ["storefront", "Marketplace", null, "/marketplace"],
    ["dashboard_customize", "Templates", null, "/templates"],
    ["calendar_month", "Calendar", null, "/calendar"],
    ["photo_library", "Gallery", null, "/gallery"],
    ["account_balance_wallet", "Financials", null, "/financials"],
    ["inbox", "Inbox", "8", "/inbox"],
    ["payments", "Payments", null, "/payments"],
    ["architecture", "Venue Builder", null, "/venue-builder"],
    ["event_seat", "Seating Planner", null, "/seating-planner"],
    ["table_restaurant", "Table Planner", null, "/table-planner"],
    ["bar_chart", "Reports", null, "/reports"],
    ["hub", "Integrations", null, "/integrations"],
  ];

  return (
    <aside className="hidden min-w-0 rounded-3xl border border-white/[0.04] bg-[#141218]/80 p-4 shadow-md backdrop-blur-2xl xl:sticky xl:top-4 xl:flex xl:h-[calc(100vh-2rem)] xl:flex-col xl:overflow-y-auto">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-400 shadow-sm" />
        <h2 className="text-xl font-semibold font-heading">InviteGenie</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map(([icon, label, badge, path]) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
              location.pathname === path
                ? "bg-gradient-to-r from-purple-700 to-purple-900 font-semibold text-white shadow-lg shadow-purple-900/30"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name={icon} />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-900/20 to-indigo-900/10 p-4">
        <Icon name="workspace_premium" className="mb-3 text-yellow-400" />
        <h3 className="font-semibold">Upgrade to Pro</h3>
        <p className="mt-1 text-xs text-slate-300">Unlock all features & boost your events.</p>
        <button 
          onClick={() => navigate("/payments")}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Upgrade Now
        </button>
      </div>

      <div className="mt-auto space-y-2 pt-6">
        <button onClick={() => navigate("/settings")} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/5">
          <Icon name="settings" /> Settings
        </button>
        <button onClick={() => navigate("/help")} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/5">
          <Icon name="help" /> Help Center
        </button>
        <button onClick={() => { if (window.confirm("Are you sure?")) { localStorage.clear(); window.location.href = "/"; } }} className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 px-4 py-3 text-red-400 hover:bg-red-500/10">
          <Icon name="logout" /> Sign Out
        </button>
      </div>
    </aside>
  );
}