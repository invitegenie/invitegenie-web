import React from "react";
import Icon from "./Icon";
import VIPAccessBadge from "./VIPAccessBadge";

export default function CheckInResultModal({ result, onClose }) {
  if (!result) return null;

  const isSuccess = result.success;
  const isDuplicate = result.code === "DUPLICATE";
  const ticket = result.ticket || {};

  const colorConfig = isSuccess 
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-900/20"
    : isDuplicate
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-amber-900/20"
      : "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-900/20";

  const iconConfig = isSuccess ? "check_circle" : isDuplicate ? "warning" : "cancel";

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm rounded-[2rem] border p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center ${colorConfig} bg-[#111827]`}>
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 mb-6 shadow-inner">
          <Icon name={iconConfig} className="text-5xl" />
        </div>

        <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
          {isSuccess ? "Access Granted" : isDuplicate ? "Already Scanned" : "Access Denied"}
        </h2>
        <p className="text-sm font-bold opacity-90 mb-6">{result.message}</p>

        {ticket.id && (
          <div className="bg-black/30 rounded-2xl p-4 border border-white/5 text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white font-black">{ticket.buyerName || "Guest"}</p>
              <VIPAccessBadge accessLevel={ticket.accessLevel} />
            </div>
            <p className="text-xs text-slate-300 font-bold">{ticket.eventName}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-2">{ticket.id}</p>
            {isDuplicate && result.previousCheckIn && (
               <p className="text-xs text-amber-300 mt-2 font-bold bg-amber-500/10 p-2 rounded-lg">Original Scan: {new Date(result.previousCheckIn).toLocaleTimeString()}</p>
            )}
          </div>
        )}

        <button onClick={onClose} className="w-full py-4 rounded-xl bg-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
          Next Scan
        </button>
      </div>
    </div>
  );
}