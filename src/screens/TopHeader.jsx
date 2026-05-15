import React from "react";
import Icon from "../components/Icon";
import { cn } from "./venueObjectCatalog";

export default function TopHeader({ stats, onUndo, onRedo, canUndo, canRedo, onAiGenerate, onExportPDF, onSaveDraft, onLoadDrafts, saveStatus, onBack }) {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-white/5 bg-[#060913] px-3 shadow-2xl relative z-50">
      <div className="flex shrink-0 items-center gap-2.5">
        <button onClick={onBack} className="flex h-7 items-center gap-1.5 rounded-lg bg-white/[0.03] px-2.5 text-slate-300 hover:bg-white/[0.08] transition-colors border border-white/5">
          <Icon name="arrow_back" className="text-xs" />
          <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Back to App</span>
        </button>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-900/40">
            <Icon name="auto_awesome" className="text-[10px]" />
          </div>
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
               <span className="text-[11px] font-black tracking-tight text-white leading-none">Invite</span>
               <span className="text-[11px] font-black tracking-tight text-violet-400 leading-none">Genie</span>
               <span className="ml-1 rounded bg-violet-500/20 px-1 py-0.5 text-[6px] font-black uppercase tracking-widest text-violet-300 border border-violet-500/30">Beta</span>
             </div>
             <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Venue Studio</span>
          </div>
        </div>
      </div>

      <div className="min-w-0 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="truncate text-[11px] font-black text-white">Event Layout Design</h1>
          <span className={cn("rounded-full px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest border", saveStatus === "Draft Saved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : saveStatus === "Saving" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-slate-400 border-white/10")}>{saveStatus}</span>
        </div>
        <p className="mt-1 text-[8px] font-bold text-slate-500">{stats.totalSeats} Seats • {stats.totalTables} Tables • {stats.totalObjects} Objects • {stats.venueLabel}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button disabled={!canUndo} onClick={onUndo} className="h-7 rounded-md border border-white/5 bg-white/[0.02] px-2 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"><Icon name="undo" className="mr-1 inline text-[10px]" />Undo</button>
        <button disabled={!canRedo} onClick={onRedo} className="h-7 rounded-md border border-white/5 bg-white/[0.02] px-2 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"><Icon name="redo" className="mr-1 inline text-[10px]" />Redo</button>
        <div className="h-4 w-px bg-white/10 mx-1" />
        <button onClick={onLoadDrafts} className="h-7 rounded-md border border-white/5 bg-white/[0.03] px-2 text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/[0.08] transition">Load Draft</button>
        <button onClick={onSaveDraft} className="h-7 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 text-[8px] font-black uppercase tracking-widest text-violet-300 hover:bg-violet-500/20 transition">Save Draft</button>
        <button onClick={onExportPDF} className="h-7 rounded-md border border-white/5 bg-white/[0.03] px-2 text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/[0.08] transition">Export</button>
        <button onClick={onAiGenerate} className="h-7 rounded-md bg-gradient-to-r from-violet-600 to-emerald-500 px-3 text-[8px] font-black uppercase tracking-widest text-white shadow-lg hover:opacity-90 transition"><Icon name="auto_awesome" className="mr-1 inline text-[10px]" />Genie AI</button>
      </div>
    </header>
  );
}
