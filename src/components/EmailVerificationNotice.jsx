import React from "react";

export default function EmailVerificationNotice({ email, onResend, resendLoading, message }) {
  return (
    <div className="max-w-md mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center shadow-xl mt-12">
      <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Check your email</h2>
      <p className="text-slate-400 mb-4 text-sm">
        We’ve sent a verification link or code to <span className="font-bold text-white">{email}</span>.<br/>
        {message || "Please follow the instructions in your email to verify your account."}
      </p>
      <button
        className="mt-4 px-6 py-3 bg-gradient-to-r from-violet-600 to-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow hover:scale-105 active:scale-95 transition-all"
        onClick={onResend}
        disabled={resendLoading}
      >
        {resendLoading ? "Resending..." : "Resend Verification Email"}
      </button>
    </div>
  );
}
