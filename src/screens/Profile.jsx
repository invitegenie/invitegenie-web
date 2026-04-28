import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../services/mockData";
import Icon from "../components/Icon";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="shrink-0 text-xl font-extrabold text-yellow-200 sm:text-2xl">
        {children}
      </h2>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-yellow-500/50 via-yellow-500/20 to-transparent sm:block" />
      <span className="hidden text-yellow-400 sm:block">✧</span>
    </div>
  );
}

function MenuItem({ icon, label, color = "text-purple-400", badge, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 border-b border-white/5 px-4 py-4 text-left last:border-b-0 transition hover:bg-white/[0.03] sm:px-5 ${
        danger ? "text-red-400" : "text-gray-200"
      }`}
    >
      <Icon name={icon} className={`text-[25px] ${danger ? "text-red-400" : color}`} />
      <span className="min-w-0 flex-1 text-sm font-medium sm:text-base">{label}</span>

      {badge && (
        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}

      {!danger && <Icon name="chevron_right" className="text-[22px] text-yellow-400/80" />}
    </button>
  );
}

function ToolCard({ icon, label, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative min-h-[112px] overflow-hidden rounded-2xl border border-yellow-500/10 bg-white/[0.03] p-4 text-center shadow-md transition hover:-translate-y-1 hover:border-purple-400/40 sm:min-h-[132px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-emerald-900/10" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-yellow-500/15 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
        <Icon name={icon} className={`text-[38px] sm:text-[46px] ${color}`} />
        <p className="text-sm font-medium text-gray-200 sm:text-base">{label}</p>
      </div>
    </button>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl bg-slate-900/40 px-2 py-4 text-center sm:bg-transparent xl:bg-slate-900/30">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${color}`}>
        <Icon name={icon} className="text-[24px]" />
      </div>
      <p className="text-xl font-bold text-gray-200 sm:text-2xl">{value}</p>
      <p className="text-[11px] text-gray-400 sm:text-sm">{label}</p>
    </div>
  );
}

function DashboardPanel({ title, count, children }) {
  const navigate = useNavigate();

  const getNavigationPath = () => {
    const routes = {
      "Today's Tasks": "/tasks",
      "Today's Meetings": "/meetings",
      "Projects Worked": "/events",
      "Upcoming Events": "/events",
      "Alerts": "/dashboard",
    };
    return routes[title] || "/dashboard";
  };

  return (
    <div className="min-w-0 rounded-3xl border border-white/5 bg-white/[0.03] p-4 shadow-md backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate font-bold text-gray-200">{title}</h3>
          {count && (
            <span className="rounded-full bg-purple-700/60 px-2 py-0.5 text-xs font-bold text-purple-100">
              {count}
            </span>
          )}
        </div>
        <button 
          onClick={() => navigate(getNavigationPath())}
          className="shrink-0 text-xs font-bold text-purple-400 hover:text-purple-300"
        >
          See All
        </button>
      </div>

      {children}
    </div>
  );
}

function DesktopSidebar() {
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
        <button 
          onClick={() => navigate("/settings")}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/5"
        >
          <Icon name="settings" />
          Settings
        </button>

        <button 
          onClick={() => navigate("/help")}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 hover:bg-white/5"
        >
          <Icon name="help" />
          Help Center
        </button>

        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to sign out?")) {
              localStorage.clear();
              window.location.href = "/";
            }
          }}
          className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 px-4 py-3 text-red-400 hover:bg-red-500/10"
        >
          <Icon name="logout" />
          Sign Out
        </button>

        <p className="px-3 pt-6 text-xs text-slate-500">
          InviteGenie v1.0.0
          <br />© 2025 All rights reserved
        </p>
      </div>
    </aside>
  );
}

function MobileHero({ name, email, tier, eventsHosted, totalGuests, points }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl sm:p-7 xl:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(126,34,206,0.35),transparent_36%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_30%)]" />
      <div className="absolute right-0 top-0 h-40 w-72 rounded-bl-full bg-purple-900/30 blur-2xl" />
      <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-50 sm:block">
        <div className="absolute right-10 top-10 h-[1px] w-80 rotate-[-18deg] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        <div className="absolute right-3 top-20 h-20 w-80 rounded-full border-t border-yellow-500/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
        <div className="relative shrink-0">
          <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-emerald-400 blur-md opacity-70" />

          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 p-[3px] sm:h-36 sm:w-36">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-4xl font-bold text-white">
              {name.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/60 bg-purple-500 text-white shadow-lg">
            <Icon name="photo_camera" className="text-[20px]" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <h1 className="break-words text-3xl font-extrabold text-yellow-200 sm:text-4xl">
              {name}
            </h1>
            <Icon name="verified" className="text-yellow-400" />
          </div>

          <p className="mt-3 inline-flex rounded-full bg-purple-700/60 px-4 py-1 text-sm font-bold text-purple-100">
            {tier}
          </p>

          <p className="mt-3 break-words text-sm text-slate-300 sm:text-base">{email}</p>
        </div>
      </div>

      <div className="relative z-10 mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0">
        <StatCard icon="calendar_month" value={eventsHosted} label="Events Created" color="text-purple-400" />
        <StatCard icon="groups" value={totalGuests.toLocaleString()} label="Total Guests" color="text-green-400" />
        <StatCard icon="trending_up" value="78%" label="Engagement" color="text-purple-400" />
        <StatCard icon="star" value={points.toLocaleString()} label="Points Earned" color="text-yellow-400" />
      </div>
    </section>
  );
}

function DesktopHeader({ name, tier }) {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 hidden items-center justify-between gap-6 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-xl backdrop-blur-xl xl:flex">
      <div className="flex min-w-[260px] max-w-md flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-400">
        <Icon name="search" />
        <span className="truncate text-sm">Search events, tasks, guests...</span>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button 
          onClick={() => navigate("/events/new")}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 text-sm font-bold hover:opacity-90"
        >
          + New Event
        </button>

        <button 
          onClick={() => navigate("/notifications")}
          className="relative rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10"
        >
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-fuchsia-500" />
          <Icon name="notifications" />
        </button>

        <div className="relative">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 font-bold text-white">
              {name.substring(0, 1)}
            </div>

            <div>
              <p className="text-sm font-bold text-white">{name}</p>
              <p className="text-xs text-slate-400">{tier}</p>
            </div>
          </div>

          <ProfileDropdown 
            isOpen={isProfileMenuOpen} 
            onClose={() => setIsProfileMenuOpen(false)} 
            user={{ name, tier }} 
          />
        </div>
      </div>
    </header>
  );
}

function DesktopProfileStrip({ name, email, tier, eventsHosted, totalGuests, points }) {
  return (
    <section className="hidden rounded-3xl border border-yellow-500/20 bg-slate-950/70 p-5 shadow-xl backdrop-blur-xl xl:block">
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 text-2xl font-bold">
            {name.substring(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-bold text-yellow-200">{name}</h1>
              <Icon name="verified" className="shrink-0 text-yellow-400" />
            </div>
            <p className="truncate text-sm text-slate-400">{email}</p>
            <p className="mt-1 inline-flex rounded-full bg-purple-700/60 px-3 py-0.5 text-xs font-bold text-purple-100">
              {tier}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-4 gap-3 2xl:w-[560px]">
          <StatCard icon="calendar_month" value={eventsHosted} label="Events" color="text-purple-400" />
          <StatCard icon="groups" value={totalGuests.toLocaleString()} label="Guests" color="text-green-400" />
          <StatCard icon="trending_up" value="78%" label="Engagement" color="text-purple-400" />
          <StatCard icon="star" value={points.toLocaleString()} label="Points" color="text-yellow-400" />
        </div>
      </div>
    </section>
  );
}

function UpgradeBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-slate-950/75 p-5 shadow-xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-emerald-900/20" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-yellow-400 shadow-lg shadow-purple-700/30 sm:h-16 sm:w-16">
            <Icon name="diamond" className="text-[32px] text-white" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-200">Upgrade to Pro</h3>
            <p className="text-sm text-slate-300">Unlock premium templates, AI tools & more</p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/payments")}
          className="rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 px-6 py-3 font-bold hover:opacity-90"
        >
          Upgrade Now
        </button>
      </div>
    </section>
  );
}

function TaskPanelContent() {
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-4">
        {[
          ["Send final payment reminder", "Emma & Liam’s Wedding"],
          ["Confirm seating plan updates", "Emma & Liam’s Wedding"],
          ["Review guest list updates", "Hope for All Charity Gala"],
        ].map(([task, event]) => (
          <div key={task} className="flex gap-3">
            <span className="mt-1 h-4 w-4 rounded-full border border-slate-500" />
            <div>
              <p className="text-sm font-medium text-white">{task}</p>
              <p className="text-xs text-purple-300">{event}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate("/tasks")}
        className="mt-6 text-sm font-semibold text-purple-400 hover:text-purple-300"
      >
        + Add Task
      </button>
    </>
  );
}

function MeetingPanelContent() {
  const navigate = useNavigate();

  return (
    <>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold">Seating Plan Approval Meeting</p>
          <p className="text-xs text-slate-400">10:00 AM – 10:30 AM</p>
          <p className="text-xs text-slate-400">Venue Coordinator – Sophia Reynolds</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Initial Planning Call for Brann’s Birthday Party</p>
          <p className="text-xs text-slate-400">10:45 AM – 11:15 AM</p>
          <p className="text-xs text-slate-400">Client – Brann Callahan</p>
        </div>
      </div>

      <button 
        onClick={() => navigate("/meetings")}
        className="mt-6 text-sm font-semibold text-purple-400 hover:text-purple-300"
      >
        + Schedule Meeting
      </button>
    </>
  );
}

function ProjectsWorkedContent() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-28 w-28 shrink-0 rounded-full bg-[conic-gradient(#8b5cf6_0_25%,#60a5fa_25%_55%,#22c55e_55%_75%,#f59e0b_75%_100%)]">
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-slate-950">
          <span className="text-2xl font-bold">4</span>
          <span className="text-xs text-slate-400">events</span>
        </div>
      </div>

      <div className="w-full space-y-2 text-xs text-slate-300">
        {[
          ["bg-purple-500", "Emma & Liam’s Wedding"],
          ["bg-blue-400", "Hope for All Charity Gala"],
          ["bg-green-500", "Clay’s Birthday Party"],
          ["bg-orange-400", "Brann’s Birthday Party"],
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingEventsContent() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Emma & Liam’s Wedding", "3 days left", "83%", "from-purple-900/80 to-blue-500/30"],
        ["Hope for All Charity Gala", "12 days left", "67%", "from-blue-900/70 to-cyan-400/30"],
        ["Clay’s Birthday Party", "18 days left", "48%", "from-pink-900/70 to-fuchsia-400/30"],
      ].map(([title, days, progress, gradient]) => (
        <div key={title} className={`rounded-2xl bg-gradient-to-br ${gradient} p-4`}>
          <div className="mb-5 flex justify-between">
            <div className="flex -space-x-2">
              <div className="h-9 w-9 rounded-full bg-slate-300" />
              <div className="h-9 w-9 rounded-full bg-slate-500" />
            </div>

            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{days}</span>
          </div>

          <p className="font-semibold">{title}</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-white/20">
              <div className="h-1.5 rounded-full bg-purple-300" style={{ width: progress }} />
            </div>
            <span className="text-sm">{progress}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsContent() {
  return (
    <div className="divide-y divide-white/10">
      {[
        ["check_circle", "text-green-400", "Seating plan needs approval for", "Hope for All Charity Gala"],
        ["error", "text-red-400", "Mia Thompson’s payment was declined for", "Emma & Liam’s Wedding"],
        ["error", "text-red-400", "DJ not confirmed", "Clay’s Birthday Party"],
        ["error", "text-red-400", "Photo vendor reply pending", "Hope for All Charity Gala"],
      ].map(([icon, color, text, event]) => (
        <div key={`${text}-${event}`} className="flex gap-3 py-4">
          <Icon name={icon} className={`${color} text-[22px]`} />
          <p className="text-sm text-slate-300">
            {text} <span className="font-semibold text-blue-400">{event}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function RecentTemplates() {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Recent Templates</h3>
        <button 
          onClick={() => navigate("/templates")}
          className="text-xs font-bold text-purple-400 hover:text-purple-300"
        >
          See All
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {[
          ["Finance", "Event Budget Tracker", "Track and manage expenses across key categories."],
          ["Guest Management", "Guest Seating Plan", "Plan guest seating with drag & drop layout."],
          ["Vendors", "Vendor Onboarding Checklist", "Step-by-step tasks to onboard new vendors efficiently."],
          ["Guest Management", "RSVP Tracker", "Track guest responses, meal choices & special notes."],
        ].map(([tag, title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-purple-600/20 px-2 py-1 text-xs text-purple-200">
                {tag}
              </span>

              <button className="rounded-lg bg-purple-500/20 p-1 text-purple-200">
                <Icon name="north_east" className="text-[18px]" />
              </button>
            </div>

            <div className="mb-4 h-28 rounded-xl bg-gradient-to-br from-purple-900/60 to-slate-800/80" />
            <h4 className="font-bold">{title}</h4>
            <p className="mt-2 text-sm text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolsSection() {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <SectionTitle>My Tools</SectionTitle>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
        <ToolCard 
          icon="shopping_bag" 
          label="Marketplace" 
          color="text-purple-400" 
          onClick={() => navigate("/marketplace")}
        />
        <ToolCard 
          icon="sync" 
          label="Convert Points" 
          color="text-green-400"
          onClick={() => navigate("/points")} 
        />
        <ToolCard 
          icon="magic_button" 
          label="Make a Wish" 
          color="text-yellow-400"
          onClick={() => navigate("/wish")} 
        />
        <ToolCard 
          icon="auto_fix_high" 
          label="Summon a Genie" 
          color="text-purple-400"
          onClick={() => navigate("/genie")} 
        />
      </div>
    </section>
  );
}

function AccountSection() {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <SectionTitle>My Account</SectionTitle>

      <div className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-slate-950/70 backdrop-blur-xl">
        <MenuItem icon="person" label="Profile Information" color="text-purple-400" onClick={() => navigate("/profile")} />
        <MenuItem icon="workspace_premium" label="Subscription & Billing" color="text-yellow-400" onClick={() => navigate("/payments")} />
        <MenuItem icon="credit_card" label="Payment Methods" color="text-green-400" onClick={() => navigate("/payments")} />
        <MenuItem icon="dashboard_customize" label="My Templates" color="text-purple-400" onClick={() => navigate("/templates")} />
        <MenuItem icon="calendar_month" label="Calendar" color="text-green-400" onClick={() => navigate("/calendar")} />
        <MenuItem icon="inbox" label="Inbox" badge="8" color="text-purple-400" onClick={() => navigate("/inbox")} />
        <MenuItem icon="payments" label="Payments" color="text-yellow-400" onClick={() => navigate("/payments")} />
        <MenuItem icon="bar_chart" label="Reports" color="text-purple-400" onClick={() => navigate("/reports")} />
        <MenuItem icon="hub" label="Integrations" color="text-green-400" onClick={() => navigate("/integrations")} />
        <MenuItem icon="notifications" label="Notification Settings" color="text-purple-400" onClick={() => navigate("/notifications")} />
        <MenuItem icon="settings" label="Settings" color="text-slate-300" onClick={() => navigate("/settings")} />
      </div>
    </section>
  );
}

function SupportSection() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      // Clear local storage if needed
      localStorage.clear();
      // Redirect to home or login page
      window.location.href = "/";
    }
  };

  return (
    <section className="space-y-4">
      <SectionTitle>Support & Feedback</SectionTitle>

      <div className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-slate-950/70 backdrop-blur-xl">
        <MenuItem icon="help" label="Help Center" color="text-green-400" onClick={() => navigate("/help")} />
        <MenuItem icon="support_agent" label="Contact Support" color="text-purple-400" onClick={() => navigate("/support")} />
        <MenuItem icon="logout" label="Sign Out" danger onClick={handleSignOut} />
      </div>
    </section>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserProfile());
  }, []);

  if (!user) return null;

  const name = user.name || "Maya Brooks";
  const email = user.email || "maya.brooks@email.com";
  const tier = user.tier || "Event Manager";
  const eventsHosted = user.eventsHosted || 24;
  const totalGuests = user.totalGuests || 1248;
  const points = user.points || 1560;

  return (
      <div className="space-y-5">
            <MobileHero
              name={name}
              email={email}
              tier={tier}
              eventsHosted={eventsHosted}
              totalGuests={totalGuests}
              points={points}
            />

            <DesktopProfileStrip
              name={name}
              email={email}
              tier={tier}
              eventsHosted={eventsHosted}
              totalGuests={totalGuests}
              points={points}
            />

            <UpgradeBanner />

            <div className="hidden space-y-5 xl:block">
              <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-[1fr_1fr_0.9fr]">
                <DashboardPanel title="Today’s Tasks" count="12">
                  <TaskPanelContent />
                </DashboardPanel>

                <DashboardPanel title="Today’s Meetings" count="5">
                  <MeetingPanelContent />
                </DashboardPanel>

                <div className="xl:col-span-2 2xl:col-span-1">
                  <DashboardPanel title="Projects Worked">
                    <ProjectsWorkedContent />
                  </DashboardPanel>
                </div>
              </section>

              <section className="grid gap-5 2xl:grid-cols-[1.4fr_0.9fr]">
                <DashboardPanel title="Upcoming Events">
                  <UpcomingEventsContent />
                </DashboardPanel>

                <DashboardPanel title="Alerts">
                  <AlertsContent />
                </DashboardPanel>
              </section>

              <RecentTemplates />

              <div className="grid gap-5 2xl:grid-cols-[1fr_1fr]">
                <ToolsSection />
                <SupportSection />
              </div>

              <AccountSection />
            </div>

            <div className="space-y-6 xl:hidden">
              <section className="grid gap-5 lg:grid-cols-3">
                <DashboardPanel title="Today’s Tasks" count="12">
                  <TaskPanelContent />
                </DashboardPanel>

                <DashboardPanel title="Today’s Meetings" count="5">
                  <MeetingPanelContent />
                </DashboardPanel>

                <DashboardPanel title="Projects Worked">
                  <ProjectsWorkedContent />
                </DashboardPanel>
              </section>

              <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                <DashboardPanel title="Upcoming Events">
                  <UpcomingEventsContent />
                </DashboardPanel>

                <DashboardPanel title="Alerts">
                  <AlertsContent />
                </DashboardPanel>
              </section>

              <RecentTemplates />
              <ToolsSection />
              <AccountSection />
              <SupportSection />
            </div>
      </div>
  );
}