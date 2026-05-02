import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Engine from "../auth/coreEngine";

import { canCreateMarketplaceListing } from "../services/roles";
export default function ProfileDropdown({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    Engine.logoutUser();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-4 w-72 origin-top-right rounded-3xl border border-[#2A3342] bg-[#111827] p-4 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
    >
      {/* Profile Info */}
      <div className="flex items-center gap-3 p-2 mb-4 border-b border-[#2A3342] pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] font-bold text-white">
          {user?.name?.substring(0, 1) || "M"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-white">{user?.name || "Maya Brooks"}</p>
          <p className="truncate text-[11px] text-[#9CA3AF] uppercase font-black tracking-widest">{user?.tier || 'Member'}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          onClick={() => { navigate("/my-account"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#1F2937]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#6B7280]">person</span>
          My Account
        </button>
        <button
          onClick={() => { navigate("/settings"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#1F2937]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#6B7280]">settings</span>
          Company Settings
        </button>
        <button
          onClick={() => { navigate("/marketplace"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#1F2937]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#6B7280]">storefront</span>
          Service Marketplace
        </button>
        <button
          onClick={() => { navigate("/marketplace/new"); onClose(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#1F2937]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#6B7280]">add_business</span>
          Create Listing
        </button>
        <div className="h-px bg-[#2A3342] my-2" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Log out
        </button>
      </div>
    </div>
  );
}