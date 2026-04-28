import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import ProfileDropdown from "./ProfileDropdown";

export default function Header({ name, tier }) {
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
              {name ? name.substring(0, 1).toUpperCase() : "U"}
            </div>

            <div>
              <p className="text-sm font-bold text-white">{name || "User"}</p>
              <p className="text-xs text-slate-400">{tier || "Member"}</p>
            </div>
          </div>

          <ProfileDropdown isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)} user={{ name, tier }} />
        </div>
      </div>
    </header>
  );
}