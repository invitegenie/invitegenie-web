import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Icon from "./Icon";
import { useSearch } from "../contexts/SearchContext";

export default function TopBar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  // currentUser is guaranteed by AuthContext to be DEMO_USER if not logged in
  const user = currentUser;

  return (
    <header className="rounded-2xl border border-[#2A3342] bg-[#111827] p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6 min-w-0">
          <div className="hidden lg:flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <Icon name="auto_awesome" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#A78BFA]">
              Invite Genie • {user.plan || "Pro Account"}
            </p>
            <h1 className="mt-2 truncate text-2xl font-black tracking-tight text-white sm:text-3xl">
              Welcome, {user.name || user.full_name || "Invite Genie Pro"}
            </h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Manage events, bookings, tickets, and revenue from one place.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[340px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#6B7280]">
              search
            </span>
            <input
              type="text"
              placeholder="Search bookings, events, vouchers..."
              className="w-full rounded-xl border border-[#2A3342] bg-[#0B0F19] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#8B5CF6]/50"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => navigate("/marketplace/new")}
              className="rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 p-2.5 text-[#A78BFA] transition hover:bg-[#8B5CF6]/20"
              title="Create Listing"
            >
              <Icon name="add_business" />
            </button>

            <button
              onClick={() => navigate("/events/new")}
              className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] p-2.5 text-white transition hover:opacity-90"
              title="Create Event"
            >
              <Icon name="add_circle" />
            </button>

            <button
              onClick={() => navigate("/notifications")}
              className="rounded-xl border border-[#2A3342] bg-[#0B0F19] p-2.5 text-[#9CA3AF] transition hover:text-[#A78BFA]"
            >
              <Icon name="notifications" />
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="rounded-xl border border-[#2A3342] bg-[#0B0F19] p-2.5 text-[#9CA3AF] transition hover:text-[#A78BFA]"
            >
              <Icon name="settings" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-[#2A3342] bg-[#0B0F19] p-2.5 text-[#9CA3AF] transition hover:text-[#A78BFA]"
            >
              <Icon name="person" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}