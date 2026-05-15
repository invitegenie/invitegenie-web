import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PLAN_DEMO_LOGINS = [
  {
    label: "FREE",
    email: "marie.user@invitegenie.cm",
    note: "Basic events, storefront, tasker, and check-in modes",
  },
  {
    label: "PRO",
    email: "estelle.pro@invitegenie.cm",
    note: "AI tools, higher limits, priority visibility",
  },
  {
    label: "BUSINESS",
    email: "brice.vendor@invitegenie.cm",
    note: "Unlimited services, teams, advanced marketplace tools",
  },
  {
    label: "ENTERPRISE",
    email: "mtn.enterprise@invitegenie.cm",
    note: "Unlimited scale and enterprise workflows",
  },
];

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  // TEMPORARY: Prefilled for development
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

          <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-5">
            {isSignUp && (
              <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="user@invitegenie.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isProcessing ? "Authenticating..." : (isSignUp ? "Create Account" : "Sign In")}
            </button>
          </form>

          {!isSignUp && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Plan demos</p>
              <p className="mb-3 text-xs leading-5 text-slate-500">Use one of the four account plans. Capabilities are toggled after login in Settings.</p>
              <div className="grid gap-2">
                {PLAN_DEMO_LOGINS.map(({ label, email, note }) => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => setFormData({ ...formData, email, password: "demo123" })}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-violet-400/40 hover:bg-violet-500/10"
                  >
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-white">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{note}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest"
            >
              {isSignUp ? "Existing user? Sign In" : "New user? Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
