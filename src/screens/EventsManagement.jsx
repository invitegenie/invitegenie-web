import React from "react";

export default function EventsManagement() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Events Engine</h1>
        <p className="text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Global Event Moderation & Oversight</p>
      </header>

      <div className="bg-white/[0.035] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">All Marketplace Events</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase">Filter</button>
          </div>
        </div>
        
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <span className="material-symbols-outlined text-slate-500">event_available</span>
          </div>
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Event Database Syncing</h3>
          <p className="text-slate-600 text-[10px] mt-2 max-w-xs mx-auto uppercase">Moderation tools loading. You have full oversight of all public and private events.</p>
        </div>
      </div>
    </div>
  );
}
