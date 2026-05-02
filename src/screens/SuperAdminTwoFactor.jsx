import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

export default function SuperAdminTwoFactor() {
  // TEMPORARY: Auto-filled for development
  const [code, setCode] = useState("999000");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    
    // DEMO ONLY: Updated verification code
    if (code === "999000") {
      sessionStorage.setItem("super_admin_2fa_verified", "true");
      navigate("/admin/super");
    } else {
      setError("Verification failed. Please enter the correct security code.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col lg:flex-row selection:bg-violet-500/30">
      {/* Left: Security Details Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0F19] border-r border-white/5 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-emerald-500/5" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase">Identity<br/>Security.</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
          </div>
          
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Multifactor authentication is mandatory for administrative sessions. Your security resonator ensures the integrity of platform governance.
          </p>

          <div className="space-y-6 pt-10">
             <div className="flex items-center gap-4 text-slate-500">
                <Icon name="info" className="text-sm" />
                <p className="text-[10px] font-black uppercase tracking-widest">Two-step verification is enforced on all management accounts.</p>
             </div>
             <div className="flex items-center gap-4 text-slate-500">
                <Icon name="history" className="text-sm" />
                <p className="text-[10px] font-black uppercase tracking-widest">All administrative access is logged for auditing purposes.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Security Verification Side */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px] -top-20 -left-20" />
        
        <div className="w-full max-w-sm space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-900/40 mx-auto lg:mx-0">
              <Icon name="vibration" className="text-white text-3xl animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Identity Security</h1>
            <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">Verification Required for God Mode Tier</p>
          </div>

          <form onSubmit={handleVerify} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] shadow-2xl space-y-6">
            <div className="space-y-4 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Input Security Code</p>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="999000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-2xl font-black text-center text-white tracking-[0.4em] outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {error && <p className="text-rose-400 text-[10px] font-black uppercase tracking-tighter text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-white text-[#0B0F19] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
            >
              Verify Session
            </button>
          </form>
          
          <div className="text-center">
            <button onClick={() => navigate("/admin/login")} className="text-[10px] text-slate-600 font-bold uppercase hover:text-slate-400 transition-colors tracking-widest">Return to Portal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
