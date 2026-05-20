﻿﻿﻿import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Icon from "../components/Icon";
import { USER_ROLES } from "../services/roles";

export default function AdminLogin() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = formData.email.trim().toLowerCase();

    try {
      const result = await login(cleanEmail, formData.password, { portal: "admin" });
      if (result.role === USER_ROLES.SUPER_ADMIN) {
        navigate("/admin/2fa");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Invalid administrative credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col lg:flex-row-reverse selection:bg-slate-500/30">
      {/* Left: Administrative Auth */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px] -top-20 -left-20" />
        
        <div className="w-full max-w-sm space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/40 mx-auto lg:mx-0">
              <Icon name="admin_panel_settings" className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Admin Portal</h1>
            <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Administrator ID</label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Security Key</label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && <p className="text-rose-400 text-[10px] font-black uppercase tracking-tighter text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:opacity-90 transition-all active:scale-95"
            >
              Authenticate Session
            </button>
          </form>
          
          <div className="text-center">
             <button onClick={() => navigate("/login")} className="text-[10px] text-slate-600 font-bold uppercase hover:text-slate-400 transition-colors">Return to User Portal</button>
          </div>
        </div>
      </div>

      {/* Right: Administrative Console Info */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0F19] border-r border-white/5 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-amber-500/5" />
        <div className="relative z-10 space-y-8">

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase">Governance<br/>Console.</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] rounded-full" />
          </div>
          
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Secure access to the centralized management console. Monitor system health, moderate content, and manage platform financials.
          </p>

          <div className="space-y-6 pt-10">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#8B5CF6]">
                  <Icon name="security" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Centralized Authority</p>
                  <p className="text-slate-500 text-xs mt-1">Granular control over user roles, permissions, and account status.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#22C55E]">
                  <Icon name="analytics" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Real-time Auditing</p>
                  <p className="text-slate-500 text-xs mt-1">Comprehensive tracking of marketplace flow and administrative activity.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
