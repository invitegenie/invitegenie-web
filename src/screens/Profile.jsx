﻿import { useState, useEffect, useCallback, useRef } from "react";
/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getUserProfile } from "../services/mockData";
import Icon from "../components/Icon";
import FeatureBadge from "../components/FeatureBadge";
import { useSearch } from "../contexts/SearchContext";
import { getAccountType, getEffectiveCapabilities, getPlanLimits } from "../services/accountCapabilities";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="shrink-0 text-xl font-extrabold text-yellow-200 sm:text-2xl">
        {children}
      </h2>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-yellow-500/50 via-yellow-500/20 to-transparent sm:block" />
      <span className="hidden text-yellow-400 sm:block">âœ§</span>
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
    <aside className="hidden min-w-0 rounded-3xl border border-white/[0.04] bg-[#141218]/80 p-4 shadow-md backdrop-blur-2xl lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col lg:overflow-y-auto">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-400 shadow-sm" />
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold font-heading">InviteGenie</h2>
          <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-violet-300 border border-violet-500/30">Beta</span>
        </div>
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
          <br />Â© 2025 All rights reserved
        </p>
      </div>
    </aside>
  );
}

function MobileHero({ name, email, tier, eventsHosted, totalGuests, points }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl sm:p-7 lg:hidden">
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

function ProfileDropdown({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="p-3 border-b border-white/5">
        <p className="text-xs font-bold text-white truncate">{user.name}</p>
        <p className="text-[10px] text-slate-500 uppercase font-black">{user.tier}</p>
      </div>
      <button onClick={() => { navigate("/my-account"); onClose(); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl mt-1">My Account</button>
      <button onClick={() => { navigate("/settings"); onClose(); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-xl">Settings</button>
      <button onClick={() => { navigate("/marketplace/new"); onClose(); }} className="w-full text-left px-3 py-2 text-xs text-violet-300 hover:bg-violet-500/10 rounded-xl">Create Listing</button>
      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl">Sign Out</button>
    </div>
  );
}

function DesktopHeader({ name, tier, showCreateListing }) {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="relative z-50 hidden items-center justify-between gap-6 rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 shadow-xl backdrop-blur-xl lg:flex">
      <div className="flex min-w-[260px] max-w-md flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-1 text-slate-400">
        <Icon name="search" className="text-sm" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search everything..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 py-2"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {showCreateListing ? (
          <button
            onClick={() => navigate("/marketplace/new")}
            className="rounded-2xl border border-purple-500/40 bg-purple-500/10 px-5 py-3 text-sm font-bold text-purple-100 hover:bg-purple-500/20 transition-all"
          >
            Create Listing
          </button>
        ) : null}
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
    <section className="hidden rounded-3xl border border-yellow-500/20 bg-slate-950/70 p-5 shadow-xl backdrop-blur-xl lg:block">
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

function CapabilitySummary({ user }) {
  const navigate = useNavigate();
  const accountType = getAccountType(user || {});
  const capabilities = getEffectiveCapabilities(user || {});
  const limits = getPlanLimits(user || {});

  return (
    <section className="rounded-3xl border border-amber-300/15 bg-slate-950/70 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Account System</p>
          <h3 className="mt-2 text-xl font-black text-white">{accountType} account with capability modes</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Vendor, planner, tasker, and check-in access now live as toggles on one account.
          </p>
        </div>
        <button onClick={() => navigate("/settings")} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">
          Manage Modes
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <FeatureBadge label={capabilities.canSellServices ? "Vendor Mode" : "Vendor Off"} active={capabilities.canSellServices} tone="amber" />
        <FeatureBadge label={capabilities.canHostEvents ? "Planner Tools" : "Planner Off"} active={capabilities.canHostEvents} />
        <FeatureBadge label={capabilities.canBeTasker ? "Tasker Available" : "Tasker Off"} active={capabilities.canBeTasker} tone="emerald" />
        <FeatureBadge label={capabilities.canRunCheckIn ? "Check-In Ready" : "Check-In Off"} active={capabilities.canRunCheckIn} />
        <FeatureBadge label={limits.unlimitedEverything ? "Unlimited guests" : `${limits.maxGuestsPerEvent.toLocaleString()} guests/event`} tone="amber" />
      </div>
    </section>
  );
}

function TaskPanelContent({ onTaskUpdated }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeoutRefs = useRef({}); // { taskId: timeoutId }

  const fetchTasks = useCallback(async () => {
    if (!currentUser) return;
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("completed", false)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTasks();
    // Cleanup timeouts on unmount
    return () => {
      for (const taskId in timeoutRefs.current) {
        clearTimeout(timeoutRefs.current[taskId]);
      }
    };
  }, [currentUser]);

  const handleToggleComplete = async (task) => {
    const taskId = task.id;
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: true })
        .eq("id", taskId);

      if (error) throw error;
      
      // Optimistically remove from UI
      setTasks(prev => prev.filter(t => t.id !== taskId));

      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      alert("Error updating task: " + err.message);
    }
  };

  if (loading) return (
    <div className="space-y-4 py-2 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-3/4"></div>
      <div className="h-3 bg-white/5 rounded w-1/2"></div>
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="group flex items-start gap-3">
              <button 
                onClick={() => handleToggleComplete(task)}
                className="mt-1 h-4 w-4 rounded-full border border-slate-500 shrink-0 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all flex items-center justify-center group/btn"
                title="Mark as complete"
              >
                <Icon name="check" className="text-[10px] text-emerald-400 opacity-0 group-hover/btn:opacity-100" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white line-clamp-1">{task.title}</p>
                <p className="text-xs text-purple-300 line-clamp-1">{task.event_name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-xs text-slate-500 italic">All tasks completed! âœ¨</p>
        )}
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

function ScheduleMeetingModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    contact_name: ""
  });
  const [timeError, setTimeError] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#141218] border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-6 font-heading tracking-tight uppercase text-center">Schedule Meeting</h3>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          setTimeError(""); // Clear previous errors

          const start = new Date(formData.start_time);
          const end = new Date(formData.end_time);

          if (end <= start) {
            setTimeError("End time must be after start time.");
            return;
          }

          onSave(formData); 
        }} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Meeting Purpose</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Seating Plan Review" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500 transition-all" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Starts At</label>
              <input 
                type="datetime-local" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" 
                value={formData.start_time} 
                onChange={e => setFormData({...formData, start_time: e.target.value})} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Ends At</label>
              <input 
                type="datetime-local" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" 
                value={formData.end_time} 
                onChange={e => setFormData({...formData, end_time: e.target.value})} 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Guest / Contact</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Venue Coordinator" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500 transition-all" 
              value={formData.contact_name} 
              onChange={e => setFormData({...formData, contact_name: e.target.value})} 
            />
          </div>
          {timeError && (
            <p className="text-rose-400 text-xs text-center">{timeError}</p>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:opacity-90 active:scale-95 transition-all">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MeetingPanelContent({ onMeetingUpdated }) {
  const { currentUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMeetings = useCallback(async () => {
    if (!currentUser) return;
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", currentUser.id)
        .gte("start_time", `${today}T00:00:00`)
        .lte("start_time", `${today}T23:59:59`)
        .order("start_time", { ascending: true })
        .limit(3);

      if (error) throw error;
      setMeetings(data || []);
    } catch (err) {
      console.error("Error fetching meetings:", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meetingId);

      if (error) throw error;
      
      fetchMeetings();
      if (onMeetingUpdated) onMeetingUpdated();
    } catch (err) {
      alert("Error deleting meeting: " + err.message);
    }
  };

  const handleSaveMeeting = async (formData) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("meetings")
        .insert([{ ...formData, user_id: currentUser.id }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchMeetings();
      if (onMeetingUpdated) onMeetingUpdated();
    } catch (err) {
      alert("Error saving meeting: " + err.message);
    }
  };

  if (loading) return (
    <div className="space-y-4 py-2 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-3/4"></div>
      <div className="h-3 bg-white/5 rounded w-1/2"></div>
    </div>
  );

  return (
    <>
      <div className="space-y-5">
        {meetings.length > 0 ? meetings.map((meeting) => (
          <div key={meeting.id} className="group flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{meeting.title}</p>
              <p className="text-xs text-slate-400">
                {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} â€“ {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-purple-300 truncate">{meeting.contact_name}</p>
            </div>
            <button 
              onClick={() => handleDeleteMeeting(meeting.id)}
              className="mt-0.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all p-1"
              title="Delete meeting"
            >
              <Icon name="delete" className="text-lg" />
            </button>
          </div>
        )) : (
          <p className="py-4 text-center text-xs text-slate-500 italic">No meetings scheduled for today.</p>
        )}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-6 text-sm font-semibold text-purple-400 hover:text-purple-300"
      >
        + Schedule Meeting
      </button>

      <ScheduleMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMeeting} 
      />
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
          ["bg-purple-500", "Emma & Liamâ€™s Wedding"],
          ["bg-blue-400", "Hope for All Charity Gala"],
          ["bg-green-500", "Clayâ€™s Birthday Party"],
          ["bg-orange-400", "Brannâ€™s Birthday Party"],
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
        ["Emma & Liamâ€™s Wedding", "3 days left", "83%", "from-purple-900/80 to-blue-500/30"],
        ["Hope for All Charity Gala", "12 days left", "67%", "from-blue-900/70 to-cyan-400/30"],
        ["Clayâ€™s Birthday Party", "18 days left", "48%", "from-pink-900/70 to-fuchsia-400/30"],
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
        ["error", "text-red-400", "Mia Thompsonâ€™s payment was declined for", "Emma & Liamâ€™s Wedding"],
        ["error", "text-red-400", "DJ not confirmed", "Clayâ€™s Birthday Party"],
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-5">
        <ToolCard 
          icon="shopping_bag" 
          label="Marketplace" 
          color="text-purple-400" 
          onClick={() => navigate("/marketplace")}
        />
        <ToolCard 
          icon="add_business" 
          label="Create Listing" 
          color="text-emerald-400" 
          onClick={() => navigate("/marketplace/new")}
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

function AccountSection({ role, showCreateListing }) {
  const navigate = useNavigate();
  const isVendor = showCreateListing || ["PRO", "BUSINESS", "ENTERPRISE"].includes(role);

  return (
    <section className="space-y-4">
      <SectionTitle>My Account</SectionTitle>

      <div className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-slate-950/70 backdrop-blur-xl">
        <MenuItem icon="person" label="Profile Information" color="text-purple-400" onClick={() => navigate("/profile")} />
        <MenuItem icon="account_balance_wallet" label="My Wallet" color="text-emerald-400" onClick={() => navigate("/wallet")} />
        {isVendor ? (
          <>
            <MenuItem icon="account_balance_wallet" label="Vendor Wallet" color="text-emerald-400" onClick={() => navigate("/vendor-wallet")} />
            <MenuItem icon="cases" label="Vendor Portfolio" color="text-purple-400" onClick={() => navigate("/vendor-portfolio")} />
            <MenuItem icon="insights" label="Vendor Insights" color="text-yellow-400" onClick={() => navigate("/vendor-insights")} />
            <MenuItem icon="auto_awesome" label="Vendor Genie" color="text-purple-400" onClick={() => navigate("/vendor-genie")} />
          </>
        ) : null}
        <MenuItem icon="inventory_2" label="My Listings" color="text-emerald-400" onClick={() => navigate("/marketplace/my-listings")} />
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
      // DEMO ONLY: Clear temporary admin session
      localStorage.removeItem("ig_demo_admin_user");
      sessionStorage.removeItem("super_admin_2fa_verified");

      // Clear local storage if needed
      localStorage.clear();
      
      // Redirect to admin login if signing out from administrative area
      const isAdminArea = window.location.pathname.startsWith("/admin");
      window.location.href = isAdminArea ? "/admin/login" : "/";
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
  const { currentUser, role, profile } = useAuth();
  const showCreateListing = true; // Enable Marketplace creation for all roles
  const [user, setUser] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);

  const getTaskCount = async () => {
    if (!currentUser || !supabase) return;
    const { count, error } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id)
      .eq("completed", false);
    
    if (!error) setTaskCount(count || 0);
  };

  const getMeetingCount = async () => {
    if (!currentUser || !supabase) return;
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from("meetings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id)
      .gte("start_time", `${today}T00:00:00`)
      .lte("start_time", `${today}T23:59:59`);
    
    if (!error) setMeetingCount(count || 0);
  };

  useEffect(() => {
    setUser(getUserProfile());
    getTaskCount();
    getMeetingCount();
  }, [currentUser]);

  if (!user) return null;

  const name = currentUser?.full_name || currentUser?.name || user.name || "Maya Brooks";
  const email = currentUser?.email || user.email || "maya.brooks@email.com";
  const tier = user.tier || "Event Manager";
  const eventsHosted = user.eventsHosted || 24;
  const totalGuests = user.totalGuests || 1248;
  const points = user.points || 1560;

  return (
    <div className="flex min-h-screen bg-[#0f0e13] p-4 gap-6 font-sans">
      <DesktopSidebar />
      
      <div className="flex-1 space-y-6 min-w-0">
            <DesktopHeader name={name} tier={tier} showCreateListing={showCreateListing} />
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
            <CapabilitySummary user={currentUser || profile} />

            <div className="hidden space-y-6 lg:block">
              <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-[1fr_1fr_0.9fr]">
                <DashboardPanel title="Todayâ€™s Tasks" count={taskCount > 0 ? taskCount : null}>
                  <TaskPanelContent onTaskUpdated={getTaskCount} />
                </DashboardPanel>

                <DashboardPanel title="Todayâ€™s Meetings" count={meetingCount > 0 ? meetingCount : null}>
                  <MeetingPanelContent onMeetingUpdated={getMeetingCount} />
                </DashboardPanel>

                <div className="xl:col-span-2 2xl:col-span-1">
                  <DashboardPanel title="Projects Worked">
                    <ProjectsWorkedContent />
                  </DashboardPanel>
                </div>
              </section>

              <section className="grid gap-6 2xl:grid-cols-[1.4fr_0.9fr]">
                <DashboardPanel title="Upcoming Events">
                  <UpcomingEventsContent />
                </DashboardPanel>

                <DashboardPanel title="Alerts">
                  <AlertsContent />
                </DashboardPanel>
              </section>

              <RecentTemplates />

              <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
                <ToolsSection showCreateListing={showCreateListing} />
                <SupportSection />
              </div>

              <AccountSection showCreateListing={showCreateListing} />
            </div>

            <div className="space-y-6 lg:hidden">
              <section className="grid gap-5 lg:grid-cols-3">
                <DashboardPanel title="Todayâ€™s Tasks" count={taskCount > 0 ? taskCount : null}>
                  <TaskPanelContent onTaskUpdated={getTaskCount} />
                </DashboardPanel>

                <DashboardPanel title="Todayâ€™s Meetings" count={meetingCount > 0 ? meetingCount : null}>
                  <MeetingPanelContent onMeetingUpdated={getMeetingCount} />
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
              <ToolsSection showCreateListing={showCreateListing} />
              <AccountSection role={role} profile={profile} showCreateListing={showCreateListing} />
              <SupportSection />
            </div>
        </div>
      </div>
  );
}
