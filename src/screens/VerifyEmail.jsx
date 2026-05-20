import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendVerification } from "./authService";
import { supabase } from "../lib/supabaseClient";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const email = location.state?.email || "";
  const isDemoSignup = sessionStorage.getItem("invitegenie_demo_signup") === "true";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Demo fallback path: accept the current demo signup session and proceed.
      if (isDemoSignup) {
        sessionStorage.removeItem("invitegenie_demo_signup");
        navigate("/dashboard");
        return;
      }

      // Developer bypass for rate-limited Supabase instances
      if (code === "000000") {
        setUser({ id: `dev-${Date.now()}`, email, full_name: "Demo User", role: "free_user" });
        navigate("/dashboard");
        return;
      }

      await verifyOTP(email, code);

      if (supabase) {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data?.session?.user) {
          throw new Error("Verification completed but no active session was found. Please sign in again.");
        }
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (isDemoSignup) {
        setResendStatus("Demo signup is already active. No verification email is required.");
        setTimeout(() => setResendStatus(""), 4000);
        return;
      }
      await resendVerification(email);
      setResendStatus("Verification email resent!");
      setTimeout(() => setResendStatus(""), 4000);
    } catch {
      setError("Failed to resend. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050812] flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-[#111827] border border-white/10 p-8 rounded-[2rem] shadow-2xl">
        <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="mark_email_read" className="text-3xl text-violet-400" />
        </div>
        <h1 className="text-2xl font-black text-center mb-2 uppercase tracking-tighter">Verify your email</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Enter the 6-digit code we sent to <strong className="text-white">{email}</strong> or click the verification link in the email.</p>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input type="text" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-white outline-none focus:border-violet-500 transition-all" required />
          </div>
          {error && <p className="text-rose-400 text-xs font-bold text-center">{error}</p>}
          {resendStatus && <p className="text-emerald-400 text-xs font-bold text-center">{resendStatus}</p>}
          
          <button type="submit" disabled={loading || code.length < 6} className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-slate-500 font-medium">Didn't receive the email?</p>
          <button onClick={handleResend} className="mt-2 text-xs font-black text-violet-400 uppercase tracking-widest hover:text-violet-300">Resend Code</button>
        </div>
      </div>
    </div>
  );
}
