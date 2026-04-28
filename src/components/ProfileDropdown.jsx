import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ isOpen, onClose, user }) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [betaEnabled, setBetaEnabled] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-4 w-72 overflow-hidden rounded-[2rem] bg-slate-900/95 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[9999] text-white border border-white/10"
    >
      {/* Top User Block */}
      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 font-bold text-white">
          {user?.name?.substring(0, 1) || "M"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-white">{user?.name || "Maya Brooks"}</p>
          <p className="truncate text-[11px] text-slate-400">Event Manager at InviteGenie</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          onClick={() => { navigate("/profile"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold transition hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">person</span>
          My Account
        </button>
        <button
          onClick={() => { navigate("/settings"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold transition hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
          Company Settings
        </button>
        <button
          onClick={() => { navigate("/payments"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold transition hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">workspace_premium</span>
          Upgrade to Pro
        </button>

        {/* Beta Features */}
        <div className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-semibold">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-slate-400">science</span>
            Beta Features
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-600">New</span>
          </div>
          <button
            onClick={() => setBetaEnabled(!betaEnabled)}
            className={`relative h-5 w-10 rounded-full transition-colors ${betaEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${betaEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

        <button
          onClick={() => { navigate("/whats-new"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold transition hover:bg-slate-50"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">campaign</span>
          What's New
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Log out
        </button>
      </div>

      {/* Bottom Promo Card */}
      <div className="mt-6 rounded-2xl bg-purple-50 p-4 border border-purple-100">
        <div className="mb-2 flex items-center gap-2 text-purple-600">
          <span className="material-symbols-outlined text-[18px]">notifications_active</span>
          <p className="text-[10px] font-bold uppercase tracking-widest">Pro Insight</p>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-600">
          Get everything you need to run your events like a pro
        </p>
        <button
          onClick={() => { navigate("/payments"); onClose(); }}
          className="text-[11px] font-bold text-purple-600 hover:text-purple-700 underline underline-offset-2"
        >
          Subscribe Now →
        </button>
      </div>
    </div>
  );
}