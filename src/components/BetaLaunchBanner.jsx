import React, { useState, useEffect } from "react";

export default function BetaLaunchBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("invitegenie_beta_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("invitegenie_beta_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-[9999] flex w-full items-center justify-between gap-4 bg-gradient-to-r from-[#0B0F19] via-[#111827] to-[#0B0F19] border-b border-violet-500/20 px-4 py-3 text-white shadow-2xl sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.05),transparent)] animate-pulse pointer-events-none" />
      <div className="relative flex flex-1 flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 text-center sm:text-left">
        <span className="flex rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
          Beta
        </span>
        <p className="text-xs sm:text-sm font-medium text-slate-300">
          <strong className="text-white">InviteGenie Beta</strong> — AI event planning, vendor booking, and manual payment verification are live.
        </p>
      </div>
      <button
        onClick={dismiss}
        className="relative flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        title="Dismiss"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}