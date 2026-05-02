import React from "react";

export default function VendorsManagement() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Vendor Hub</h1>
        <p className="text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Marketplace Partners & Service Providers</p>
      </header>

      <div className="bg-white/[0.035] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Registered Vendors</h3>
          <button className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
            Approve Pending
          </button>
        </div>
        
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <span className="material-symbols-outlined text-slate-500">storefront</span>
          </div>
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Vendor Registry Loading</h3>
          <p className="text-slate-600 text-[10px] mt-2 max-w-xs mx-auto uppercase">Fetching service provider metrics and approval queues. Pro and Basic vendor data incoming.</p>
        </div>
      </div>
    </div>
  );
}
