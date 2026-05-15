import React from "react";
import Icon from "./Icon";
export default function OperationsOverviewCard({ icon, title, value, total, isAlert }) {
  return (
    <div className={`p-4 rounded-2xl border ${isAlert ? 'border-rose-500/50 bg-rose-500/10' : 'border-white/5 bg-slate-900'}`}>
      <div className="flex justify-between"><Icon name={icon} className={isAlert ? 'text-rose-400' : 'text-slate-400'} /><span className="text-xs text-slate-500">{total ? `of ${total}` : ''}</span></div>
      <div className="mt-2"><p className="text-[10px] uppercase font-bold text-slate-500">{title}</p><p className="text-2xl font-black text-white">{value}</p></div>
    </div>
  );
}