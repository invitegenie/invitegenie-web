import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { normalizePhone } from "./authService";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState("email"); // "email" or "whatsapp"
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", whatsappOptIn: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, signup, sendWhatsAppOtp } = useAuth();
  const navigate = useNavigate();

  // To handle the supabase directly for reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Please enter your email address to reset your password");
    setIsProcessing(true);
    try {
      const { supabase } = await import("../lib/supabaseClient");
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin + '/login',
        });
        if (error) throw error;
        setResetSent(true);
      } else {
        alert("Password reset is not available in demo mode.");
      }
    } catch (error) {
      alert(error.message || "Failed to send reset link.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();

    const cleanPhone = normalizePhone(formData.phone);
    if (!cleanPhone || (isSignUp && !formData.name)) {
      return alert("Please enter a valid phone number with country code and fill in all required fields.");
    }

    setIsProcessing(true);
    try {
      await sendWhatsAppOtp(cleanPhone, formData.name || "User");
      sessionStorage.setItem("invitegenie_whatsapp_phone", cleanPhone);
      sessionStorage.setItem("invitegenie_whatsapp_fullName", formData.name || "User");
      navigate("/verify-phone", { state: { phone: cleanPhone, fullName: formData.name }, replace: true });
    } catch (error) {
      alert(error.message || "Failed to send WhatsApp verification code. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || (isSignUp && !formData.name)) return alert("Please fill in all required fields");
    
    setIsProcessing(true);
    try {
      if (isSignUp) {
        await signup(cleanEmail, formData.password, formData.name);
        navigate("/verify-email", { state: { email: cleanEmail }, replace: true });
      } else {
        await login(cleanEmail, formData.password, { portal: "user" });
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      alert(error.message || "The portal denied your entry. Check your credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = authMethod === "whatsapp" ? handleWhatsAppSubmit : handleEmailSubmit;

  return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col lg:flex-row selection:bg-violet-500/30">
      {/* Left: Information Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0F19] border-r border-white/5 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-emerald-500/5" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase">Professional<br/>Events.</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
          </div>

          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Experience the next generation of event management. Design premium invitations, manage guest lists with precision, and track check-ins in real-time.
          </p>

          <div className="space-y-6 pt-10">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-violet-400">
                  <span className="material-symbols-outlined">auto_awesome_motion</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Enterprise Solutions</p>
                  <p className="text-slate-500 text-xs mt-1">Create high-conversion digital invitations with integrated ticketing rails.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                  <span className="material-symbols-outlined">all_inclusive</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Scalable Architecture</p>
                  <p className="text-slate-500 text-xs mt-1">Control access and guest engagement with professional management tools.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right: Authentication Side */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px] -top-20 -left-20" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-900/40 mx-auto lg:mx-0">
              <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              {isSignUp ? "Create Account" : "User Login"}
            </h1>
            <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">
              {isSignUp ? "Register for platform access" : "Sign in to manage your events"}
            </p>
          </div>

          {!isForgotPassword && !isSignUp && (
            <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  authMethod === "email"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-lg align-middle">mail</span> Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("whatsapp")}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  authMethod === "whatsapp"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-lg align-middle">chat</span> WhatsApp
              </button>
            </div>
          )}

          <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-5">
            {!isForgotPassword && isSignUp && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
          )}

            {(authMethod === "email" || isForgotPassword) && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  placeholder="user@invitegenie.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            )}

            {authMethod === "whatsapp" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="+237 6XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <p className="text-[10px] text-slate-500 mt-2">We'll send a verification code via WhatsApp</p>
              </div>
            )}

          {isSignUp && authMethod === "email" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Phone Number (Optional)</label>
              <input
                type="tel"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="+237 6XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          )}

            {authMethod === "email" && !isForgotPassword && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  {!isSignUp && (
                    <button type="button" onClick={() => { setIsForgotPassword(true); setAuthMethod("email"); }} className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}

          {!isForgotPassword && isSignUp && (
            <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer">
              <input type="checkbox" checked={formData.whatsappOptIn} onChange={(e) => setFormData({ ...formData, whatsappOptIn: e.target.checked })} className="mt-1 accent-emerald-500" />
              <span className="text-xs text-slate-400">Send me important booking and payment alerts on WhatsApp.</span>
            </label>
          )}

            {resetSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <p className="text-emerald-400 text-xs font-bold">Password reset link sent to your email!</p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3.5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all ${
                  authMethod === "whatsapp"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-900/40 disabled:opacity-50"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-900/40 disabled:opacity-50"
                }`}
              >
                {isProcessing ? "Processing..." : (isForgotPassword ? "Send Reset Link" : (authMethod === "whatsapp" ? "Send WhatsApp Code" : (isSignUp ? "Create Account" : "Sign In")))}
              </button>
            )}
          </form>

        {!isForgotPassword && isSignUp && authMethod === "email" && <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest">We'll send a verification code or link to confirm your email.</p>}

          <div className="text-center">
            {isForgotPassword ? (
              <button
                onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                className="text-[10px] font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest"
              >
                Back to Sign In
              </button>
            ) : (
              <button
                onClick={() => { setIsSignUp(!isSignUp); setAuthMethod("email"); }}
                className="text-[10px] font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest"
              >
                {isSignUp ? "Existing user? Sign In" : "New user? Create account"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
