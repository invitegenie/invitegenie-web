import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export default function EmailVerificationNotice({ user }) {
  const navigate = useNavigate();
  if (!user || user.email_verified) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-full text-amber-400 shrink-0"><Icon name="mark_email_unread" /></div>
        <div>
          <p className="text-sm font-bold text-amber-400">Please verify your email address</p>
          <p className="text-xs text-amber-200/70">Full marketplace actions and payouts are disabled until verification is complete.</p>
        </div>
      </div>
      <button onClick={() => navigate("/verify-email", { state: { email: user.email } })} className="shrink-0 px-4 py-2 bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors">
        Verify Now
      </button>
    </div>
  );
}