import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { USER_ROLES } from "../auth/roles";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || (isSignUp && !formData.name)) return alert("Please fill in all required fields");
    
    // Pass credentials to auth logic
    // Role is assigned internally based on email or defaults to BASIC_USER
    login({ ...formData, role: USER_ROLES.BASIC_USER });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center p-6 selection:bg-violet-500/30">
      <div className="absolute h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px] -top-20 -left-20" />
      <div className="absolute h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px] -bottom-20 -right-20" />
      
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-900/40">
            <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            {isSignUp ? "Join the Coven" : "Welcome to Genie"}
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            {isSignUp ? "Create your account to start conjuring." : "Step into the realm of magical events."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              placeholder="Ngalle Marie"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              placeholder="marie@example.cm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Password</label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>


          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isSignUp ? "Create Account" : "Enter the Portal"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-400 hover:text-violet-400 transition-colors uppercase tracking-widest"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}