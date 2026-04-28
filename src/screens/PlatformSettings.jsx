import React from "react";

export default function PlatformSettings() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Core Settings</h1>
        <p className="text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Global Platform Configuration</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white/[0.035] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Revenue & Commissions</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
               <span className="text-xs font-bold text-gray-300 uppercase">Marketplace Fee (%)</span>
               <input type="number" defaultValue="10" className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1 text-white text-sm w-20 text-center outline-none focus:ring-1 focus:ring-violet-500" />
             </div>
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
               <span className="text-xs font-bold text-gray-300 uppercase">Maintenance Mode</span>
               <button className="w-12 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
             </div>
          </div>
        </section>

        <section className="bg-white/[0.035] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Security Protocol</h3>
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <p className="text-[10px] font-black text-rose-400 uppercase mb-2">Emergency Override</p>
            <button className="w-full py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-rose-500 transition-all">Freeze All Transactions</button>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="px-10 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:bg-violet-500 transition-all active:scale-95">
            Save Global Changes
          </button>
        </div>
      </div>
    </div>
  );
}