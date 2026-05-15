import React from "react";
import Icon from "../components/Icon";
import { cn, clamp } from "./venueObjectCatalog";

export default function ControlStrip({ venueSize, setVenueSize, zoom, setZoom, fitToScreen, showGrid, setShowGrid, snapToGrid, setSnapToGrid, gridSize, setGridSize, activeTool, setActiveTool }) {
  const tools = [
    ["select", "near_me", "Select"], ["move", "open_with", "Move"], ["rotate", "rotate_right", "Rotate"], ["scale", "aspect_ratio", "Scale"],
    ["mirror", "flip", "Mirror"], ["group", "group_work", "Group"], ["ungroup", "splitscreen", "Ungroup"], ["align", "align_horizontal_left", "Align"],
    ["distribute", "density_medium", "Distribute"], ["arrange", "layers", "Arrange"], ["more", "more_horiz", "More"],
  ];

  const updateDimension = (key, value) => {
    const next = clamp(Number(value || 0), 300, 10000);
    setVenueSize((prev) => ({ ...prev, [key]: next }));
  };

  return (
    <div className="flex h-[50px] shrink-0 border-b border-white/5 bg-[#0B101D]">
      <div className="w-[220px] shrink-0 border-r border-white/5 px-2 py-1 flex flex-col justify-center">
        <div className="mb-0.5 flex items-center justify-between"><p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Dimensions</p><Icon name="lock_open" className="text-[10px] text-slate-500" /></div>
        <div className="flex items-center gap-1">
          <label className="flex h-6 flex-1 items-center gap-1 rounded border border-white/5 bg-black/25 px-1.5 text-[9px] font-bold text-slate-300">W<input type="number" value={venueSize.w} onChange={(e) => updateDimension("w", e.target.value)} className="w-8 bg-transparent text-right font-black text-white outline-none" />cm</label>
          <label className="flex h-6 flex-1 items-center gap-1 rounded border border-white/5 bg-black/25 px-1.5 text-[9px] font-bold text-slate-300">H<input type="number" value={venueSize.h} onChange={(e) => updateDimension("h", e.target.value)} className="w-8 bg-transparent text-right font-black text-white outline-none" />cm</label>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-0.5 overflow-x-auto px-2 no-scrollbar">
        {tools.map(([id, icon, label]) => (<button key={id} onClick={() => setActiveTool(id)} className={cn("flex h-[36px] min-w-[40px] flex-col items-center justify-center rounded-md text-[7px] font-bold transition", activeTool === id ? "bg-[#1A2333] text-white shadow-inner" : "text-slate-400 hover:bg-white/[0.05] hover:text-white")}><Icon name={icon} className="mb-0.5 text-xs" />{label}</button>))}
      </div>
      <div className="flex shrink-0 items-center gap-1 border-l border-white/5 px-2">
        <button onClick={() => setShowGrid((value) => !value)} className={cn("h-6 rounded border px-1.5 text-[7px] font-black uppercase tracking-widest transition", showGrid ? "border-violet-400/40 bg-violet-500/20 text-violet-100" : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]")}>Grid</button>
        <button onClick={() => setSnapToGrid((value) => !value)} className={cn("h-6 rounded border px-1.5 text-[7px] font-black uppercase tracking-widest transition", snapToGrid ? "border-violet-400/40 bg-violet-500/20 text-violet-100" : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]")}>Snap</button>
        <input type="number" min="10" max="200" step="10" value={gridSize} onChange={(e) => setGridSize(clamp(Number(e.target.value || 10), 10, 200))} className="h-6 w-10 rounded border border-white/5 bg-black/30 px-1 text-center text-[9px] font-black text-white outline-none focus:border-violet-500/50" /><div className="w-px h-3 bg-white/10 mx-0.5" />
        <button onClick={() => setZoom((value) => clamp(Number((value - 0.1).toFixed(2)), 0.1, 3))} className="grid h-6 w-6 place-items-center rounded border border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] transition"><Icon name="zoom_out" className="text-[10px]" /></button>
        <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-6 rounded border border-white/5 bg-black/40 px-1 text-[8px] font-black text-white outline-none cursor-pointer">{[0.25, 0.5, 0.75, 1, 1.5].map((value) => <option key={value} value={value}>{Math.round(value * 100)}%</option>)}</select>
        <button onClick={() => setZoom((value) => clamp(Number((value + 0.1).toFixed(2)), 0.1, 3))} className="grid h-6 w-6 place-items-center rounded border border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] transition"><Icon name="zoom_in" className="text-[10px]" /></button>
        <button onClick={fitToScreen} className="h-6 rounded border border-white/5 bg-white/[0.02] px-1.5 text-[7px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.06] transition">Fit</button>
      </div>
    </div>
  );
}
